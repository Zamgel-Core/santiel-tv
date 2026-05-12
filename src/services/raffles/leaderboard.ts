//📍 Ruta: src/services/raffles/leaderboard.ts

import { supabase } from "../../lib/supabaseClient";

export type LeaderboardItem = {
  display_name: string;
  total_tickets: number;
  referral_code: string | null;
  is_premium: boolean;
};

export async function getPublicLeaderboard() {
  const { data, error } = await supabase.rpc("get_public_leaderboard");

  if (error) {
    throw new Error(error.message || "No se pudo cargar el ranking.");
  }

  return (data || []) as LeaderboardItem[];
}
