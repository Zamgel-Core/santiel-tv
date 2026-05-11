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

const createSantielCode = () => {
  const randomPart = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `SAN-${randomPart}`;
};

const cleanPhoneNumber = (phone: string) => phone.replace(/\D/g, "");

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
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

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    setIsLoading(false);

    if (error) {
      console.error("Error cargando usuarios:", error);
      setMessage("Error cargando usuarios.");
      return;
    }

    setUsers(data || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addMonths = (date: Date, months: number) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  };

  const addHours = (date: Date, hours: number) => {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + hours);
    return newDate;
  };

  const getPlanLabel = (months: number) => {
    return `${months} mes${months > 1 ? "es" : ""}`;
  };

  const getDemoLabel = (hours: number) => {
    return `Demo ${hours} hora${hours > 1 ? "s" : ""}`;
  };

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
    return user.customer_name || user.full_name || user.name || user.username || "Cliente";
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

      if (filter === "active") return !isUserBlocked(user) && !isUserExpired(user);
      if (filter === "blocked") return isUserBlocked(user);
      if (filter === "expired") return isUserExpired(user);
      if (filter === "admin") return user.role === "admin";
      if (filter === "demo") return getAccountType(user) === "demo";
      if (filter === "customer") return getAccountType(user) === "customer";

      return true;
    });
  }, [users, search, filter]);

  const createUser = async () => {
    setMessage("");

    const customerName = newUser.customer_name.trim();
    const appUsername = newUser.username.trim();
    const appPassword = newUser.password.trim();
    const cleanPhone = cleanPhoneNumber(newUser.phone);

    if (!customerName) {
      setMessage("Nombre del cliente es obligatorio.");
      return;
    }

    if (!appUsername || !appPassword) {
      setMessage("Usuario app y contraseña app son obligatorios.");
      return;
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      setMessage("Teléfono / WhatsApp válido es obligatorio.");
      return;
    }

    const isDemo = newUser.account_type === "demo";

    const expirationDate = newUser.expiration_date
      ? new Date(newUser.expiration_date).toISOString()
      : isDemo
        ? addHours(new Date(), newUser.demoHours).toISOString()
        : addMonths(new Date(), newUser.months).toISOString();

    setIsCreating(true);

    const { error } = await supabase.from("users").insert({
      customer_name: customerName,
      username: appUsername,
      password: appPassword,
      role: "customer",
      account_type: isDemo ? "demo" : "customer",
      status: "active",
      is_active: true,
      is_trial: isDemo,
      demo_duration_hours: isDemo ? newUser.demoHours : null,
      plan_months: isDemo ? null : newUser.months,
      converted_from_demo: false,
      expiration_date: expirationDate,
      phone: cleanPhone,
      plan: isDemo ? getDemoLabel(newUser.demoHours) : getPlanLabel(newUser.months),
      device_type: newUser.device_type,
      device_mac: newUser.device_mac.trim(),
      device_key: newUser.device_key.trim(),
      notes: newUser.notes.trim(),
      portal_pin: "0000",
      must_change_pin: true,
      customer_code: createSantielCode(),
      referral_code: createSantielCode(),
      total_tickets: 0,
      activity_points: 0,
      updated_at: new Date().toISOString(),
    });

    setIsCreating(false);

    if (error) {
      console.error("Error creando usuario:", error);
      setMessage(`Error creando usuario: ${error.message}`);
      return;
    }

    setNewUser({
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

    setMessage(isDemo ? "Demo creado correctamente." : "Cliente creado correctamente.");
    fetchUsers();
  };

  const addTimeToUser = async (user: any, months: number) => {
    const today = new Date();
    const currentExpiration = user.expiration_date
      ? new Date(user.expiration_date)
      : today;

    const baseDate = currentExpiration > today ? currentExpiration : today;
    const newExpiration = addMonths(baseDate, months);

    const currentPlanMonths = Number(user.plan_months || 0);
    const newPlanMonths = currentPlanMonths + months;

    const { error } = await supabase
      .from("users")
      .update({
        account_type: "customer",
        is_trial: false,
        plan_months: newPlanMonths,
        plan: getPlanLabel(newPlanMonths),
        expiration_date: newExpiration.toISOString(),
        status: "active",
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error agregando tiempo:", error);
      setMessage("Error agregando tiempo.");
      return;
    }

    setMessage(`Se agregaron ${months} mes${months > 1 ? "es" : ""} a ${getCustomerName(user)}.`);
    fetchUsers();
  };

  const convertDemoToCustomer = async (user: any, months: number) => {
    const newExpiration = addMonths(new Date(), months);

    const { error } = await supabase
      .from("users")
      .update({
        account_type: "customer",
        is_trial: false,
        converted_from_demo: true,
        demo_duration_hours: null,
        plan_months: months,
        plan: getPlanLabel(months),
        expiration_date: newExpiration.toISOString(),
        status: "active",
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error convirtiendo demo:", error);
      setMessage("Error convirtiendo demo a cliente.");
      return;
    }

    setMessage(
      `Demo ${getCustomerName(user)} convertido a cliente final por ${months} mes${
        months > 1 ? "es" : ""
      }.`
    );

    fetchUsers();
  };

  const toggleBlockUser = async (user: any) => {
    if (user.role === "admin") {
      setMessage("No puedes bloquear un usuario admin desde este panel.");
      return;
    }

    const blocked = isUserBlocked(user);

    const { error } = await supabase
      .from("users")
      .update({
        status: blocked ? "active" : "blocked",
        is_active: blocked,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error cambiando estado:", error);
      setMessage("Error cambiando estado del usuario.");
      return;
    }

    setMessage(blocked ? "Usuario desbloqueado." : "Usuario bloqueado.");
    fetchUsers();
  };

  const resetPortalPin = async (user: any) => {
    const { error } = await supabase
      .from("users")
      .update({
        portal_pin: "0000",
        must_change_pin: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error reiniciando PIN:", error);
      setMessage("Error reiniciando PIN.");
      return;
    }

    setMessage(`PIN de ${getCustomerName(user)} reiniciado a 0000.`);
    fetchUsers();
  };

  const startEdit = (user: any) => {
    const accountType = getAccountType(user);

    setEditingId(user.id);
    setEditForm({
      customer_name: user.customer_name || "",
      username: user.username || "",
      password: user.password || "",
      phone: user.phone || "",
      account_type: accountType,
      plan_months: user.plan_months || 1,
      demo_duration_hours: user.demo_duration_hours || 1,
      device_type: user.device_type || "Roku TV",
      device_mac: user.device_mac || "",
      device_key: user.device_key || "",
      notes: user.notes || "",
      role: user.role || "customer",
      status: user.status || "active",
      portal_pin: user.portal_pin || "0000",
      must_change_pin: user.must_change_pin ?? true,
      expiration_date: user.expiration_date
        ? user.expiration_date.slice(0, 16)
        : "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (user: any) => {
    const isDemo = editForm.account_type === "demo";
    const demoHours = Number(editForm.demo_duration_hours || 1);
    const planMonths = Number(editForm.plan_months || 1);

    const { error } = await supabase
      .from("users")
      .update({
        customer_name: editForm.customer_name.trim(),
        username: editForm.username.trim(),
        password: editForm.password.trim(),
        phone: cleanPhoneNumber(editForm.phone),
        account_type: editForm.account_type,
        is_trial: isDemo,
        demo_duration_hours: isDemo ? demoHours : null,
        plan_months: isDemo ? null : planMonths,
        plan: isDemo ? getDemoLabel(demoHours) : getPlanLabel(planMonths),
        device_type: editForm.device_type,
        device_mac: editForm.device_mac.trim(),
        device_key: editForm.device_key.trim(),
        notes: editForm.notes.trim(),
        role: editForm.role,
        status: editForm.status,
        is_active: editForm.status === "blocked" ? false : true,
        portal_pin: editForm.portal_pin || "0000",
        must_change_pin: Boolean(editForm.must_change_pin),
        expiration_date: editForm.expiration_date
          ? new Date(editForm.expiration_date).toISOString()
          : null,
        customer_code: user.customer_code || createSantielCode(),
        referral_code: user.referral_code || createSantielCode(),
        total_tickets: user.total_tickets ?? 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error guardando usuario:", error);
      setMessage(`Error guardando cambios: ${error.message}`);
      return;
    }

    setMessage(`Usuario ${editForm.customer_name || editForm.username} actualizado correctamente.`);
    cancelEdit();
    fetchUsers();
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
      `Hola ${name}, te contacto de Santiel TV sobre tu cuenta.`
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white">Panel Super Admin</h3>
        <p className="text-neutral-400 text-sm">
          Gestión avanzada de clientes, cuentas, sorteos y membresías.
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
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            placeholder="Usuario app"
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
          />

          <input
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
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
            onChange={(e) => setNewUser({ ...newUser, device_mac: e.target.value })}
            placeholder="MAC opcional"
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
          />

          <input
            value={newUser.device_key}
            onChange={(e) => setNewUser({ ...newUser, device_key: e.target.value })}
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
            disabled={isCreating}
            className="rounded-xl bg-yellow-500 px-4 py-3 font-bold text-black hover:bg-yellow-400 disabled:opacity-60 md:col-span-4"
          >
            {isCreating
              ? "Creando..."
              : newUser.account_type === "demo"
                ? "Crear demo"
                : "Crear cliente"}
          </button>
        </div>

        <p className="mt-3 text-xs text-neutral-500">
          Al crear un cliente se asigna automáticamente PIN portal 0000, código
          de cliente y código de referido.
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
                        <span className="text-neutral-200">{user.username || "N/A"}</span>
                      </p>

                      <p className="text-sm text-neutral-400">
                        Contraseña app:{" "}
                        <span className="text-neutral-200">{user.password || "N/A"}</span>
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
                        Plan: <span className="text-neutral-200">{user.plan || "N/A"}</span>
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
                          {user.portal_pin || "0000"}
                        </span>{" "}
                        {user.must_change_pin ? (
                          <span className="text-yellow-400">(debe cambiarlo)</span>
                        ) : (
                          <span className="text-green-400">(personalizado)</span>
                        )}
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
                              className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-bold text-black hover:bg-yellow-400"
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
                            updateSelectedMonths(user.id, Number(e.target.value))
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
                            onClick={() => convertDemoToCustomer(user, selectedMonths)}
                            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-500"
                          >
                            Convertir a cliente
                          </button>
                        ) : (
                          <button
                            onClick={() => addTimeToUser(user, selectedMonths)}
                            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-500"
                          >
                            Agregar tiempo
                          </button>
                        )}

                        <button
                          onClick={() => startEdit(user)}
                          className="rounded-xl bg-neutral-800 px-4 py-2 text-sm font-bold text-white hover:bg-neutral-700"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => resetPortalPin(user)}
                          className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600"
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
                          className={`rounded-xl px-4 py-2 text-sm font-bold ${
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
                          setEditForm({ ...editForm, customer_name: e.target.value })
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
                        value={editForm.password}
                        onChange={(e) =>
                          setEditForm({ ...editForm, password: e.target.value })
                        }
                        placeholder="Contraseña app"
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
                          setEditForm({ ...editForm, device_type: e.target.value })
                        }
                        className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
                      >
                        {deviceOptions.map((device) => (
                          <option key={device} value={device}>
                            {device}
                          </option>
                        ))}
                      </select>

                      <select
                        value={editForm.role}
                        onChange={(e) =>
                          setEditForm({ ...editForm, role: e.target.value })
                        }
                        className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
                      >
                        <option value="customer">customer</option>
                        <option value="admin">admin</option>
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

                      <input
                        value={editForm.portal_pin}
                        onChange={(e) =>
                          setEditForm({ ...editForm, portal_pin: e.target.value })
                        }
                        placeholder="PIN portal"
                        className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
                      />

                      <label className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-neutral-200">
                        <input
                          type="checkbox"
                          checked={Boolean(editForm.must_change_pin)}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              must_change_pin: e.target.checked,
                            })
                          }
                        />
                        Debe cambiar PIN
                      </label>
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
                        onClick={() => saveEdit(user)}
                        className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-bold text-black hover:bg-yellow-400"
                      >
                        Guardar
                      </button>

                      <button
                        onClick={cancelEdit}
                        className="rounded-xl bg-neutral-800 px-4 py-2 text-sm font-bold text-white hover:bg-neutral-700"
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