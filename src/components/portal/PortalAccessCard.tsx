//📍 Ruta: src/components/portal/PortalAccessCard.tsx

import { useEffect, useState } from "react";
import { Lock, Phone, ShieldCheck, KeyRound, Crown, Ticket, LogOut } from "lucide-react";

import {
  changePortalPin,
  loginPortalWithPin,
  type PortalUser,
} from "../../services/portal/portalAuth";

const PORTAL_SESSION_KEY = "portalUser";

export default function PortalAccessCard() {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const [user, setUser] = useState<PortalUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem(PORTAL_SESSION_KEY);

    if (!savedUser) return;

    try {
      const parsedUser = JSON.parse(savedUser) as PortalUser;
      setUser(parsedUser);
      setPhone(parsedUser.phone || "");
      setMessage("Bienvenido de nuevo a tu portal Santiel.");
    } catch {
      localStorage.removeItem(PORTAL_SESSION_KEY);
    }
  }, []);

  const savePortalSession = (loggedUser: PortalUser) => {
    setUser(loggedUser);
    setPhone(loggedUser.phone || phone);
    localStorage.setItem(PORTAL_SESSION_KEY, JSON.stringify(loggedUser));
  };

  const handleLogout = () => {
    localStorage.removeItem(PORTAL_SESSION_KEY);
    setUser(null);
    setPin("");
    setNewPin("");
    setConfirmPin("");
    setMessage("Sesión cerrada correctamente.");
    setError("");
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const loggedUser = await loginPortalWithPin(phone, pin);
      savePortalSession(loggedUser);

      if (loggedUser.must_change_pin) {
        setMessage("Por seguridad, crea tu PIN personal para continuar.");
      } else {
        setMessage("Bienvenido a tu portal Santiel.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePin = async () => {
    try {
      setPinLoading(true);
      setError("");
      setMessage("");

      await changePortalPin(phone, pin, newPin, confirmPin);

      const loggedUser = await loginPortalWithPin(phone, newPin);
      savePortalSession(loggedUser);

      setPin(newPin);
      setNewPin("");
      setConfirmPin("");
      setMessage("PIN creado correctamente. Ya puedes usar tu portal.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error.");
    } finally {
      setPinLoading(false);
    }
  };

  const expirationLabel = user?.expiration_date
    ? new Date(user.expiration_date).toLocaleDateString("es-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Sin fecha registrada";

  return (
    <div className="rounded-[2rem] border border-yellow-500/20 bg-neutral-950 p-5 md:p-7">
      <div className="mb-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm font-bold text-yellow-400">
          <Lock className="h-4 w-4" />
          Portal Santiel
        </div>

        <h3 className="mt-4 text-2xl md:text-3xl font-black text-white">
          Entra con tu teléfono y PIN
        </h3>

        <p className="mt-2 text-sm md:text-base text-neutral-400">
          La primera vez usa el PIN 0000. Después te pediremos crear tu PIN personal.
        </p>
      </div>

      {!user ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-300">Teléfono</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <Phone className="h-5 w-5 text-yellow-400" />
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Ej. 8321234567"
                className="w-full bg-transparent text-white outline-none placeholder:text-neutral-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-300">PIN</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <KeyRound className="h-5 w-5 text-yellow-400" />
              <input
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                placeholder="0000"
                className="w-full bg-transparent text-white outline-none placeholder:text-neutral-500"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-2xl bg-yellow-500 px-6 py-4 font-black text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar a mi cuenta"}
          </button>
        </div>
      ) : user.must_change_pin ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-100">
            <p className="font-bold">Crea tu PIN personal</p>
            <p className="mt-1 text-sm text-yellow-100/80">
              Este PIN será tu llave para entrar a tu cuenta Santiel.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-300">Nuevo PIN</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <KeyRound className="h-5 w-5 text-yellow-400" />
              <input
                type="password"
                inputMode="numeric"
                value={newPin}
                onChange={(event) => setNewPin(event.target.value)}
                placeholder="4 a 6 números"
                className="w-full bg-transparent text-white outline-none placeholder:text-neutral-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-300">Confirmar PIN</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <ShieldCheck className="h-5 w-5 text-yellow-400" />
              <input
                type="password"
                inputMode="numeric"
                value={confirmPin}
                onChange={(event) => setConfirmPin(event.target.value)}
                placeholder="Repite tu PIN"
                className="w-full bg-transparent text-white outline-none placeholder:text-neutral-500"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleChangePin}
            disabled={pinLoading}
            className="w-full rounded-2xl bg-yellow-500 px-6 py-4 font-black text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pinLoading ? "Guardando PIN..." : "Guardar mi PIN"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-neutral-400">Usuario</p>
            <p className="text-2xl font-black text-white">
              {user.username || "Cliente Santiel"}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-5">
              <div className="flex items-center gap-2 text-yellow-300">
                <Crown className="h-5 w-5" />
                <p className="font-bold">
                  {user.is_premium ? "Premium activo" : "Cuenta gratis/vencida"}
                </p>
              </div>
              <p className="mt-2 text-sm text-yellow-100/80">Vence: {expirationLabel}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 text-yellow-400">
                <Ticket className="h-5 w-5" />
                <p className="font-bold">Boletos acumulados</p>
              </div>
              <p className="mt-2 text-3xl font-black text-white">
                {user.total_tickets ?? 0}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
            <p className="text-sm text-neutral-400">Tu código para invitar</p>
            <p className="mt-2 text-3xl font-black tracking-wide text-yellow-400">
              {user.referral_code || "Pendiente"}
            </p>
            <p className="mt-2 text-sm text-neutral-400">
              Comparte este código para ganar boletos extra cuando alguien participe por primera vez.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/5 px-6 py-3 font-bold text-white transition hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión del portal
          </button>
        </div>
      )}

      {message ? (
        <div className="mt-5 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-300">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
          {error}
        </div>
      ) : null}
    </div>
  );
}