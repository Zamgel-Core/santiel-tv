import { Gift, Ticket, Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function RaffleSection() {
  const isPremium = true;

  const tickets = isPremium ? 12 : 3;

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-5 py-2 rounded-full mb-6">
            <Gift className="w-4 h-4" />
            <span className="text-sm font-medium">
              Sorteos Santiel TV
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Gana premios cada mes
          </h2>

          <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
            Participa en dinámicas, comparte tu código y acumula boletos
            para ganar premios exclusivos.
          </p>
        </div>

        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] border border-yellow-500/20 bg-gradient-to-br from-neutral-900 to-black p-8 md:p-12"
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-yellow-500/5 pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-full font-bold mb-6">
                <Sparkles className="w-4 h-4" />
                Sorteo Activo
              </div>

              <h3 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
                🎁 Gana una cuenta con acceso premium
                <span className="text-yellow-400"> GRATIS</span>
              </h3>

              <p className="text-neutral-400 text-lg mb-8">
                Mientras más participes, más oportunidades tienes de ganar.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-2xl transition">
                  Participar
                </button>

                <button className="border border-white/10 hover:border-yellow-500/40 bg-white/5 hover:bg-yellow-500/10 text-white font-medium px-8 py-4 rounded-2xl transition">
                  Ver Ganadores
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="grid gap-5">
              {/* Tickets */}
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

              {/* Premium */}
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
    </section>
  );
}