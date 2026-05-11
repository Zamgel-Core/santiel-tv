type Props = {
  lang: 'es' | 'en';
  setLang: (value: 'es' | 'en') => void;
  currency: 'USD' | 'MXN';
  setCurrency: (value: 'USD' | 'MXN') => void;
  setShowLoginModal: (value: boolean) => void;
  setShowDemoModal: (value: boolean) => void;
  t: any;
};

export default function Navbar({
  lang,
  setLang,
  currency,
  setCurrency,
  setShowLoginModal,
  setShowDemoModal,
  t,
}: Props) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="text-xl font-black tracking-tight text-white">
          Santiel <span className="text-yellow-500">TV</span>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-300">
  <a href="#inicio" className="hover:text-yellow-400 transition">
    {t.nav.inicio}
  </a>
  <a href="#planes" className="hover:text-yellow-400 transition">
    {t.nav.planes}
  </a>
  <a href="#lealtad" className="hover:text-yellow-400 transition">
    {t.nav.lealtad}
  </a>
  <a href="#contenido" className="hover:text-yellow-400 transition">
    {t.nav.contenido}
  </a>
  <a href="#compatibilidad" className="hover:text-yellow-400 transition">
    {t.nav.compatibilidad}
  </a>
  <a href="#soporte" className="hover:text-yellow-400 transition">
    {t.nav.soporte}
  </a>
</div>

        {/* BOTONES DERECHA */}
        <div className="flex items-center gap-3">

          {/* Idioma */}
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="px-3 py-1 text-sm bg-neutral-800 rounded-lg hover:bg-neutral-700"
          >
            {lang.toUpperCase()}
          </button>

          {/* Moneda */}
          <button
            onClick={() => setCurrency(currency === 'USD' ? 'MXN' : 'USD')}
            className="px-3 py-1 text-sm bg-neutral-800 rounded-lg hover:bg-neutral-700"
          >
            {currency}
          </button>

          {/* Demo */}
          <button
            onClick={() => setShowDemoModal(true)}
            className="px-4 py-2 bg-neutral-800 rounded-xl hover:bg-neutral-700"
          >
            {t.nav.probarGratis}
          </button>

          {/* Portal */}
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400"
          >
            Portal
          </button>

        </div>
      </div>
    </nav>
  );
}