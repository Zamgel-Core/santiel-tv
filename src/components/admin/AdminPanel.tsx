//📍 Ruta: src/components/admin/AdminPanel.tsx

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { getDaysRemaining } from "../../lib/dates";
import { getWhatsAppLink } from "../../lib/whatsapp";

type AccountType = "customer" | "demo";
type FilterType =
  | "all"
  | "active"
  | "blocked"
  | "expired"
  | "admin"
  | "demo"
  | "customer";

type NewUserForm = {
  customer_name: string;
  username: string;
  password: string;
  account_type: AccountType;
  months: number;
  demoHours: number;
  phone: string;
  expiration_date: string;
  device_type: string;
  device_mac: string;
  device_key: string;
  notes: string;
};

const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
const quickMonths = [1, 2, 3, 4, 6, 12];
const demoHourOptions = [1, 2, 4];

const deviceOptions = [
  "Roku TV",
  "Android",
  "Santiel TV",
  "Fire TV",
  "Smart TV",
  "Otro",
];

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const [selectedMonthsByUser, setSelectedMonthsByUser] = useState<
    Record<string, number>
  >({});

  const [newUser, setNewUser] = useState<NewUserForm>({
    customer_name: "",
    username: "",
    password: "",
    account_type: "customer",
    months: 1,
    demoHours: 1,
    phone: "",
    expiration_date: "",
    device_type: "Roku TV",
    device_mac: "",
    device_key: "",
    notes: "",
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData.session?.access_token) {
        throw new Error("Debes iniciar sesión nuevamente.");
      }

      const response = await fetch("/api/admin/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
        cache: "no-store",
      });

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error(
          "La API administrativa no está disponible aquí. Para probarla utiliza el entorno de Vercel.",
        );
      }
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "No se pudieron cargar los clientes.");
      }

      if (!Array.isArray(result.users)) {
        throw new Error("Respuesta inválida del servidor.");
      }

      setUsers(result.users);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      setMessage(
        error instanceof Error ? error.message : "Error cargando usuarios.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const isUserBlocked = (user: any) =>
    user.is_active === false ||
    user.status === "blocked" ||
    user.status === "bloqueada";

  const isUserExpired = (user: any) => {
    if (!user.expiration_date) return false;
    return new Date(user.expiration_date) < new Date();
  };

  const getAccountType = (user: any): AccountType => {
    if (user.account_type === "demo" || user.is_trial === true) return "demo";
    return "customer";
  };

  const getCustomerName = (user: any) => {
    return (
      user.customer_name ||
      user.full_name ||
      user.name ||
      user.username ||
      "Cliente"
    );
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = search.toLowerCase();

      const matchesSearch =
        user.customer_name?.toLowerCase().includes(query) ||
        user.username?.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query) ||
        user.device_type?.toLowerCase().includes(query) ||
        user.device_mac?.toLowerCase().includes(query) ||
        user.device_key?.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      if (filter === "active")
        return !isUserBlocked(user) && !isUserExpired(user);
      if (filter === "blocked") return isUserBlocked(user);
      if (filter === "expired") return isUserExpired(user);
      if (filter === "admin") return user.role === "admin";
      if (filter === "demo") return getAccountType(user) === "demo";
      if (filter === "customer") return getAccountType(user) === "customer";

      return true;
    });
  }, [users, search, filter]);

  // Las operaciones de escritura requieren endpoints administrativos autorizados.
  // No realizamos cambios en Supabase directamente desde el navegador.
  const unavailableAction = () => {
    setMessage("Esta operación estará disponible cuando se habilite su API segura.");
  };

  const [isCreating, setIsCreating] = useState(false);

  const createUser = async () => {
    if (newUser.account_type !== "customer") {
      setMessage("La creación de demos todavía no está habilitada.");
      return;
    }
    if (!newUser.customer_name.trim() || !newUser.username.trim() || !newUser.password.trim()) {
      setMessage("Completa nombre, usuario y contraseña de la app.");
      return;
    }
    setIsCreating(true);
    setMessage("");
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session?.access_token) {
        throw new Error("Debes iniciar sesión nuevamente.");
      }
      const payload = {
        ...newUser,
        expiration_date: newUser.expiration_date
          ? new Date(newUser.expiration_date).toISOString()
          : "",
      };
      const response = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(payload),
      });
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("La API de creación no está disponible. Prueba en Vercel.");
      }
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo crear el cliente.");
      setNewUser({
        customer_name: "", username: "", password: "", account_type: "customer",
        months: 1, demoHours: 1, phone: "", expiration_date: "",
        device_type: "Roku TV", device_mac: "", device_key: "", notes: "",
      });
      await fetchUsers();
      setMessage("Cliente creado correctamente. Ya aparece en el listado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo crear el cliente.");
    } finally {
      setIsCreating(false);
    }
  };
  const addTimeToUser = (_user: any, _months: number) => unavailableAction();
  const convertDemoToCustomer = (_user: any, _months: number) => unavailableAction();
  const toggleBlockUser = (_user: any) => unavailableAction();
  const resetPortalPin = (_user: any) => unavailableAction();

  const startEdit = (user: any) => {
    const accountType = getAccountType(user);

    setEditingId(user.id);
    setEditForm({
      customer_name: user.customer_name || "",
      username: user.username || "",
      phone: user.phone || "",
      account_type: accountType,
      plan_months: user.plan_months || 1,
      demo_duration_hours: user.demo_duration_hours || 1,
      device_type: user.device_type || "Roku TV",
      device_mac: user.device_mac || "",
      device_key: user.device_key || "",
      notes: user.notes || "",
      status: user.status || "active",
      expiration_date: user.expiration_date
        ? user.expiration_date.slice(0, 16)
        : "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const updateSelectedMonths = (userId: string, months: number) => {
    setSelectedMonthsByUser((prev) => ({
      ...prev,
      [userId]: months,
    }));
  };

  const getWhatsAppCustomerLink = (user: any) => {
    const name = getCustomerName(user);
    return getWhatsAppLink(
      `Hola ${name}, te contacto de Santiel TV sobre tu cuenta.`,
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white">Panel Super Admin</h3>
        <p className="text-neutral-400 text-sm">
          Consulta segura de clientes y membresías. Las acciones de edición están temporalmente deshabilitadas.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
          <p className="text-xs text-neutral-500">Total</p>
          <p className="text-2xl font-black text-white">{users.length}</p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
          <p className="text-xs text-neutral-500">Clientes</p>
          <p className="text-2xl font-black text-green-400">
            {users.filter((u) => getAccountType(u) === "customer").length}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
          <p className="text-xs text-neutral-500">Demos</p>
          <p className="text-2xl font-black text-yellow-400">
            {users.filter((u) => getAccountType(u) === "demo").length}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
          <p className="text-xs text-neutral-500">Vencidos</p>
          <p className="text-2xl font-black text-red-400">
            {users.filter((u) => isUserExpired(u)).length}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
          <p className="text-xs text-neutral-500">Bloqueados</p>
          <p className="text-2xl font-black text-orange-400">
            {users.filter((u) => isUserBlocked(u)).length}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
          <p className="text-xs text-neutral-500">Admins</p>
          <p className="text-2xl font-black text-yellow-400">
            {users.filter((u) => u.role === "admin").length}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5">
        <h4 className="mb-4 font-bold text-white">Crear nuevo cliente</h4>

        <div className="grid gap-3 md:grid-cols-4">
          <input
            value={newUser.customer_name}
            onChange={(e) =>
              setNewUser({ ...newUser, customer_name: e.target.value })
            }
            placeholder="Nombre del cliente"
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
          />

          <input
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            placeholder="Teléfono / WhatsApp"
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
          />

          <input
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
            placeholder="Usuario app"
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
          />

          <input
            value={newUser.password}
            type="password"
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            placeholder="Contraseña app"
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
          />

          <select
            value={newUser.account_type}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                account_type: e.target.value as AccountType,
              })
            }
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
          >
            <option value="customer">Cliente final</option>
            <option value="demo">Demo</option>
          </select>

          {newUser.account_type === "customer" ? (
            <select
              value={newUser.months}
              onChange={(e) =>
                setNewUser({ ...newUser, months: Number(e.target.value) })
              }
              className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
            >
              {monthOptions.map((month) => (
                <option key={month} value={month}>
                  {month} mes{month > 1 ? "es" : ""}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={newUser.demoHours}
              onChange={(e) =>
                setNewUser({ ...newUser, demoHours: Number(e.target.value) })
              }
              className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
            >
              {demoHourOptions.map((hour) => (
                <option key={hour} value={hour}>
                  {hour} hora{hour > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          )}

          <input
            type="datetime-local"
            value={newUser.expiration_date}
            onChange={(e) =>
              setNewUser({ ...newUser, expiration_date: e.target.value })
            }
            placeholder="Fecha de expiración"
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
          />

          <select
            value={newUser.device_type}
            onChange={(e) =>
              setNewUser({ ...newUser, device_type: e.target.value })
            }
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
          >
            {deviceOptions.map((device) => (
              <option key={device} value={device}>
                {device}
              </option>
            ))}
          </select>

          <input
            value={newUser.device_mac}
            onChange={(e) =>
              setNewUser({ ...newUser, device_mac: e.target.value })
            }
            placeholder="MAC opcional"
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
          />

          <input
            value={newUser.device_key}
            onChange={(e) =>
              setNewUser({ ...newUser, device_key: e.target.value })
            }
            placeholder="Device Key opcional"
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
          />

          <input
            value={newUser.notes}
            onChange={(e) => setNewUser({ ...newUser, notes: e.target.value })}
            placeholder="Notas internas"
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500 md:col-span-2"
          />

          <button
            onClick={createUser}
            disabled={isCreating || newUser.account_type !== "customer"}
            className="rounded-xl bg-yellow-500 px-4 py-3 font-bold text-black disabled:opacity-50 disabled:cursor-not-allowed md:col-span-4"
          >
            {newUser.account_type === "demo"
              ? "Crear demo (próximamente)"
              : isCreating ? "Creando cliente..." : "Crear cliente"}
          </button>
        </div>

        <p className="mt-3 text-xs text-neutral-500">
          La creación de clientes utiliza la API administrativa segura. Las demos, renovaciones y ediciones continúan deshabilitadas.
          Las cuentas existentes no se modifican.
        </p>

        {message && (
          <p className="mt-4 rounded-xl bg-neutral-900 px-4 py-3 text-sm text-yellow-400">
            {message}
          </p>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_220px_120px]">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por cliente, usuario app, teléfono, dispositivo, MAC o Key..."
          className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
          className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
        >
          <option value="all">Todos</option>
          <option value="customer">Clientes</option>
          <option value="demo">Demos</option>
          <option value="active">Activos</option>
          <option value="expired">Vencidos</option>
          <option value="blocked">Bloqueados</option>
          <option value="admin">Admins</option>
        </select>

        <button
          onClick={fetchUsers}
          className="rounded-xl bg-neutral-800 px-4 py-3 font-bold text-white hover:bg-neutral-700"
        >
          Refrescar
        </button>
      </div>

      {isLoading ? (
        <p className="text-neutral-400">Cargando usuarios...</p>
      ) : (
        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-2">
          {filteredUsers.map((user) => {
            const blocked = isUserBlocked(user);
            const expired = isUserExpired(user);
            const editing = editingId === user.id;
            const accountType = getAccountType(user);
            const selectedMonths = selectedMonthsByUser[user.id] || 1;
            const customerName = getCustomerName(user);

            return (
              <div
                key={user.id}
                className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4"
              >
                {!editing ? (
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white">
                        {customerName}

                        {user.role === "admin" && (
                          <span className="ml-2 rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-400">
                            ADMIN
                          </span>
                        )}

                        {accountType === "demo" ? (
                          <span className="ml-2 rounded-full bg-purple-500/10 px-2 py-0.5 text-xs text-purple-400">
                            DEMO
                          </span>
                        ) : (
                          <span className="ml-2 rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
                            CLIENTE
                          </span>
                        )}
                      </h4>

                      <p className="text-sm text-neutral-400">
                        Usuario app:{" "}
                        <span className="text-neutral-200">
                          {user.username || "N/A"}
                        </span>
                      </p>

                      <p className="text-sm text-neutral-400">
                        Contraseña app:{" "}
                        <span className="text-neutral-200">
                          Oculta por seguridad
                        </span>
                      </p>

                      <p className="text-sm text-neutral-400">
                        Estado:{" "}
                        <span
                          className={
                            blocked
                              ? "text-red-400"
                              : expired
                                ? "text-orange-400"
                                : "text-green-400"
                          }
                        >
                          {blocked ? "blocked" : expired ? "expired" : "active"}
                        </span>
                      </p>

                      <p className="text-sm text-neutral-400">
                        Tipo:{" "}
                        <span className="text-neutral-200">
                          {accountType === "demo" ? "Demo" : "Cliente final"}
                        </span>
                      </p>

                      <p className="text-sm text-neutral-400">
                        Plan:{" "}
                        <span className="text-neutral-200">
                          {user.plan || "N/A"}
                        </span>
                      </p>

                      <p className="text-sm text-neutral-400">
                        Expira:{" "}
                        <span className="text-neutral-200">
                          {user.expiration_date || "Sin fecha"}
                        </span>
                      </p>

                      <p className="text-sm text-neutral-400">
                        Tiempo:{" "}
                        <span className="text-neutral-200">
                          {getDaysRemaining(user.expiration_date)}
                        </span>
                      </p>

                      <p className="text-sm text-neutral-400">
                        WhatsApp:{" "}
                        <span className="text-neutral-200">
                          {user.phone || "Sin teléfono"}
                        </span>
                      </p>

                      <p className="text-sm text-neutral-400">
                        Dispositivo:{" "}
                        <span className="text-neutral-200">
                          {user.device_type || "Sin dispositivo"}
                        </span>
                      </p>

                      <p className="text-sm text-neutral-400">
                        PIN portal:{" "}
                        <span className="text-neutral-200">
                          Oculto por seguridad
                        </span>
                      </p>

                      <p className="text-sm text-neutral-400">
                        Código referido:{" "}
                        <span className="text-yellow-400">
                          {user.referral_code || "Pendiente"}
                        </span>
                      </p>

                      <p className="text-sm text-neutral-400">
                        Boletos:{" "}
                        <span className="text-neutral-200">
                          {user.total_tickets || 0}
                        </span>
                      </p>

                      <p className="text-sm text-neutral-400">
                        MAC:{" "}
                        <span className="text-neutral-200">
                          {user.device_mac || "Sin MAC"}
                        </span>
                      </p>

                      <p className="text-sm text-neutral-400">
                        Key:{" "}
                        <span className="text-neutral-200">
                          {user.device_key || "Sin Key"}
                        </span>
                      </p>

                      {user.notes && (
                        <p className="text-sm text-neutral-500">
                          Nota: {user.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 xl:items-end">
                      {accountType === "customer" && (
                        <div className="flex flex-wrap gap-2">
                          {quickMonths.map((month) => (
                            <button
                              key={month}
                              onClick={() => addTimeToUser(user, month)}
                              disabled
                              className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-bold text-black disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              +{month} mes{month > 1 ? "es" : ""}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <select
                          value={selectedMonths}
                          onChange={(e) =>
                            updateSelectedMonths(
                              user.id,
                              Number(e.target.value),
                            )
                          }
                          className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-yellow-500"
                        >
                          {monthOptions.map((month) => (
                            <option key={month} value={month}>
                              {month} mes{month > 1 ? "es" : ""}
                            </option>
                          ))}
                        </select>

                        {accountType === "demo" ? (
                          <button
                            onClick={() =>
                              convertDemoToCustomer(user, selectedMonths)
                            }
                            disabled
                            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Convertir a cliente
                          </button>
                        ) : (
                          <button
                            onClick={() => addTimeToUser(user, selectedMonths)}
                            disabled
                            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Agregar tiempo
                          </button>
                        )}

                        <button
                          onClick={() => startEdit(user)}
                          disabled
                          className="rounded-xl bg-neutral-800 px-4 py-2 text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-700"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => resetPortalPin(user)}
                          disabled
                          className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Reset PIN
                        </button>

                        {user.phone && (
                          <a
                            href={getWhatsAppCustomerLink(user)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl bg-green-700 px-4 py-2 text-sm font-bold text-white hover:bg-green-600"
                          >
                            WhatsApp
                          </a>
                        )}

                        <button
                          onClick={() => toggleBlockUser(user)}
                          disabled
                          className={`rounded-xl px-4 py-2 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed ${
                            blocked
                              ? "bg-green-600 text-white hover:bg-green-500"
                              : "bg-red-600 text-white hover:bg-red-500"
                          }`}
                        >
                          {blocked ? "Desbloquear" : "Bloquear"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-3">
                      <input
                        value={editForm.customer_name}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            customer_name: e.target.value,
                          })
                        }
                        placeholder="Nombre del cliente"
                        className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
                      />

                      <input
                        value={editForm.username}
                        onChange={(e) =>
                          setEditForm({ ...editForm, username: e.target.value })
                        }
                        placeholder="Usuario app"
                        className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
                      />

                      <input
                        type="datetime-local"
                        value={editForm.expiration_date}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            expiration_date: e.target.value,
                          })
                        }
                        className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
                      />

                      <select
                        value={editForm.account_type}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            account_type: e.target.value,
                          })
                        }
                        className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
                      >
                        <option value="customer">Cliente final</option>
                        <option value="demo">Demo</option>
                      </select>

                      {editForm.account_type === "customer" ? (
                        <select
                          value={editForm.plan_months}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              plan_months: Number(e.target.value),
                            })
                          }
                          className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
                        >
                          {monthOptions.map((month) => (
                            <option key={month} value={month}>
                              {month} mes{month > 1 ? "es" : ""}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <select
                          value={editForm.demo_duration_hours}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              demo_duration_hours: Number(e.target.value),
                            })
                          }
                          className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
                        >
                          {demoHourOptions.map((hour) => (
                            <option key={hour} value={hour}>
                              {hour} hora{hour > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      )}

                      <input
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                        placeholder="Teléfono"
                        className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
                      />

                      <select
                        value={editForm.device_type}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            device_type: e.target.value,
                          })
                        }
                        className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
                      >
                        {deviceOptions.map((device) => (
                          <option key={device} value={device}>
                            {device}
                          </option>
                        ))}
                      </select>

                      <input
                        value={editForm.device_mac}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            device_mac: e.target.value,
                          })
                        }
                        placeholder="MAC opcional"
                        className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
                      />

                      <input
                        value={editForm.device_key}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            device_key: e.target.value,
                          })
                        }
                        placeholder="Device Key opcional"
                        className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
                      />

                      <select
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm({ ...editForm, status: e.target.value })
                        }
                        className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
                      >
                        <option value="active">active</option>
                        <option value="blocked">blocked</option>
                      </select>

                    </div>

                    <textarea
                      value={editForm.notes}
                      onChange={(e) =>
                        setEditForm({ ...editForm, notes: e.target.value })
                      }
                      placeholder="Notas internas"
                      className="min-h-[90px] w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
                    />

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled
                        title="Estamos preparando el guardado seguro de clientes"
                        className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-bold text-black opacity-50 cursor-not-allowed"
                      >
                        Guardar (próximamente)
                      </button>

                      <button
                        onClick={cancelEdit}
                        className="rounded-xl bg-neutral-800 px-4 py-2 text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-700"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredUsers.length === 0 && (
            <p className="text-neutral-500">No hay usuarios con ese filtro.</p>
          )}
        </div>
      )}
    </div>
  );
}
