/** Acceso por correo: requiere vinculación previa del cliente en el servidor. */
import { supabase } from "../../lib/supabaseClient";

export async function requestEmailCode(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new Error("Ingresa un correo válido.");
  }
  // Evita registrar usuarios desconocidos desde el formulario de acceso.
  const { error } = await supabase.auth.signInWithOtp({
    email: normalized,
    options: { shouldCreateUser: false },
  });
  if (error) throw new Error(error.message);
}

export async function verifyEmailCode(email: string, token: string) {
  const normalized = email.trim().toLowerCase();
  const cleanToken = token.trim();
  if (!/^\d{8}$/.test(cleanToken)) {
    throw new Error("Ingresa el código de 8 dígitos.");
  }
  const { data, error } = await supabase.auth.verifyOtp({
    email: normalized,
    token: cleanToken,
    type: "email",
  });
  if (error) throw new Error(error.message);
  if (!data.session) throw new Error("No se pudo establecer la sesión.");
  return data.session;
}

export async function signOutEmailSession() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}
