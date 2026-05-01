import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tv, Play, Film, MonitorPlay, Trophy, Star, Gift, Phone, CheckCircle2, ChevronRight, ShieldCheck, Zap, HeartHandshake, Smartphone, Tablet, Apple, Monitor, Laptop, AlertCircle, UserCog, Bug, HelpCircle, X, Globe, Download, Lock, ExternalLink, Coins } from 'lucide-react';

const WHATSAPP_NUMBER = "13468847800"; // Reemplazar con el número real

const translations = {
  es: {
    nav: {
      inicio: "Inicio",
      planes: "Planes",
      lealtad: "Lealtad",
      contenido: "Contenido",
      compatibilidad: "Compatibilidad",
      soporte: "Soporte",
      probarGratis: "Probar Gratis",
      contactar: "Contactar"
    },
    hero: {
      badge: "Entretenimiento Premium",
      title: "Todo tu contenido en",
      desc: "Plataforma de streaming que ofrece acceso a películas, series, TV en vivo y deportes en una sola aplicación. Accede desde cualquier dispositivo con planes accesibles.",
      btnPlanes: "Ver Planes",
      btnCatalogo: "Explorar Catálogo"
    },
    planes: {
      title: "Planes disponibles",
      desc: "Acceso completo por 1, 2 o 3 meses para ver películas, series, TV en vivo y deportes.",
      mejorOferta: "Mejor Oferta",
      btnComprar: "Comprar Plan",
      ahorro: "Mayor ahorro",
      recomendado: "Mejor opción recomendada",
      monedaTitle: "Sobre moneda (USD vs MXN)",
      monedaDesc: "💵 Precios y moneda\nLos precios en dólares (USD) aplican para usuarios en Estados Unidos y otros países donde se utilice esta moneda.\nPara usuarios en México y Latinoamérica, contamos con precios especiales en moneda local.",
      pagosTitle: "Métodos de pago",
      pagosDesc: "💳 Métodos de pago disponibles\nAceptamos pagos mediante Zelle, PayPal y Mercado Pago.\nMercado Pago está disponible únicamente en países donde el servicio es compatible."
    },
    compatibilidad: {
      title: "Compatibilidad Total",
      desc: "Disfruta de Santiel TV en todos tus dispositivos favoritos, en casa o en cualquier lugar.",
      simultaneos: "Hasta 4 dispositivos simultáneamente",
      btnDescargas: "Descargas"
    },
    soporte: {
      title: "Soporte y Ayuda",
      desc: "¿Tienes algún inconveniente? Nuestro equipo está listo para ayudarte rápidamente.",
      whatsapp: "Contactar por WhatsApp",
      descargas: "Problemas con las descargas"
    },
    demo: {
      title: "Solicitar Demo Gratis",
      desc: "Te damos acceso a una demo gratuita para que vivas la experiencia Santiel TV sin compromiso.",
      btnSi: "Sí, vamos",
      btnNo: "No gracias"
    },
    lealtad: {
      badge: "Próximamente",
      title: "Sistema de Lealtad Santiel TV",
      desc: "Premiamos a nuestros clientes fieles. Acumula puntos cada mes y obtén beneficios exclusivos dentro de Santiel TV.",
      comoFunciona: "¿Cómo funciona?",
      regla1: "Cada mes activo = 1 punto",
      regla2: "Por cada 2 amigos invitados = 1 punto",
      regla3: "3 puntos = 1 mes GRATIS",
      cita: "\"No solo estás pagando un servicio, estás invirtiendo en beneficios a largo plazo.\"",
      btnActivar: "Activar plan ahora",
      beneficios: [
        { title: "Meses gratis", desc: "Canjea puntos por tiempo de servicio" },
        { title: "Acceso prioritario", desc: "A nuevo contenido y funciones" },
        { title: "Promociones exclusivas", desc: "Descuentos especiales para ti" },
        { title: "Soporte preferencial", desc: "Atención rápida y directa" }
      ]
    },
    contenido: {
      title: "Catálogo Inmenso",
      desc: "Acceso a una amplia variedad de contenido. Todo en un solo lugar, sin necesidad de múltiples plataformas.",
      items: ["Películas", "Series", "TV en vivo", "Deportes", "Eventos Premium"],
      stats: {
        movies: "+18000 películas",
        series: "+4500 series",
        channels: "+3000 canales de tv en vivo",
        platforms: "Incluye contenido de las plataformas de streaming más populares."
      }
    },
    acerca: {
      title: "Sobre Santiel TV",
      desc: "Santiel TV es una plataforma diseñada para ofrecer entretenimiento completo en un solo lugar. Nuestro objetivo es brindar acceso fácil, rápido y económico a contenido de calidad desde cualquier dispositivo.",
      puntos: [
        { title: "Simplicidad", desc: "Fácil de usar para todos" },
        { title: "Acceso inmediato", desc: "Sin esperas ni complicaciones" },
        { title: "Precio accesible", desc: "Planes para cada bolsillo" },
        { title: "Experiencia premium", desc: "Calidad en cada reproducción" }
      ]
    },
    footer: {
      terminos: "Términos y Condiciones",
      privacidad: "Política de Privacidad",
      derechos: "Todos los derechos reservados."
    },
    legal: {
      terminos: {
        title: "Términos y Condiciones de Uso – Santiel TV",
        sections: [
          { title: "1. Aceptación de los términos", content: "Al contratar y utilizar los servicios de Santiel TV, el usuario acepta cumplir con los presentes Términos y Condiciones. Si no está de acuerdo con alguna parte, deberá abstenerse de utilizar el servicio." },
          { title: "2. Descripción del servicio", content: "Santiel TV ofrece acceso a contenido digital de entretenimiento, incluyendo canales en vivo, películas, series y eventos especiales mediante una plataforma compatible con dispositivos móviles, televisores inteligentes y otros dispositivos autorizados." },
          { title: "3. Planes y precios", content: "Los precios pueden mostrarse en dólares estadounidenses (USD) o (MXN).\nLos precios en USD aplican principalmente para usuarios en Estados Unidos u otros países donde se utilice dicha moneda.\nLos precios en (MXN) pueden incluir descuentos o ajustes según la región.\nSantiel TV se reserva el derecho de modificar precios y promociones en cualquier momento." },
          { title: "4. Métodos de pago", content: "Se aceptan pagos a través de:\n\nZelle\nPayPal\nMercado Pago (disponible solo en países compatibles)\n\nEl servicio será activado una vez confirmado el pago." },
          { title: "5. Activación y duración", content: "El acceso al servicio se activa tras la confirmación del pago.\nLa duración del servicio corresponde al plan adquirido (ej. 1 mes, 2 meses, 3 meses).\nEl tiempo comienza a contar desde el momento de activación." },
          { title: "6. Uso del servicio", content: "El usuario se compromete a:\n\nNo compartir su cuenta con terceros fuera de su hogar.\nNo revender, distribuir o comercializar el servicio sin autorización.\nNo realizar actividades que afecten el funcionamiento del sistema.\n\nSantiel TV podrá suspender o cancelar cuentas que incumplan estas condiciones." },
          { title: "7. Política de no reembolso", content: "Debido a la naturaleza digital del servicio:\nNo se realizan reembolsos una vez activado el servicio.\nEs responsabilidad del usuario verificar compatibilidad antes de la compra.\nNota: se aplican ciertas excepciones a tipos de reembolso pero esto se tomara a criterio del Equipo de Santiel TV. Gracias por su compresion." },
          { title: "8. Disponibilidad del servicio", content: "Santiel TV busca ofrecer un servicio continuo, pero no garantiza disponibilidad del 100%.\nPueden presentarse interrupciones por mantenimiento, fallas técnicas o causas externas.\nNo se realizan compensaciones por interrupciones temporales." },
          { title: "9. Compatibilidad", content: "El usuario es responsable de contar con:\n\nConexión a internet estable\nDispositivo compatible\n\nSantiel TV no se responsabiliza por fallas derivadas del equipo o conexión del usuario." },
          { title: "10. Modificaciones del servicio", content: "Santiel TV puede:\n\nActualizar, modificar o eliminar contenido sin previo aviso\nCambiar características del servicio para mejorar la experiencia" },
          { title: "11. Cancelación", content: "Santiel TV se reserva el derecho de suspender o cancelar el acceso sin previo aviso en caso de:\n\nUso indebido\nIncumplimiento de estos términos" },
          { title: "12. Responsabilidad", content: "Santiel TV no se hace responsable por:\n\nUso indebido del servicio\nContenido visualizado por el usuario\nProblemas derivados de terceros (internet, dispositivos, etc.)" },
          { title: "13. Privacidad", content: "La información proporcionada por el usuario será utilizada únicamente para la gestión del servicio y no será compartida con terceros sin consentimiento." },
          { title: "14. Cambios en los términos", content: "Santiel TV puede modificar estos Términos y Condiciones en cualquier momento. Se recomienda revisarlos periódicamente." },
          { title: "15. Contacto", content: "Para soporte o dudas, el usuario puede comunicarse a través de los canales oficiales de Santiel TV." }
        ]
      },
      privacidad: {
        title: "Política de Privacidad – Santiel TV",
        sections: [
          { title: "1. Introducción", content: "En Santiel TV, valoramos la privacidad de nuestros usuarios y nos comprometemos a proteger la información personal que compartes con nosotros. Esta Política de Privacidad explica cómo recopilamos, utilizamos y protegemos tus datos." },
          { title: "2. Información que recopilamos", content: "Podemos recopilar la siguiente información:\n\nNombre o alias del usuario\nNúmero de teléfono\nCorreo electrónico (si aplica)\nInformación de pago (solo confirmación, no almacenamos datos bancarios sensibles)\nInformación básica de uso del servicio" },
          { title: "3. Uso de la información", content: "La información recopilada se utiliza para:\nActivar y gestionar tu cuenta\nBrindar acceso al servicio contratado\nOfrecer soporte técnico\nEnviar información relevante sobre tu suscripción\nMejorar nuestros servicios" },
          { title: "4. Métodos de pago", content: "Los pagos se procesan a través de plataformas externas como:\n\nZelle\nPayPal\nMercado Pago\n\nSantiel TV no almacena información bancaria ni datos sensibles de pago. Todas las transacciones son gestionadas directamente por dichas plataformas." },
          { title: "5. Protección de datos", content: "Implementamos medidas razonables de seguridad para proteger tu información contra accesos no autorizados, alteraciones o divulgación." },
          { title: "6. Compartición de información", content: "Santiel TV no vende, alquila ni comparte tu información personal con terceros." },
          { title: "7. Uso del servicio", content: "Podemos recopilar información básica sobre el uso del servicio con fines de:\n\nDiagnóstico de errores\nMejora de la experiencia del usuario\nOptimización del sistema" },
          { title: "8. Cookies y tecnologías similares", content: "En caso de utilizar sitio web, podemos usar cookies o tecnologías similares para mejorar la navegación y experiencia del usuario." },
          { title: "9. Derechos del usuario", content: "El usuario tiene derecho a:\n\nSolicitar acceso a su información\nSolicitar corrección o eliminación de sus datos\nRetirar su consentimiento en cualquier momento\n\nPara ejercer estos derechos, puede contactarnos a través de los canales oficiales." },
          { title: "10. Retención de datos", content: "La información será conservada únicamente durante el tiempo necesario para cumplir con los fines del servicio." },
          { title: "11. Menores de edad", content: "El servicio no está dirigido a menores de edad sin supervisión de un adulto. No recopilamos intencionalmente información de menores." },
          { title: "12. Cambios en la política", content: "Santiel TV puede actualizar esta Política de Privacidad en cualquier momento. Se recomienda revisarla periódicamente." },
          { title: "13. Contacto", content: "Para cualquier duda relacionada con esta Política de Privacidad, puedes comunicarte a través de los canales oficiales de Santiel TV." }
        ]
      }
    },
    descargas: {
      title: "Panel de Descargas",
      passPlaceholder: "Ingresa la contraseña",
      btnDesbloquear: "Desbloquear",
      errorPass: "Contraseña incorrecta",
      btnCerrar: "Cerrar",
      instrucciones: "Usa la contraseña proporcionada para acceder a los links de descarga."
    }
  },
  en: {
    nav: {
      inicio: "Home",
      planes: "Plans",
      lealtad: "Loyalty",
      contenido: "Content",
      compatibilidad: "Compatibility",
      soporte: "Support",
      probarGratis: "Try Free",
      contactar: "Contact"
    },
    hero: {
      badge: "Premium Entertainment",
      title: "All your content on",
      desc: "Streaming platform offering access to movies, series, live TV, and sports in a single app. Access from any device with affordable plans.",
      btnPlanes: "View Plans",
      btnCatalogo: "Explore Catalog"
    },
    planes: {
      title: "Available Plans",
      desc: "Full access for 1, 2, or 3 months to watch movies, series, live TV, and sports.",
      mejorOferta: "Best Offer",
      btnComprar: "Buy Plan",
      ahorro: "Biggest savings",
      recomendado: "Best recommended option",
      monedaTitle: "About currency (USD vs MXN)",
      monedaDesc: "💵 Prices and currency\nPrices in dollars (USD) apply to users in the United States and other countries where this currency is used.\nFor users in Mexico and Latin America, we have special prices in local currency.",
      pagosTitle: "Payment methods",
      pagosDesc: "💳 Available payment methods\nWe accept payments via Zelle, PayPal, and Mercado Pago.\nMercado Pago is only available in countries where the service is compatible."
    },
    compatibilidad: {
      title: "Total Compatibility",
      desc: "Enjoy Santiel TV on all your favorite devices, at home or anywhere.",
      simultaneos: "Up to 4 simultaneous devices",
      btnDescargas: "Downloads"
    },
    soporte: {
      title: "Support and Help",
      desc: "Having any issues? Our team is ready to help you quickly.",
      whatsapp: "Contact via WhatsApp",
      descargas: "Download issues"
    },
    demo: {
      title: "Request Free Demo",
      desc: "We give you access to a free demo so you can experience Santiel TV without commitment.",
      btnSi: "Yes, let's go",
      btnNo: "No thanks"
    },
    lealtad: {
      badge: "Coming Soon",
      title: "Santiel TV Loyalty System",
      desc: "We reward our loyal customers. Accumulate points every month and get exclusive benefits within Santiel TV.",
      comoFunciona: "How does it work?",
      regla1: "Each active month = 1 point",
      regla2: "For every 2 invited friends = 1 point",
      regla3: "3 points = 1 month FREE",
      cita: "\"You're not just paying for a service, you're investing in long-term benefits.\"",
      btnActivar: "Activate plan now",
      beneficios: [
        { title: "Free months", desc: "Redeem points for service time" },
        { title: "Priority access", desc: "To new content and features" },
        { title: "Exclusive promos", desc: "Special discounts for you" },
        { title: "Preferred support", desc: "Fast and direct attention" }
      ]
    },
    contenido: {
      title: "Immense Catalog",
      desc: "Access to a wide variety of content. Everything in one place, without the need for multiple platforms.",
      items: ["Movies", "Series", "Live TV", "Sports", "Premium Events"],
      stats: {
        movies: "+18000 movies",
        series: "+4500 series",
        channels: "+3000 live TV channels",
        platforms: "Includes content from the most popular streaming platforms."
      }
    },
    acerca: {
      title: "About Santiel TV",
      desc: "Santiel TV is a platform designed to offer complete entertainment in one place. Our goal is to provide easy, fast, and affordable access to quality content from any device.",
      puntos: [
        { title: "Simplicity", desc: "Easy to use for everyone" },
        { title: "Immediate access", desc: "No waiting or complications" },
        { title: "Affordable price", desc: "Plans for every pocket" },
        { title: "Premium experience", desc: "Quality in every playback" }
      ]
    },
    footer: {
      terminos: "Terms and Conditions",
      privacidad: "Privacy Policy",
      derechos: "All rights reserved."
    },
    legal: {
      terminos: {
        title: "Terms and Conditions of Use – Santiel TV",
        sections: [
          { title: "1. Acceptance of terms", content: "By hiring and using Santiel TV services, the user agrees to comply with these Terms and Conditions. If you do not agree with any part, you must refrain from using the service." },
          { title: "2. Description of service", content: "Santiel TV offers access to digital entertainment content, including live channels, movies, series, and special events through a platform compatible with mobile devices, smart TVs, and other authorized devices." },
          { title: "3. Plans and prices", content: "Prices can be shown in US dollars (USD) or (MXN).\nUSD prices apply mainly to users in the United States or other countries where said currency is used.\nMXN prices may include discounts or adjustments according to the region.\nSantiel TV reserves the right to modify prices and promotions at any time." },
          { title: "4. Payment methods", content: "Payments are accepted through:\n\nZelle\nPayPal\nMercado Pago (available only in compatible countries)\n\nThe service will be activated once payment is confirmed." },
          { title: "5. Activation and duration", content: "Access to the service is activated after payment confirmation.\nThe duration of the service corresponds to the plan purchased (e.g., 1 month, 2 months, 3 months).\nTime starts counting from the moment of activation." },
          { title: "6. Use of service", content: "The user agrees to:\n\nNot share their account with third parties outside their home.\nNot resell, distribute, or market the service without authorization.\nNot perform activities that affect the operation of the system.\n\nSantiel TV may suspend or cancel accounts that breach these conditions." },
          { title: "7. No refund policy", content: "Due to the digital nature of the service:\nNo refunds are made once the service is activated.\nIt is the user's responsibility to verify compatibility before purchase.\nNote: certain exceptions to types of refund apply but this will be taken at the discretion of the Santiel TV Team. Thank you for your understanding." },
          { title: "8. Service availability", content: "Santiel TV seeks to offer continuous service but does not guarantee 100% availability.\nInterruptions may occur due to maintenance, technical failures, or external causes.\nNo compensation is made for temporary interruptions." },
          { title: "9. Compatibility", content: "The user is responsible for having:\n\nStable internet connection\nCompatible device\n\nSantiel TV is not responsible for failures derived from the user's equipment or connection." },
          { title: "10. Service modifications", content: "Santiel TV can:\n\nUpdate, modify, or delete content without prior notice\nChange service features to improve the experience" },
          { title: "11. Cancellation", content: "Santiel TV reserves the right to suspend or cancel access without prior notice in case of:\n\nMisuse\nBreach of these terms" },
          { title: "12. Responsibility", content: "Santiel TV is not responsible for:\n\nMisuse of the service\nContent viewed by the user\nProblems derived from third parties (internet, devices, etc.)" },
          { title: "13. Privacy", content: "The information provided by the user will be used only for the management of the service and will not be shared with third parties without consent." },
          { title: "14. Changes in terms", content: "Santiel TV may modify these Terms and Conditions at any time. It is recommended to review them periodically." },
          { title: "15. Contact", content: "For support or doubts, the user can communicate through the official Santiel TV channels." }
        ]
      },
      privacidad: {
        title: "Privacy Policy – Santiel TV",
        sections: [
          { title: "1. Introduction", content: "At Santiel TV, we value the privacy of our users and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and protect your data." },
          { title: "2. Information we collect", content: "We may collect the following information:\n\nUser name or alias\nPhone number\nEmail (if applicable)\nPayment information (confirmation only, we do not store sensitive bank data)\nBasic service usage information" },
          { title: "3. Use of information", content: "The information collected is used to:\nActivate and manage your account\nProvide access to the contracted service\nProvide technical support\nSend relevant information about your subscription\nImprove our services" },
          { title: "4. Payment methods", content: "Payments are processed through external platforms like:\n\nZelle\nPayPal\nMercado Pago\n\nSantiel TV does not store bank information or sensitive payment data. All transactions are managed directly by said platforms." },
          { title: "5. Data protection", content: "We implement reasonable security measures to protect your information against unauthorized access, alteration, or disclosure." },
          { title: "6. Sharing information", content: "Santiel TV does not sell, rent, or share your personal information with third parties." },
          { title: "7. Use of service", content: "We may collect basic information about the use of the service for purposes of:\n\nError diagnosis\nUser experience improvement\nSystem optimization" },
          { title: "8. Cookies and similar technologies", content: "In case of using the website, we may use cookies or similar technologies to improve navigation and user experience." },
          { title: "9. User rights", content: "The user has the right to:\n\nRequest access to their information\nRequest correction or deletion of their data\nWithdraw their consent at any time\n\nTo exercise these rights, you can contact us through official channels." },
          { title: "10. Data retention", content: "The information will be kept only for the time necessary to fulfill the purposes of the service." },
          { title: "11. Minors", content: "The service is not directed to minors without adult supervision. We do not intentionally collect information from minors." },
          { title: "12. Changes in policy", content: "Santiel TV may update this Privacy Policy at any time. It is recommended to review it periodically." },
          { title: "13. Contact", content: "For any doubt related to this Privacy Policy, you can communicate through the official Santiel TV channels." }
        ]
      }
    },
    descargas: {
      title: "Downloads Panel",
      passPlaceholder: "Enter password",
      btnDesbloquear: "Unlock",
      errorPass: "Incorrect password",
      btnCerrar: "Close",
      instrucciones: "Use the provided password to access the download links."
    }
  }
};

const getWhatsAppLink = (message: string) => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export default function App() {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [currency, setCurrency] = useState<'USD' | 'MXN'>('USD');
  const [activeDownload, setActiveDownload] = useState<string | null>(null);
  const [downloadPassword, setDownloadPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [legalModal, setLegalModal] = useState<{ type: 'terminos' | 'privacidad', isOpen: boolean }>({ type: 'terminos', isOpen: false });

  const t = translations[lang];

  const downloadData: Record<string, { link?: string, images?: string[], pass: string, title: string }> = {
    android: { 
      title: "Android APK",
      link: "https://www.mediafire.com/file/4yss9xnkucl4zbr/SantielTV_V1.apk/file", 
      pass: "Santielandroid2026" 
    },
    apple: { 
      title: "Apple iOS",
      link: "https://apps.apple.com/us/app/aztk-play/id1662070685", 
      pass: "SantielApple1103" 
    },
    roku: { 
      title: "Roku TV",
      images: ["DigitalPro", "MundoSoporte"], 
      pass: "SantielRokutv2026" 
    },
    pc: { 
      title: "PC / Mac",
      link: "https://www.mediafire.com/file/urdb1l3cf7yvpoe/iptv-smarters-pro-1-1-2.exe/file", 
      pass: "SantielPC2026" 
    }
  };

  const handleUnlock = () => {
    if (activeDownload && downloadPassword === downloadData[activeDownload].pass) {
      setIsUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const closeDownloadModal = () => {
    setActiveDownload(null);
    setDownloadPassword("");
    setPasswordError(false);
    setIsUnlocked(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-yellow-500/30 relative">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-[-1]">
        <img src="/background.png" alt="Fondo Santiel TV" className="w-full h-full object-cover opacity-40" onError={(e) => e.currentTarget.style.display = 'none'} />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/90 to-neutral-950"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Santiel TV" className="h-8 w-auto drop-shadow-md" onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }} />
            <div className="hidden flex items-center gap-2 text-yellow-500">
              <Tv className="w-6 h-6" />
              <span className="font-bold text-xl tracking-tight text-white">Santiel <span className="text-yellow-500">TV</span></span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-300">
            <a href="#inicio" className="hover:text-yellow-500 transition-colors">{t.nav.inicio}</a>
            <a href="#planes" className="hover:text-yellow-500 transition-colors">{t.nav.planes}</a>
            <a href="#lealtad" className="hover:text-yellow-500 transition-colors">{t.nav.lealtad}</a>
            <a href="#contenido" className="hover:text-yellow-500 transition-colors">{t.nav.contenido}</a>
            <a href="#compatibilidad" className="hover:text-yellow-500 transition-colors">{t.nav.compatibilidad}</a>
            <a href="#soporte" className="hover:text-yellow-500 transition-colors">{t.nav.soporte}</a>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrency(currency === 'USD' ? 'MXN' : 'USD')}
              className="p-2 text-neutral-400 hover:text-yellow-500 transition-colors flex items-center gap-1 text-xs font-bold uppercase border border-neutral-800 rounded-lg"
              title="Cambiar moneda"
            >
              <Coins className="w-4 h-4" />
              {currency}
            </button>
            <button 
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              className="p-2 text-neutral-400 hover:text-yellow-500 transition-colors flex items-center gap-1 text-xs font-bold uppercase"
              title="Cambiar idioma"
            >
              <Globe className="w-4 h-4" />
              {lang}
            </button>
            <button 
              onClick={() => setShowDemoModal(true)}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-yellow-500 hover:text-yellow-400 transition-colors px-4 py-2"
            >
              <Play className="w-4 h-4 fill-current" />
              {t.nav.probarGratis}
            </button>
            <a 
              href={getWhatsAppLink(lang === 'es' ? "Hola, quiero más información sobre Santiel TV" : "Hello, I want more information about Santiel TV")}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-neutral-950 px-5 py-2 rounded-full font-bold text-sm transition-all shadow-lg shadow-yellow-500/20 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">{t.nav.contactar}</span>
            </a>
          </div>
        </div>
      </nav>

      <main>
        {/* 1. INICIO (HOME) */}
        <section id="inicio" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 min-h-[90vh] justify-center">
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
              {t.hero.title} <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600">Santiel TV</span>
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
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              {/* Fallback if icon is not found */}
              <div className="hidden relative bg-neutral-900 border border-neutral-800 rounded-3xl p-4 shadow-2xl shadow-yellow-500/10 w-full aspect-video">
                <div className="w-full h-full bg-neutral-950 rounded-2xl overflow-hidden relative flex items-center justify-center border border-neutral-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950 opacity-50"></div>
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <Tv className="w-24 h-24 text-yellow-500 mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                    <span className="text-3xl font-bold tracking-widest text-white uppercase">Santiel</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 2. PLANES */}
        <section id="planes" className="py-24 bg-neutral-950/50 backdrop-blur-sm border-y border-neutral-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.planes.title}</h2>
              <p className="text-neutral-400 text-lg">
                {t.planes.desc}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Plan 1 */}
              <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-3xl p-8 flex flex-col relative hover:border-yellow-500/30 transition-colors">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-neutral-300 mb-2">{lang === 'es' ? 'Plan 1 mes' : '1 Month Plan'}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-medium text-neutral-500 line-through">
                      {currency === 'USD' ? '$20' : '$270'}
                    </span>
                    <span className="text-4xl font-bold text-white">
                      {currency === 'USD' ? '$15' : '$200'}
                    </span>
                    <span className="text-neutral-500">{currency}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {['Acceso completo', 'Películas', 'Series', 'TV en vivo', 'Eventos PPV'].map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-neutral-300">
                      <CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" />
                      <span>{lang === 'es' ? benefit : t.contenido.items[idx]}</span>
                    </li>
                  ))}
                </ul>
                <a 
                  href={getWhatsAppLink(lang === 'es' ? `Hola, quiero comprar el Plan de 1 mes por ${currency === 'USD' ? '$15 USD' : '$200 MXN'}.` : `Hello, I want to buy the 1 Month Plan for ${currency === 'USD' ? '$15 USD' : '$200 MXN'}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-xl font-semibold transition-colors text-center"
                >
                  {t.planes.btnComprar}
                </a>
              </div>

              {/* Plan 3 (Destacado) */}
              <div className="bg-gradient-to-b from-yellow-500/10 to-neutral-900/90 backdrop-blur-md border-2 border-yellow-500 rounded-3xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-yellow-500/20">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-neutral-950 px-6 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg shadow-yellow-500/30 whitespace-nowrap uppercase tracking-wider">
                  <Star className="w-4 h-4 fill-neutral-950" /> {t.planes.mejorOferta}
                </div>
                <div className="mb-8 mt-2">
                  <h3 className="text-xl font-semibold text-yellow-500 mb-2">{lang === 'es' ? 'Plan 3 Meses' : '3 Months Plan'}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-medium text-neutral-500 line-through opacity-70">
                      {currency === 'USD' ? '$50' : '$670'}
                    </span>
                    <span className="text-5xl font-bold text-white">
                      {currency === 'USD' ? '$35' : '$450'}
                    </span>
                    <span className="text-neutral-400">{currency}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {['Acceso completo', 'Películas', 'Series', 'TV en vivo', 'Eventos PPV'].map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-neutral-200">
                      <CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" />
                      <span>{lang === 'es' ? benefit : t.contenido.items[idx]}</span>
                    </li>
                  ))}
                  <div className="pt-4 mt-4 border-t border-yellow-500/20 space-y-3">
                    <li className="flex items-center gap-3 text-yellow-400 font-medium">
                      <Zap className="w-5 h-5 shrink-0 fill-yellow-400/20" />
                      <span>{t.planes.ahorro}</span>
                    </li>
                    <li className="flex items-center gap-3 text-yellow-400 font-medium">
                      <ShieldCheck className="w-5 h-5 shrink-0 fill-yellow-400/20" />
                      <span>{t.planes.recomendado}</span>
                    </li>
                  </div>
                </ul>
                <a 
                  href={getWhatsAppLink(lang === 'es' ? `Hola, quiero aprovechar la Mejor Oferta: Plan de 3 meses por ${currency === 'USD' ? '$35 USD' : '$450 MXN'}.` : `Hello, I want to take advantage of the Best Offer: 3 Months Plan for ${currency === 'USD' ? '$35 USD' : '$450 MXN'}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-neutral-950 py-4 rounded-xl font-bold transition-all text-center text-lg shadow-lg shadow-yellow-500/25 hover:scale-[1.02]"
                >
                  {t.planes.btnComprar}
                </a>
              </div>

              {/* Plan 2 */}
              <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-3xl p-8 flex flex-col relative hover:border-yellow-500/30 transition-colors">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-neutral-300 mb-2">{lang === 'es' ? 'Plan 2 Meses' : '2 Months Plan'}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-medium text-neutral-500 line-through">
                      {currency === 'USD' ? '$35' : '$470'}
                    </span>
                    <span className="text-4xl font-bold text-white">
                      {currency === 'USD' ? '$25' : '$350'}
                    </span>
                    <span className="text-neutral-500">{currency}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {['Acceso completo', 'Películas', 'Series', 'TV en vivo', 'Eventos PPV'].map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-neutral-300">
                      <CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" />
                      <span>{lang === 'es' ? benefit : t.contenido.items[idx]}</span>
                    </li>
                  ))}
                </ul>
                <a 
                  href={getWhatsAppLink(lang === 'es' ? `Hola, quiero comprar el Plan de 2 meses por ${currency === 'USD' ? '$25 USD' : '$350 MXN'}.` : `Hello, I want to buy the 2 Months Plan for ${currency === 'USD' ? '$25 USD' : '$350 MXN'}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-xl font-semibold transition-colors text-center"
                >
                  {t.planes.btnComprar}
                </a>
              </div>
            </div>

            {/* Info Moneda y Pagos */}
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

        {/* 3. SISTEMA DE LEALTAD */}
        <section id="lealtad" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 backdrop-blur-md border border-neutral-800/50 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 blur-[80px] rounded-full"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-medium mb-6 border border-yellow-500/20">
                  <Trophy className="w-4 h-4" />
                  <span>{t.lealtad.badge}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">{t.lealtad.title}</h2>
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
                  href={getWhatsAppLink(lang === 'es' ? "Hola, quiero activar mi membresía y participar en el sistema de lealtad." : "Hello, I want to activate my membership and participate in the loyalty system.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-neutral-950 px-8 py-4 rounded-full font-bold hover:bg-neutral-200 transition-colors shadow-lg"
                >
                  {t.lealtad.btnActivar} <ChevronRight className="w-5 h-5" />
                </a>
              </div>

              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                {t.lealtad.beneficios.map((benefit, i) => {
                  const icons = [Gift, Zap, Star, HeartHandshake];
                  const Icon = icons[i];
                  return (
                    <div key={i} className="bg-neutral-900/50 border border-neutral-800/50 p-6 rounded-2xl hover:bg-neutral-800/50 transition-colors">
                      <Icon className="w-8 h-8 text-yellow-500 mb-4" />
                      <h4 className="text-white font-semibold mb-2">{benefit.title}</h4>
                      <p className="text-sm text-neutral-400">{benefit.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 4. CONTENIDO */}
        <section id="contenido" className="py-24 bg-neutral-950/50 backdrop-blur-sm border-y border-neutral-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">{t.contenido.title}</h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-16">
              {t.contenido.desc}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-8 max-w-4xl mx-auto mb-16">
              {[
                { icon: Film, label: t.contenido.items[0] },
                { icon: MonitorPlay, label: t.contenido.items[1] },
                { icon: Tv, label: t.contenido.items[2] },
                { icon: Trophy, label: t.contenido.items[3] },
                { icon: Star, label: t.contenido.items[4] }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/50 hover:border-yellow-500/50 transition-colors group">
                  <div className="w-16 h-16 rounded-full bg-neutral-950 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-yellow-500/10 shadow-inner">
                    <item.icon className="w-8 h-8 text-neutral-400 group-hover:text-yellow-500 transition-colors" />
                  </div>
                  <span className="font-medium text-neutral-300 group-hover:text-white transition-colors text-sm sm:text-base">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 shadow-xl">
                <div className="text-4xl font-black text-yellow-500 mb-2">{t.contenido.stats.movies.split(' ')[0]}</div>
                <div className="text-neutral-400 font-medium uppercase tracking-wider text-sm">{t.contenido.stats.movies.split(' ').slice(1).join(' ')}</div>
              </div>
              <div className="p-8 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 shadow-xl">
                <div className="text-4xl font-black text-yellow-500 mb-2">{t.contenido.stats.series.split(' ')[0]}</div>
                <div className="text-neutral-400 font-medium uppercase tracking-wider text-sm">{t.contenido.stats.series.split(' ').slice(1).join(' ')}</div>
              </div>
              <div className="p-8 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 shadow-xl">
                <div className="text-4xl font-black text-yellow-500 mb-2">{t.contenido.stats.channels.split(' ')[0]}</div>
                <div className="text-neutral-400 font-medium uppercase tracking-wider text-sm">{t.contenido.stats.channels.split(' ').slice(1).join(' ')}</div>
              </div>
            </div>
            <p className="mt-12 text-neutral-400 font-medium italic">
              ✨ {t.contenido.stats.platforms}
            </p>
          </div>
        </section>

        {/* 4.5 COMPATIBILIDAD */}
        <section id="compatibilidad" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.compatibilidad.title}</h2>
            <p className="text-xl text-neutral-400 mb-4">
              {t.compatibilidad.desc}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold">
              <MonitorPlay className="w-5 h-5" />
              <span>{t.compatibilidad.simultaneos}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Android */}
            <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-3xl p-8 flex flex-col items-center text-center hover:border-yellow-500/30 transition-colors shadow-lg group">
              <div className="flex gap-2 mb-6 text-yellow-500 group-hover:scale-110 transition-transform">
                <Smartphone className="w-10 h-10" />
                <Tablet className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Android</h3>
              <p className="text-neutral-400 text-sm mb-6">Celulares y Tablets</p>
              <button 
                onClick={() => setActiveDownload('android')}
                className="mt-auto flex items-center gap-2 text-yellow-500 hover:text-yellow-400 font-bold text-sm transition-colors"
              >
                <Download className="w-4 h-4" /> {t.compatibilidad.btnDescargas}
              </button>
            </div>

            {/* Apple */}
            <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-3xl p-8 flex flex-col items-center text-center hover:border-yellow-500/30 transition-colors shadow-lg group">
              <div className="flex gap-2 mb-6 text-yellow-500 group-hover:scale-110 transition-transform">
                <Apple className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Apple</h3>
              <p className="text-neutral-400 text-sm mb-6">iPhone y iPad</p>
              <button 
                onClick={() => setActiveDownload('apple')}
                className="mt-auto flex items-center gap-2 text-yellow-500 hover:text-yellow-400 font-bold text-sm transition-colors"
              >
                <Download className="w-4 h-4" /> {t.compatibilidad.btnDescargas}
              </button>
            </div>

            {/* Roku TV */}
            <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-3xl p-8 flex flex-col items-center text-center hover:border-yellow-500/30 transition-colors shadow-lg group">
              <div className="flex gap-2 mb-6 text-yellow-500 group-hover:scale-110 transition-transform">
                <Tv className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Roku TV</h3>
              <p className="text-neutral-400 text-sm mb-6">Smart TVs y Reproductores</p>
              <button 
                onClick={() => setActiveDownload('roku')}
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
                onClick={() => setActiveDownload('pc')}
                className="mt-auto flex items-center gap-2 text-yellow-500 hover:text-yellow-400 font-bold text-sm transition-colors"
              >
                <Download className="w-4 h-4" /> {t.compatibilidad.btnDescargas}
              </button>
            </div>
          </div>
        </section>

        {/* 5. ACERCA DE */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">{t.acerca.title}</h2>
              <p className="text-lg text-neutral-300 mb-6 leading-relaxed">
                {t.acerca.desc}
              </p>
              <div className="grid grid-cols-2 gap-6 mt-12">
                {t.acerca.puntos.map((focus, i) => (
                  <div key={i} className="border-l-2 border-yellow-500 pl-4">
                    <h4 className="text-white font-semibold mb-1">{focus.title}</h4>
                    <p className="text-sm text-neutral-400">{focus.desc}</p>
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

        {/* 5.5 SOPORTE Y AYUDA */}
        <section id="soporte" className="py-24 bg-neutral-950/50 backdrop-blur-sm border-y border-neutral-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.soporte.title}</h2>
              <p className="text-xl text-neutral-400">
                {t.soporte.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto justify-center">
              {[
                { title: lang === 'es' ? "Problemas con la app" : "App issues", icon: Smartphone, msg: lang === 'es' ? "Hola, tengo problemas con la app de Santiel TV y necesito ayuda." : "Hello, I have issues with the Santiel TV app and need help." },
                { title: lang === 'es' ? "Problemas con la cuenta" : "Account issues", icon: UserCog, msg: lang === 'es' ? "Hola, tengo problemas con mi cuenta de Santiel TV." : "Hello, I have issues with my Santiel TV account." },
                { title: lang === 'es' ? "Error al acceder" : "Login error", icon: AlertCircle, msg: lang === 'es' ? "Hola, me aparece un error al intentar acceder a Santiel TV." : "Hello, I get an error when trying to access Santiel TV." },
                { title: lang === 'es' ? "Reportar bug" : "Report bug", icon: Bug, msg: lang === 'es' ? "Hola, quiero reportar un bug o error en Santiel TV." : "Hello, I want to report a bug or error in Santiel TV." },
                { title: lang === 'es' ? "Soporte general" : "General support", icon: HelpCircle, msg: lang === 'es' ? "Hola, necesito soporte general sobre Santiel TV." : "Hello, I need general support about Santiel TV." },
                { title: lang === 'es' ? t.soporte.descargas : t.soporte.descargas, icon: Download, msg: lang === 'es' ? "Hola, tengo problemas con los links de descarga de Santiel TV." : "Hello, I'm having trouble with the Santiel TV download links." }
              ].map((item, i) => (
                <a 
                  key={i}
                  href={getWhatsAppLink(item.msg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-neutral-900/80 border border-neutral-800 hover:border-yellow-500/50 p-6 rounded-2xl flex items-center gap-4 transition-all hover:bg-neutral-800 group ${i >= 3 ? 'lg:col-span-1' : ''}`}
                >
                  <div className="w-12 h-12 rounded-full bg-neutral-950 flex items-center justify-center group-hover:bg-yellow-500/10 transition-colors shrink-0">
                    <item.icon className="w-6 h-6 text-neutral-400 group-hover:text-yellow-500" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-white font-semibold leading-tight mb-1">{item.title}</h4>
                    <p className="text-xs text-neutral-500">{t.soporte.whatsapp}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 6 & 7. CONTACTO / CIERRE DE VENTA */}
        <section className="py-24 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-neutral-950 text-center px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/background.png')] opacity-10 mix-blend-overlay bg-cover bg-center"></div>
          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight drop-shadow-sm">{lang === 'es' ? '¿Listo para comenzar?' : 'Ready to start?'}</h2>
            <p className="text-xl font-medium mb-10 opacity-90">
              {lang === 'es' ? 'Contáctanos ahora y obtén acceso inmediato a Santiel TV. Resolvemos tus dudas y activamos tu servicio al instante.' : 'Contact us now and get immediate access to Santiel TV. We solve your doubts and activate your service instantly.'}
            </p>
            <a 
              href={getWhatsAppLink(lang === 'es' ? "Hola, estoy listo para comenzar con Santiel TV. ¿Me pueden ayudar?" : "Hello, I'm ready to start with Santiel TV. Can you help me?")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-neutral-950 hover:bg-neutral-800 text-white px-10 py-5 rounded-full font-bold text-xl transition-all hover:scale-105 shadow-2xl shadow-neutral-950/30"
            >
              <Phone className="w-6 h-6" />
              {lang === 'es' ? 'Comprar por WhatsApp' : 'Buy via WhatsApp'}
            </a>
          </div>
        </section>
      </main>

      {/* 8. LEGALES (FOOTER) */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Santiel TV" className="h-6 w-auto opacity-80 grayscale hover:grayscale-0 transition-all" onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }} />
            <div className="hidden flex items-center gap-2 text-yellow-500 opacity-80">
              <Tv className="w-5 h-5" />
              <span className="font-bold text-lg tracking-tight text-white">Santiel <span className="text-yellow-500">TV</span></span>
            </div>
          </div>
          
          <div className="flex gap-6 text-sm text-neutral-500">
            <button 
              onClick={() => setLegalModal({ type: 'terminos', isOpen: true })}
              className="hover:text-neutral-300 transition-colors"
            >
              {t.footer.terminos}
            </button>
            <button 
              onClick={() => setLegalModal({ type: 'privacidad', isOpen: true })}
              className="hover:text-neutral-300 transition-colors"
            >
              {t.footer.privacidad}
            </button>
          </div>
          
          <p className="text-sm text-neutral-600">
            &copy; {new Date().getFullYear()} Santiel TV. {t.footer.derechos}
          </p>
        </div>
      </footer>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDemoModal(false)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-[2rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <button 
                  onClick={() => setShowDemoModal(false)}
                  className="p-2 text-neutral-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6">
                  <Play className="w-8 h-8 text-yellow-500 fill-current" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{t.demo.title}</h3>
                <p className="text-neutral-300 leading-relaxed mb-8">
                  {t.demo.desc}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <a 
                    href={getWhatsAppLink(lang === 'es' ? "Hola, me gustaría solicitar una demo para probar el servicio de Santiel TV por favor." : "Hello, I would like to request a demo to test the Santiel TV service please.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowDemoModal(false)}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-neutral-950 px-6 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {t.demo.btnSi}
                  </a>
                  <button 
                    onClick={() => setShowDemoModal(false)}
                    className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-4 rounded-2xl font-bold transition-all"
                  >
                    {t.demo.btnNo}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Download Modal */}
      <AnimatePresence>
        {activeDownload && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDownloadModal}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-[2rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="absolute top-0 right-0 p-4">
                <button 
                  onClick={closeDownloadModal}
                  className="p-2 text-neutral-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6">
                  <Download className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{t.descargas.title}</h3>
                <p className="text-yellow-500 font-semibold mb-6">{downloadData[activeDownload].title}</p>
                
                {!isUnlocked ? (
                  <div className="w-full space-y-4">
                    <p className="text-sm text-neutral-400 text-center">
                      {t.descargas.instrucciones}
                    </p>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input 
                        type="password"
                        value={downloadPassword}
                        onChange={(e) => setDownloadPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                        placeholder={t.descargas.passPlaceholder}
                        className={`w-full bg-neutral-950 border ${passwordError ? 'border-red-500' : 'border-neutral-800'} rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-500 transition-colors`}
                      />
                    </div>
                    {passwordError && (
                      <p className="text-red-500 text-xs text-center font-medium">
                        {t.descargas.errorPass}
                      </p>
                    )}
                    <button 
                      onClick={handleUnlock}
                      className="w-full bg-yellow-500 hover:bg-yellow-400 text-neutral-950 py-3 rounded-xl font-bold transition-colors"
                    >
                      {t.descargas.btnDesbloquear}
                    </button>
                  </div>
                ) : (
                  <div className="w-full space-y-6">
                    {downloadData[activeDownload].link ? (
                      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 text-center">
                        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <p className="text-white font-bold mb-4">Link desbloqueado con éxito</p>
                        <a 
                          href={downloadData[activeDownload].link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-neutral-950 px-8 py-3 rounded-xl font-bold transition-colors"
                        >
                          Ir a descarga <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-white font-bold text-center mb-4">Canales para Roku TV:</p>
                        <div className="grid grid-cols-1 gap-4">
                          {downloadData[activeDownload].images?.map((img, idx) => (
                            <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex flex-col items-center">
                              <div className="w-full aspect-video bg-neutral-900 rounded-lg mb-3 flex items-center justify-center border border-neutral-800 overflow-hidden">
                                <img 
                                  src={`/${img.toLowerCase()}.png`} 
                                  alt={img} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerHTML = `<span class="text-neutral-500 font-bold">${img}</span>`;
                                  }}
                                />
                              </div>
                              <span className="text-yellow-500 font-bold">{img}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <button 
                      onClick={closeDownloadModal}
                      className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-xl font-bold transition-colors"
                    >
                      {t.descargas.btnCerrar}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Legal Modal */}
      <AnimatePresence>
        {legalModal.isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLegalModal({ ...legalModal, isOpen: false })}
              className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-8 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  {legalModal.type === 'terminos' ? <ShieldCheck className="w-7 h-7 text-yellow-500" /> : <Lock className="w-7 h-7 text-yellow-500" />}
                  {t.legal[legalModal.type].title}
                </h3>
                <button 
                  onClick={() => setLegalModal({ ...legalModal, isOpen: false })}
                  className="p-2 text-neutral-400 hover:text-white transition-colors hover:bg-neutral-800 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-neutral-950/30">
                <div className="space-y-8">
                  {t.legal[legalModal.type].sections.map((section, idx) => (
                    <div key={idx} className="space-y-3">
                      <h4 className="text-lg font-bold text-yellow-500 uppercase tracking-wider">{section.title}</h4>
                      <div className="text-neutral-300 leading-relaxed whitespace-pre-line text-base sm:text-lg">
                        {section.content}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-neutral-500 text-sm">
                  Santiel TV &copy; {new Date().getFullYear()} - {lang === 'es' ? 'Documento Legal Oficial' : 'Official Legal Document'}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
