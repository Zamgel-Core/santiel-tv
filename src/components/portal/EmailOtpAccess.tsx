import { useState } from "react";
import { Mail, ShieldCheck, LogOut } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { requestEmailCode, verifyEmailCode, signOutEmailSession } from "../../services/auth/emailOtp";

type Profile = { username?: string; customer_name?: string; display_name?: string; is_admin?: boolean; is_premium?: boolean };

export default function EmailOtpAccess() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [stage, setStage] = useState<"email" | "code" | "verified">("email");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function sendCode() {
    setLoading(true); setError(""); setMessage("");
    try {
      await requestEmailCode(email);
      setStage("code");
      setMessage("Si el correo está habilitado, recibirás un código. Revisa también spam.");
    } catch (e) { setError(e instanceof Error ? e.message : "No fue posible solicitar el código."); }
    finally { setLoading(false); }
  }

  async function confirmCode() {
    setLoading(true); setError("");
    try {
      await verifyEmailCode(email, token);
      const { data, error: profileError } = await supabase.rpc("portal_profile");
      if (profileError || !data) {
        await signOutEmailSession();
        throw new Error("Tu correo aún no está vinculado a una cuenta del portal. Contacta a Santiel TV.");
      }
      setProfile(data as Profile);
      setStage("verified");
      setMessage("Correo verificado y cuenta vinculada correctamente.");
    } catch (e) { setError(e instanceof Error ? e.message : "No se pudo validar el código."); }
    finally { setLoading(false); }
  }

  async function logout() {
    setLoading(true); setError("");
    try { await signOutEmailSession(); setProfile(null); setToken(""); setStage("email"); setMessage("Sesión cerrada."); }
    catch (e) { setError(e instanceof Error ? e.message : "No se pudo cerrar la sesión."); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-4 rounded-3xl border border-yellow-500/20 bg-black/30 p-5 text-white">
      <div className="flex items-center gap-3"><Mail className="text-yellow-400"/><div><h3 className="font-bold">Acceso con correo</h3><p className="text-xs text-neutral-400">Solo para cuentas previamente vinculadas.</p></div></div>
      {stage === "email" && <form onSubmit={e => { e.preventDefault(); void sendCode(); }} className="space-y-3">
        <label htmlFor="santiel-otp-email" className="block text-sm text-neutral-300">Correo registrado</label>
        <input id="santiel-otp-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-3" />
        <button disabled={loading} className="w-full rounded-xl bg-yellow-500 p-3 font-bold text-black disabled:opacity-50">{loading ? "Enviando..." : "Enviar código"}</button>
      </form>}
      {stage === "code" && <form onSubmit={e => { e.preventDefault(); void confirmCode(); }} className="space-y-3">
        <p className="text-sm text-neutral-300">Introduce el código enviado a {email}.</p>
        <input aria-label="Código de ocho dígitos" inputMode="numeric" autoComplete="one-time-code" maxLength={8} pattern="[0-9]{8}" required value={token} onChange={e => setToken(e.target.value.replace(/\D/g, ""))} placeholder="00000000" className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-3 tracking-widest" />
        <button disabled={loading} className="w-full rounded-xl bg-yellow-500 p-3 font-bold text-black disabled:opacity-50">{loading ? "Verificando..." : "Verificar código"}</button>
        <button type="button" disabled={loading} onClick={() => { setStage("email"); setToken(""); setError(""); }} className="w-full text-sm text-yellow-400">Cambiar correo o solicitar otro código</button>
      </form>}
      {stage === "verified" && profile && <div className="space-y-3">
        <div className="flex items-center gap-2 text-green-400"><ShieldCheck size={20}/> Identidad verificada</div>
        <p className="text-sm">{profile.display_name || profile.customer_name || profile.username || "Cuenta Santiel TV"}</p>
        <p className="text-xs text-neutral-400">Esta etapa valida tu acceso por correo. La integración con el panel completo se habilitará después de revisar la sesión y los permisos.</p>
        <button disabled={loading} onClick={() => void logout()} className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-700 p-3 text-sm"><LogOut size={16}/> Cerrar sesión de correo</button>
      </div>}
      {message && <p role="status" className="text-sm text-green-300">{message}</p>}
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
