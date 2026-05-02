exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ status: "method_not_allowed" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const { device_id, key } = body;

    if (!device_id || !key) {
      return {
        statusCode: 400,
        body: JSON.stringify({ status: "missing_data" }),
      };
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ status: "missing_env_vars" }),
      };
    }

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/users?device_mac=eq.${encodeURIComponent(device_id)}&device_key=eq.${encodeURIComponent(key)}&select=*`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          status: "supabase_error",
          message: data.message || data.error || "Error consultando Supabase",
        }),
      };
    }

    if (!Array.isArray(data) || data.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: "not_found" }),
      };
    }

    const user = data[0];

    if (!user.is_active || user.status === "blocked") {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: "blocked" }),
      };
    }

    if (user.expiration_date) {
      const now = new Date();
      const expiration = new Date(user.expiration_date);

      if (expiration < now) {
        return {
          statusCode: 200,
          body: JSON.stringify({ status: "expired" }),
        };
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "active",
        username: user.username,
        account_type: user.account_type,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: "error",
        message: err.message,
      }),
    };
  }
};