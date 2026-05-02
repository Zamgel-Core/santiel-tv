import { useState } from "react";
import { supabase } from "../supabaseClient";
import { getWhatsAppLink } from "../utils/whatsapp";
import { getDaysRemaining } from "../utils/dates";

type Props = {
  user: any;
};

export default function CustomerPanel({ user }: Props) {
  const [deviceMac, setDeviceMac] = useState(user.device_mac || "");
  const [deviceKey, setDeviceKey] = useState(user.device_key || "");
  const [savedMac, setSavedMac] = useState(user.device_mac || "");
  const [savedKey, setSavedKey] = useState(user.device_key || "");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const canRegisterDevice = !savedMac && !savedKey;

  const nearExpiration =
    user.expiration_date &&
    new Date(user.expiration_date).getTime() - new Date().getTime() <
      7 * 24 * 60 * 60 * 1000;

  const saveDeviceInfo = async () => {
    setMessage("");

    if (!deviceMac.trim() || !deviceKey.trim()) {
      setMessage("Debes ingresar MAC y KEY.");
      return;
    }

    setIsSaving(true);

    const { error } = await supabase
      .from("users")
      .update({
        device_mac: deviceMac.trim(),
        device_key: deviceKey.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setIsSaving(false);

    if (error) {
      console.error("Error guardando dispositivo:", error);
      setMessage("No se pudo guardar. Contacta a soporte.");
      return;
    }

    setSavedMac(deviceMac.trim());
    setSavedKey(deviceKey.trim());
    setMessage("Dispositivo registrado correctamente.");
  };

  return (
    <div className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-6 text-left space-y-5">
      <div>
        <p className="text-white font-bold text-xl">{user.username}</p>
        <p className="text-neutral-400 text-sm">
          Estado: {user.status ?? "active"}
        </p>
      </div>

      <div className="space-y-2 text-sm text-neutral-300">
        <p>
          <span className="text-neutral-500">Plan:</span>{" "}
          {user.plan || "N/A"}
        </p>

        <p>
          <span className="text-neutral-500">Expira:</span>{" "}
          <span className={nearExpiration ? "text-red-400" : "text-green-400"}>
            {getDaysRemaining(user.expiration_date)}
          </span>
        </p>

        <p>
          <span className="text-neutral-500">MAC:</span>{" "}
          {savedMac || "No registrada"}
        </p>

        <p>
          <span className="text-neutral-500">Key:</span>{" "}
          {savedKey || "No registrada"}
        </p>
      </div>

      {canRegisterDevice ? (
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 space-y-3">
          <div>
            <h4 className="font-bold text-yellow-400">
              Registrar dispositivo
            </h4>
            <p className="text-xs text-neutral-400 mt-1">
              Puedes registrar tu MAC y KEY una sola vez. La MAC normalmente
              tiene formato XX:XX:XX:XX:XX:XX.
            </p>
          </div>

          <input
            value={deviceMac}
            onChange={(e) => setDeviceMac(e.target.value)}
            placeholder="MAC del dispositivo - Ej: A1:B2:C3:D4:E5:F6"
            className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
          />

          <input
            value={deviceKey}
            onChange={(e) => setDeviceKey(e.target.value)}
            placeholder="Device Key - Ej: 123456 o ABCD-1234"
            className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
          />

          <button
            onClick={saveDeviceInfo}
            disabled={isSaving}
            className="w-full bg-yellow-500 text-black text-center py-3 rounded-xl font-bold hover:bg-yellow-400 disabled:opacity-60"
          >
            {isSaving ? "Guardando..." : "Guardar dispositivo"}
          </button>

          {message && (
            <p className="text-sm text-yellow-400 bg-neutral-900 rounded-xl px-4 py-3">
              {message}
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 space-y-3">
          <p className="text-sm text-neutral-300">
            Tu dispositivo ya está registrado. Para modificar la MAC o KEY,
            solicita ayuda al equipo de Santiel TV.
          </p>

          <a
            href={getWhatsAppLink(
              `Hola, necesito modificar mi MAC/KEY registrada en Santiel TV.\nUsuario: ${user.username}\nMAC actual: ${savedMac || "No registrada"}\nKEY actual: ${savedKey || "No registrada"}`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-red-600 text-white text-center py-3 rounded-xl font-bold hover:bg-red-500"
          >
            Solicitar modificar MAC / KEY
          </a>
        </div>
      )}

      <div className="grid gap-3">
        <a
          href={getWhatsAppLink(
            `Hola, quiero renovar mi cuenta Santiel TV. Usuario: ${user.username}`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-yellow-500 text-black text-center py-3 rounded-xl font-bold hover:bg-yellow-400"
        >
          Renovar membresía
        </a>

        <a
          href={getWhatsAppLink(
            `Hola, necesito ayuda con mi cuenta Santiel TV. Usuario: ${user.username}`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-neutral-800 text-white text-center py-3 rounded-xl font-bold hover:bg-neutral-700"
        >
          Necesito ayuda
        </a>

        <a
          href={getWhatsAppLink(
            `Hola, quiero solicitar cambio de dispositivo en Santiel TV.\nUsuario: ${user.username}\nMAC actual: ${savedMac || "No registrada"}\nKEY actual: ${savedKey || "No registrada"}`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-neutral-800 text-white text-center py-3 rounded-xl font-bold hover:bg-neutral-700"
        >
          Solicitar cambio de dispositivo
        </a>

        <a
          href={getWhatsAppLink(
            `Hola, quiero solicitar agregar un nuevo dispositivo Roku TV a mi cuenta Santiel TV.\nUsuario: ${user.username}\nMAC actual: ${savedMac || "No registrada"}\nKEY actual: ${savedKey || "No registrada"}`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-neutral-800 text-white text-center py-3 rounded-xl font-bold hover:bg-neutral-700"
        >
          Solicitar añadir nuevo dispositivo
        </a>
      </div>
    </div>
  );
}