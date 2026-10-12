import { createClient } from "@supabase/supabase-js";

const PAGE_SIZE = 500;
const MAX_USERS = 5000;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  // Esta API solamente permite consultar clientes.
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      error: "Método no permitido",
    });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !anonKey || !serviceKey) {
    return res.status(500).json({
      error: "Configuración del servidor incompleta",
    });
  }

  // Obtener la sesión enviada por el navegador.
  const authorization = req.headers.authorization || "";

  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";

  if (!token) {
    return res.status(401).json({
      error: "Debes iniciar sesión",
    });
  }

  try {
    // Cliente con los permisos del usuario autenticado.
    const authClient = createClient(supabaseUrl, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // Comprobar que la sesión sea válida.
    const { data: authData, error: authError } =
      await authClient.auth.getUser(token);

    if (authError || !authData.user) {
      return res.status(401).json({
        error: "Sesión inválida o vencida",
      });
    }

    // Verificar los permisos administrativos.
    const { data: profile, error: profileError } =
      await authClient.rpc("portal_profile");

    if (profileError) {
      console.error("Error verificando administrador:", profileError.message);

      return res.status(403).json({
        error: "No se pudo verificar el acceso administrativo",
      });
    }

    if (profile?.is_admin !== true) {
      return res.status(403).json({
        error: "No tienes permisos de administrador",
      });
    }

    // La clave privada solamente se utiliza en el servidor.
    const adminClient = createClient(supabaseUrl, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Columnas autorizadas para el panel administrativo.
    // No se incluyen contraseñas ni PIN.
    const columns = [
      "id",
      "customer_name",
      "username",
      "phone",
      "role",
      "account_type",
      "status",
      "is_active",
      "is_trial",
      "plan",
      "plan_months",
      "expiration_date",
      "device_type",
      "device_mac",
      "device_key",
      "notes",
      "referral_code",
      "customer_code",
      "total_tickets",
      "created_at",
    ].join(",");

    const allUsers = [];

    // Obtener los clientes por lotes.
    for (let offset = 0; offset <= MAX_USERS; offset += PAGE_SIZE) {
      const { data, error } = await adminClient
        .from("users")
        .select(columns)
        .order("created_at", {
          ascending: false,
        })
        .order("id", {
          ascending: false,
        })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) {
        console.error("Error consultando clientes:", error.message);

        return res.status(500).json({
          error: "No se pudieron consultar los clientes",
        });
      }

      const batch = data || [];

      allUsers.push(...batch);

      // Terminamos cuando ya no hay más registros.
      if (batch.length < PAGE_SIZE) {
        break;
      }

      // Evitar respuestas excesivamente grandes.
      if (allUsers.length > MAX_USERS) {
        return res.status(413).json({
          error:
            "La cantidad de clientes supera el límite permitido para esta consulta.",
        });
      }
    }

    // Respuesta compatible con AdminPanel.tsx.
    return res.status(200).json({
      users: allUsers,
    });
  } catch (error) {
    console.error("Error interno en API administrativa:", error);

    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}
