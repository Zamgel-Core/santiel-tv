//📍 Ruta: src/services/portal/portalAuth.ts

import { supabase } from "../../lib/supabaseClient";

export type PortalUser = {
  id: string;
  username: string | null;
  phone: string | null;
  status: string | null;
  account_type: string | null;
  expiration_date: string | null;
  customer_code: string | null;
  referral_code: string | null;
  total_tickets: number | null;
  must_change_pin: boolean;
  is_premium: boolean;
};

export async function loginPortalWithPin(phone: string, pin: string) {
  const cleanPhone = phone.trim();
  const cleanPin = pin.trim();

  if (!cleanPhone) {
    throw new Error("Ingresa tu teléfono.");
  }

  if (!cleanPin) {
    throw new Error("Ingresa tu PIN.");
  }

  const { data, error } = await supabase.rpc("portal_login_by_phone_pin", {
    p_phone: cleanPhone,
    p_pin: cleanPin,
  });

  if (error) {
    throw new Error(error.message || "No se pudo iniciar sesión.");
  }

  if (!data) {
    throw new Error("Teléfono o PIN incorrecto.");
  }

  return data as PortalUser;
}

export async function changePortalPin(
  phone: string,
  oldPin: string,
  newPin: string,
  confirmPin: string
) {
  const cleanPhone = phone.trim();
  const cleanOldPin = oldPin.trim();
  const cleanNewPin = newPin.trim();
  const cleanConfirmPin = confirmPin.trim();

  if (!cleanPhone) {
    throw new Error("Ingresa tu teléfono.");
  }

  if (!cleanOldPin) {
    throw new Error("Ingresa tu PIN actual.");
  }

  if (!/^[0-9]{4,6}$/.test(cleanNewPin)) {
    throw new Error("Tu nuevo PIN debe tener de 4 a 6 números.");
  }

  if (cleanNewPin !== cleanConfirmPin) {
    throw new Error("Los PIN no coinciden.");
  }

  if (cleanNewPin === "0000") {
    throw new Error("Por seguridad, el nuevo PIN no puede ser 0000.");
  }

  const { data, error } = await supabase.rpc("change_portal_pin", {
    p_phone: cleanPhone,
    p_old_pin: cleanOldPin,
    p_new_pin: cleanNewPin,
  });

  if (error) {
    throw new Error(error.message || "No se pudo cambiar el PIN.");
  }

  return data as { success: boolean; message: string };
}