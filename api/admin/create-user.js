import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const json = (res, status, error) => res.status(status).json({ error });
const clean = (value, max = 200) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";
const code = (prefix) =>
  `${prefix}${randomBytes(8).toString("hex").toUpperCase()}`;

function addCalendarMonths(date, months) {
  const result = new Date(date);
  const day = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const lastDay = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0),
  ).getUTCDate();
  result.setUTCDate(Math.min(day, lastDay));
  return result;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, "Método no permitido");
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !anonKey || !serviceKey) {
    return json(res, 500, "Configuración del servidor incompleta");
  }

  const header = req.headers.authorization || "";
  const token = /^Bearer\s+(.+)$/i.exec(header)?.[1];

  if (!token) {
    return json(res, 401, "Debes iniciar sesión");
  }

  try {
    const authClient = createClient(supabaseUrl, anonKey, {
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
      return json(res, 401, "Sesión inválida o vencida");
    }

    const { data: profile, error: profileError } =
      await authClient.rpc("portal_profile");

    if (profileError || profile?.is_admin !== true) {
      return json(res, 403, "No tienes permisos de administrador");
    }

    const input = req.body;

    if (!input || typeof input !== "object" || Array.isArray(input)) {
      return json(res, 400, "Datos inválidos");
    }

    if (input.account_type !== "customer") {
      return json(res, 400, "Por ahora solo se permite crear clientes finales");
    }

    const customer_name = clean(input.customer_name, 120);
    const username = clean(input.username, 80);
    const password = clean(input.password, 160);
    const phone = clean(input.phone, 40);
    const device_type = clean(input.device_type, 60);
    const device_mac = clean(input.device_mac, 100);
    const device_key = clean(input.device_key, 160);
    const notes = clean(input.notes, 2000);
    const months = Number(input.months);

    if (!customer_name || !username || !password) {
      return json(res, 400, "Nombre, usuario y contraseña son obligatorios");
    }

    if (!/^[a-zA-Z0-9._-]{3,80}$/.test(username)) {
      return json(
        res,
        400,
        "Usuario inválido: usa de 3 a 80 letras, números, puntos, guiones o guion bajo",
      );
    }

    if (password.length < 4) {
      return json(
        res,
        400,
        "La contraseña de la app debe tener al menos 4 caracteres",
      );
    }

    if (!Number.isInteger(months) || months < 1 || months > 12) {
      return json(res, 400, "Selecciona de 1 a 12 meses");
    }

    let expiresAt;

    if (input.expiration_date) {
      expiresAt = new Date(input.expiration_date);

      if (Number.isNaN(expiresAt.getTime()) || expiresAt <= new Date()) {
        return json(res, 400, "Selecciona una fecha de vencimiento futura");
      }
    } else {
      expiresAt = addCalendarMonths(new Date(), months);
    }

    const adminClient = createClient(supabaseUrl, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data: existing, error: lookupError } = await adminClient
      .from("users")
      .select("id")
      .eq("username", username)
      .limit(1);

    if (lookupError) {
      return json(res, 500, "No se pudo verificar el nombre de usuario");
    }

    if (existing?.length) {
      return json(res, 409, "Ese nombre de usuario ya existe");
    }

    const now = new Date();

    const record = {
      customer_name,
      username,
      password,
      phone: phone || null,
      role: "customer",
      account_type: "customer",
      status: "active",
      is_active: true,
      is_trial: false,
      plan: `${months} mes${months === 1 ? "" : "es"}`,
      plan_months: months,
      start_date: now.toISOString(),
      expiration_date: expiresAt.toISOString(),
      plan_started_at: now.toISOString().replace("T", " ").replace("Z", ""),
      plan_expires_at: expiresAt
        .toISOString()
        .replace("T", " ")
        .replace("Z", ""),
      device_type: device_type || null,
      device_mac: device_mac || null,
      device_key: device_key || null,
      notes: notes || null,
      customer_code: code("ST-"),
      referral_code: code("REF-"),
      must_change_pin: true,
    };

    const { data, error } = await adminClient
      .from("users")
      .insert(record)
      .select("id,username,customer_name,expiration_date")
      .single();

    if (error) {
      if (error.code === "23505") {
        return json(
          res,
          409,
          "El usuario o uno de sus códigos ya existe. Intenta nuevamente",
        );
      }

      console.error("Error creando cliente:", error.code, error.message);
      return json(res, 500, "No se pudo crear el cliente");
    }

    return res.status(201).json({
      user: data,
      message: "Cliente creado correctamente",
    });
  } catch (error) {
    console.error("Error en creación de cliente:", error);
    return json(res, 500, "Error interno del servidor");
  }
}
