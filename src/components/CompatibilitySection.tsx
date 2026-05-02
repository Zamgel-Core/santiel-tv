import {
  Apple,
  Download,
  Laptop,
  Monitor,
  MonitorPlay,
  Smartphone,
  Tablet,
  Tv,
} from "lucide-react";

type Props = {
  t: any;
  setActiveDownload: (value: string) => void;
};

export default function CompatibilitySection({ t, setActiveDownload }: Props) {
  return (
    <section
      id="compatibilidad"
      className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          {t.compatibilidad.title}
        </h2>

        <p className="text-xl text-neutral-400 mb-4">
          {t.compatibilidad.desc}
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold">
          <MonitorPlay className="w-5 h-5" />
          <span>{t.compatibilidad.simultaneos}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* ANDROID */}
        <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-3xl p-8 flex flex-col items-center text-center hover:border-yellow-500/30 transition-colors shadow-lg group">
          <div className="flex gap-2 mb-6 text-yellow-500 group-hover:scale-110 transition-transform">
            <Smartphone className="w-10 h-10" />
            <Tablet className="w-10 h-10" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Android</h3>
          <p className="text-neutral-400 text-sm mb-6">Celulares y Tablets</p>

          <button
            onClick={() => setActiveDownload("android")}
            className="mt-auto flex items-center gap-2 text-yellow-500 hover:text-yellow-400 font-bold text-sm transition-colors"
          >
            <Download className="w-4 h-4" /> {t.compatibilidad.btnDescargas}
          </button>
        </div>

        {/* APPLE */}
        <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-3xl p-8 flex flex-col items-center text-center hover:border-yellow-500/30 transition-colors shadow-lg group">
          <div className="flex gap-2 mb-6 text-yellow-500 group-hover:scale-110 transition-transform">
            <Apple className="w-10 h-10" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Apple</h3>
          <p className="text-neutral-400 text-sm mb-6">iPhone y iPad</p>

          <button
            onClick={() => setActiveDownload("apple")}
            className="mt-auto flex items-center gap-2 text-yellow-500 hover:text-yellow-400 font-bold text-sm transition-colors"
          >
            <Download className="w-4 h-4" /> {t.compatibilidad.btnDescargas}
          </button>
        </div>

        {/* ROKU */}
        <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-3xl p-8 flex flex-col items-center text-center hover:border-yellow-500/30 transition-colors shadow-lg group">
          <div className="flex gap-2 mb-6 text-yellow-500 group-hover:scale-110 transition-transform">
            <Tv className="w-10 h-10" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Roku TV</h3>
          <p className="text-neutral-400 text-sm mb-6">Smart TVs y Reproductores</p>

          <button
            onClick={() => setActiveDownload("roku")}
            className="mt-auto flex items-center gap-2 text-yellow-500 hover:text-yellow-400 font-bold text-sm transition-colors"
          >
            <Download className="w-4 h-4" /> {t.compatibilidad.btnDescargas}
          </button>
        </div>

        {/* PC */}
        <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-3xl p-8 flex flex-col items-center text-center hover:border-yellow-500/30 transition-colors shadow-lg group">
          <div className="flex gap-2 mb-6 text-yellow-500 group-hover:scale-110 transition-transform">
            <Monitor className="w-10 h-10" />
            <Laptop className="w-10 h-10" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">PC y Mac</h3>
          <p className="text-neutral-400 text-sm mb-6">Navegadores Web</p>

          <button
            onClick={() => setActiveDownload("pc")}
            className="mt-auto flex items-center gap-2 text-yellow-500 hover:text-yellow-400 font-bold text-sm transition-colors"
          >
            <Download className="w-4 h-4" /> {t.compatibilidad.btnDescargas}
          </button>
        </div>

      </div>
    </section>
  );
}