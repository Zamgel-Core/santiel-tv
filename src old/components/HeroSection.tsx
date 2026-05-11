import { motion } from "framer-motion";
import { Star, ChevronRight, Tv } from "lucide-react";

type Props = {
  t: any;
};

export default function HeroSection({ t }: Props) {
  return (
    <section
      id="inicio"
      className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 min-h-[90vh] justify-center"
    >
      {/* LEFT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 text-center lg:text-left"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-medium mb-6 border border-yellow-500/20 backdrop-blur-sm">
          <Star className="w-4 h-4" />
          <span>{t.hero.badge}</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight drop-shadow-lg">
          {t.hero.title}
          <br className="hidden lg:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600">
            Santiel TV
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-neutral-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed drop-shadow">
          {t.hero.desc}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
          <a
            href="#planes"
            className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-neutral-950 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-xl shadow-yellow-500/20"
          >
            {t.hero.btnPlanes} <ChevronRight className="w-5 h-5" />
          </a>

          <a
            href="#contenido"
            className="w-full sm:w-auto bg-neutral-800/80 hover:bg-neutral-700/80 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 border border-neutral-700"
          >
            {t.hero.btnCatalogo}
          </a>
        </div>
      </motion.div>

      {/* RIGHT */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 w-full max-w-lg relative flex justify-center"
      >
        <div className="absolute inset-0 bg-yellow-500/20 blur-[100px] rounded-full"></div>

        <div className="relative z-10 group">
          <motion.img
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            src="/icon.png"
            alt="Santiel TV App Icon"
            className="w-64 h-64 sm:w-80 sm:h-80 object-contain drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />

          {/* fallback */}
          <div className="hidden relative bg-neutral-900 border border-neutral-800 rounded-3xl p-4 shadow-2xl shadow-yellow-500/10 w-full aspect-video">
            <div className="w-full h-full bg-neutral-950 rounded-2xl flex items-center justify-center border border-neutral-800">
              <Tv className="w-24 h-24 text-yellow-500" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}