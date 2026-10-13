import { createClient } from "@supabase/supabase-js";

import {
  hashSessionToken,
  readSessionToken,
  clearSessionCookie,
} from "../_lib/portal-session.js";

import {
  hashPortalPin,
  isValidPin,
  verifyPortalPin,
} from "../_lib/portal-pin.js";

function reply(res, status, error) {
  return res.status(status).json({ error });
}

function isSameOrigin(req) {
  const origin = req.headers.origin;
  const host = req.headers.host;

  if (typeof origin !== "string" || typeof host !== "string") {
    return false;
  }

  try {
    const parsed = new URL(origin);

    return parsed.protocol === "https:" && parsed.host === host;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return reply(res, 405, "Método no permitido");
  }

  // Evitar solicitudes desde otros sitios.
  if (!isSameOrigin(req)) {
    return reply(res, 403, "Solicitud no autorizada");
  }

  const token = readSessionToken(req);

  if (!token) {
    return reply(res, 401, "Debes iniciar sesión");
  }

  const oldPin = req.body?.old_pin;
  const newPin = req.body?.new_pin;

  if (!isValidPin(oldPin) || !isValidPin(newPin)) {
    return reply(res, 400, "Los PIN deben contener exactamente 6 dígitos");
  }

  if (oldPin === newPin) {
    return reply(res, 400, "El nuevo PIN debe ser diferente al anterior");
  }

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const pepper = process.env.PORTAL_PIN_PEPPER;

  if (!url || !serviceKey || !pepper || pepper.length < 32) {
    return reply(res, 503, "Servicio temporalmente no disponible");
  }

  try {
    const adminClient = createClient(url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const tokenHash = hashSessionToken(token);

    const { data: session, error: sessionError } = await adminClient
      .from("portal_sessions")
      .select("user_id,expires_at,revoked_at")
      .eq("token_hash", tokenHash)
      .maybeSingle();

    if (sessionError) {
      throw sessionError;
    }

    if (
      !session ||
      session.revoked_at ||
      new Date(session.expires_at).getTime() <= Date.now()
    ) {
      clearSessionCookie(res);
      return reply(res, 401, "Sesión inválida o vencida");
    }

    const { data: user, error: userError } = await adminClient
      .from("users")
      .select("id")
      .eq("id", session.user_id)
      .eq("role", "customer")
      .eq("status", "active")
      .eq("is_active", true)
      .maybeSingle();

    if (userError) {
      throw userError;
    }

    if (!user) {
      clearSessionCookie(res);
      return reply(res, 401, "Cuenta no disponible");
    }

    const { data: credentials, error: credentialsError } = await adminClient
      .from("portal_credentials")
      .select("pin_hash,must_change_pin,temporary_pin_expires_at,locked_until")
      .eq("user_id", user.id)
      .maybeSingle();

    if (credentialsError) {
      throw credentialsError;
    }

    if (!credentials?.pin_hash) {
      return reply(res, 401, "Credenciales no disponibles");
    }

    if (
      credentials.locked_until &&
      new Date(credentials.locked_until).getTime() > Date.now()
    ) {
      return reply(res, 429, "Demasiados intentos. Intenta más tarde");
    }

    if (
      credentials.must_change_pin &&
      (!credentials.temporary_pin_expires_at ||
        new Date(credentials.temporary_pin_expires_at).getTime() <= Date.now())
    ) {
      return reply(res, 401, "El PIN temporal venció. Solicita uno nuevo");
    }

    const validOldPin = await verifyPortalPin(oldPin, credentials.pin_hash);

    if (!validOldPin) {
      const { error: attemptError } = await adminClient.rpc(
        "portal_register_failed_pin_attempt",
        {
          p_user_id: user.id,
        },
      );

      if (attemptError) {
        throw attemptError;
      }

      return reply(res, 401, "El PIN anterior es incorrecto");
    }

    const newHash = await hashPortalPin(newPin);

    const { data: changed, error: changeError } = await adminClient.rpc(
      "portal_change_credentials",
      {
        p_user_id: user.id,
        p_expected_hash: credentials.pin_hash,
        p_new_hash: newHash,
      },
    );

    if (changeError) {
      throw changeError;
    }

    if (changed !== true) {
      return reply(
        res,
        409,
        "No se pudo completar el cambio. Vuelve a iniciar sesión",
      );
    }

    // El cambio de PIN revoca las sesiones existentes.
    // También eliminamos la cookie del navegador.
    clearSessionCookie(res);

    return res.status(200).json({
      success: true,
      message: "PIN actualizado correctamente",
      must_login_again: true,
    });
  } catch (error) {
    console.error("Error interno cambiando PIN:", error);

    return reply(
      res,
      500,
      "No fue posible cambiar el PIN. Intenta nuevamente.",
    );
  }
}
