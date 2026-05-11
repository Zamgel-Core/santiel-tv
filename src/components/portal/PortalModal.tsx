//📍 Ruta: src/components/portal/PortalModal.tsx

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, UserCog, Smartphone, ShieldCheck } from "lucide-react";

import AdminPanel from "../admin/AdminPanel";
import CustomerPanel from "./CustomerPanel";
import PortalAccessCard from "./PortalAccessCard";

type PortalModalProps = {
  showLoginModal: boolean;
  setShowLoginModal: (value: boolean) => void;

  portalUser: any;

  portalUsername: string;
  setPortalUsername: (value: string) => void;

  portalPassword: string;
  setPortalPassword: (value: string) => void;

  portalError: string;
  isPortalLoading: boolean;

  handlePortalLogin: () => void;
  handlePortalLogout: () => void;

  getDaysRemaining: (expirationDate?: string | null) => string;
  getWhatsAppLink: (message: string) => string;
};

export default function PortalModal({
  showLoginModal,
  setShowLoginModal,

  portalUser,

  portalUsername,
  setPortalUsername,

  portalPassword,
  setPortalPassword,

  portalError,
  isPortalLoading,

  handlePortalLogin,
  handlePortalLogout,
}: PortalModalProps) {
  const isAdmin = portalUser?.role === "admin";

  const [portalMode, setPortalMode] = useState<
    "selector" | "legacy" | "phone"
  >("selector");

  useEffect(() => {
    if (showLoginModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showLoginModal]);

  useEffect(() => {
    if (!showLoginModal) {
      setPortalMode("selector");
    }
  }, [showLoginModal]);

  return (
    <AnimatePresence>
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLoginModal(false)}
            className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            className={`relative w-full ${
              isAdmin ? "max-w-5xl" : "max-w-2xl"
            } rounded-[2rem] border border-neutral-800 bg-neutral-900 p-8 shadow-2xl max-h-[90vh] overflow-y-auto`}
          >
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 rounded-full bg-white/5 p-2 text-neutral-500 transition hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>

            {!portalUser ? (
              <>
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/10">
                    <ShieldCheck className="h-10 w-10 text-yellow-500" />
                  </div>

                  <h2 className="text-3xl font-black text-white">
                    Portal Santiel TV
                  </h2>

                  <p className="mt-3 text-neutral-400">
                    Accede a tu cuenta, boletos de sorteos y beneficios premium.
                  </p>
                </div>

                {portalMode === "selector" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <button
                      onClick={() => setPortalMode("phone")}
                      className="group rounded-[2rem] border border-yellow-500/20 bg-yellow-500/10 p-6 text-left transition hover:border-yellow-400 hover:bg-yellow-500/15"
                    >
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500 text-black">
                        <Smartphone className="h-7 w-7" />
                      </div>

                      <h3 className="text-xl font-black text-white">
                        Teléfono + PIN
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                        Nuevo acceso rápido para clientes Santiel. Fácil y rápido
                        desde cualquier celular.
                      </p>

                      <div className="mt-5 inline-flex rounded-full bg-yellow-500 px-4 py-2 text-sm font-black text-black">
                        Entrar ahora
                      </div>
                    </button>

                    <button
                      onClick={() => setPortalMode("legacy")}
                      className="group rounded-[2rem] border border-white/10 bg-white/5 p-6 text-left transition hover:border-white/20 hover:bg-white/10"
                    >
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                        <UserCog className="h-7 w-7 text-white" />
                      </div>

                      <h3 className="text-xl font-black text-white">
                        Acceso clásico
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                        Portal anterior con usuario y contraseña. Recomendado
                        para administradores.
                      </p>

                      <div className="mt-5 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white">
                        Usar acceso clásico
                      </div>
                    </button>
                  </div>
                )}

                {portalMode === "phone" && (
                  <div className="space-y-5">
                    <button
                      onClick={() => setPortalMode("selector")}
                      className="text-sm font-bold text-yellow-400 transition hover:text-yellow-300"
                    >
                      ← Volver
                    </button>

                    <PortalAccessCard />
                  </div>
                )}

                {portalMode === "legacy" && (
                  <div className="space-y-5">
                    <button
                      onClick={() => setPortalMode("selector")}
                      className="text-sm font-bold text-yellow-400 transition hover:text-yellow-300"
                    >
                      ← Volver
                    </button>

                    <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6">
                      <div className="mb-6 text-center">
                        <h3 className="text-2xl font-black text-white">
                          Acceso clásico
                        </h3>

                        <p className="mt-2 text-sm text-neutral-400">
                          Inicia sesión con usuario y contraseña.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-400">
                            Usuario
                          </label>

                          <input
                            value={portalUsername}
                            onChange={(e) =>
                              setPortalUsername(e.target.value)
                            }
                            placeholder="Usuario"
                            className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white transition-colors focus:border-yellow-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-400">
                            Contraseña
                          </label>

                          <input
                            value={portalPassword}
                            onChange={(e) =>
                              setPortalPassword(e.target.value)
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" && handlePortalLogin()
                            }
                            type="password"
                            placeholder="Contraseña"
                            className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white transition-colors focus:border-yellow-500 focus:outline-none"
                          />
                        </div>

                        {portalError && (
                          <p className="text-center text-sm font-medium text-red-500">
                            {portalError}
                          </p>
                        )}

                        <button
                          onClick={handlePortalLogin}
                          disabled={isPortalLoading}
                          className="w-full rounded-xl bg-yellow-500 py-3 font-bold text-neutral-950 transition-colors hover:bg-yellow-400 disabled:opacity-60"
                        >
                          {isPortalLoading
                            ? "Validando..."
                            : "Entrar al portal"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : isAdmin ? (
              <div className="w-full text-left">
                <AdminPanel />

                <button
                  onClick={handlePortalLogout}
                  className="mt-5 w-full rounded-xl bg-neutral-800 py-3 font-bold text-white transition-colors hover:bg-neutral-700"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="w-full">
                <CustomerPanel user={portalUser} />

                <button
                  onClick={handlePortalLogout}
                  className="mt-5 w-full rounded-xl bg-neutral-800 py-3 font-bold text-white transition-colors hover:bg-neutral-700"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}