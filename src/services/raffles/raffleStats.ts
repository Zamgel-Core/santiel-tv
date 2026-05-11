//📍 Ruta: src/services/raffles/raffleStats.ts

import { supabase } from "../../lib/supabaseClient";

export type ActiveRaffleStats = {
  raffle_id: string;
  title: string;
  description: string | null;
  end_date: string | null;
  status: string;
  total_entries: number;
  total_tickets: number;
};

export async function getActiveRaffleStats() {
  const { data, error } = await supabase
    .rpc("get_active_raffle_stats")
    .maybeSingle();

  if (error) {
    throw new Error("No se pudieron cargar las estadísticas del sorteo.");
  }

  return data as ActiveRaffleStats | null;
}
