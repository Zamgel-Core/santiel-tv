import { supabase } from "../../lib/supabaseClient";

export type CreateRaffleEntryInput = {
  name: string;
  phone: string;
  referralCode?: string;
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

  const { data: activeRaffle, error: raffleError } = await supabase
    .from("raffles")
    .select("id, title, status")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (raffleError) {
    throw new Error("No se pudo verificar el sorteo activo.");
  }

  if (!activeRaffle) {
    throw new Error("No hay sorteo activo por el momento.");
  }

  const { data: existingEntry, error: existingError } = await supabase
    .from("raffle_entries")
    .select("id")
    .eq("raffle_id", activeRaffle.id)
    .eq("phone", cleanPhone)
    .maybeSingle();

  if (existingError) {
    throw new Error("No se pudo verificar tu participación.");
  }

  if (existingEntry) {
    throw new Error("Este teléfono ya está participando en el sorteo activo.");
  }

  const tickets = cleanReferral ? 2 : 1;

  const { error: insertError } = await supabase.from("raffle_entries").insert({
    raffle_id: activeRaffle.id,
    username: cleanName,
    phone: cleanPhone,
    customer_code: cleanReferral,
    entry_type: cleanReferral ? "referral" : "public",
    tickets,
    note: cleanReferral
      ? `Participación con referido ${cleanReferral}`
      : "Participación pública desde la landing",
  });

  if (insertError) {
    throw new Error("No se pudo guardar tu participación.");
  }

  return {
    success: true,
    raffleTitle: activeRaffle.title,
    tickets,
  };
}