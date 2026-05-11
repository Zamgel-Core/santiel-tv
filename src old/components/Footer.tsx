import { Tv } from "lucide-react";

type Props = {
  t: any;
  setLegalModal: (value: {
    type: "terminos" | "privacidad";
    isOpen: boolean;
  }) => void;
};

export default function Footer({ t, setLegalModal }: Props) {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Santiel TV"
            className="h-6 w-auto opacity-80 grayscale hover:grayscale-0 transition-all"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />

          <div className="hidden flex items-center gap-2 text-yellow-500 opacity-80">
            <Tv className="w-5 h-5" />
            <span className="font-bold text-lg tracking-tight text-white">
              Santiel <span className="text-yellow-500">TV</span>
            </span>
          </div>
        </div>

        {/* LINKS */}
        <div className="flex gap-6 text-sm text-neutral-500">
          <button
            onClick={() =>
              setLegalModal({ type: "terminos", isOpen: true })
            }
            className="hover:text-neutral-300 transition-colors"
          >
            {t.footer.terminos}
          </button>

          <button
            onClick={() =>
              setLegalModal({ type: "privacidad", isOpen: true })
            }
            className="hover:text-neutral-300 transition-colors"
          >
            {t.footer.privacidad}
          </button>
        </div>

        {/* COPYRIGHT */}
        <p className="text-sm text-neutral-600">
          &copy; {new Date().getFullYear()} Santiel TV. {t.footer.derechos}
        </p>
      </div>
    </footer>
  );
}