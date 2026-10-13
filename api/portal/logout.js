import { createClient } from "@supabase/supabase-js";

import {
  readSessionToken,
  hashSessionToken,
  clearSessionCookie,
} from "../_lib/portal-session.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Método no permitido",
    });
  }

  const origin = req.headers.origin;
  const host = req.headers.host;

  try {
    if (!origin || !host || new URL(origin).host !== host) {
      return res.status(403).json({
        error: "Solicitud no autorizada",
      });
    }
  } catch {
    return res.status(403).json({
      error: "Solicitud no autorizada",
    });
  }

  const token = readSessionToken(req);

  if (!token) {
    clearSessionCookie(res);
    return res.status(200).json({ success: true });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return res.status(503).json({
      error: "Servicio temporalmente no disponible",
    });
  }

  try {
    const admin = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { error } = await admin
      .from("portal_sessions")
      .update({
        revoked_at: new Date().toISOString(),
      })
      .eq("token_hash", hashSessionToken(token))
      .is("revoked_at", null);

    if (error) throw error;

    clearSessionCookie(res);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error cerrando sesión:", error);

    return res.status(500).json({
      error: "No se pudo cerrar la sesión",
    });
  }
}
