import { createClient } from "@supabase/supabase-js";
import { hashSessionToken, readSessionToken } from "../_lib/portal-session.js";

const PUBLIC_COLUMNS = [
  "id",
  "username",
  "customer_name",
  "display_name",
  "phone",
  "status",
  "account_type",
  "expiration_date",
  "customer_code",
  "referral_code",
  "total_tickets",
  "must_change_pin",
].join(",");

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      error: "Método no permitido",
    });
  }

  const token = readSessionToken(req);

  if (!token) {
    return res.status(401).json({
      error: "No hay una sesión activa",
    });
  }

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return res.status(500).json({
      error: "Configuración del servidor incompleta",
    });
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
      console.error("Error consultando sesión:", sessionError.message);

      return res.status(500).json({
        error: "No se pudo verificar la sesión",
      });
    }

    if (
      !session ||
      session.revoked_at ||
      new Date(session.expires_at).getTime() <= Date.now()
    ) {
      return res.status(401).json({
        error: "Sesión inválida o vencida",
      });
    }

    const { data: user, error: userError } = await adminClient
      .from("users")
      .select(PUBLIC_COLUMNS)
      .eq("id", session.user_id)
      .eq("role", "customer")
      .eq("is_active", true)
      .eq("status", "active")
      .maybeSingle();

    if (userError) {
      console.error("Error consultando cliente:", userError.message);

      return res.status(500).json({
        error: "No se pudo verificar el cliente",
      });
    }

    if (!user) {
      return res.status(401).json({
        error: "Cuenta no disponible",
      });
    }

    const { data: credentials, error: credentialsError } = await adminClient
      .from("portal_credentials")
      .select("must_change_pin")
      .eq("user_id", session.user_id)
      .maybeSingle();

    if (credentialsError || !credentials) {
      return res.status(401).json({
        error: "Credenciales no disponibles",
      });
    }

    // Si el cliente tiene un PIN temporal,
    // no permitimos consultar su perfil todavía.
    if (credentials.must_change_pin === true) {
      return res.status(200).json({
        authenticated: true,
        must_change_pin: true,
        user: null,
        message: "Debes cambiar tu PIN temporal para continuar.",
      });
    }

    const expiresAt = user.expiration_date
      ? new Date(user.expiration_date).getTime()
      : null;

    return res.status(200).json({
      user: {
        ...user,
        must_change_pin: credentials.must_change_pin,
        is_premium:
          expiresAt !== null &&
          Number.isFinite(expiresAt) &&
          expiresAt > Date.now(),
      },
    });
  } catch (error) {
    console.error("Error interno consultando sesión:", error);

    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}
