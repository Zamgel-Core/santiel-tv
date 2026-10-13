import { randomBytes, randomInt, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";
import { createClient } from "@supabase/supabase-js";

const scrypt = promisify(scryptCallback);

const reply = (res, status, error) => res.status(status).json({ error });

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return reply(res, 405, "Método no permitido");
  }

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const pepper = process.env.PORTAL_PIN_PEPPER;

  if (!url || !anonKey || !serviceKey || !pepper) {
    return reply(res, 500, "Configuración del servidor incompleta");
  }

  const authorization = req.headers.authorization || "";
  const token = /^Bearer\s+(.+)$/i.exec(authorization)?.[1];

  if (!token) {
    return reply(res, 401, "Debes iniciar sesión");
  }

  const idText = String(req.body?.user_id ?? "");

  if (!/^[1-9]\d{0,18}$/.test(idText)) {
    return reply(res, 400, "Identificador de cliente inválido");
  }

  try {
    // Verificar la sesión del administrador.
    const authClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const { data: authData, error: authError } =
      await authClient.auth.getUser(token);

    if (authError || !authData.user) {
      return reply(res, 401, "Sesión inválida o vencida");
    }

    // Comprobar que realmente sea Super Admin.
    const { data: profile, error: profileError } =
      await authClient.rpc("portal_profile");

    if (profileError || profile?.is_admin !== true) {
      return reply(res, 403, "No tienes permisos de administrador");
    }

    // Cliente privado de Supabase: solo servidor.
    const adminClient = createClient(url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Comprobar que el cliente existe y está activo.
    const { data: user, error: userError } = await adminClient
      .from("users")
      .select("id,customer_name,phone")
      .eq("id", idText)
      .eq("role", "customer")
      .eq("status", "active")
      .eq("is_active", true)
      .maybeSingle();

    if (userError) {
      console.error("Error consultando cliente:", userError.message);

      return reply(res, 500, "No se pudo consultar el cliente");
    }

    if (!user) {
      return reply(res, 404, "Cliente no encontrado o inactivo");
    }

    if (!user.phone?.trim()) {
      return reply(
        res,
        400,
        "El cliente necesita un teléfono registrado antes de generar su PIN",
      );
    }

    // Generar un PIN temporal aleatorio de 6 dígitos.
    const temporaryPin = String(randomInt(0, 1_000_000)).padStart(6, "0");

    // Generar una sal criptográfica aleatoria.
    const salt = randomBytes(16).toString("hex");

    // Proteger el PIN utilizando scrypt y el secreto privado.
    const derivedKey = await scrypt(`${temporaryPin}:${pepper}`, salt, 64);

    const pinHash = `scrypt:${salt}:${derivedKey.toString("hex")}`;

    // El PIN temporal vence después de 30 minutos.
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    // Guardar credenciales y revocar sesiones
    // mediante una única transacción en PostgreSQL.
    const { error: resetError } = await adminClient.rpc(
      "portal_reset_credentials",
      {
        p_user_id: user.id,
        p_pin_hash: pinHash,
        p_expires_at: expiresAt,
      },
    );

    if (resetError) {
      console.error(
        "Error restableciendo credenciales:",
        resetError.code,
        resetError.message,
      );

      return reply(res, 500, "No se pudo generar el PIN temporal");
    }

    // Mostrar el PIN una sola vez al administrador.
    return res.status(200).json({
      message: "PIN temporal generado correctamente",
      customer_name: user.customer_name,
      phone: user.phone,
      temporary_pin: temporaryPin,
      expires_at: expiresAt,
      must_change_pin: true,
    });
  } catch (error) {
    console.error("Error generando PIN temporal:", error);

    return reply(res, 500, "Error interno del servidor");
  }
}
