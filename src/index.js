const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders }
  });
}

function getUser(request) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  try { return JSON.parse(atob(token)); } catch { return null; }
}

function createToken(user) {
  return btoa(JSON.stringify({
    id: user.id, username: user.username, nama: user.nama,
    role: user.role, kelas: user.kelas, rombel: user.rombel
  }));
}

async function columns(env, table) {
  const r = await env.DB.prepare(`PRAGMA table_info(${table})`).all();
  return new Set((r.results || []).map(x => String(x.name).toLowerCase()));
}

function cleanRombel(value) {
  const raw = String(value ?? "").trim().toUpperCase().replace(/\s+/g, "");
  const map = {
    "1A":"IA","1B":"IB","2A":"IIA","2B":"IIB","3A":"IIIA","3B":"IIIB",
    "4A":"IVA","4B":"IVB","5":"V","6":"VI",
    "KELAS1A":"IA","KELAS1B":"IB","KELAS2A":"IIA","KELAS2B":"IIB",
    "KELAS3A":"IIIA","KELAS3B":"IIIB","KELAS4A":"IVA","KELAS4B":"IVB",
    "KELAS5":"V","KELAS6":"VI","KELASIA":"IA","KELASIB":"IB","KELASIIA":"IIA",
    "KELASIIB":"IIB","KELASIIIA":"IIIA","KELASIIIB":"IIIB","KELASIVA":"IVA",
    "KELASIVB":"IVB","KELASV":"V","KELASVI":"VI"
  };
  return map[raw] || raw;
}

function rombelVariants(value) {
  const r = cleanRombel(value);
  const map = {
    IA:["IA","1A","1 A","KELAS1A","KELAS 1 A","KELASIA"],
    IB:["IB","1B","1 B","KELAS1B","KELAS 1 B","KELASIB"],
    IIA:["IIA","2A","2 A","KELAS2A","KELAS 2 A","KELASIIA"],
    IIB:["IIB","2B","2 B","KELAS2B","KELAS 2 B","KELASIIB"],
    IIIA:["IIIA","3A","3 A","KELAS3A","KELAS 3 A","KELASIIIA"],
    IIIB:["IIIB","3B","3 B","KELAS3B","KELAS 3 B","KELASIIIB"],
    IVA:["IVA","4A","4 A","KELAS4A","KELAS 4 A","KELASIVA"],
    IVB:["IVB","4B","4 B","KELAS4B","KELAS 4 B","KELASIVB"],
    V:["V","5","KELAS5","KELAS 5","KELASV"],
    VI:["VI","6","KELAS6","KELAS 6","KELASVI"]
  };
  return [...new Set(map[r] || [r])];
}

function classFilter(requested, user) {
  const q = cleanRombel(requested || "");
  const own = cleanRombel(user?.rombel || user?.kelas || "");
  return { requested: q, own };
}

function rombelWhere(field, value) {
  const vals = rombelVariants(value);
  return { sql: `${field} IN (${vals.map(() => "?").join(",")})`, binds: vals };
}

async function queryByRombel(env, table, rombel, extraSql = "", binds = []) {
  const c = await columns(env, table);
  const field = c.has("rombel") ? "COALESCE(NULLIF(TRIM(rombel), ''), TRIM(kelas))" : "TRIM(kelas)";
  const rw = rombelWhere(field, rombel);
  const sql = `SELECT * FROM ${table} WHERE ${rw.sql} ${extraSql}`;
  return env.DB.prepare(sql).bind(...rw.binds, ...binds).all();
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    const url = new URL(request.url);

    try {
      if (url.pathname === "/api/health") {
        const [uc, sc] = await Promise.all([columns(env, "users"), columns(env, "siswa")]);
        return json({
          ok: true,
          aplikasi: "SI-NILAI SD V8",
          backend: "Cloudflare Worker + D1",
          rombel: {
            users: uc.has("rombel"),
            siswa: sc.has("rombel")
          },
          catatan: "Worker membaca kolom rombel jika tersedia; jika belum ada, memakai nilai kolom kelas tanpa mengubah data D1."
        });
      }

      // LOGIN: membaca rombel jika kolom rombel tersedia, tanpa mengubah data lama.
      if (url.pathname === "/api/login" && request.method === "POST") {
        const body = await request.json();
        const username = String(body.username || "").trim();
        const password = String(body.password || "");

        const c = await columns(env, "users");
        const rombelExpr = c.has("rombel")
          ? "COALESCE(NULLIF(TRIM(rombel), ''), TRIM(kelas)) AS rombel"
          : "TRIM(kelas) AS rombel";

        const user = await env.DB.prepare(
          `SELECT id, username, password, nama, role, kelas, ${rombelExpr}
           FROM users WHERE username = ?`
        ).bind(username).first();

        if (!user || user.password !== password) {
          return json({ ok: false, message: "Username atau password salah." }, 401);
        }

        const safeUser = {
          id: user.id, username: user.username, nama: user.nama,
          role: user.role, kelas: cleanRombel(user.rombel || user.kelas),
          rombel: cleanRombel(user.rombel || user.kelas)
        };

        return json({ ok: true, token: createToken(safeUser), user: safeUser });
      }

      const user = getUser(request);
      if (!user) return json({ ok: false, message: "Belum login." }, 401);

      // DATA SISWA
      if (url.pathname === "/api/siswa" && request.method === "GET") {
        const { requested, own } = classFilter(url.searchParams.get("rombel") || url.searchParams.get("kelas"), user);

        if (user.role !== "admin" && requested && requested !== own) {
          return json({ ok: false, message: "Akses rombel ditolak." }, 403);
        }

        const c = await columns(env, "siswa");
        const classField = c.has("rombel") && c.has("kelas")
          ? "COALESCE(NULLIF(TRIM(rombel), ''), TRIM(kelas))"
          : c.has("rombel") ? "TRIM(rombel)"
          : c.has("kelas") ? "TRIM(kelas)"
          : "''";
        const nameField = c.has("nama") ? "nama"
          : c.has("name") ? "name"
          : c.has("nama_siswa") ? "nama_siswa"
          : c.has("nama_lengkap") ? "nama_lengkap"
          : null;
        const orderSql = nameField ? ` ORDER BY ${nameField}` : "";

        let result;
        if (requested) {
          const rw = rombelWhere(classField, requested);
          result = await env.DB.prepare(`SELECT * FROM siswa WHERE ${rw.sql}${orderSql}`).bind(...rw.binds).all();
        } else if (user.role === "admin") {
          result = await env.DB.prepare(`SELECT * FROM siswa${orderSql}`).all();
        } else {
          const rw = rombelWhere(classField, own);
          result = await env.DB.prepare(`SELECT * FROM siswa WHERE ${rw.sql}${orderSql}`).bind(...rw.binds).all();
        }

        return json({ ok: true, rombel: requested || own, data: result.results });
      }

      // DATA GURU / USERS
      if (url.pathname === "/api/guru" && request.method === "GET") {
        if (user.role !== "admin") return json({ ok: false, message: "Khusus administrator." }, 403);

        const c = await columns(env, "users");
        const rombelExpr = c.has("rombel")
          ? "COALESCE(NULLIF(TRIM(rombel), ''), TRIM(kelas)) AS rombel"
          : "TRIM(kelas) AS rombel";

        const result = await env.DB.prepare(
          `SELECT id, username, nama, role, kelas, ${rombelExpr}
           FROM users ORDER BY role, rombel, nama`
        ).all();

        return json({ ok: true, data: result.results });
      }

      // NILAI
      if (url.pathname === "/api/nilai" && request.method === "GET") {
        const { requested, own } = classFilter(url.searchParams.get("rombel") || url.searchParams.get("kelas"), user);
        const mapel = url.searchParams.get("mapel") || "";
        const semester = Number(url.searchParams.get("semester") || 1);

        if (user.role !== "admin" && requested && requested !== own) {
          return json({ ok: false, message: "Akses rombel ditolak." }, 403);
        }

        const c = await columns(env, "nilai");
        const field = c.has("rombel") ? "COALESCE(NULLIF(TRIM(rombel), ''), TRIM(kelas))" : "TRIM(kelas)";
        const rw = rombelWhere(field, requested || own); let sql = `SELECT * FROM nilai WHERE ${rw.sql} AND semester = ?`;
        const binds = [...rw.binds, semester];
        if (mapel) { sql += ` AND mapel = ?`; binds.push(mapel); }
        sql += ` ORDER BY siswa_id`;

        let result;
        if (user.role === "admin" && !requested) {
          let q = `SELECT * FROM nilai WHERE semester = ?`;
          const b = [semester];
          if (mapel) { q += ` AND mapel = ?`; b.push(mapel); }
          q += ` ORDER BY siswa_id`;
          result = await env.DB.prepare(q).bind(...b).all();
        } else {
          result = await env.DB.prepare(sql).bind(...binds).all();
        }

        return json({ ok: true, data: result.results });
      }

      // PERANGKAT PEMBELAJARAN
      if (url.pathname === "/api/perangkat" && request.method === "GET") {
        const { requested, own } = classFilter(url.searchParams.get("rombel") || url.searchParams.get("kelas"), user);
        const jenis = url.searchParams.get("jenis") || "";
        const mapel = url.searchParams.get("mapel") || "";

        if (user.role !== "admin" && requested && requested !== own) {
          return json({ ok: false, message: "Akses rombel ditolak." }, 403);
        }

        const c = await columns(env, "perangkat");
        const field = c.has("rombel") ? "COALESCE(NULLIF(TRIM(rombel), ''), TRIM(kelas))" : "TRIM(kelas)";

        if (user.role === "admin" && !requested) {
          let sql = "SELECT * FROM perangkat";
          const binds = [];
          const wh = [];
          if (jenis) { wh.push("jenis = ?"); binds.push(jenis); }
          if (mapel) { wh.push("mapel = ?"); binds.push(mapel); }
          if (wh.length) sql += " WHERE " + wh.join(" AND ");
          sql += " ORDER BY jenis, mapel, id";
          const result = await env.DB.prepare(sql).bind(...binds).all();
          return json({ ok: true, data: result.results });
        }

        const rw = rombelWhere(field, requested || own); let sql = `SELECT * FROM perangkat WHERE ${rw.sql}`;
        const binds = [...rw.binds];
        if (jenis) { sql += " AND jenis = ?"; binds.push(jenis); }
        if (mapel) { sql += " AND mapel = ?"; binds.push(mapel); }
        sql += " ORDER BY jenis, mapel, id";

        const result = await env.DB.prepare(sql).bind(...binds).all();
        return json({ ok: true, data: result.results });
      }

      // RPM
      if (url.pathname === "/api/rpm" && request.method === "GET") {
        const { requested, own } = classFilter(url.searchParams.get("rombel") || url.searchParams.get("kelas"), user);
        const mapel = url.searchParams.get("mapel") || "";

        if (user.role !== "admin" && requested && requested !== own) {
          return json({ ok: false, message: "Akses rombel ditolak." }, 403);
        }

        const c = await columns(env, "rpm");
        const field = c.has("rombel") ? "COALESCE(NULLIF(TRIM(rombel), ''), TRIM(kelas))" : "TRIM(kelas)";

        if (user.role === "admin" && !requested) {
          let sql = "SELECT * FROM rpm";
          const binds = [];
          if (mapel) { sql += " WHERE mapel = ?"; binds.push(mapel); }
          sql += " ORDER BY mapel, id";
          const result = await env.DB.prepare(sql).bind(...binds).all();
          return json({ ok: true, data: result.results });
        }

        const rw = rombelWhere(field, requested || own); let sql = `SELECT * FROM rpm WHERE ${rw.sql}`;
        const binds = [...rw.binds];
        if (mapel) { sql += " AND mapel = ?"; binds.push(mapel); }
        sql += " ORDER BY mapel, id";
        const result = await env.DB.prepare(sql).bind(...binds).all();

        return json({ ok: true, data: result.results });
      }

      return json({ ok: false, message: "Endpoint tidak ditemukan." }, 404);
    } catch (error) {
      return json({ ok: false, message: error.message }, 500);
    }
  }
};
