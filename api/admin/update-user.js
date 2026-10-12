import { createClient } from "@supabase/supabase-js";

const allowedFields = {
  customer_name: 120,
  phone: 40,
  device_type: 60,
  device_mac: 100,
  device_key: 160,
  notes: 2000,
};

const reply = (res, status, error) => res.status(status).json({ error });

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "PATCH") {
    res.setHeader("Allow", "PATCH");
    return reply(res, 405, "Método no permitido");
  }

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceKey) {
    return reply(res, 500, "Configuración del servidor incompleta");
  }

  const authorization = req.headers.authorization || "";
  const token = /^Bearer\s+(.+)$/i.exec(authorization)?.[1];

  if (!token) {
    return reply(res, 401, "Debes iniciar sesión");
  }

  try {
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

    const { data: profile, error: profileError } =
      await authClient.rpc("portal_profile");

    if (profileError || profile?.is_admin !== true) {
      return reply(res, 403, "No tienes permisos de administrador");
    }

    const input = req.body;

    if (!input || typeof input !== "object" || Array.isArray(input)) {
      return reply(res, 400, "Datos inválidos");
    }

    const { id, ...changes } = input;
    const idText = String(id ?? "");

    if (!/^[1-9]\d{0,18}$/.test(idText)) {
      return reply(res, 400, "Identificador de cliente inválido");
    }

    const fields = Object.keys(changes);

    if (!fields.length || fields.some((field) => !(field in allowedFields))) {
      return reply(res, 400, "Se enviaron campos no permitidos");
    }

    const update = {};

    for (const field of fields) {
      const value = changes[field];

      if (typeof value !== "string" || value.length > allowedFields[field]) {
        return reply(res, 400, `Valor inválido para ${field}`);
      }

      const normalized = value.trim();

      if (field === "customer_name" && !normalized) {
        return reply(res, 400, "El nombre del cliente es obligatorio");
      }

      update[field] = normalized || null;
    }

    const adminClient = createClient(url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Evita modificar registros administrativos.
    const { data, error } = await adminClient
      .from("users")
      .update(update)
      .eq("id", idText)
      .eq("role", "customer")
      .select("id,customer_name,phone,device_type,device_mac,device_key,notes")
      .maybeSingle();

    if (error) {
      console.error("Error actualizando cliente:", error.code, error.message);

      return reply(res, 500, "No se pudo actualizar el cliente");
    }

    if (!data) {
      return reply(res, 404, "Cliente no encontrado o no editable");
    }

    return res.status(200).json({
      user: data,
      message: "Cliente actualizado correctamente",
    });
  } catch (error) {
    console.error("Error en API de edición:", error);
    return reply(res, 500, "Error interno del servidor");
  }
}
