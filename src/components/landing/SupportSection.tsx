import {
  AlertCircle,
  Bug,
  Download,
  HelpCircle,
  Smartphone,
  UserCog,
} from "lucide-react";

import { getWhatsAppLink } from "../../lib/whatsapp";

type Props = {
  t: any;
  lang: "es" | "en";
};

export default function SupportSection({ t, lang }: Props) {
  const items = [
    {
      title: lang === "es" ? "Problemas con la app" : "App issues",
      icon: Smartphone,
      msg:
        lang === "es"
          ? "Hola, tengo problemas con la app de Santiel TV y necesito ayuda."
          : "Hello, I have issues with the Santiel TV app and need help.",
    },
    {
      title: lang === "es" ? "Problemas con la cuenta" : "Account issues",
      icon: UserCog,
      msg:
        lang === "es"
          ? "Hola, tengo problemas con mi cuenta de Santiel TV."
          : "Hello, I have issues with my Santiel TV account.",
    },
    {
      title: lang === "es" ? "Error al acceder" : "Login error",
      icon: AlertCircle,
      msg:
        lang === "es"
          ? "Hola, me aparece un error al intentar acceder a Santiel TV."
          : "Hello, I get an error when trying to access Santiel TV.",
    },
    {
      title: lang === "es" ? "Reportar bug" : "Report bug",
      icon: Bug,
      msg:
        lang === "es"
          ? "Hola, quiero reportar un bug o error en Santiel TV."
          : "Hello, I want to report a bug or error in Santiel TV.",
    },
    {
      title: lang === "es" ? "Soporte general" : "General support",
      icon: HelpCircle,
      msg:
        lang === "es"
          ? "Hola, necesito soporte general sobre Santiel TV."
          : "Hello, I need general support about Santiel TV.",
    },
    {
      title: t.soporte.descargas,
      icon: Download,
      msg:
        lang === "es"
          ? "Hola, tengo problemas con los links de descarga de Santiel TV."
          : "Hello, I'm having trouble with the Santiel TV download links.",
    },
  ];

  return (
    <section
      id="soporte"
      className="py-24 bg-neutral-950/50 backdrop-blur-sm border-y border-neutral-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t.soporte.title}
          </h2>

          <p className="text-xl text-neutral-400">
            {t.soporte.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {items.map((item, i) => (
            <a
              key={i}
              href={getWhatsAppLink(item.msg)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-neutral-900/80 border border-neutral-800 hover:border-yellow-500/50 p-6 rounded-2xl flex items-center gap-4 transition-all hover:bg-neutral-800 group"
            >
              <div className="w-12 h-12 rounded-full bg-neutral-950 flex items-center justify-center group-hover:bg-yellow-500/10 transition-colors shrink-0">
                <item.icon className="w-6 h-6 text-neutral-400 group-hover:text-yellow-500" />
              </div>

              <div className="text-left">
                <h4 className="text-white font-semibold leading-tight mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-500">
                  {t.soporte.whatsapp}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}