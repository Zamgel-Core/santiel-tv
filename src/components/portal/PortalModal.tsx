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

          {!portalUser ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="relative w-full max-w-2xl rounded-[2rem] border border-neutral-800 bg-neutral-900 p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 rounded-full bg-white/5 p-2 text-neutral-500 transition hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="mb-8 text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/10">
                  <ShieldCheck className="h-10 w-10 text-yellow-500" />
                </div>

                <h2 className="text-3xl font-black text-white">
                  Portal Santiel TV
                </h2>

                <p className="mt-3 text-neutral-400">
                  Accede a tu cuenta, boletos y beneficios premium.
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
                      Acceso rápido para clientes Santiel TV.
                    </p>
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
                      Recomendado para administradores.
                    </p>
                  </button>
                </div>
              )}

              {portalMode === "phone" && (
                <div className="space-y-5">
                  <button
                    onClick={() => setPortalMode("selector")}
                    className="text-sm font-bold text-yellow-400"
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
                    className="text-sm font-bold text-yellow-400"
                  >
                    ← Volver
                  </button>

                  <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6">
                    <div className="space-y-4">
                      <input
                        value={portalUsername}
                        onChange={(e) => setPortalUsername(e.target.value)}
                        placeholder="Usuario"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white"
                      />

                      <input
                        value={portalPassword}
                        onChange={(e) => setPortalPassword(e.target.value)}
                        type="password"
                        placeholder="Contraseña"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white"
                      />

                      {portalError && (
                        <p className="text-center text-sm text-red-500">
                          {portalError}
                        </p>
                      )}

                      <button
                        onClick={handlePortalLogin}
                        disabled={isPortalLoading}
                        className="w-full rounded-xl bg-yellow-500 py-3 font-bold text-black"
                      >
                        {isPortalLoading ? "Validando..." : "Entrar"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : isAdmin ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative h-[95vh] w-[98vw] overflow-hidden rounded-[2rem] border border-neutral-800 bg-neutral-950 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 px-8 py-5">
                <div>
                  <h2 className="text-2xl font-black text-white">
                    Panel Super Admin
                  </h2>

                  <p className="text-sm text-neutral-400">
                    Gestión avanzada de usuarios y sorteos.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePortalLogout}
                    className="rounded-xl bg-neutral-800 px-5 py-3 font-bold text-white transition hover:bg-neutral-700"
                  >
                    Cerrar sesión
                  </button>

                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="rounded-full bg-white/5 p-2 text-neutral-400 transition hover:text-white"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="h-[calc(95vh-88px)] overflow-y-auto p-6">
                <AdminPanel />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="relative w-full max-w-2xl rounded-[2rem] border border-neutral-800 bg-neutral-900 p-8 shadow-2xl"
            >
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 rounded-full bg-white/5 p-2 text-neutral-500 transition hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>

              <CustomerPanel user={portalUser} />

              <button
                onClick={handlePortalLogout}
                className="mt-5 w-full rounded-xl bg-neutral-800 py-3 font-bold text-white transition hover:bg-neutral-700"
              >
                Cerrar sesión
              </button>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}