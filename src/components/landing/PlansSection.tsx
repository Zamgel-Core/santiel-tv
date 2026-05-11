import {
  CheckCircle2,
  Coins,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";

import { getWhatsAppLink } from "../../lib/whatsapp";

type Props = {
  t: any;
  lang: "es" | "en";
  currency: "USD" | "MXN";
};

export default function PlansSection({ t, lang, currency }: Props) {
  return (
    <section
      id="planes"
      className="py-24 bg-neutral-950/50 backdrop-blur-sm border-y border-neutral-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t.planes.title}
          </h2>
          <p className="text-neutral-400 text-lg">{t.planes.desc}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-3xl p-8 flex flex-col relative hover:border-yellow-500/30 transition-colors">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-neutral-300 mb-2">
                {lang === "es" ? "Plan 1 mes" : "1 Month Plan"}
              </h3>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-medium text-neutral-500 line-through">
                  {currency === "USD" ? "$20" : "$270"}
                </span>
                <span className="text-4xl font-bold text-white">
                  {currency === "USD" ? "$15" : "$200"}
                </span>
                <span className="text-neutral-500">{currency}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {["Acceso completo", "Películas", "Series", "TV en vivo", "Eventos PPV"].map(
                (benefit, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-neutral-300">
                    <CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" />
                    <span>{lang === "es" ? benefit : t.contenido.items[idx]}</span>
                  </li>
                )
              )}
            </ul>

            <a
              href={getWhatsAppLink(
                lang === "es"
                  ? `Hola, quiero comprar el Plan de 1 mes por ${
                      currency === "USD" ? "$15 USD" : "$200 MXN"
                    }.`
                  : `Hello, I want to buy the 1 Month Plan for ${
                      currency === "USD" ? "$15 USD" : "$200 MXN"
                    }.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-xl font-semibold transition-colors text-center"
            >
              {t.planes.btnComprar}
            </a>
          </div>

          <div className="bg-gradient-to-b from-yellow-500/10 to-neutral-900/90 backdrop-blur-md border-2 border-yellow-500 rounded-3xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-yellow-500/20">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-neutral-950 px-6 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg shadow-yellow-500/30 whitespace-nowrap uppercase tracking-wider">
              <Star className="w-4 h-4 fill-neutral-950" /> {t.planes.mejorOferta}
            </div>

            <div className="mb-8 mt-2">
              <h3 className="text-xl font-semibold text-yellow-500 mb-2">
                {lang === "es" ? "Plan 4 Meses" : "4 Months Plan"}
              </h3>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-medium text-neutral-500 line-through opacity-70">
                  {currency === "USD" ? "$50" : "$670"}
                </span>
                <span className="text-5xl font-bold text-white">
                  {currency === "USD" ? "$35" : "$450"}
                </span>
                <span className="text-neutral-400">{currency}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {["Acceso completo", "Películas", "Series", "TV en vivo", "Eventos PPV"].map(
                (benefit, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-neutral-200">
                    <CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" />
                    <span>{lang === "es" ? benefit : t.contenido.items[idx]}</span>
                  </li>
                )
              )}

              <li className="pt-4 mt-4 border-t border-yellow-500/20 space-y-3 list-none">
  <div className="flex items-center gap-3 text-yellow-400 font-medium">
    <Zap className="w-5 h-5 shrink-0 fill-yellow-400/20" />
    <span>{lang === "es" ? "1 mes de regalo incluido" : "1 free month included"}</span>
  </div>

  <div className="flex items-center gap-3 text-yellow-400 font-medium">
    <ShieldCheck className="w-5 h-5 shrink-0 fill-yellow-400/20" />
    <span>{t.planes.recomendado}</span>
  </div>
</li>
            </ul>

            <a
              href={getWhatsAppLink(
                lang === "es"
                  ? `Hola, quiero aprovechar la Mejor Oferta: Plan de 4 meses por ${
                      currency === "USD" ? "$35 USD" : "$450 MXN"
                    }.`
                  : `Hello, I want to take advantage of the Best Offer: 4 Months Plan for ${
                      currency === "USD" ? "$35 USD" : "$450 MXN"
                    }.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-neutral-950 py-4 rounded-xl font-bold transition-all text-center text-lg shadow-lg shadow-yellow-500/25 hover:scale-[1.02]"
            >
              {t.planes.btnComprar}
            </a>
          </div>

          <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-3xl p-8 flex flex-col relative hover:border-yellow-500/30 transition-colors">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-neutral-300 mb-2">
                {lang === "es" ? "Plan 2 Meses" : "2 Months Plan"}
              </h3>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-medium text-neutral-500 line-through">
                  {currency === "USD" ? "$35" : "$470"}
                </span>
                <span className="text-4xl font-bold text-white">
                  {currency === "USD" ? "$25" : "$350"}
                </span>
                <span className="text-neutral-500">{currency}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {["Acceso completo", "Películas", "Series", "TV en vivo", "Eventos PPV"].map(
                (benefit, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-neutral-300">
                    <CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" />
                    <span>{lang === "es" ? benefit : t.contenido.items[idx]}</span>
                  </li>
                )
              )}
            </ul>

            <a
              href={getWhatsAppLink(
                lang === "es"
                  ? `Hola, quiero comprar el Plan de 2 meses por ${
                      currency === "USD" ? "$25 USD" : "$350 MXN"
                    }.`
                  : `Hello, I want to buy the 2 Months Plan for ${
                      currency === "USD" ? "$25 USD" : "$350 MXN"
                    }.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-xl font-semibold transition-colors text-center"
            >
              {t.planes.btnComprar}
            </a>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-neutral-900/40 border border-neutral-800/50 rounded-3xl p-8 hover:border-yellow-500/20 transition-colors">
            <h4 className="text-xl font-bold text-yellow-500 mb-4 flex items-center gap-2">
              <Coins className="w-6 h-6" /> {t.planes.monedaTitle}
            </h4>

            <div className="space-y-4 text-neutral-300 whitespace-pre-line">
              {t.planes.monedaDesc}
            </div>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800/50 rounded-3xl p-8 hover:border-yellow-500/20 transition-colors">
            <h4 className="text-xl font-bold text-yellow-500 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6" /> {t.planes.pagosTitle}
            </h4>

            <div className="space-y-4 text-neutral-300 whitespace-pre-line">
              {t.planes.pagosDesc}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}