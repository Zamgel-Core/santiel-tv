exports.handler = async (event) => {
  try {
    const { device_id, key } = JSON.parse(event.body);

    const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/users?device_mac=eq.${device_id}&device_key=eq.${key}`, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });

    const data = await res.json();

    if (!data || data.length === 0) {
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

    const now = new Date();
    const expiration = new Date(user.expiration_date);

    if (expiration < now) {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: "expired" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "active" }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: "error" }),
    };
  }
};