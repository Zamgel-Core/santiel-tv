import { createClient } from "@supabase/supabase-js";
import { createHash, createHmac, randomBytes } from "node:crypto";

import {
  createSessionToken,
  hashSessionToken,
  setSessionCookie,
  SESSION_DURATION_MS,
} from "../_lib/portal-session.js";

import { isValidPin, verifyPortalPin } from "../_lib/portal-pin.js";

const MAX_BODY_LENGTH = 2048;
const ATTEMPT_DURATION_MS = 2 * 60 * 1000;

function send(res, status, data) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(status).json(data);
}

function normalizePhone(value) {
  if (typeof value !== "string") return null;

  const phone = value.trim().replace(/[\s().-]/g, "");

  return /^\+[1-9]\d{7,14}$/.test(phone) ? phone : null;
}

function getClientIp(req) {
  // Solo utilizar cabeceras establecidas por el proxy de Vercel.
  // No confiar en un x-forwarded-for arbitrario del cliente.
  const value = req.headers["x-vercel-forwarded-for"];

  if (typeof value !== "string") return null;

  const ip = value.trim();

  if (
    !ip ||
    ip.length > 45 ||
    ip.includes(",") ||
    !/^[0-9a-fA-F:.]+$/.test(ip)
  ) {
    return null;
  }

  return ip;
}

function hashIp(ip, pepper) {
  return createHmac("sha256", pepper).update(`portal-ip:${ip}`).digest("hex");
}

function hashAttemptToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function getAdminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Falta la configuración de Supabase");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function markAttempt(admin, attemptId, status) {
  if (!attemptId) return;

  const { error } = await admin
    .from("portal_login_attempts")
    .update({
      status,
      completed_at: new Date().toISOString(),
    })
    .eq("id", attemptId)
    .eq("status", "pending");

  if (error) {
    console.error("No se pudo finalizar el intento:", error.message);
  }
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, {
      error: "Método no permitido",
    });
  }

  const origin = req.headers.origin;
  const host = req.headers.host;

  if (
    !origin ||
    !host ||
    (() => {
      try {
        return new URL(origin).host !== host;
      } catch {
        return true;
      }
    })()
  ) {
    return send(res, 403, {
      error: "Solicitud no autorizada",
    });
  }

  const bodyLength = Number(req.headers["content-length"] || 0);

  if (!Number.isFinite(bodyLength) || bodyLength > MAX_BODY_LENGTH) {
    return send(res, 413, {
      error: "Solicitud demasiado grande",
    });
  }

  const phone = normalizePhone(req.body?.phone);
  const pin = req.body?.pin;

  if (!phone || !isValidPin(pin)) {
    return send(res, 400, {
      error: "Ingresa un teléfono válido y un PIN de 6 dígitos",
    });
  }

  const pepper = process.env.PORTAL_PIN_PEPPER;

  if (!pepper || pepper.length < 32) {
    console.error("PORTAL_PIN_PEPPER no configurado");
    return send(res, 503, {
      error: "Acceso temporalmente no disponible",
    });
  }

  const ip = getClientIp(req);

  if (!ip) {
    console.error("No se obtuvo una IP confiable desde Vercel");
    return send(res, 503, {
      error: "No fue posible verificar la solicitud",
    });
  }

  const genericError = {
    error: "Teléfono o PIN incorrecto, o acceso temporalmente bloqueado",
  };

  let admin;
  let attemptId = null;

  try {
    admin = getAdminClient();

    // Buscar coincidencia exacta y detectar teléfonos duplicados.
    const { data: users, error: userError } = await admin
      .from("users")
      .select("id, role, status, is_active, phone")
      .eq("phone", phone)
      .limit(2);

    if (userError) {
      throw userError;
    }

    const user =
      users?.length === 1 &&
      users[0].role === "customer" &&
      users[0].status === "active" &&
      users[0].is_active === true
        ? users[0]
        : null;

    const attemptToken = randomBytes(32).toString("hex");
    const attemptTokenHash = hashAttemptToken(attemptToken);
    const ipHash = hashIp(ip, pepper);

    // Registrar también los intentos con teléfonos inexistentes.
    const { data: reservations, error: reservationError } = await admin.rpc(
      "portal_begin_login_attempt",
      {
        p_user_id: user?.id ?? null,
        p_ip_hash: ipHash,
        p_attempt_token_hash: attemptTokenHash,
      },
    );

    if (reservationError) {
      throw reservationError;
    }

    const reservation = reservations?.[0];

    if (!reservation?.allowed || !reservation.attempt_id) {
      return send(res, 429, {
        error: "Demasiados intentos. Intenta más tarde.",
      });
    }

    attemptId = reservation.attempt_id;

    if (!user) {
      await markAttempt(admin, attemptId, "failed");
      return send(res, 401, genericError);
    }

    // Reservar el intento y vincularlo a la versión de
    // credenciales dentro de una sola transacción.
    const { data: attemptReady, error: reserveError } = await admin.rpc(
      "portal_reserve_and_bind_login",
      {
        p_attempt_id: attemptId,
        p_attempt_token_hash: attemptTokenHash,
        p_user_id: user.id,
      },
    );

    if (reserveError) {
      throw reserveError;
    }

    if (attemptReady !== true) {
      await markAttempt(admin, attemptId, "blocked");

      return send(res, 429, {
        error: "Acceso temporalmente bloqueado. Intenta nuevamente más tarde.",
      });
    }

    const { data: credentials, error: credentialsError } = await admin
      .from("portal_credentials")
      .select("pin_hash, must_change_pin, temporary_pin_expires_at")
      .eq("user_id", user.id)
      .maybeSingle();

    if (credentialsError) {
      throw credentialsError;
    }

    if (!credentials?.pin_hash) {
      await markAttempt(admin, attemptId, "failed");
      return send(res, 401, genericError);
    }

    const pinIsCorrect = await verifyPortalPin(pin, credentials.pin_hash);

    if (!pinIsCorrect) {
      await markAttempt(admin, attemptId, "failed");
      return send(res, 401, genericError);
    }

    if (
      credentials.must_change_pin &&
      (!credentials.temporary_pin_expires_at ||
        new Date(credentials.temporary_pin_expires_at).getTime() <= Date.now())
    ) {
      await markAttempt(admin, attemptId, "expired");
      return send(res, 401, {
        error: "El PIN temporal ha vencido. Solicita uno nuevo.",
      });
    }

    const sessionToken = createSessionToken();
    const sessionTokenHash = hashSessionToken(sessionToken);

    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

    const { data: confirmed, error: confirmationError } = await admin.rpc(
      "portal_complete_login_attempt",
      {
        p_attempt_id: attemptId,
        p_attempt_token_hash: attemptTokenHash,
        p_user_id: user.id,
        p_expected_pin_hash: credentials.pin_hash,
        p_session_token_hash: sessionTokenHash,
        p_session_expires_at: expiresAt,
      },
    );

    if (confirmationError) {
      throw confirmationError;
    }

    if (confirmed !== true) {
      await markAttempt(admin, attemptId, "blocked");
      return send(res, 401, genericError);
    }

    setSessionCookie(res, sessionToken);

    return send(res, 200, {
      success: true,
      must_change_pin: credentials.must_change_pin === true,
      message:
        credentials.must_change_pin === true
          ? "Debes cambiar tu PIN temporal para continuar"
          : "Inicio de sesión correcto",
    });
  } catch (error) {
    console.error("Error en portal/login:", error);

    if (admin && attemptId) {
      await markAttempt(admin, attemptId, "failed");
    }

    return send(res, 500, {
      error: "No fue posible iniciar sesión. Intenta nuevamente.",
    });
  }
}
