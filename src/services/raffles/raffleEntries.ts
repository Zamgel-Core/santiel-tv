//📍 Ruta: src/services/raffles/raffleEntries.ts

import { supabase } from "../../lib/supabaseClient";

export type CreateRaffleEntryInput = {
  name: string;
  phone: string;
  referralCode?: string;
};

export type CreateRaffleEntryResult = {
  success: boolean;
  raffle_title: string;
  tickets: number;
  user_type: "guest" | "free" | "premium" | string;
  message: string;
};

export async function createRaffleEntry(input: CreateRaffleEntryInput) {
  const cleanName = input.name.trim();
  const cleanPhone = input.phone.trim();
  const cleanReferral = input.referralCode?.trim().toUpperCase() || null;

  if (!cleanName) {
    throw new Error("Ingresa tu nombre.");
  }

  if (!cleanPhone) {
    throw new Error("Ingresa tu teléfono.");
  }

  const { data, error } = await supabase
    .rpc("create_raffle_entry_public", {
      p_name: cleanName,
      p_phone: cleanPhone,
      p_referral_code: cleanReferral,
    })
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "No se pudo guardar tu participación.");
  }

  const result = data as CreateRaffleEntryResult | null;

  if (!result?.success) {
    throw new Error("No se pudo guardar tu participación.");
  }

  return {
    success: result.success,
    raffleTitle: result.raffle_title,
    tickets: result.tickets,
    userType: result.user_type,
    message: result.message,
  };
}
