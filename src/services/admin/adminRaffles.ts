//📍 Ruta: src/services/admin/adminRaffles.ts

import { supabase } from "../../lib/supabaseClient";

export type RaffleEntryAdmin = {
  id: string;
  raffle_id: string;
  username: string;
  phone: string;
  tickets: number;
  entry_type: string;
  user_type: string;
  created_at: string;
};

export async function createAdminRaffle(input: {
  title: string;
  description: string;
  prize: string;
  startDate: string;
  endDate: string;
}) {
  const { data, error } = await supabase
    .from("raffles")
    .insert({
      title: input.title,
      description: input.description,
      prize: input.prize,
      start_date: input.startDate,
      end_date: input.endDate,
      status: "active",
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message || "No se pudo crear el sorteo.");
  }

  return data;
}

export async function getActiveAdminRaffle() {
  const { data, error } = await supabase
    .from("raffles")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "No se pudo cargar el sorteo activo.");
  }

  return data;
}

export async function getActiveRaffleEntries(raffleId: string) {
  const { data, error } = await supabase
    .from("raffle_entries")
    .select("*")
    .eq("raffle_id", raffleId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "No se pudieron cargar participantes.");
  }

  return (data || []) as RaffleEntryAdmin[];
}

export async function getWheelEntries(raffleId?: string) {
  const { data, error } = await supabase.rpc("get_raffle_wheel_entries", {
    p_raffle_id: raffleId || null,
  });

  if (error) {
    throw new Error(error.message || "No se pudo exportar ruleta.");
  }

  return (data || []).map((item: { wheel_name: string }) => item.wheel_name);
}

export async function markRaffleWinner(input: {
  raffleId: string;
  username: string;
  phone: string;
  prize: string;
  videoUrl?: string;
}) {
  const { data, error } = await supabase.rpc("admin_mark_raffle_winner", {
    p_raffle_id: input.raffleId,
    p_username: input.username,
    p_phone: input.phone,
    p_prize: input.prize,
    p_video_url: input.videoUrl || null,
  });

  if (error) {
    throw new Error(error.message || "No se pudo guardar ganador.");
  }

  return data;
}
