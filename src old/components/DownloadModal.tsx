import { AnimatePresence, motion } from "framer-motion";
import { X, Download, Lock, CheckCircle2, ExternalLink } from "lucide-react";
import { downloadData } from "../../src/data/downloadData";

type Props = {
  activeDownload: string | null;
  setActiveDownload: (value: string | null) => void;
  downloadPassword: string;
  setDownloadPassword: (value: string) => void;
  passwordError: boolean;
  isUnlocked: boolean;
  handleUnlock: () => void;
  closeDownloadModal: () => void;
};

export default function DownloadModal({
  activeDownload,
  setActiveDownload,
  downloadPassword,
  setDownloadPassword,
  passwordError,
  isUnlocked,
  handleUnlock,
  closeDownloadModal,
}: Props) {
  return (
    <AnimatePresence>
      {activeDownload && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDownloadModal}
            className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-[2rem] p-8 shadow-2xl"
          >
            <button
              onClick={closeDownloadModal}
              className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center">
              <Download className="w-10 h-10 text-yellow-500 mb-4" />

              <h3 className="text-xl font-bold text-white mb-2">
                {downloadData[activeDownload].title}
              </h3>

              {!isUnlocked ? (
                <div className="w-full space-y-4 mt-4">
                  <input
                    type="password"
                    value={downloadPassword}
                    onChange={(e) => setDownloadPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
                  />

                  {passwordError && (
                    <p className="text-red-500 text-sm text-center">
                      Contraseña incorrecta
                    </p>
                  )}

                  <button
                    onClick={handleUnlock}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-3 rounded-xl font-bold"
                  >
                    Desbloquear
                  </button>
                </div>
              ) : (
                <div className="w-full text-center mt-4">
                  <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />

                  {downloadData[activeDownload].link ? (
                    <a
                      href={downloadData[activeDownload].link}
                      target="_blank"
                      className="inline-flex items-center gap-2 bg-yellow-500 px-6 py-3 rounded-xl font-bold text-black"
                    >
                      Descargar <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <p className="text-neutral-400">
                      Usa los canales dentro de Roku
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}