import { ShieldCheck } from "lucide-react";

type Props = {
  t: any;
};

export default function AboutSection({ t }: Props) {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t.acerca.title}
          </h2>

          <p className="text-lg text-neutral-300 mb-6 leading-relaxed">
            {t.acerca.desc}
          </p>

          <div className="grid grid-cols-2 gap-6 mt-12">
            {t.acerca.puntos.map((focus: any, i: number) => (
              <div key={i} className="border-l-2 border-yellow-500 pl-4">
                <h4 className="text-white font-semibold mb-1">
                  {focus.title}
                </h4>
                <p className="text-sm text-neutral-400">
                  {focus.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="aspect-square w-full max-w-md rounded-full bg-gradient-to-tr from-yellow-500/20 to-neutral-900/50 border border-neutral-800/50 flex items-center justify-center p-12 relative overflow-hidden backdrop-blur-sm">
            <ShieldCheck className="w-32 h-32 text-yellow-500 relative z-10 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
          </div>
        </div>
      </div>
    </section>
  );
}