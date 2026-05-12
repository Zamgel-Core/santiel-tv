//📍 Ruta: src/services/raffles/raffleEntries.ts

import { supabase } from "../../lib/supabaseClient";

interface CreateRaffleEntryPayload {
  name: string;
  phone: string;
  referralCode?: string;
}

export async function createRaffleEntry({
  name,
  phone,
  referralCode,
}: CreateRaffleEntryPayload) {
  const { data, error } = await supabase.rpc(
    "create_raffle_entry_public",
    {
      p_name: name,
      p_phone: phone,
      p_referral_code: referralCode || null,
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  return data?.[0] || {
    success: true,
    tickets: 1,
    message: "Participación registrada.",
  };
}