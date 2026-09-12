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

const JWT_ALG = "HS256";
const JWT_TYP = "JWT";
const JWT_TTL_SECONDS = 60 * 60 * 8;

function base64urlEncode(input) {
  const bytes = input instanceof Uint8Array ? input : new TextEncoder().encode(String(input));
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64urlDecode(str) {
  const pad = str.length % 4 ? "=".repeat(4 - (str.length % 4)) : "";
  const binary = atob(str.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function jwtKey(secret) {
  return crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

async function getUser(request, env) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token || !env.JWT_SECRET) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const [h, p, sig] = parts;
    const header = JSON.parse(new TextDecoder().decode(base64urlDecode(h)));
    const payload = JSON.parse(new TextDecoder().decode(base64urlDecode(p)));
    if (header.alg !== JWT_ALG || header.typ !== JWT_TYP) return null;
    const exp = Number(payload.exp);
    if (!Number.isFinite(exp) || exp <= Math.floor(Date.now() / 1000)) return null;
    const ok = await crypto.subtle.verify("HMAC", await jwtKey(env.JWT_SECRET), base64urlDecode(sig), new TextEncoder().encode(`${h}.${p}`));
    return ok ? payload : null;
  } catch { return null; }
}

async function createToken(user, secret) {
  const now = Math.floor(Date.now() / 1000);
  const h = base64urlEncode(JSON.stringify({ alg: JWT_ALG, typ: JWT_TYP }));
  const p = base64urlEncode(JSON.stringify({ id:user.id, username:user.username, nama:user.nama, role:user.role, kelas:user.kelas, rombel:user.rombel, mapel:user.mapel || "", iat:now, exp:now + JWT_TTL_SECONDS }));
  const data = `${h}.${p}`;
  const sig = await crypto.subtle.sign("HMAC", await jwtKey(secret), new TextEncoder().encode(data));
  return `${data}.${base64urlEncode(new Uint8Array(sig))}`;
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

function normalizeMapel(value) {
  const raw = String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  if (["agama", "pai", "pendidikan agama", "pendidikan agama dan budi pekerti"].includes(raw)) return "Pendidikan Agama dan Budi Pekerti";
  if (["pjok", "pendidikan jasmani", "pendidikan jasmani olahraga dan kesehatan"].includes(raw)) return "PJOK";
  if (["inggris", "bahasa inggris", "english"].includes(raw)) return "Bahasa Inggris";
  return String(value ?? "").trim();
}

function isGuruMapelAll(user) {
  return user?.role === "guru_mapel" && cleanRombel(user?.rombel || user?.kelas) === "ALL";
}

function canAccessRombel(user, requested) {
  if (!user || user.role === "admin") return true;
  if (isGuruMapelAll(user)) return true;
  return cleanRombel(requested) === cleanRombel(user.rombel || user.kelas);
}

function subjectAllowed(user, requestedMapel) {
  if (!user || user.role === "admin") return true;
  if (user.role !== "guru_mapel") return true;
  const own = normalizeMapel(user.mapel);
  const requested = normalizeMapel(requestedMapel);
  return !!own && !!requested && own === requested;
}


function extractRequestedMapel(body, url) {
  if (body && typeof body === "object") {
    for (const k of ["mapel","mata_pelajaran","mataPelajaran","subject"]) {
      if (body[k] != null && String(body[k]).trim()) return body[k];
    }
  }
  for (const k of ["mapel","mata_pelajaran","mataPelajaran","subject"]) {
    const v = url.searchParams.get(k);
    if (v != null && String(v).trim()) return v;
  }
  return "";
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

// Mengubah nilai kelas/rombel CSV menjadi format D1 yang benar.
// Contoh: "1 A" -> kelas 1, rombel IA; "2 B" -> kelas 2, rombel IIB; "5" -> kelas 5, rombel V.
function normalizeClass(value) {
  const raw = String(value ?? "").trim().toUpperCase();
  const compact = raw.replace(/\s+/g, "");
  const m = compact.match(/^([1-6])([AB])?$/);
  if (!m) return null;
  const kelas = Number(m[1]);
  const rombel = m[2] ? `${m[1]}${m[2]}` : m[1];
  return { kelas, rombel: cleanRombel(rombel) };
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
          rombel: { users: uc.has("rombel"), siswa: sc.has("rombel") },
          catatan: "Worker membaca kolom rombel jika tersedia; jika belum ada, memakai nilai kolom kelas tanpa mengubah data D1."
        });
      }

      if (url.pathname === "/api/login" && request.method === "POST") {
        const body = await request.json();
        const username = String(body.username || "").trim();
        const password = String(body.password || "");
        let c = await columns(env, "users");
        if (!c.has("mapel")) {
          try { await env.DB.prepare("ALTER TABLE users ADD COLUMN mapel TEXT").run(); } catch {}
          c = await columns(env, "users");
        }
        const rombelExpr = c.has("rombel")
          ? "COALESCE(NULLIF(TRIM(rombel), ''), TRIM(kelas)) AS rombel"
          : "TRIM(kelas) AS rombel";
        const mapelExpr = c.has("mapel") ? "TRIM(COALESCE(mapel, '')) AS mapel" : "'' AS mapel";
        const loginWhere = c.has("nip") ? "WHERE username = ? OR nip = ?" : "WHERE username = ?";
        const loginStmt = env.DB.prepare(
          `SELECT id, username, password, nama, role, kelas, ${rombelExpr}, ${mapelExpr}
           FROM users ${loginWhere}`
        );
        const user = c.has("nip")
          ? await loginStmt.bind(username, username).first()
          : await loginStmt.bind(username).first();
        if (!user || user.password !== password) {
          return json({ ok: false, message: "Username atau password salah." }, 401);
        }
        const safeUser = {
          id: user.id, username: user.username, nama: user.nama,
          role: user.role, kelas: cleanRombel(user.rombel || user.kelas),
          rombel: cleanRombel(user.rombel || user.kelas),
          mapel: normalizeMapel(user.mapel || "")
        };
        if (!env.JWT_SECRET) return json({ ok: false, message: "JWT_SECRET belum dikonfigurasi di Worker." }, 500);
        return json({ ok: true, token: await createToken(safeUser, env.JWT_SECRET), user: safeUser });
      }

      const user = await getUser(request, env);
      if (!user) return json({ ok: false, message: "Belum login." }, 401);


      // GURU MAPEL: all rombel for students/attendance, own subject for all other menus.
      if (user.role === "guru_mapel" && url.pathname !== "/api/siswa" && url.pathname !== "/api/absensi") {
        let body = null;
        if (!["GET","HEAD"].includes(request.method)) {
          try { body = await request.clone().json(); } catch {}
        }
        const requestedMapel = extractRequestedMapel(body, url) || user.mapel || "";
        if (!subjectAllowed(user, requestedMapel)) {
          return json({ ok:false, message:`Akses ditolak. Akun Guru Mapel hanya dapat mengakses mapel ${normalizeMapel(user.mapel)}.` },403);
        }
      }

      // DATA GURU MAPEL - UPDATE
      if (url.pathname.startsWith("/api/guru/") && request.method === "PUT") {
        if (user.role !== "admin") return json({ ok:false, message:"Hanya administrator yang dapat mengubah data guru." },403);
        const gid = url.pathname.split("/").pop();
        if (!/^\d+$/.test(gid)) return json({ ok:false, message:"ID guru tidak valid." },400);
        const existing = await env.DB.prepare("SELECT * FROM users WHERE id=?").bind(Number(gid)).first();
        if (!existing) return json({ ok:false, message:"Data guru tidak ditemukan." },404);
        if (existing.role !== "guru_mapel") return json({ ok:false, message:"Hanya akun Guru Mapel yang dapat diedit dari menu ini." },400);
        const body = await request.json();
        const nama = String(body.nama ?? existing.nama ?? "").trim();
        const username = String(body.username ?? existing.username ?? "").trim();
        const password = String(body.password ?? "");
        const mapel = normalizeMapel(body.mapel ?? existing.mapel ?? "");
        const rombel = cleanRombel(body.rombel ?? existing.rombel ?? existing.kelas ?? "ALL") || "ALL";
        if (!nama || !username || !mapel) return json({ ok:false, message:"Nama, username, dan mapel wajib diisi." },400);
        if (!["Pendidikan Agama dan Budi Pekerti","PJOK","Bahasa Inggris"].includes(mapel)) return json({ ok:false, message:"Mata pelajaran Guru Mapel tidak valid." },400);
        const dup = await env.DB.prepare("SELECT id FROM users WHERE username=? AND id<>?").bind(username,Number(gid)).first();
        if (dup) return json({ ok:false, message:"Username sudah digunakan guru lain." },409);
        const c = await columns(env,"users");
        const sets=["nama=?","username=?","mapel=?","role=?"]; const vals=[nama,username,mapel,"guru_mapel"];
        if(c.has("rombel")){sets.push("rombel=?");vals.push(rombel);} else {sets.push("kelas=?");vals.push(rombel);}
        if(password) { sets.push("password=?"); vals.push(password); }
        vals.push(Number(gid));
        await env.DB.prepare(`UPDATE users SET ${sets.join(",")} WHERE id=?`).bind(...vals).run();
        const r = await env.DB.prepare("SELECT id,username,nama,role,kelas,rombel,mapel FROM users WHERE id=?").bind(Number(gid)).first();
        return json({ ok:true, data:r, message:"Data Guru Mapel berhasil diperbarui." });
      }

      // DATA SISWA - GET
      if (url.pathname === "/api/siswa" && request.method === "GET") {
        const { requested, own } = classFilter(url.searchParams.get("rombel") || url.searchParams.get("kelas"), user);
        if (user.role !== "admin" && requested && !canAccessRombel(user, requested)) {
          return json({ ok: false, message: "Akses rombel ditolak." }, 403);
        }
        const c = await columns(env, "siswa");
        const field = c.has("rombel") ? "COALESCE(NULLIF(TRIM(rombel), ''), TRIM(kelas))" : "TRIM(kelas)";
        let result;
        if (requested) {
          if (isGuruMapelAll(user) && requested === "ALL") {
            result = await env.DB.prepare(`SELECT * FROM siswa ORDER BY nama`).all();
          } else {
            const rw = rombelWhere(field, requested);
            result = await env.DB.prepare(`SELECT * FROM siswa WHERE ${rw.sql} ORDER BY nama`).bind(...rw.binds).all();
          }
        } else if (user.role === "admin") {
          result = await env.DB.prepare(`SELECT * FROM siswa ORDER BY nama`).all();
        } else {
          const rw = rombelWhere(field, own);
          result = await env.DB.prepare(`SELECT * FROM siswa WHERE ${rw.sql} ORDER BY nama`).bind(...rw.binds).all();
        }
        return json({ ok: true, rombel: requested || own, data: result.results });
      }

      // DATA SISWA - CREATE / UPDATE / DELETE
      if (url.pathname === "/api/siswa" && request.method === "POST") {
        const body = await request.json();
        const nama = String(body.nama ?? body.name ?? "").trim();
        const nis = String(body.nis ?? "").trim();
        const absen = String(body.absen ?? "").trim();
        const classInfo = normalizeClass(body.rombel ?? body.kelas ?? ((user.role === "guru" || user.role === "guru_mapel") ? user.rombel : ""));
        if (!nama || !classInfo) return json({ ok:false, message:"Nama dan rombel wajib diisi dengan benar." },400);
        if (user.role !== "admin" && cleanRombel(classInfo.rombel) !== cleanRombel(user.rombel || user.kelas)) return json({ok:false,message:"Akses rombel ditolak."},403);
        const c=await columns(env,"siswa");
        const cols=["nama","nis","kelas"]; const vals=[nama,nis,classInfo.kelas];
        if(c.has("nisn")){cols.push("nisn");vals.push(String(body.nisn??""));}
        if(c.has("rombel")){cols.push("rombel");vals.push(classInfo.rombel);}
        if(c.has("absen")){cols.push("absen");vals.push(absen);}
        const r=await env.DB.prepare(`INSERT INTO siswa (${cols.join(",")}) VALUES (${cols.map(()=>"?").join(",")}) RETURNING *`).bind(...vals).first();
        return json({ok:true,data:r});
      }

      if (url.pathname.startsWith("/api/siswa/") && ["PUT","DELETE"].includes(request.method)) {
        const sid=url.pathname.split("/").pop();
        if(!/^\d+$/.test(sid)) return json({ok:false,message:"ID siswa tidak valid."},400);
        const existing=await env.DB.prepare("SELECT * FROM siswa WHERE id=?").bind(Number(sid)).first();
        if(!existing) return json({ok:false,message:"Siswa tidak ditemukan."},404);
        const own=cleanRombel(user.rombel||user.kelas); const er=cleanRombel(existing.rombel||existing.kelas);
        if(user.role!=="admin"&&er!==own)return json({ok:false,message:"Akses rombel ditolak."},403);
        if(request.method==="DELETE"){await env.DB.prepare("DELETE FROM siswa WHERE id=?").bind(Number(sid)).run();return json({ok:true,message:"Siswa dihapus."});}
        const body=await request.json(); const nama=String(body.nama??body.name??existing.nama).trim(); const nis=String(body.nis??existing.nis??"").trim(); const ci=normalizeClass(body.rombel??body.kelas??existing.rombel??existing.kelas);
        if(!nama||!ci)return json({ok:false,message:"Nama dan rombel tidak valid."},400);
        if(user.role!=="admin"&&cleanRombel(ci.rombel)!==own)return json({ok:false,message:"Akses rombel ditolak."},403);
        const c=await columns(env,"siswa"); const sets=["nama=?","nis=?","kelas=?"]; const vals=[nama,nis,ci.kelas];
        if(c.has("nisn")){sets.push("nisn=?");vals.push(String(body.nisn??existing.nisn??""));}
        if(c.has("rombel")){sets.push("rombel=?");vals.push(ci.rombel);}
        if(c.has("absen")){sets.push("absen=?");vals.push(String(body.absen??existing.absen??""));}
        vals.push(Number(sid)); await env.DB.prepare(`UPDATE siswa SET ${sets.join(",")} WHERE id=?`).bind(...vals).run();
        const r=await env.DB.prepare("SELECT * FROM siswa WHERE id=?").bind(Number(sid)).first(); return json({ok:true,data:r});
      }

      // IMPORT SISWA - POST
      // Endpoint ini dipanggil langsung oleh index.html: POST /api/siswa/import
      if (url.pathname === "/api/siswa/import" && request.method === "POST") {
        if (user.role !== "admin") {
          return json({ ok: false, message: "Import data siswa hanya dapat dilakukan administrator." }, 403);
        }

        const body = await request.json();
        const items = Array.isArray(body.items) ? body.items : [];
        const replace = body.replace !== false;

        if (!items.length) {
          return json({ ok: false, message: "Data siswa kosong." }, 400);
        }

        const c = await columns(env, "siswa");
        const has = name => c.has(name);
        if (!has("nama") || !has("kelas")) {
          return json({ ok: false, message: "Struktur tabel siswa tidak memiliki kolom nama/kelas." }, 500);
        }

        const rows = [];
        const errors = [];
        for (let i = 0; i < items.length; i++) {
          const x = items[i] || {};
          const nama = String(x.nama ?? x.name ?? "").trim();
          const nis = String(x.nis ?? "").trim();
          const nisn = String(x.nisn ?? "").trim();
          const classInfo = normalizeClass(x.rombel ?? x.kelas ?? "");

          if (!nama) {
            errors.push(`Baris ${i + 1}: nama kosong`);
            continue;
          }
          if (!classInfo) {
            errors.push(`Baris ${i + 1} (${nama}): kelas tidak valid "${String(x.rombel ?? x.kelas ?? "")}"`);
            continue;
          }

          const row = { nama, nis, nisn, kelas: classInfo.kelas, rombel: classInfo.rombel };
          rows.push(row);
        }

        if (!rows.length) {
          return json({ ok: false, message: "Tidak ada baris yang valid.", errors }, 400);
        }

        // Ganti seluruh data lama hanya jika replace=true.
        if (replace) await env.DB.prepare("DELETE FROM siswa").run();

        // Hanya memakai kolom yang benar-benar ada di tabel D1.
        const cols = ["nama", "nis", "kelas"];
        if (has("nisn")) cols.splice(2, 0, "nisn");
        if (has("rombel")) cols.push("rombel");
        const placeholders = cols.map(() => "?").join(",");
        const sql = `INSERT INTO siswa (${cols.join(",")}) VALUES (${placeholders})`;

        const statements = rows.map(r => {
          const vals = cols.map(col => r[col] ?? "");
          return env.DB.prepare(sql).bind(...vals);
        });

        // D1 batch aman untuk ratusan baris; pecah per 50 agar payload tidak terlalu besar.
        for (let i = 0; i < statements.length; i += 50) {
          await env.DB.batch(statements.slice(i, i + 50));
        }

        return json({
          ok: true,
          message: `Import berhasil: ${rows.length} siswa tersimpan di D1.`,
          inserted: rows.length,
          skipped: errors.length,
          errors: errors.slice(0, 20)
        });
      }

      // AI DIAGNOSTIC — tidak pernah mengembalikan isi secret
      if (url.pathname === "/api/ai/status" && request.method === "GET") {
        const hasKey = typeof env.OPENAI_API_KEY === "string" && env.OPENAI_API_KEY.trim().length > 0;
        const model = String(env.OPENAI_MODEL || "gpt-5.6-luna");
        return json({ ok:true, openaiKeyBound:hasKey, model });
      }

      // AI GURU TERPUSAT — perangkat, bahan ajar, asesmen, dan administrasi guru
      if (url.pathname === "/api/ai/generate" && request.method === "POST") {
        const user = await getUser(request, env);
        if (!user) return json({ ok:false, message:"Sesi login tidak valid." }, 401);
        const body = await request.json();
        const jenis = String(body.jenis || "").toLowerCase().trim();
        const allowed = [
          "cp","tp","atp","prota","prosem","rpm",
          "lkpd","modul_ajar","bahan_ajar","materi","ringkasan","ide_aktivitas",
          "soal_sumatif","soal_formatif","kisi_kisi","rubrik","kunci_jawaban","pedoman_skor",
          "jurnal","refleksi","remedial","pengayaan","deskripsi_hasil"
        ];
        if (!allowed.includes(jenis)) return json({ ok:false, message:"Jenis AI Guru tidak valid." }, 400);
        const requested = cleanRombel(body.rombel || body.kelas || "");
        const own = cleanRombel(user.rombel || user.kelas || "");
        if (user.role !== "admin" && requested && !canAccessRombel(user, requested)) return json({ ok:false, message:"Akses rombel ditolak." }, 403);
        const openaiKey = typeof env.OPENAI_API_KEY === "string" ? env.OPENAI_API_KEY.trim() : "";
        if (!openaiKey) return json({ok:false,code:"OPENAI_KEY_NOT_BOUND",message:"Worker aktif tidak menerima secret OPENAI_API_KEY. Pastikan secret dipasang pada Worker/environment yang sedang dideploy, lalu Deploy ulang Worker."},503);

        const mapel = String(body.mapel || "").trim();
        if (!subjectAllowed(user, mapel)) {
          return json({ ok:false, message:"Akses mata pelajaran ditolak." }, 403);
        }
        const context = String(body.context || "").trim().slice(0,10000);
        const tahun = String(body.tahun || "2026/2027").trim();
        const fase = String(body.fase || "").trim();
        const bab = String(body.bab || "").trim();
        const bookReference = body.bookReference && typeof body.bookReference === "object" ? body.bookReference : null;
        const bookLock = body.bookLock === true;
        const bookTitle = String(bookReference?.title || "").trim();
        const bookSource = String(bookReference?.source || "").trim();
        const bookYear = String(bookReference?.year || "").trim();
        const bookBab = String(bookReference?.bab || "").trim();
        const bookChapters = Array.isArray(bookReference?.chapters) ? bookReference.chapters.map(x => String(x).trim()).filter(Boolean).slice(0,50) : [];
        const bookContext = bookLock && bookTitle ? `\n\nSUMBER BUKU TERKUNCI:\n- Judul buku: ${bookTitle}\n- Sumber: ${bookSource || "SIBI"}\n- Tahun/Edisi: ${bookYear || "sesuai metadata"}\n${bookBab ? `- BAB/UNIT TERPILIH: ${bookBab}\n` : ""}${bookChapters.length ? `- DAFTAR BAB/UNIT YANG TERVERIFIKASI: ${bookChapters.join(" | ")}\n` : ""}ATURAN WAJIB SUMBER BUKU:\n1. Jangan mengganti, menerjemahkan, memendekkan, atau mengarang judul buku.\n2. Jika BAB/UNIT terpilih diberikan, gunakan tepat BAB/UNIT tersebut.\n3. Jika daftar BAB diberikan, jangan membuat BAB di luar daftar.\n4. Jangan mengklaim isi BAB yang belum terverifikasi.\n5. Jika informasi buku tidak cukup, tulis “struktur buku belum terverifikasi” daripada mengarang.` : "";
        const jumlahSoal = Math.min(100, Math.max(1, Number(body.jumlahSoal || 10)));
        const bentukSoal = String(body.bentukSoal || "campuran");
        const tingkatKesulitan = String(body.tingkatKesulitan || "sedang");
        const sertakanKunci = body.sertakanKunci !== false;
        const tujuan = String(body.tujuan || "").trim();
        const durasi = String(body.durasi || "").trim();
        const aktivitas = String(body.aktivitas || "").trim();
        const model = String(env.OPENAI_MODEL || "gpt-5.6-luna");
        const names = {
          cp:"Capaian Pembelajaran (CP)",tp:"Tujuan Pembelajaran (TP)",atp:"Alur Tujuan Pembelajaran (ATP)",prota:"Program Tahunan (Prota)",prosem:"Program Semester (Prosem)",rpm:"Rencana Pembelajaran Mendalam (RPM)",
          lkpd:"LKPD (Lembar Kerja Peserta Didik)",modul_ajar:"Modul Ajar",bahan_ajar:"Bahan Ajar",materi:"Materi Pembelajaran",ringkasan:"Ringkasan Materi",ide_aktivitas:"Media dan Ide Aktivitas Pembelajaran",
          soal_sumatif:"Soal Sumatif",soal_formatif:"Soal Formatif",kisi_kisi:"Kisi-kisi Soal",rubrik:"Rubrik Penilaian",kunci_jawaban:"Kunci Jawaban",pedoman_skor:"Pedoman Penskoran",
          jurnal:"Jurnal Pembelajaran",refleksi:"Refleksi Pembelajaran",remedial:"Program Remedial",pengayaan:"Program Pengayaan",deskripsi_hasil:"Deskripsi Hasil Belajar"
        };
        const common = `KELAS/ROMBEL: ${requested || own || "SD"}\nFASE: ${fase || "sesuai kelas"}\nMAPEL: ${mapel || "sesuai konteks"}\nTAHUN PELAJARAN: ${tahun}\nTOPIK/KONTEKS: ${context || "gunakan konteks dekat dengan kehidupan murid"}${bab ? `\nBAB/UNIT: ${bab}` : ""}${bookContext}`;
        let specific = "";
        if (jenis === "lkpd") specific = `\nTUJUAN LKPD: ${tujuan || "rumuskan tujuan yang terukur"}\nDURASI: ${durasi || "sesuaikan kebutuhan"}\nAKTIVITAS KHUSUS: ${aktivitas || "pilih aktivitas kontekstual yang aktif dan bermakna"}`;
        if (jenis === "soal_sumatif" || jenis === "soal_formatif") specific = `\nJUMLAH SOAL: ${jumlahSoal}\nBENTUK SOAL: ${bentukSoal}\nTINGKAT KESULITAN: ${tingkatKesulitan}\nSERTAKAN KUNCI DAN KISI-KISI: ${sertakanKunci ? "YA" : "TIDAK"}`;
        const rules = {
          cp:"Rumusan sebagai rancangan kerja guru yang selaras karakteristik fase dan mapel. Jangan mengklaim sebagai kutipan resmi pemerintah.",
          tp:"Buat tujuan terukur dengan kata kerja operasional, kondisi/konteks, dan bukti ketercapaian.",
          atp:"Susun alur TP dari prasyarat menuju konsep, aplikasi, komunikasi, dan refleksi.",
          prota:"Buat pembagian lingkup materi sepanjang tahun dalam tabel: unit, semester, alokasi JP, asesmen, dan catatan.",
          prosem:"Buat program semester yang realistis per minggu/pertemuan: materi, aktivitas, asesmen, alokasi JP, dan tindak lanjut.",
          rpm:"Buat RPM lengkap: identitas, tujuan, pemahaman bermakna, pertanyaan pemantik, asesmen awal/proses/akhir, memahami-mengaplikasi-merefleksi, diferensiasi, media/sumber, kolaborasi, remedial/pengayaan, refleksi guru dan murid.",
          lkpd:"Buat LKPD siap cetak: identitas, tujuan, petunjuk, materi singkat, alat/bahan bila perlu, langkah aktivitas, tabel/lembar kerja, pertanyaan pemantik, refleksi, dan asesmen.",
          modul_ajar:"Buat modul ajar praktis dan lengkap untuk guru SD, dengan tujuan, langkah pembelajaran, asesmen, diferensiasi, media/sumber, remedial, pengayaan, dan refleksi.",
          bahan_ajar:"Buat bahan ajar yang sistematis, ramah murid SD, berisi konsep inti, contoh, ilustrasi tekstual, aktivitas, latihan, dan rangkuman.",
          materi:"Jelaskan materi secara bertahap dari konsep sederhana ke penerapan, dengan contoh kontekstual dan aktivitas singkat.",
          ringkasan:"Buat ringkasan padat namun utuh, poin-poin penting, istilah kunci, contoh, dan kesimpulan.",
          ide_aktivitas:"Berikan ide media dan aktivitas yang murah/realistis, aktif, kontekstual, inklusif, dan menyenangkan, lengkap dengan tujuan serta langkah pelaksanaan.",
          soal_sumatif:"Buat paket asesmen sumatif. Nomori soal dengan jelas, variasikan stimulus bila sesuai, hindari soal ambigu, dan sesuaikan perkembangan murid.",
          soal_formatif:"Buat asesmen formatif untuk memantau proses belajar. Sertakan indikator yang diamati dan umpan balik/tindak lanjut bila relevan.",
          kisi_kisi:"Buat kisi-kisi dalam tabel: nomor, lingkup/materi, indikator, level kognitif, bentuk soal, dan nomor soal.",
          rubrik:"Buat rubrik analitik dengan kriteria jelas dan 4 tingkat performa, menggunakan bahasa yang dapat dipakai guru saat menilai.",
          kunci_jawaban:"Buat kunci jawaban berdasarkan soal/topik yang diminta. Untuk uraian, berikan jawaban ideal dan poin penting yang harus muncul.",
          pedoman_skor:"Buat pedoman penskoran transparan, termasuk bobot tiap bentuk soal dan aturan penilaian uraian/praktik bila ada.",
          jurnal:"Buat format jurnal pembelajaran yang praktis: tanggal/pertemuan, materi, aktivitas, asesmen, kehadiran/catatan, hasil pengamatan, dan tindak lanjut.",
          refleksi:"Buat refleksi guru yang konkret: yang berhasil, bukti, kendala, respons murid, hal yang perlu diperbaiki, dan rencana tindak lanjut.",
          remedial:"Buat program remedial berdasarkan kesulitan belajar: identifikasi, tujuan, strategi, aktivitas, asesmen ulang, dan kriteria keberhasilan.",
          pengayaan:"Buat program pengayaan untuk murid yang sudah tuntas: tujuan, tantangan lanjutan, aktivitas, produk, dan asesmen.",
          deskripsi_hasil:"Buat beberapa contoh deskripsi hasil belajar yang positif, spesifik, berbasis kompetensi, dan menyertakan saran pengembangan tanpa memberi label negatif."
        };
        const instructions = `Anda adalah AI Guru SD Indonesia yang membantu guru membuat perangkat dan administrasi pembelajaran yang siap diedit dan digunakan. Gunakan Bahasa Indonesia formal tetapi natural. Selaraskan dengan Kurikulum Merdeka dan Pembelajaran Mendalam: berkesadaran (mindful), bermakna (meaningful), menggembirakan (joyful), serta pengalaman memahami, mengaplikasi, dan merefleksi. Sesuaikan bahasa dan beban tugas dengan usia murid. Jangan membuat klaim bahwa rancangan Anda adalah dokumen resmi pemerintah. Jangan mengarang data sekolah, nama murid, kebijakan, atau angka yang tidak diberikan. Jika informasi kurang, buat asumsi wajar dan tandai bagian yang dapat disesuaikan.\n\nJENIS: ${names[jenis]}\n${common}${specific}\n\nTUGAS KHUSUS: ${rules[jenis] || "Buat hasil yang lengkap, sistematis, dan siap dipakai guru."}\n\nKeluaran harus rapi dengan judul, subjudul, tabel bila bermanfaat, dan isi yang substansial. Untuk soal, pastikan jumlah soal tepat ${jumlahSoal} bila jenisnya soal. Untuk pilihan ganda, gunakan opsi A-D dan hanya satu jawaban paling tepat. ${sertakanKunci ? "Sertakan kunci/kisi-kisi sesuai permintaan." : "Jangan sertakan kunci jawaban kecuali diminta."}`;
        const userPrompt = `Buat ${names[jenis]} untuk ${requested || own || "kelas SD"}, mapel ${mapel || "sesuai konteks"}. ${context ? "Gunakan topik/konteks: "+context : "Gunakan topik yang paling relevan dengan kebutuhan ini."}${bab ? " Unit/BAB: "+bab+"." : ""}${bookContext ? "\n\nWAJIB: patuhi sumber buku terkunci di atas dan jangan mengganti judul/BAB." : ""}`;
        const apiRes = await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${openaiKey}`},body:JSON.stringify({model,store:false,input:[{role:"developer",content:instructions},{role:"user",content:userPrompt}],text:{verbosity:"high"}})});
        const raw=await apiRes.text();let data={};try{data=JSON.parse(raw)}catch{}
        if(!apiRes.ok)return json({ok:false,message:data?.error?.message||"AI gagal memproses permintaan.",status:apiRes.status},502);
        const text=String(data.output_text||(data.output||[]).flatMap(x=>x.content||[]).find(x=>x.type==='output_text')?.text||"").trim();
        if(!text)return json({ok:false,message:"AI tidak mengembalikan isi dokumen."},502);

        // BOOK LOCK V2: metadata buku/BAB selalu dipasang ulang oleh Worker
        // agar hasil yang tampil di frontend tidak bisa kehilangan identitas sumber.
        let finalText = text;
        if (bookLock && bookTitle) {
          const lockLines = [
            "🔒 SUMBER BUKU TERKUNCI",
            `Judul buku: ${bookTitle}`,
            `Sumber: ${bookSource || "SIBI"}`,
            `Tahun/Edisi: ${bookYear || "sesuai metadata"}`
          ];
          if (bookBab) lockLines.push(`BAB/UNIT: ${bookBab}`);
          if (bookChapters.length) lockLines.push(`Daftar BAB/UNIT terverifikasi: ${bookChapters.join(" | ")}`);
          const lockHeader = lockLines.join("\n") + "\n\n";
          // Jangan pernah mengganti isi guru secara diam-diam; metadata terkunci
          // ditempatkan di paling atas sebagai identitas sumber yang authoritative.
          finalText = lockHeader + finalText;
        }
        return json({ok:true,jenis,text:finalText,model,bookReference: bookReference || null,bookLock,bookLockEnforced: !!(bookLock && bookTitle)});
      }

      // DATA GURU / USERS
      if (url.pathname === "/api/guru" && request.method === "GET") {
        if (user.role !== "admin") return json({ ok: false, message: "Khusus administrator." }, 403);
        const c = await columns(env, "users");
        const rombelExpr = c.has("rombel")
          ? "COALESCE(NULLIF(TRIM(rombel), ''), TRIM(kelas)) AS rombel"
          : "TRIM(kelas) AS rombel";
        const mapelExpr = c.has("mapel") ? "TRIM(COALESCE(mapel, '')) AS mapel" : "'' AS mapel";
        const result = await env.DB.prepare(
          `SELECT id, username, nama, role, kelas, ${rombelExpr}, ${mapelExpr}
           FROM users ORDER BY role, rombel, nama`
        ).all();
        return json({ ok: true, data: result.results });
      }

      // CREATE GURU MAPEL — administrator only
      if (url.pathname === "/api/guru" && request.method === "POST") {
        if (user.role !== "admin") return json({ ok:false, message:"Khusus administrator." }, 403);
        const body = await request.json();
        const nama = String(body.nama || "").trim();
        const username = String(body.username || "").trim();
        const password = String(body.password || "");
        const role = String(body.role || "guru_mapel").trim();
        const rombel = cleanRombel(body.rombel || body.kelas || "");
        const mapel = normalizeMapel(body.mapel || "");
        if (!nama || !username || !password || !rombel || !mapel) return json({ok:false,message:"Nama, username, password, mapel, dan rombel wajib diisi."},400);
        if (role !== "guru_mapel") return json({ok:false,message:"Endpoint ini khusus akun Guru Mapel."},400);
        if (!["Pendidikan Agama dan Budi Pekerti","PJOK","Bahasa Inggris"].includes(mapel)) return json({ok:false,message:"Mata pelajaran Guru Mapel tidak valid."},400);
        let c = await columns(env, "users");
        if (!c.has("mapel")) { try { await env.DB.prepare("ALTER TABLE users ADD COLUMN mapel TEXT").run(); } catch {} c = await columns(env,"users"); }
        const exists = await env.DB.prepare("SELECT id FROM users WHERE username = ?").bind(username).first();
        if (exists) return json({ok:false,message:"Username sudah digunakan."},409);
        const fields=[]; const binds=[];
        const add=(name,value)=>{if(c.has(name)){fields.push(name);binds.push(value)}};
        add("username",username); add("password",password); add("nama",nama); add("role",role);
        add("kelas",rombel); add("rombel",rombel); add("mapel",mapel);
        if (!fields.length) return json({ok:false,message:"Struktur tabel users tidak sesuai."},500);
        const marks=fields.map(()=>"?").join(",");
        await env.DB.prepare(`INSERT INTO users (${fields.join(",")}) VALUES (${marks})`).bind(...binds).run();
        const created=await env.DB.prepare(`SELECT id, username, nama, role, kelas, rombel, mapel FROM users WHERE username = ?`).bind(username).first();
        return json({ok:true,message:"Akun Guru Mapel berhasil dibuat.",data:created},201);
      }

      // CREATE GURU MAPEL — administrator only
      if (url.pathname === "/api/guru" && request.method === "POST") {
        if (user.role !== "admin") return json({ ok:false, message:"Khusus administrator." }, 403);
        const body = await request.json();
        const nama = String(body.nama || "").trim(); const username = String(body.username || "").trim(); const password = String(body.password || "");
        const role = String(body.role || "guru_mapel").trim(); const rombel = cleanRombel(body.rombel || body.kelas || ""); const mapel = normalizeMapel(body.mapel || "");
        if (!nama || !username || !password || !rombel || !mapel) return json({ok:false,message:"Nama, username, password, mapel, dan rombel wajib diisi."},400);
        if (role !== "guru_mapel") return json({ok:false,message:"Endpoint ini khusus akun Guru Mapel."},400);
        if (!["Pendidikan Agama dan Budi Pekerti","PJOK","Bahasa Inggris"].includes(mapel)) return json({ok:false,message:"Mata pelajaran Guru Mapel tidak valid."},400);
        let c=await columns(env,"users"); if(!c.has("mapel")){try{await env.DB.prepare("ALTER TABLE users ADD COLUMN mapel TEXT").run()}catch{} c=await columns(env,"users")}
        const exists=await env.DB.prepare("SELECT id FROM users WHERE username=?").bind(username).first(); if(exists)return json({ok:false,message:"Username sudah digunakan."},409);
        const fields=[],binds=[]; const add=(n,v)=>{if(c.has(n)){fields.push(n);binds.push(v)}}; add("username",username);add("password",password);add("nama",nama);add("role",role);add("kelas",rombel);add("rombel",rombel);add("mapel",mapel);
        const marks=fields.map(()=>"?").join(","); await env.DB.prepare(`INSERT INTO users (${fields.join(",")}) VALUES (${marks})`).bind(...binds).run();
        const created=await env.DB.prepare("SELECT id,username,nama,role,kelas,rombel,mapel FROM users WHERE username=?").bind(username).first(); return json({ok:true,message:"Akun Guru Mapel berhasil dibuat.",data:created},201);
      }

      // NILAI
      if (url.pathname === "/api/nilai" && request.method === "GET") {
        const { requested, own } = classFilter(url.searchParams.get("rombel") || url.searchParams.get("kelas"), user);
        const mapel = url.searchParams.get("mapel") || "";
        const semester = Number(url.searchParams.get("semester") || 1);
        if (!subjectAllowed(user, mapel)) {
          return json({ ok:false, message:"Akses mata pelajaran ditolak." }, 403);
        }
        if (user.role !== "admin" && requested && !canAccessRombel(user, requested)) {
          return json({ ok: false, message: "Akses rombel ditolak." }, 403);
        }
        const c = await columns(env, "nilai");
        const field = c.has("rombel") ? "COALESCE(NULLIF(TRIM(rombel), ''), TRIM(kelas))" : "TRIM(kelas)";
        const rw = rombelWhere(field, requested || own);
        let sql = `SELECT * FROM nilai WHERE ${rw.sql} AND semester = ?`;
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
        if (!subjectAllowed(user, mapel)) return json({ok:false,message:"Akses mata pelajaran ditolak."},403);
        if (user.role !== "admin" && requested && !canAccessRombel(user, requested)) {
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
        const rw = rombelWhere(field, requested || own);
        let sql = `SELECT * FROM perangkat WHERE ${rw.sql}`;
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
        if (!subjectAllowed(user, mapel)) return json({ok:false,message:"Akses mata pelajaran ditolak."},403);
        if (user.role !== "admin" && requested && !canAccessRombel(user, requested)) {
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
        const rw = rombelWhere(field, requested || own);
        let sql = `SELECT * FROM rpm WHERE ${rw.sql}`;
        const binds = [...rw.binds];
        if (mapel) { sql += " AND mapel = ?"; binds.push(mapel); }
        sql += " ORDER BY mapel, id";
        const result = await env.DB.prepare(sql).bind(...binds).all();
        return json({ ok: true, data: result.results });
      }

      // ABSENSI — Harian, rekap bulanan, dan upsert
      if (url.pathname === "/api/absensi" && request.method === "GET") {
        await env.DB.prepare(`CREATE TABLE IF NOT EXISTS absensi (id INTEGER PRIMARY KEY AUTOINCREMENT,siswa_id INTEGER NOT NULL,nama_siswa TEXT NOT NULL,rombel TEXT NOT NULL,tanggal TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'Hadir',catatan TEXT DEFAULT '',guru_id INTEGER,guru_nama TEXT DEFAULT '',created_at TEXT DEFAULT CURRENT_TIMESTAMP,updated_at TEXT DEFAULT CURRENT_TIMESTAMP,UNIQUE(siswa_id,tanggal))`).run();
        const requested=cleanRombel(url.searchParams.get("rombel")||"");
        const own=cleanRombel(user.rombel||user.kelas||"");
        if(user.role!=="admin"&&requested&&!canAccessRombel(user,requested))return json({ok:false,message:"Akses rombel ditolak."},403);
        const r=requested||own;if(!r)return json({ok:false,message:"Rombel wajib dipilih."},400);
        const tanggal=url.searchParams.get("tanggal")||"",bulan=url.searchParams.get("bulan")||"";
        const siswaQ=await queryByRombel(env,"siswa",r);
        if(bulan){const rw=rombelWhere("a.rombel",r);const rows=await env.DB.prepare(`SELECT a.nama_siswa,SUM(CASE WHEN a.status='Hadir' THEN 1 ELSE 0 END) H,SUM(CASE WHEN a.status='Sakit' THEN 1 ELSE 0 END) S,SUM(CASE WHEN a.status='Izin' THEN 1 ELSE 0 END) I,SUM(CASE WHEN a.status='Alpa' THEN 1 ELSE 0 END) A,COUNT(*) total FROM absensi a WHERE ${rw.sql} AND substr(a.tanggal,1,7)=? GROUP BY a.siswa_id,a.nama_siswa ORDER BY a.nama_siswa`).bind(...rw.binds,bulan).all();return json({ok:true,data:rows.results||[]});}
        const rw=rombelWhere("rombel",r);const data=await env.DB.prepare(`SELECT * FROM absensi WHERE tanggal=? AND ${rw.sql} ORDER BY nama_siswa`).bind(tanggal,...rw.binds).all();return json({ok:true,data:data.results||[],siswa:siswaQ.results||[]});
      }
      if(url.pathname==="/api/absensi"&&request.method==="POST"){
        await env.DB.prepare(`CREATE TABLE IF NOT EXISTS absensi (id INTEGER PRIMARY KEY AUTOINCREMENT,siswa_id INTEGER NOT NULL,nama_siswa TEXT NOT NULL,rombel TEXT NOT NULL,tanggal TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'Hadir',catatan TEXT DEFAULT '',guru_id INTEGER,guru_nama TEXT DEFAULT '',created_at TEXT DEFAULT CURRENT_TIMESTAMP,updated_at TEXT DEFAULT CURRENT_TIMESTAMP,UNIQUE(siswa_id,tanggal))`).run();
        const body=await request.json(),items=Array.isArray(body.items)?body.items:[];if(!items.length)return json({ok:false,message:"Data absensi kosong."},400);const allowed=new Set(["Hadir","Sakit","Izin","Alpa"]);
        for(const x of items){const sid=Number(x.siswa_id),r=cleanRombel(x.rombel),d=String(x.tanggal||"").trim(),st=String(x.status||"Hadir");if(!sid||!r||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(d)||!allowed.has(st))return json({ok:false,message:"Data absensi tidak valid."},400);if(user.role!=="admin"&&!canAccessRombel(user,r))return json({ok:false,message:"Akses rombel ditolak."},403);const sv=await env.DB.prepare("SELECT id,nama FROM siswa WHERE id=?").bind(sid).first();if(!sv)return json({ok:false,message:"Siswa tidak ditemukan."},404);await env.DB.prepare(`INSERT INTO absensi(siswa_id,nama_siswa,rombel,tanggal,status,catatan,guru_id,guru_nama,updated_at) VALUES(?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(siswa_id,tanggal) DO UPDATE SET nama_siswa=excluded.nama_siswa,rombel=excluded.rombel,status=excluded.status,catatan=excluded.catatan,guru_id=excluded.guru_id,guru_nama=excluded.guru_nama,updated_at=CURRENT_TIMESTAMP`).bind(sid,String(sv.nama||""),r,d,st,String(x.catatan||""),user.id||null,String(user.nama||user.username||"")).run();}
        return json({ok:true,message:`${items.length} data absensi tersimpan.`});
      }
      if(url.pathname==="/api/absensi"&&request.method==="PUT"){const id=Number(url.searchParams.get("id"));if(!id)return json({ok:false,message:"ID absensi tidak valid."},400);const body=await request.json(),row=await env.DB.prepare("SELECT * FROM absensi WHERE id=?").bind(id).first();if(!row)return json({ok:false,message:"Data absensi tidak ditemukan."},404);if(user.role!=="admin"&&!canAccessRombel(user,row.rombel))return json({ok:false,message:"Akses rombel ditolak."},403);const st=String(body.status||row.status);if(!["Hadir","Sakit","Izin","Alpa"].includes(st))return json({ok:false,message:"Status tidak valid."},400);await env.DB.prepare("UPDATE absensi SET status=?,catatan=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(st,String(body.catatan??row.catatan??""),id).run();return json({ok:true});}
      if(url.pathname==="/api/absensi"&&request.method==="DELETE"){const id=Number(url.searchParams.get("id"));if(!id)return json({ok:false,message:"ID absensi tidak valid."},400);const row=await env.DB.prepare("SELECT * FROM absensi WHERE id=?").bind(id).first();if(!row)return json({ok:false,message:"Data absensi tidak ditemukan."},404);if(user.role!=="admin"&&!canAccessRombel(user,row.rombel))return json({ok:false,message:"Akses rombel ditolak."},403);await env.DB.prepare("DELETE FROM absensi WHERE id=?").bind(id).run();return json({ok:true});}

      return json({ ok: false, message: "Endpoint tidak ditemukan." }, 404);
    } catch (error) {
      return json({ ok: false, message: error?.message || String(error) }, 500);
    }
  }
};
