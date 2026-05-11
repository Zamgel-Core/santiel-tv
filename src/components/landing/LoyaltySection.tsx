import {
  ChevronRight,
  Gift,
  HeartHandshake,
  Star,
  Trophy,
  Zap,
} from "lucide-react";

import { getWhatsAppLink } from "../../lib/whatsapp";

type Props = {
  t: any;
  lang: "es" | "en";
};

export default function LoyaltySection({ t, lang }: Props) {
  return (
    <section id="lealtad" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 backdrop-blur-md border border-neutral-800/50 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 blur-[80px] rounded-full"></div>

        <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-medium mb-6 border border-yellow-500/20">
              <Trophy className="w-4 h-4" />
              <span>{t.lealtad.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              {t.lealtad.title}
            </h2>

            <p className="text-xl text-neutral-300 mb-8">
              {t.lealtad.desc}
            </p>

            <div className="bg-neutral-950/50 border border-neutral-800/50 rounded-2xl p-6 mb-8">
              <h4 className="text-yellow-500 font-semibold mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5" /> {t.lealtad.comoFunciona}
              </h4>

              <ul className="space-y-3 text-neutral-300">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span>{t.lealtad.regla1}</span>
                </li>

                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span>{t.lealtad.regla2}</span>
                </li>

                <li className="flex items-center gap-3 text-white font-medium mt-4 pt-4 border-t border-neutral-800/50">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span>{t.lealtad.regla3}</span>
                </li>
              </ul>
            </div>

            <p className="text-lg font-medium text-yellow-400/90 mb-8 italic">
              {t.lealtad.cita}
            </p>

            <a
              href={getWhatsAppLink(
                lang === "es"
                  ? "Hola, quiero activar mi membresía y participar en el sistema de lealtad."
                  : "Hello, I want to activate my membership and participate in the loyalty system."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-neutral-950 px-8 py-4 rounded-full font-bold hover:bg-neutral-200 transition-colors shadow-lg"
            >
              {t.lealtad.btnActivar} <ChevronRight className="w-5 h-5" />
            </a>
          </div>

          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {t.lealtad.beneficios.map((benefit: any, i: number) => {
              const icons = [Gift, Zap, Star, HeartHandshake];
              const Icon = icons[i];

              return (
                <div
                  key={i}
                  className="bg-neutral-900/50 border border-neutral-800/50 p-6 rounded-2xl hover:bg-neutral-800/50 transition-colors"
                >
                  <Icon className="w-8 h-8 text-yellow-500 mb-4" />
                  <h4 className="text-white font-semibold mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-neutral-400">
                    {benefit.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}