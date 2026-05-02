exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ status: "method_not_allowed" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const device_id = body.device_id;
    const key = body.key;

    if (!device_id || !key) {
      return {
        statusCode: 400,
        body: JSON.stringify({ status: "missing_data" }),
      };
    }

    const url =
      `${process.env.SUPABASE_URL}/rest/v1/users` +
      `?device_mac=eq.${encodeURIComponent(device_id)}` +
      `&device_key=eq.${encodeURIComponent(key)}` +
      `&select=*`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

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
        account_type: user.account_type || "customer",
        username: user.username || null,
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