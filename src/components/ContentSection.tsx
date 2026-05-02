import {
  Film,
  MonitorPlay,
  Star,
  Trophy,
  Tv,
} from "lucide-react";

type Props = {
  t: any;
};

export default function ContentSection({ t }: Props) {
  return (
    <section
      id="contenido"
      className="py-24 bg-neutral-950/50 backdrop-blur-sm border-y border-neutral-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          {t.contenido.title}
        </h2>

        <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-16">
          {t.contenido.desc}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-8 max-w-4xl mx-auto mb-16">
          {[
            { icon: Film, label: t.contenido.items[0] },
            { icon: MonitorPlay, label: t.contenido.items[1] },
            { icon: Tv, label: t.contenido.items[2] },
            { icon: Trophy, label: t.contenido.items[3] },
            { icon: Star, label: t.contenido.items[4] },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/50 hover:border-yellow-500/50 transition-colors group"
            >
              <div className="w-16 h-16 rounded-full bg-neutral-950 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-yellow-500/10 shadow-inner">
                <item.icon className="w-8 h-8 text-neutral-400 group-hover:text-yellow-500 transition-colors" />
              </div>

              <span className="font-medium text-neutral-300 group-hover:text-white transition-colors text-sm sm:text-base">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 shadow-xl">
            <div className="text-4xl font-black text-yellow-500 mb-2">
              {t.contenido.stats.movies.split(" ")[0]}
            </div>
            <div className="text-neutral-400 font-medium uppercase tracking-wider text-sm">
              {t.contenido.stats.movies.split(" ").slice(1).join(" ")}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 shadow-xl">
            <div className="text-4xl font-black text-yellow-500 mb-2">
              {t.contenido.stats.series.split(" ")[0]}
            </div>
            <div className="text-neutral-400 font-medium uppercase tracking-wider text-sm">
              {t.contenido.stats.series.split(" ").slice(1).join(" ")}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 shadow-xl">
            <div className="text-4xl font-black text-yellow-500 mb-2">
              {t.contenido.stats.channels.split(" ")[0]}
            </div>
            <div className="text-neutral-400 font-medium uppercase tracking-wider text-sm">
              {t.contenido.stats.channels.split(" ").slice(1).join(" ")}
            </div>
          </div>
        </div>

        <p className="mt-12 text-neutral-400 font-medium italic">
          ✨ {t.contenido.stats.platforms}
        </p>
      </div>
    </section>
  );
}