//📍 Ruta: src/components/raffles/RaffleSection.tsx

import { useEffect, useMemo, useState } from "react";
import { Copy, Share2, Crown } from "lucide-react";
import { createRaffleEntry } from "../../services/raffles/raffleEntries";

export default function RaffleSection() {
  const [hasService, setHasService] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [referral, setReferral] = useState("");

  const [portalUser, setPortalUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("portalUser");

    if (saved) {
      const parsed = JSON.parse(saved);
      setPortalUser(parsed);
      setHasService(true);
    }
  }, []);

  const referralCode = useMemo(() => {
    return portalUser?.referral_code || portalUser?.customer_code || "";
  }, [portalUser]);

  const handleParticipate = async () => {
    try {
      setLoading(true);
      setMessage("");

      const result = await createRaffleEntry({
        name: portalUser?.username || name,
        phone: portalUser?.phone || phone,
        referralCode: referral,
      });

      setMessage(result.message || "Participación registrada.");

      if (portalUser) {
        const updated = {
          ...portalUser,
          total_tickets:
            (portalUser.total_tickets || 0) + (result.tickets || 1),
        };

        localStorage.setItem(
          "portalUser",
          JSON.stringify(updated)
        );

        setPortalUser(updated);
      }
    } catch (error: any) {
      setMessage(error.message || "Ocurrió un error.");
    } finally {
      setLoading(false);
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
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="rounded-[32px] border border-yellow-500/20 bg-[#090909] p-6 md:p-8 text-white shadow-2xl">
        <div className="mb-6 flex items-center gap-2">
          <div className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-400">
            🎁 Participar en sorteo
          </div>
        </div>

        <h2 className="text-4xl font-black leading-tight">
          Participa y gana
        </h2>

        <p className="mt-3 text-neutral-400 max-w-xl">
          Participa GRATIS cada mes y gana acceso premium Santiel TV.
        </p>

        <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/50 p-5">
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
                Premium activo
              </div>

              <h3 className="mt-4 text-3xl font-black">
                👋 {portalUser.username}
              </h3>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-neutral-400">
                    Boletos acumulados
                  </p>

                  <p className="mt-2 text-3xl font-black text-yellow-400">
                    {portalUser.total_tickets || 0}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-neutral-400">
                    Código referido
                  </p>

                  <p className="mt-2 text-3xl font-black text-yellow-400">
                    {referralCode}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleParticipate}
                  disabled={loading}
                  className="rounded-2xl bg-yellow-500 px-6 py-4 font-black text-black transition hover:bg-yellow-400"
                >
                  {loading
                    ? "Generando..."
                    : "🎟 Participar ahora"}
                </button>

                <button
                  onClick={copyReferral}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-semibold"
                >
                  <Copy className="h-4 w-4" />
                  Copiar código
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
              <input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none"
              />

              <input
                type="text"
                placeholder="Tu teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none"
              />

              <input
                type="text"
                placeholder="Código de referido opcional"
                value={referral}
                onChange={(e) => setReferral(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none"
              />

              <button
                onClick={handleParticipate}
                disabled={loading}
                className="rounded-2xl bg-yellow-500 px-6 py-4 font-black text-black transition hover:bg-yellow-400"
              >
                {loading
                  ? "Generando..."
                  : "🎟 Generar boletos"}
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
    </section>
  );
}