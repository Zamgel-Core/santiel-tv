const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/content_items?is_active=eq.true`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    const data = await response.json();

    // Separar por tipo
    const movies = data.filter((item) => item.type === "movie");
    const live = data.filter((item) => item.type === "live");
    const series = data.filter((item) => item.type === "episode");

    return {
      statusCode: 200,
      body: JSON.stringify({
        movies,
        live,
        series,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};