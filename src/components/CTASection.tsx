import { Phone } from "lucide-react";
import { getWhatsAppLink } from "../utils/whatsapp";

type Props = {
  lang: "es" | "en";
};

export default function CTASection({ lang }: Props) {
  return (
    <section className="py-24 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-neutral-950 text-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/background.png')] opacity-10 mix-blend-overlay bg-cover bg-center"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight drop-shadow-sm">
          {lang === "es" ? "¿Listo para comenzar?" : "Ready to start?"}
        </h2>

        <p className="text-xl font-medium mb-10 opacity-90">
          {lang === "es"
            ? "Contáctanos ahora y obtén acceso inmediato a Santiel TV. Resolvemos tus dudas y activamos tu servicio al instante."
            : "Contact us now and get immediate access to Santiel TV. We solve your doubts and activate your service instantly."}
        </p>

        <a
          href={getWhatsAppLink(
            lang === "es"
              ? "Hola, estoy listo para comenzar con Santiel TV. ¿Me pueden ayudar?"
              : "Hello, I'm ready to start with Santiel TV. Can you help me?"
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-neutral-950 hover:bg-neutral-800 text-white px-10 py-5 rounded-full font-bold text-xl transition-all hover:scale-105 shadow-2xl shadow-neutral-950/30"
        >
          <Phone className="w-6 h-6" />
          {lang === "es" ? "Comprar por WhatsApp" : "Buy via WhatsApp"}
        </a>
      </div>
    </section>
  );
}