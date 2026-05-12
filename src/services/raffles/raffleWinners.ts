//📍 Ruta: src/services/raffles/raffleWinners.ts

import { supabase } from "../../lib/supabaseClient";

export type RaffleWinner = {
  username: string;
  prize: string | null;
  video_url: string | null;
  announced_at: string;
};

export async function getPublicRaffleWinners() {
  const { data, error } = await supabase.rpc("get_public_raffle_winners");

  if (error) {
    throw new Error(error.message || "No se pudieron cargar ganadores.");
  }

  return (data || []) as RaffleWinner[];
}
