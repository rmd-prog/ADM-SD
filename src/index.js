const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}

function getUser(request) {
  const token = request.headers
    .get("Authorization")
    ?.replace("Bearer ", "");

  if (!token) return null;

  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
}

function createToken(user) {
  return btoa(JSON.stringify({
    id: user.id,
    username: user.username,
    nama: user.nama,
    role: user.role,
    kelas: user.kelas
  }));
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    const url = new URL(request.url);

    try {

      // TEST SERVER
      if (url.pathname === "/api/health") {
        return json({
          ok: true,
          aplikasi: "SI-NILAI SD V8",
          backend: "Cloudflare Worker + D1"
        });
      }

      // LOGIN
      if (url.pathname === "/api/login" && request.method === "POST") {
        const body = await request.json();

        const username = String(body.username || "").trim();
        const password = String(body.password || "");

        const user = await env.DB.prepare(
          `SELECT id, username, password, nama, role, kelas
           FROM users
           WHERE username = ?`
        )
        .bind(username)
        .first();

        if (!user || user.password !== password) {
          return json({
            ok: false,
            message: "Username atau password salah."
          }, 401);
        }

        const safeUser = {
          id: user.id,
          username: user.username,
          nama: user.nama,
          role: user.role,
          kelas: user.kelas
        };

        return json({
          ok: true,
          token: createToken(safeUser),
          user: safeUser
        });
      }

      // CEK LOGIN
      const user = getUser(request);

      if (!user) {
        return json({
          ok: false,
          message: "Belum login."
        }, 401);
      }

      // DATA SISWA
      if (
        url.pathname === "/api/siswa" &&
        request.method === "GET"
      ) {
        const kelas = Number(
          url.searchParams.get("kelas") || user.kelas
        );

        if (
          user.role !== "admin" &&
          kelas !== Number(user.kelas)
        ) {
          return json({
            ok: false,
            message: "Akses kelas ditolak."
          }, 403);
        }

        const result = await env.DB.prepare(
          `SELECT *
           FROM siswa
           WHERE kelas = ?
           ORDER BY nama`
        )
        .bind(kelas)
        .all();

        return json({
          ok: true,
          kelas,
          data: result.results
        });
      }

      // DATA GURU
      if (
        url.pathname === "/api/guru" &&
        request.method === "GET"
      ) {
        if (user.role !== "admin") {
          return json({
            ok: false,
            message: "Khusus administrator."
          }, 403);
        }

        const result = await env.DB.prepare(
          `SELECT id, username, nama, role, kelas
           FROM users
           ORDER BY role, kelas, nama`
        ).all();

        return json({
          ok: true,
          data: result.results
        });
      }

      // NILAI
      if (
        url.pathname === "/api/nilai" &&
        request.method === "GET"
      ) {
        const kelas = Number(
          url.searchParams.get("kelas") || user.kelas
        );

        const mapel =
          url.searchParams.get("mapel") || "";

        const semester = Number(
          url.searchParams.get("semester") || 1
        );

        if (
          user.role !== "admin" &&
          kelas !== Number(user.kelas)
        ) {
          return json({
            ok: false,
            message: "Akses kelas ditolak."
          }, 403);
        }

        let result;

        if (mapel) {
          result = await env.DB.prepare(
            `SELECT *
             FROM nilai
             WHERE kelas = ?
             AND mapel = ?
             AND semester = ?
             ORDER BY siswa_id`
          )
          .bind(kelas, mapel, semester)
          .all();
        } else {
          result = await env.DB.prepare(
            `SELECT *
             FROM nilai
             WHERE kelas = ?
             AND semester = ?
             ORDER BY siswa_id`
          )
          .bind(kelas, semester)
          .all();
        }

        return json({
          ok: true,
          data: result.results
        });
      }

      // PERANGKAT PEMBELAJARAN
      if (
        url.pathname === "/api/perangkat" &&
        request.method === "GET"
      ) {
        const kelas = Number(
          url.searchParams.get("kelas") || user.kelas
        );

        if (
          user.role !== "admin" &&
          kelas !== Number(user.kelas)
        ) {
          return json({
            ok: false,
            message: "Akses kelas ditolak."
          }, 403);
        }

        const jenis =
          url.searchParams.get("jenis") || "";

        const mapel =
          url.searchParams.get("mapel") || "";

        let result;

        if (jenis && mapel) {
          result = await env.DB.prepare(
            `SELECT *
             FROM perangkat
             WHERE kelas = ?
             AND jenis = ?
             AND mapel = ?
             ORDER BY id`
          )
          .bind(kelas, jenis, mapel)
          .all();
        } else {
          result = await env.DB.prepare(
            `SELECT *
             FROM perangkat
             WHERE kelas = ?
             ORDER BY jenis, mapel, id`
          )
          .bind(kelas)
          .all();
        }

        return json({
          ok: true,
          data: result.results
        });
      }

      // RPM
      if (
        url.pathname === "/api/rpm" &&
        request.method === "GET"
      ) {
        const kelas = Number(
          url.searchParams.get("kelas") || user.kelas
        );

        if (
          user.role !== "admin" &&
          kelas !== Number(user.kelas)
        ) {
          return json({
            ok: false,
            message: "Akses kelas ditolak."
          }, 403);
        }

        const mapel =
          url.searchParams.get("mapel") || "";

        let result;

        if (mapel) {
          result = await env.DB.prepare(
            `SELECT *
             FROM rpm
             WHERE kelas = ?
             AND mapel = ?
             ORDER BY id`
          )
          .bind(kelas, mapel)
          .all();
        } else {
          result = await env.DB.prepare(
            `SELECT *
             FROM rpm
             WHERE kelas = ?
             ORDER BY mapel, id`
          )
          .bind(kelas)
          .all();
        }

        return json({
          ok: true,
          data: result.results
        });
      }

      return json({
        ok: false,
        message: "Endpoint tidak ditemukan."
      }, 404);

    } catch (error) {
      return json({
        ok: false,
        message: error.message
      }, 500);
    }
  }
};
