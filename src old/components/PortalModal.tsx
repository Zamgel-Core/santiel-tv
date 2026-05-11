import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, UserCog } from "lucide-react";

import AdminPanel from "./AdminPanel";
import CustomerPanel from "./CustomerPanel";

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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full ${
              isAdmin ? "max-w-5xl" : "max-w-lg"
            } bg-neutral-900 border border-neutral-800 rounded-[2rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto`}
          >
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center text-center">
              {!isAdmin && (
                <>
                  <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6">
                    <UserCog className="w-8 h-8 text-yellow-500" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">
                    Portal Santiel TV
                  </h3>

                  <p className="text-neutral-400 text-sm mb-6">
                    Inicia sesión con el usuario y contraseña asignados.
                  </p>
                </>
              )}

              {!portalUser ? (
                <div className="w-full space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">
                      Usuario
                    </label>
                    <input
                      value={portalUsername}
                      onChange={(e) => setPortalUsername(e.target.value)}
                      placeholder="Usuario"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">
                      Contraseña
                    </label>
                    <input
                      value={portalPassword}
                      onChange={(e) => setPortalPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handlePortalLogin()}
                      type="password"
                      placeholder="Contraseña"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>

                  {portalError && (
                    <p className="text-red-500 text-sm text-center font-medium">
                      {portalError}
                    </p>
                  )}

                  <button
                    onClick={handlePortalLogin}
                    disabled={isPortalLoading}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 text-neutral-950 py-3 rounded-xl font-bold transition-colors"
                  >
                    {isPortalLoading ? "Validando..." : "Entrar"}
                  </button>
                </div>
              ) : isAdmin ? (
                <div className="w-full text-left">
                  <AdminPanel />

                  <button
                    onClick={handlePortalLogout}
                    className="mt-5 w-full bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-xl font-bold transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <div className="w-full">
                  <CustomerPanel user={portalUser} />

                  <button
                    onClick={handlePortalLogout}
                    className="mt-5 w-full bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-xl font-bold transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}