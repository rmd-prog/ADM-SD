export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({
        status: "ok",
        aplikasi: "SI-NILAI SD V8",
        backend: "Cloudflare Worker"
      });
    }

    return new Response("SI-NILAI SD V8 Backend Aktif");
  }
};
