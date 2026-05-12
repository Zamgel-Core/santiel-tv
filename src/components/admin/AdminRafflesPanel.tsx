//📍 Ruta: src/components/admin/AdminRafflesPanel.tsx

import { useEffect, useMemo, useState } from "react";
import { Trophy, Clipboard, RefreshCw, Video, PlusCircle } from "lucide-react";

import {
  createAdminRaffle,
  getActiveAdminRaffle,
  getActiveRaffleEntries,
  getWheelEntries,
  markRaffleWinner,
  type RaffleEntryAdmin,
} from "../../services/admin/adminRaffles";

export default function AdminRafflesPanel() {
  const [raffle, setRaffle] = useState<any>(null);
  const [entries, setEntries] = useState<RaffleEntryAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("Sorteo Cuenta Premium");
  const [description, setDescription] = useState("Participa para ganar acceso premium gratis.");
  const [prize, setPrize] = useState("1 mes de servicio premium gratis");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [winnerName, setWinnerName] = useState("");
  const [winnerPhone, setWinnerPhone] = useState("");
  const [winnerPrize, setWinnerPrize] = useState("1 mes de servicio premium gratis");
  const [winnerVideo, setWinnerVideo] = useState("");

  const totals = useMemo(() => {
    const totalTickets = entries.reduce((sum, entry) => sum + Number(entry.tickets || 0), 0);
    const participants = entries.filter((entry) => entry.entry_type !== "referral_bonus").length;

    return {
      totalTickets,
      participants,
    };
  }, [entries]);

  const loadRaffle = async () => {
    try {
      setLoading(true);
      setMessage("");

      const active = await getActiveAdminRaffle();
      setRaffle(active);

      if (active?.id) {
        const activeEntries = await getActiveRaffleEntries(active.id);
        setEntries(activeEntries);
      } else {
        setEntries([]);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error cargando sorteos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRaffle();
  }, []);

  const handleCreateRaffle = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (!title || !endDate) {
        setMessage("Título y fecha final son obligatorios.");
        return;
      }

      await createAdminRaffle({
        title,
        description,
        prize,
        startDate: startDate || new Date().toISOString(),
        endDate,
      });

      setMessage("Sorteo creado correctamente.");
      await loadRaffle();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error creando sorteo.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportWheel = async () => {
    try {
      if (!raffle?.id) {
        setMessage("No hay sorteo activo.");
        return;
      }

      const names = await getWheelEntries(raffle.id);
      await navigator.clipboard.writeText(names.join("\\n"));

      setMessage(`Lista para ruleta copiada: ${names.length} líneas.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo exportar ruleta.");
    }
  };

  const handlePickFromSelected = (entry: RaffleEntryAdmin) => {
    setWinnerName(entry.username || "");
    setWinnerPhone(entry.phone || "");
    setWinnerPrize(raffle?.prize || "1 mes de servicio premium gratis");
  };

  const handleMarkWinner = async () => {
    try {
      if (!raffle?.id) {
        setMessage("No hay sorteo activo.");
        return;
      }

      if (!winnerName || !winnerPhone || !winnerPrize) {
        setMessage("Ganador, teléfono y premio son obligatorios.");
        return;
      }

      await markRaffleWinner({
        raffleId: raffle.id,
        username: winnerName,
        phone: winnerPhone,
        prize: winnerPrize,
        videoUrl: winnerVideo,
      });

      setMessage("Ganador guardado y sorteo cerrado.");
      await loadRaffle();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar ganador.");
    }
  };

  return (
    <section className="rounded-3xl border border-yellow-500/20 bg-neutral-950/80 p-5">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-2xl font-black text-white">
            <Trophy className="h-6 w-6 text-yellow-400" />
            Sorteos y ruleta
          </h3>

          <p className="text-sm text-neutral-400">
            Crea sorteos, exporta nombres para ruleta y registra ganadores públicos.
          </p>
        </div>

        <button
          onClick={loadRaffle}
          className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 font-bold text-white hover:bg-white/15"
        >
          <RefreshCw className="h-4 w-4" />
          Refrescar
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <h4 className="mb-3 flex items-center gap-2 font-black text-white">
            <PlusCircle className="h-5 w-5 text-yellow-400" />
            Crear sorteo
          </h4>

          <div className="grid gap-3">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Título del sorteo"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            />

            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Descripción"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            />

            <input
              value={prize}
              onChange={(event) => setPrize(event.target.value)}
              placeholder="Premio"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            />

            <div className="grid gap-3 md:grid-cols-2">
              <input
                type="datetime-local"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              />

              <input
                type="datetime-local"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              />
            </div>

            <button
              onClick={handleCreateRaffle}
              disabled={loading}
              className="rounded-xl bg-yellow-500 px-5 py-3 font-black text-black hover:bg-yellow-400 disabled:opacity-60"
            >
              Crear sorteo activo
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <h4 className="mb-3 font-black text-white">Sorteo activo</h4>

          {raffle ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4">
                <p className="text-xl font-black text-white">{raffle.title}</p>
                <p className="text-sm text-neutral-300">{raffle.description}</p>
                <p className="mt-2 text-sm text-yellow-300">Premio: {raffle.prize || "N/A"}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs text-neutral-400">Participantes</p>
                  <p className="text-2xl font-black text-white">{totals.participants}</p>
                </div>

                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs text-neutral-400">Boletos</p>
                  <p className="text-2xl font-black text-yellow-400">{totals.totalTickets}</p>
                </div>
              </div>

              <button
                onClick={handleExportWheel}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 px-5 py-3 font-black text-black hover:bg-yellow-400"
              >
                <Clipboard className="h-4 w-4" />
                Copiar lista para ruleta
              </button>
            </div>
          ) : (
            <p className="rounded-2xl bg-white/5 p-4 text-neutral-400">
              No hay sorteo activo.
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
        <h4 className="mb-3 flex items-center gap-2 font-black text-white">
          <Video className="h-5 w-5 text-yellow-400" />
          Registrar ganador público
        </h4>

        <div className="grid gap-3 md:grid-cols-4">
          <input
            value={winnerName}
            onChange={(event) => setWinnerName(event.target.value)}
            placeholder="Nombre ganador"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
          />

          <input
            value={winnerPhone}
            onChange={(event) => setWinnerPhone(event.target.value)}
            placeholder="Teléfono ganador"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
          />

          <input
            value={winnerPrize}
            onChange={(event) => setWinnerPrize(event.target.value)}
            placeholder="Premio"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
          />

          <input
            value={winnerVideo}
            onChange={(event) => setWinnerVideo(event.target.value)}
            placeholder="Link video sorteo"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
          />
        </div>

        <button
          onClick={handleMarkWinner}
          className="mt-3 rounded-xl bg-green-600 px-5 py-3 font-black text-white hover:bg-green-500"
        >
          Guardar ganador y cerrar sorteo
        </button>
      </div>

      <div className="mt-5 max-h-80 overflow-y-auto rounded-2xl border border-white/10 bg-black/30">
        <div className="grid grid-cols-5 gap-3 border-b border-white/10 px-4 py-3 text-xs font-black uppercase text-neutral-400">
          <span>Nombre</span>
          <span>Teléfono</span>
          <span>Tipo</span>
          <span>Boletos</span>
          <span>Acción</span>
        </div>

        {entries.map((entry) => (
          <div
            key={entry.id}
            className="grid grid-cols-5 gap-3 border-b border-white/5 px-4 py-3 text-sm text-neutral-200"
          >
            <span>{entry.username}</span>
            <span>{entry.phone}</span>
            <span>{entry.entry_type}</span>
            <span className="font-black text-yellow-400">{entry.tickets}</span>
            <button
              onClick={() => handlePickFromSelected(entry)}
              className="rounded-lg bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/15"
            >
              Usar como ganador
            </button>
          </div>
        ))}

        {entries.length === 0 ? (
          <p className="p-4 text-neutral-500">Sin participantes todavía.</p>
        ) : null}
      </div>

      {message ? (
        <p className="mt-4 rounded-xl bg-white/5 px-4 py-3 text-sm font-medium text-yellow-300">
          {message}
        </p>
      ) : null}
    </section>
  );
}
