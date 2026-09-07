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

      // DATA SISWA - GET
      if (url.pathname === "/api/siswa" && request.method === "GET") {
        const { requested, own } = classFilter(url.searchParams.get("rombel") || url.searchParams.get("kelas"), user);
        if (user.role !== "admin" && requested && requested !== own) {
          return json({ ok: false, message: "Akses rombel ditolak." }, 403);
        }
        const c = await columns(env, "siswa");
        const field = c.has("rombel") ? "COALESCE(NULLIF(TRIM(rombel), ''), TRIM(kelas))" : "TRIM(kelas)";
        let result;
        if (requested) {
          const rw = rombelWhere(field, requested);
          result = await env.DB.prepare(`SELECT * FROM siswa WHERE ${rw.sql} ORDER BY nama`).bind(...rw.binds).all();
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
        const classInfo = normalizeClass(body.rombel ?? body.kelas ?? (user.role === "guru" ? user.rombel : ""));
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

      // AI GENERATOR PERANGKAT PEMBELAJARAN
      if (url.pathname === "/api/ai/generate" && request.method === "POST") {
        const user = getUser(request);
        if (!user) return json({ ok:false, message:"Sesi login tidak valid." }, 401);
        const body = await request.json();
        const jenis = String(body.jenis || "").toLowerCase();
        const allowed = ["cp","tp","atp","prota","prosem","rpm"];
        if (!allowed.includes(jenis)) return json({ ok:false, message:"Jenis perangkat tidak valid." }, 400);
        const requested = cleanRombel(body.rombel || body.kelas || "");
        const own = cleanRombel(user.rombel || user.kelas || "");
        if (user.role !== "admin" && requested && requested !== own) return json({ ok:false, message:"Akses rombel ditolak." }, 403);
        if (!env.OPENAI_API_KEY) return json({ ok:false, message:"OPENAI_API_KEY belum dipasang di Cloudflare Worker." }, 503);

        const mapel = String(body.mapel || "").trim();
        const context = String(body.context || "").trim();
        const existing = String(body.existing || "").trim().slice(0, 18000);
        const tahun = String(body.tahun || "2026/2027");
        const fase = String(body.fase || "");
        const model = String(env.OPENAI_MODEL || "gpt-5.6-luna");
        const names = {cp:"Capaian Pembelajaran (CP)",tp:"Tujuan Pembelajaran (TP)",atp:"Alur Tujuan Pembelajaran (ATP)",prota:"Program Tahunan (Prota)",prosem:"Program Semester (Prosem)",rpm:"Rencana Pembelajaran Mendalam (RPM)"};
        const instructions = `Anda adalah AI perancang perangkat pembelajaran SD Indonesia. Buat ${names[jenis]} yang siap dipakai guru, bukan sekadar contoh generik. Gunakan bahasa Indonesia formal, jelas, operasional, dan realistis untuk kelas SD. Selaraskan dengan Kurikulum Merdeka dan pendekatan Pembelajaran Mendalam: berkesadaran (mindful), bermakna (meaningful), menggembirakan (joyful), serta alur pengalaman belajar memahami, mengaplikasi, dan merefleksi. Jangan mengaku sebagai kutipan resmi jika bukan kutipan resmi. Jika ada bagian yang membutuhkan penyesuaian satuan pendidikan, tulis sebagai rancangan yang dapat disesuaikan.

ATURAN DOKUMEN:
- CP: fokus pada capaian fase dan elemen/kompetensi inti, tidak membuat klaim sebagai teks resmi pemerintah.
- TP: rumuskan tujuan yang terukur, menggunakan kata kerja operasional dan terkait materi/konteks.
- ATP: susun urutan TP logis dari prasyarat menuju penerapan dan refleksi.
- Prota: tabel/daftar unit atau lingkup materi sepanjang tahun, semester, alokasi JP, asesmen, dan catatan.
- Prosem: susun per minggu/pertemuan dengan unit, materi, aktivitas, asesmen, alokasi JP, dan tindak lanjut.
- RPM: buat lengkap dengan identitas, tujuan, pemahaman bermakna, pertanyaan pemantik, asesmen awal/proses/akhir, pengalaman memahami-mengaplikasi-merefleksi, diferensiasi, media/sumber, kolaborasi, remedial/pengayaan, dan refleksi guru/murid. Sesuaikan durasi dan karakter SD.
- Hindari angka atau kebijakan yang tidak diberikan pengguna jika tidak diperlukan. Gunakan rancangan yang masuk akal dan mudah diedit.

KELAS/ROMBEL: ${requested || own || "SD"}
FASE: ${fase || "sesuai kelas"}
MAPEL: ${mapel || "sesuai konteks"}
TAHUN: ${tahun}
KONTEKS TAMBAHAN: ${context || "tidak ada; gunakan konteks umum sekolah dasar dan lingkungan sekitar murid"}
RANCANGAN SEBELUMNYA (boleh diperbaiki):\n${existing || "belum ada"}`;

        const apiRes = await fetch("https://api.openai.com/v1/responses", {
          method:"POST",
          headers:{"Content-Type":"application/json","Authorization":`Bearer ${env.OPENAI_API_KEY}`},
          body:JSON.stringify({
            model,
            store:false,
            input:[
              {role:"developer",content:instructions},
              {role:"user",content:`Buat ${names[jenis]} untuk kelas/rombel ${requested || own}, mapel ${mapel}, tahun ${tahun}. Kembangkan secara substansial dan siap ditempel ke dokumen sekolah. ${context ? "Perhatikan konteks: "+context : ""}`}
            ],
            text:{verbosity:"high"}
          })
        });
        const raw = await apiRes.text();
        let data={}; try{ data=JSON.parse(raw); }catch{}
        if (!apiRes.ok) return json({ok:false,message:data?.error?.message || "AI gagal memproses permintaan.",status:apiRes.status}, 502);
        const text = String(data.output_text || (data.output||[]).flatMap(x=>x.content||[]).find(x=>x.type==='output_text')?.text || "").trim();
        if (!text) return json({ok:false,message:"AI tidak mengembalikan isi dokumen."}, 502);
        return json({ok:true,jenis,text,model});
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
        const rw = rombelWhere(field, requested || own);
        let sql = `SELECT * FROM rpm WHERE ${rw.sql}`;
        const binds = [...rw.binds];
        if (mapel) { sql += " AND mapel = ?"; binds.push(mapel); }
        sql += " ORDER BY mapel, id";
        const result = await env.DB.prepare(sql).bind(...binds).all();
        return json({ ok: true, data: result.results });
      }

      return json({ ok: false, message: "Endpoint tidak ditemukan." }, 404);
    } catch (error) {
      return json({ ok: false, message: error?.message || String(error) }, 500);
    }
  }
};
