//📍 Ruta: src/components/raffles/RaffleSection.tsx

import { useEffect, useMemo, useState } from "react";
import {
  Copy,
  Share2,
  Crown,
  Trophy,
  Flame,
  Gift,
  Ticket,
  CheckCircle2,
} from "lucide-react";

import { createRaffleEntry } from "../../services/raffles/raffleEntries";
import { dailyCheckIn, getTicketHistoryByPhone, type TicketHistoryItem } from "../../services/raffles/ticketActions";
import { getPublicLeaderboard, type LeaderboardItem } from "../../services/raffles/leaderboard";
import { getPublicRaffleWinners, type RaffleWinner } from "../../services/raffles/raffleWinners";
import { getActiveRaffleStats, type ActiveRaffleStats } from "../../services/raffles/raffleStats";

const PORTAL_SESSION_KEY = "portalUser";

export default function RaffleSection() {
  const [hasService, setHasService] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [referral, setReferral] = useState("");

  const [portalUser, setPortalUser] = useState<any>(null);
  const [stats, setStats] = useState<ActiveRaffleStats | null>(null);
  const [history, setHistory] = useState<TicketHistoryItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [winners, setWinners] = useState<RaffleWinner[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(PORTAL_SESSION_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPortalUser(parsed);
        setHasService(true);
      } catch {
        localStorage.removeItem(PORTAL_SESSION_KEY);
      }
    }

    loadPublicData();
  }, []);

  useEffect(() => {
    if (portalUser?.phone) {
      getTicketHistoryByPhone(portalUser.phone)
        .then(setHistory)
        .catch(() => setHistory([]));
    }
  }, [portalUser?.phone]);

  const loadPublicData = async () => {
    const [statsData, leaderboardData, winnersData] = await Promise.allSettled([
      getActiveRaffleStats(),
      getPublicLeaderboard(),
      getPublicRaffleWinners(),
    ]);

    if (statsData.status === "fulfilled") setStats(statsData.value);
    if (leaderboardData.status === "fulfilled") setLeaderboard(leaderboardData.value);
    if (winnersData.status === "fulfilled") setWinners(winnersData.value);
  };

  const referralCode = useMemo(() => {
    return portalUser?.referral_code || portalUser?.customer_code || "";
  }, [portalUser]);

  const updatePortalUserTickets = (ticketsToAdd: number, totalTickets?: number) => {
    if (!portalUser) return;

    const updated = {
      ...portalUser,
      total_tickets: totalTickets ?? (portalUser.total_tickets || 0) + ticketsToAdd,
    };

    localStorage.setItem(PORTAL_SESSION_KEY, JSON.stringify(updated));
    setPortalUser(updated);
  };

  const handleParticipate = async () => {
    try {
      setLoading(true);
      setMessage("");

      const result = await createRaffleEntry({
        name: portalUser?.username || portalUser?.customer_name || name,
        phone: portalUser?.phone || phone,
        referralCode: referral,
      });

      setMessage(result.message || "Participación registrada.");
      updatePortalUserTickets(result.tickets || 1);

      await loadPublicData();

      if (portalUser?.phone) {
        const data = await getTicketHistoryByPhone(portalUser.phone);
        setHistory(data);
      }
    } catch (error: any) {
      setMessage(error.message || "Ocurrió un error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDailyCheckIn = async () => {
    try {
      setCheckinLoading(true);
      setMessage("");

      if (!portalUser?.phone) {
        setMessage("Primero entra al portal Santiel para hacer check-in.");
        return;
      }

      const result = await dailyCheckIn(portalUser.phone);
      setMessage(result.message);

      if (result.success) {
        updatePortalUserTickets(result.tickets, result.total_tickets);
        const data = await getTicketHistoryByPhone(portalUser.phone);
        setHistory(data);
        await loadPublicData();
      }
    } catch (error: any) {
      setMessage(error.message || "No se pudo hacer check-in.");
    } finally {
      setCheckinLoading(false);
    }
  };

  const copyReferral = async () => {
    if (!referralCode) return;

    await navigator.clipboard.writeText(referralCode);
    setMessage("Código copiado correctamente.");
  };

  const shareReferral = async () => {
    if (!referralCode) return;

    const text = `🎁 Estoy participando en los sorteos GRATIS de Santiel TV 🔥

Puedes ganar meses de servicio premium cada mes.

Usa mi código:
${referralCode}

👉 https://santieltv.com`;

    if (navigator.share) {
      await navigator.share({
        title: "Santiel TV",
        text,
        url: "https://santieltv.com",
      });
    } else {
      await navigator.clipboard.writeText(text);
      setMessage("Texto copiado para compartir.");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 text-center">
        <div className="inline-flex rounded-full border border-yellow-500/20 bg-yellow-500/10 px-5 py-2 text-sm font-bold text-yellow-400">
          🎁 Sorteos Santiel TV
        </div>

        <h2 className="mt-4 text-3xl md:text-5xl font-black text-white">
          Gana premios cada mes
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-neutral-400">
          Participa, haz check-in diario, comparte tu código y acumula boletos.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-yellow-500/20 bg-[#090909] p-5 md:p-7 text-white shadow-2xl">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-400">
              🎟 Participar en sorteo
            </div>

            {stats ? (
              <div className="text-sm text-neutral-400">
                <span className="text-yellow-400 font-bold">{stats.total_tickets}</span> boletos ·{" "}
                <span className="text-white font-bold">{stats.total_entries}</span> participantes
              </div>
            ) : null}
          </div>

          <h3 className="text-3xl md:text-4xl font-black leading-tight">
            Participa y gana
          </h3>

          <p className="mt-2 text-neutral-400 max-w-xl">
            Participa GRATIS cada mes y gana acceso premium Santiel TV.
          </p>

          <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/50 p-5">
            <label className="flex items-center gap-3 text-sm font-medium text-neutral-300">
              <input
                type="checkbox"
                checked={hasService}
                onChange={(e) => setHasService(e.target.checked)}
                className="h-5 w-5 accent-yellow-500"
              />
              Ya cuento con servicio Santiel TV
            </label>

            {hasService && portalUser ? (
              <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-5">
                <div className="flex items-center gap-2 text-yellow-400 font-bold text-lg">
                  <Crown className="h-5 w-5" />
                  {portalUser.is_premium ? "Premium activo" : "Cliente Santiel"}
                </div>

                <h4 className="mt-4 text-2xl md:text-3xl font-black">
                  👋 {portalUser.username || portalUser.customer_name}
                </h4>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-neutral-400">Boletos acumulados</p>
                    <p className="mt-2 text-3xl font-black text-yellow-400">
                      {portalUser.total_tickets || 0}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-neutral-400">Código referido</p>
                    <p className="mt-2 text-3xl font-black text-yellow-400">
                      {referralCode}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={handleParticipate}
                    disabled={loading}
                    className="rounded-2xl bg-yellow-500 px-6 py-4 font-black text-black transition hover:bg-yellow-400 disabled:opacity-60"
                  >
                    {loading ? "Generando..." : "🎟 Participar ahora"}
                  </button>

                  <button
                    onClick={handleDailyCheckIn}
                    disabled={checkinLoading}
                    className="rounded-2xl bg-green-600 px-6 py-4 font-black text-white transition hover:bg-green-500 disabled:opacity-60"
                  >
                    {checkinLoading ? "Procesando..." : "✅ Check-in diario"}
                  </button>

                  <button
                    onClick={copyReferral}
                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-semibold"
                  >
                    <Copy className="h-4 w-4" />
                    Copiar
                  </button>

                  <button
                    onClick={shareReferral}
                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-semibold"
                  >
                    <Share2 className="h-4 w-4" />
                    Compartir
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {hasService ? (
                  <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-100">
                    Entra primero al portal con tu teléfono + PIN para participar sin escribir tus datos.
                  </div>
                ) : null}

                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none"
                />

                <input
                  type="text"
                  placeholder="Tu teléfono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none"
                />

                <input
                  type="text"
                  placeholder="Código de referido opcional"
                  value={referral}
                  onChange={(e) => setReferral(e.target.value.toUpperCase())}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none"
                />

                <button
                  onClick={handleParticipate}
                  disabled={loading}
                  className="rounded-2xl bg-yellow-500 px-6 py-4 font-black text-black transition hover:bg-yellow-400 disabled:opacity-60"
                >
                  {loading ? "Generando..." : "🎟 Generar boletos"}
                </button>
              </div>
            )}

            {!!message && (
              <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                {message}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-5">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 text-white">
            <h4 className="mb-4 flex items-center gap-2 text-xl font-black">
              <Flame className="h-5 w-5 text-yellow-400" />
              Ranking
            </h4>

            <div className="space-y-3">
              {leaderboard.slice(0, 5).map((item, index) => (
                <div
                  key={`${item.display_name}-${index}`}
                  className="flex items-center justify-between rounded-2xl bg-black/30 p-3"
                >
                  <div>
                    <p className="font-bold text-white">
                      #{index + 1} {item.display_name}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {item.is_premium ? "Premium" : "Participante"}
                    </p>
                  </div>

                  <p className="font-black text-yellow-400">{item.total_tickets}</p>
                </div>
              ))}

              {leaderboard.length === 0 ? (
                <p className="text-sm text-neutral-500">Aún no hay ranking.</p>
              ) : null}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 text-white">
            <h4 className="mb-4 flex items-center gap-2 text-xl font-black">
              <Trophy className="h-5 w-5 text-yellow-400" />
              Ganadores
            </h4>

            <div className="space-y-3">
              {winners.slice(0, 3).map((winner, index) => (
                <div
                  key={`${winner.username}-${winner.announced_at}-${index}`}
                  className="rounded-2xl bg-black/30 p-3"
                >
                  <p className="font-bold text-white">{winner.username}</p>
                  <p className="text-sm text-yellow-300">{winner.prize}</p>
                  {winner.video_url ? (
                    <a
                      href={winner.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm font-bold text-yellow-400 underline"
                    >
                      Ver video del sorteo
                    </a>
                  ) : null}
                </div>
              ))}

              {winners.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  Aún no hay ganadores publicados.
                </p>
              ) : null}
            </div>
          </div>

          {portalUser?.phone ? (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 text-white">
              <h4 className="mb-4 flex items-center gap-2 text-xl font-black">
                <Ticket className="h-5 w-5 text-yellow-400" />
                Tus últimos boletos
              </h4>

              <div className="space-y-3">
                {history.slice(0, 5).map((item, index) => (
                  <div
                    key={`${item.action}-${item.created_at}-${index}`}
                    className="flex items-center justify-between rounded-2xl bg-black/30 p-3"
                  >
                    <div>
                      <p className="font-bold text-white">{item.reason || item.action}</p>
                      <p className="text-xs text-neutral-500">
                        {new Date(item.created_at).toLocaleDateString("es-US")}
                      </p>
                    </div>

                    <p className="font-black text-yellow-400">+{item.tickets}</p>
                  </div>
                ))}

                {history.length === 0 ? (
                  <p className="text-sm text-neutral-500">Sin historial todavía.</p>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="rounded-[28px] border border-yellow-500/20 bg-yellow-500/10 p-5 text-yellow-100">
            <h4 className="flex items-center gap-2 text-lg font-black text-yellow-300">
              <Gift className="h-5 w-5" />
              Formas de ganar boletos
            </h4>

            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                Participar en el sorteo activo
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                Ser cliente premium activo
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                Hacer check-in diario
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                Compartir tu código de referido
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
