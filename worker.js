export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Protected API endpoint for your speed-reading engine math
    if (url.pathname === '/api/read' && request.method === 'POST') {
      try {
        const body = await request.json();
        const words = (body.text || '').trim().split(/\s+/);
        return new Response(JSON.stringify({ success: true, words }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ success: false }), { status: 400 });
      }
    }

    // Serve your frontend interface for all other requests
    return env.ASSETS.fetch(request);
  }
};
