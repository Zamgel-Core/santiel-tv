import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ShieldCheck, Lock } from "lucide-react";

import { supabase } from "./supabaseClient";

import { getWhatsAppLink } from "./utils/whatsapp";
import { getDaysRemaining } from "./utils/dates";
import { downloadData } from "./data/downloadData";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import PlansSection from "./components/PlansSection";
import LoyaltySection from "./components/LoyaltySection";
import ContentSection from "./components/ContentSection";
import CompatibilitySection from "./components/CompatibilitySection";
import AboutSection from "./components/AboutSection";
import SupportSection from "./components/SupportSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

import PortalModal from "./components/PortalModal";
import DownloadModal from "./components/DownloadModal";

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

export default function App() {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [lang, setLang] = useState<"es" | "en">("es");
  const [currency, setCurrency] = useState<"USD" | "MXN">("USD");

  const [activeDownload, setActiveDownload] = useState<string | null>(null);
  const [downloadPassword, setDownloadPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [portalUsername, setPortalUsername] = useState("");
  const [portalPassword, setPortalPassword] = useState("");
  const [portalError, setPortalError] = useState("");
  const [portalUser, setPortalUser] = useState<any>(null);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  const [legalModal, setLegalModal] = useState<{
    type: "terminos" | "privacidad";
    isOpen: boolean;
  }>({
    type: "terminos",
    isOpen: false,
  });

  const t = translations[lang];

  const handlePortalLogin = async () => {
  setPortalError("");
  setIsPortalLoading(true);

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", portalUsername.trim())
    .eq("password", portalPassword.trim())
    .maybeSingle();

  setIsPortalLoading(false);

  if (error) {
    console.error("Portal login error:", error);
    setPortalError("Error de conexión. Intenta nuevamente.");
    return;
  }

  if (!data) {
    setPortalError("Usuario o contraseña incorrectos.");
    return;
  }

  const isBlocked =
    data.is_active === false ||
    data.status === "blocked" ||
    data.status === "bloqueada";

  if (isBlocked) {
    setPortalError("Esta cuenta no está activa. Contacta a soporte.");
    return;
  }

  const isAdmin = data.role === "admin";
  const accountType =
    data.account_type === "demo" || data.is_trial === true
      ? "demo"
      : "customer";

  if (!isAdmin && data.expiration_date) {
  const expirationDate = new Date(data.expiration_date);
  const now = new Date();

  if (expirationDate < now) {
    // 🔒 Auto bloquear en DB
    await supabase
      .from("users")
      .update({
        status: "blocked",
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);

    // 🧠 Detectar si era demo o cliente REAL
    const isDemo = data.account_type === "demo" || data.is_trial === true;

    setPortalError(
      isDemo
        ? "Tu demo ha expirado. Si deseas continuar, adquiere un plan en Santiel TV."
        : "Tu cuenta está vencida. Renueva tu membresía."
    );

    return;
  }
}

  setPortalUser(data);
};

  const handlePortalLogout = () => {
    setPortalUser(null);
    setPortalUsername("");
    setPortalPassword("");
    setPortalError("");
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
      <div className="fixed inset-0 z-[-1]">
        <img
          src="/background.png"
          alt="Fondo Santiel TV"
          className="w-full h-full object-cover opacity-40"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/90 to-neutral-950" />
      </div>

      <Navbar
        lang={lang}
        setLang={setLang}
        currency={currency}
        setCurrency={setCurrency}
        setShowLoginModal={setShowLoginModal}
        setShowDemoModal={setShowDemoModal}
        t={t}
      />

      <main>
        <HeroSection t={t} />
        <PlansSection t={t} lang={lang} currency={currency} />
        <LoyaltySection t={t} lang={lang} />
        <ContentSection t={t} />
        <CompatibilitySection t={t} setActiveDownload={setActiveDownload} />
        <AboutSection t={t} />
        <SupportSection t={t} lang={lang} />
        <CTASection lang={lang} />
      </main>

      <Footer t={t} setLegalModal={setLegalModal} />

      <PortalModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        portalUser={portalUser}
        portalUsername={portalUsername}
        setPortalUsername={setPortalUsername}
        portalPassword={portalPassword}
        setPortalPassword={setPortalPassword}
        portalError={portalError}
        isPortalLoading={isPortalLoading}
        handlePortalLogin={handlePortalLogin}
        handlePortalLogout={handlePortalLogout}
        getDaysRemaining={getDaysRemaining}
        getWhatsAppLink={getWhatsAppLink}
      />

      <DownloadModal
        activeDownload={activeDownload}
        setActiveDownload={setActiveDownload}
        downloadPassword={downloadPassword}
        setDownloadPassword={setDownloadPassword}
        passwordError={passwordError}
        isUnlocked={isUnlocked}
        handleUnlock={handleUnlock}
        closeDownloadModal={closeDownloadModal}
      />

      <AnimatePresence>
        {showDemoModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDemoModal(false)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
            />

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

                <h3 className="text-2xl font-bold text-white mb-4">
                  {t.demo.title}
                </h3>

                <p className="text-neutral-300 leading-relaxed mb-8">
                  {t.demo.desc}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <a
                    href={getWhatsAppLink(
                      lang === "es"
                        ? "Hola, me gustaría solicitar una demo para probar el servicio de Santiel TV por favor."
                        : "Hello, I would like to request a demo to test the Santiel TV service please."
                    )}
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

      <AnimatePresence>
        {legalModal.isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLegalModal({ ...legalModal, isOpen: false })}
              className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-8 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  {legalModal.type === "terminos" ? (
                    <ShieldCheck className="w-7 h-7 text-yellow-500" />
                  ) : (
                    <Lock className="w-7 h-7 text-yellow-500" />
                  )}
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
                  {t.legal[legalModal.type].sections.map(
                    (section: any, idx: number) => (
                      <div key={idx} className="space-y-3">
                        <h4 className="text-lg font-bold text-yellow-500 uppercase tracking-wider">
                          {section.title}
                        </h4>
                        <div className="text-neutral-300 leading-relaxed whitespace-pre-line text-base sm:text-lg">
                          {section.content}
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-neutral-500 text-sm">
                  Santiel TV &copy; {new Date().getFullYear()} -{" "}
                  {lang === "es"
                    ? "Documento Legal Oficial"
                    : "Official Legal Document"}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}