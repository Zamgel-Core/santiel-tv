//📍 Ruta: src/services/raffles/ticketActions.ts

import { supabase } from "../../lib/supabaseClient";

export type DailyCheckInResult = {
  success: boolean;
  tickets: number;
  total_tickets: number;
  message: string;
};

export type TicketHistoryItem = {
  action: string;
  tickets: number;
  reason: string | null;
  created_at: string;
};

export async function dailyCheckIn(phone: string) {
  const { data, error } = await supabase
    .rpc("daily_checkin_public", {
      p_phone: phone,
    })
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "No se pudo hacer check-in.");
  }

  return data as DailyCheckInResult;
}

export async function getTicketHistoryByPhone(phone: string) {
  const { data, error } = await supabase.rpc("get_ticket_history_by_phone", {
    p_phone: phone,
  });

  if (error) {
    throw new Error(error.message || "No se pudo cargar el historial.");
  }

  return (data || []) as TicketHistoryItem[];
}
