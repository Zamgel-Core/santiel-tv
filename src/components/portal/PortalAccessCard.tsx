import { useEffect, useState } from "react";
import {
  Lock,
  Phone,
  ShieldCheck,
  KeyRound,
  Crown,
  Ticket,
  LogOut,
  RefreshCw,
} from "lucide-react";

type PortalUser = {
  id: number;
  username?: string | null;
  customer_name?: string | null;
  display_name?: string | null;
  phone?: string | null;
  status?: string | null;
  account_type?: string | null;
  expiration_date?: string | null;
  referral_code?: string | null;
  total_tickets?: number | null;
  is_premium?: boolean;
  must_change_pin?: boolean;
};

type SessionResponse = {
  authenticated?: boolean;
  must_change_pin?: boolean;
  user?: PortalUser | null;
  error?: string;
  message?: string;
};

type LoginResponse = {
  success?: boolean;
  must_change_pin?: boolean;
  error?: string;
  message?: string;
};

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(path, {
    ...options,
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const data = (await response.json()) as T & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error || "No fue posible completar la solicitud.");
  }

  return data;
}

function normalizePhone(value: string): string {
  const cleaned = value.trim().replace(/[\s().-]/g, "");

  // Para pruebas con números estadounidenses de 10 dígitos.
  if (/^\d{10}$/.test(cleaned)) {
    return `+1${cleaned}`;
  }

  if (/^1\d{10}$/.test(cleaned)) {
    return `+${cleaned}`;
  }

  return cleaned;
}

export default function PortalAccessCard() {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const [user, setUser] = useState<PortalUser | null>(null);
  const [mustChangePin, setMustChangePin] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadSession() {
    try {
      const session = await apiRequest<SessionResponse>("/api/portal/session");

      if (session.must_change_pin) {
        setMustChangePin(true);
        setUser(null);
        return;
      }

      if (session.user) {
        setUser(session.user);
        setPhone(session.user.phone || "");
        setMustChangePin(false);
      } else {
        setUser(null);
        setMustChangePin(false);
      }
    } catch {
      setUser(null);
      setMustChangePin(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function restore() {
      try {
        const session = await apiRequest<SessionResponse>(
          "/api/portal/session",
        );

        if (!active) return;

        if (session.must_change_pin) {
          setMustChangePin(true);
          setUser(null);
        } else if (session.user) {
          setUser(session.user);
          setPhone(session.user.phone || "");
        }
      } catch {
        if (active) {
          setUser(null);
          setMustChangePin(false);
        }
      } finally {
        if (active) setCheckingSession(false);
      }
    }

    void restore();

    return () => {
      active = false;
    };
  }, []);

  async function handleLogin() {
    if (!/^\d{6}$/.test(pin)) {
      setError("El PIN debe contener exactamente 6 números.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const result = await apiRequest<LoginResponse>("/api/portal/login", {
        method: "POST",
        body: JSON.stringify({
          phone: normalizePhone(phone),
          pin,
        }),
      });

      if (!result.success) {
        throw new Error("No fue posible iniciar sesión.");
      }

      setPin("");

      if (result.must_change_pin) {
        setUser(null);
        setMustChangePin(true);
        setMessage("Por seguridad, crea un PIN personal de 6 números.");
      } else {
        await loadSession();
        setMessage("Bienvenido a tu portal Santiel.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de acceso.");
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePin() {
    if (!/^\d{6}$/.test(pin)) {
      setError("Ingresa el PIN temporal de 6 números.");
      return;
    }

    if (!/^\d{6}$/.test(newPin)) {
      setError("Tu nuevo PIN debe contener exactamente 6 números.");
      return;
    }

    if (newPin !== confirmPin) {
      setError("Los PIN nuevos no coinciden.");
      return;
    }

    if (pin === newPin) {
      setError("El nuevo PIN debe ser diferente al temporal.");
      return;
    }

    try {
      setPinLoading(true);
      setError("");
      setMessage("");

      await apiRequest("/api/portal/change-pin", {
        method: "POST",
        body: JSON.stringify({
          old_pin: pin,
          new_pin: newPin,
        }),
      });

      // La API revoca las sesiones al cambiar el PIN.
      setUser(null);
      setMustChangePin(false);
      setPin("");
      setNewPin("");
      setConfirmPin("");

      setMessage("¡PIN actualizado! Inicia sesión con tu nuevo PIN.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo actualizar el PIN.",
      );
    } finally {
      setPinLoading(false);
    }
  }

  async function handleLogout() {
    try {
      setLogoutLoading(true);
      setError("");

      await apiRequest("/api/portal/logout", {
        method: "POST",
      });

      setUser(null);
      setMustChangePin(false);
      setPin("");
      setNewPin("");
      setConfirmPin("");
      setMessage("Sesión cerrada correctamente.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo cerrar la sesión.",
      );
    } finally {
      setLogoutLoading(false);
    }
  }

  const visibleName =
    user?.display_name ||
    user?.customer_name ||
    user?.username ||
    "Cliente Santiel";

  const expirationLabel = user?.expiration_date
    ? new Date(user.expiration_date).toLocaleDateString("es-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Sin fecha registrada";

  if (checkingSession) {
    return (
      <div className="rounded-[2rem] border border-yellow-500/20 bg-neutral-950 p-8 text-center text-neutral-300">
        <RefreshCw className="mx-auto mb-3 h-7 w-7 animate-spin text-yellow-400" />
        Verificando tu sesión...
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-yellow-500/20 bg-neutral-950 p-5 md:p-7">
      <div className="mb-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm font-bold text-yellow-400">
          <Lock className="h-4 w-4" />
          Portal Santiel
        </div>

        <h3 className="mt-4 text-2xl font-black text-white md:text-3xl">
          {mustChangePin
            ? "Crea tu PIN personal"
            : user
              ? "Mi cuenta Santiel"
              : "Entra con tu teléfono y PIN"}
        </h3>

        <p className="mt-2 text-sm text-neutral-400">
          {mustChangePin
            ? "Por seguridad, debes cambiar el PIN temporal."
            : user
              ? "Consulta la información de tu cuenta."
              : "Ingresa tu teléfono registrado y tu PIN de 6 números."}
        </p>
      </div>

      {!user && !mustChangePin && (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void handleLogin();
          }}
        >
          <div>
            <label className="text-sm font-medium text-neutral-300">
              Teléfono
            </label>

            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <Phone className="h-5 w-5 text-yellow-400" />
              <input
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+1 832 123 4567"
                required
                className="w-full bg-transparent text-white outline-none placeholder:text-neutral-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-300">
              PIN de acceso
            </label>

            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <KeyRound className="h-5 w-5 text-yellow-400" />
              <input
                type="password"
                inputMode="numeric"
                autoComplete="off"
                maxLength={6}
                pattern="[0-9]{6}"
                value={pin}
                onChange={(event) =>
                  setPin(event.target.value.replace(/\D/g, ""))
                }
                placeholder="6 números"
                required
                className="w-full bg-transparent text-white outline-none placeholder:text-neutral-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-yellow-500 px-6 py-4 font-black text-black transition hover:bg-yellow-400 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar a mi cuenta"}
          </button>
        </form>
      )}

      {mustChangePin && (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void handleChangePin();
          }}
        >
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-100">
            <ShieldCheck className="mb-2 h-5 w-5 text-yellow-400" />
            Tu PIN temporal es de un solo uso. Elige uno nuevo para proteger tu
            cuenta.
          </div>

          {[
            {
              label: "PIN temporal actual",
              value: pin,
              setter: setPin,
            },
            {
              label: "Nuevo PIN",
              value: newPin,
              setter: setNewPin,
            },
            {
              label: "Confirmar nuevo PIN",
              value: confirmPin,
              setter: setConfirmPin,
            },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-sm font-medium text-neutral-300">
                {field.label}
              </label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <KeyRound className="h-5 w-5 text-yellow-400" />
                <input
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                  value={field.value}
                  onChange={(event) =>
                    field.setter(event.target.value.replace(/\D/g, ""))
                  }
                  placeholder="6 números"
                  className="w-full bg-transparent text-white outline-none placeholder:text-neutral-500"
                />
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={pinLoading}
            className="w-full rounded-2xl bg-yellow-500 px-6 py-4 font-black text-black transition hover:bg-yellow-400 disabled:opacity-60"
          >
            {pinLoading ? "Guardando..." : "Guardar mi nuevo PIN"}
          </button>
        </form>
      )}

      {user && !mustChangePin && (
        <div className="space-y-4">
          <div
            className={`rounded-3xl border p-4 ${
              user.is_premium
                ? "border-yellow-500/20 bg-yellow-500/10"
                : "border-sky-500/20 bg-sky-500/10"
            }`}
          >
            <p
              className={`font-black ${
                user.is_premium ? "text-yellow-300" : "text-sky-300"
              }`}
            >
              {user.is_premium ? "👑 Premium activo" : "🎟 Free / participante"}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-neutral-400">Nombre visible</p>
            <p className="mt-2 text-2xl font-black text-white">{visibleName}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-5">
              <div className="flex items-center gap-2 text-yellow-300">
                <Crown className="h-5 w-5" />
                <p className="font-bold">
                  {user.is_premium ? "Premium activo" : "Free / sin servicio"}
                </p>
              </div>
              <p className="mt-2 text-sm text-yellow-100/80">
                Vence: {expirationLabel}
              </p>
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
            <p className="mt-2 break-all text-3xl font-black tracking-wide text-yellow-400">
              {user.referral_code || "Pendiente"}
            </p>
            <p className="mt-2 text-sm text-neutral-400">
              Comparte tu código para obtener boletos extra cuando alguien
              participe por primera vez.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={logoutLoading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/5 px-6 py-3 font-bold text-white transition hover:bg-white/10 disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" />
            {logoutLoading ? "Cerrando sesión..." : "Cerrar sesión del portal"}
          </button>
        </div>
      )}

      {message && (
        <div className="mt-5 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-300">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
