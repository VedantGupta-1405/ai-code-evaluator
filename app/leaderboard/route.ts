export async function GET() {
  try {
    const res = await fetch(
      "https://enterally-unshedding-raelyn.ngrok-free.dev/webhook/leaderboard",
      { cache: "no-store" }
    );

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch" }), {
      status: 500,
    });
  }
}