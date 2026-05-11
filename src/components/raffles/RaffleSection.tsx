import { useState } from "react";
import {
  Gift,
  Ticket,
  Crown,
  Sparkles,
  X,
  User,
  Phone,
  BadgePercent,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { createRaffleEntry } from "../../services/raffles/raffleEntries";

export default function RaffleSection() {
  const [participateOpen, setParticipateOpen] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isPremium = true;
  const tickets = isPremium ? 12 : 3;

  const handleCreateEntry = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const result = await createRaffleEntry({
        name,
        phone,
        referralCode,
      });

      setMessage(
        `¡Listo! Generaste ${result.tickets} boleto(s) para ${result.raffleTitle}.`
      );

      setName("");
      setPhone("");
      setReferralCode("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-2 pb-16 md:pb-24 px-4 -mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-5 py-2 rounded-full mb-6">
            <Gift className="w-4 h-4" />
            <span className="text-sm font-medium">Sorteos Santiel TV</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Gana premios cada mes
          </h2>

          <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
            Participa en dinámicas, comparte tu código y acumula boletos para
            ganar premios exclusivos.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] border border-yellow-500/20 bg-gradient-to-br from-neutral-900 to-black p-8 md:p-12"
        >
          <div className="absolute inset-0 bg-yellow-500/5 pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-full font-bold mb-6">
                <Sparkles className="w-4 h-4" />
                Sorteo Activo
              </div>

              <h3 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
                🎁 Gana una cuenta con acceso premium{" "}
                <span className="text-yellow-400">GRATIS</span>
              </h3>

              <p className="text-neutral-400 text-lg mb-8">
                Mientras más participes, más oportunidades tienes de ganar.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setParticipateOpen(true);
                    setMessage("");
                    setError("");
                  }}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-2xl transition"
                >
                  Participar
                </button>

                <button
                  type="button"
                  className="border border-white/10 hover:border-yellow-500/40 bg-white/5 hover:bg-yellow-500/10 text-white font-medium px-8 py-4 rounded-2xl transition"
                >
                  Ver Ganadores
                </button>
              </div>
            </div>

            <div className="grid gap-5">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Ticket className="w-6 h-6 text-yellow-400" />
                  <span className="text-white font-bold text-lg">
                    Tus boletos
                  </span>
                </div>

                <div className="text-5xl font-black text-yellow-400">
                  {tickets}
                </div>

                <p className="text-neutral-400 mt-3">
                  Sigue participando para conseguir más.
                </p>
              </div>

              <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Crown className="w-6 h-6 text-yellow-400" />
                  <span className="text-yellow-300 font-bold text-lg">
                    Beneficio Premium
                  </span>
                </div>

                <p className="text-yellow-100/80">
                  Los usuarios premium reciben más boletos por cada actividad.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {participateOpen ? (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-xl rounded-[2rem] border border-yellow-500/20 bg-neutral-950 p-6 md:p-8 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setParticipateOpen(false)}
                className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm font-bold text-yellow-400 mb-5">
                  <Gift className="w-4 h-4" />
                  Participar en sorteo
                </div>

                <h3 className="text-3xl font-black text-white">
                  Registra tu participación
                </h3>

                <p className="text-neutral-400 mt-3">
                  Ingresa tus datos para generar tus boletos. Si tienes código
                  de referido, agrégalo para apoyar a quien te invitó.
                </p>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-neutral-300">
                    Nombre
                  </label>
                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <User className="w-5 h-5 text-yellow-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full bg-transparent text-white outline-none placeholder:text-neutral-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-300">
                    Teléfono
                  </label>
                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <Phone className="w-5 h-5 text-yellow-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej. 8321234567"
                      className="w-full bg-transparent text-white outline-none placeholder:text-neutral-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-300">
                    Código de referido opcional
                  </label>
                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <BadgePercent className="w-5 h-5 text-yellow-400" />
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) =>
                        setReferralCode(e.target.value.toUpperCase())
                      }
                      placeholder="Ej. SAN-8F42"
                      className="w-full bg-transparent text-white outline-none placeholder:text-neutral-500 uppercase"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCreateEntry}
                  disabled={loading}
                  className="w-full rounded-2xl bg-yellow-500 px-6 py-4 font-black text-black hover:bg-yellow-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Generando boletos..." : "Generar boletos"}
                </button>

                {message ? (
                  <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-300">
                    {message}
                  </div>
                ) : null}

                {error ? (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                    {error}
                  </div>
                ) : null}
              </form>

              <p className="text-xs text-neutral-500 mt-5 text-center">
                Próximo paso: conectar este formulario a sistema premium,
                referidos y boletos acumulados.
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}