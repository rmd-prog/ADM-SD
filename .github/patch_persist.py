from pathlib import Path

p = Path('src/index.js')
s = p.read_text(encoding='utf-8')

perangkat_marker = '      // RPM\n      if (url.pathname === "/api/rpm" && request.method === "GET") {'
perangkat_block = '''      // PERANGKAT PEMBELAJARAN - CREATE / UPDATE / DELETE
      if (url.pathname === "/api/perangkat" && request.method === "POST") {
        const body = await request.json();
        const requested = cleanRombel(body.rombel || body.kelas || user.rombel || user.kelas || "");
        const own = cleanRombel(user.rombel || user.kelas || "");
        if (user.role !== "admin" && requested !== own) return json({ok:false,message:"Akses rombel ditolak."},403);
        const c = await columns(env, "perangkat");
        const allowed = ["jenis","mapel","kelas","rombel","judul","isi","konten","tahun","semester","bab","metadata"];
        const payload = {};
        for (const key of allowed) if (c.has(key) && body[key] !== undefined) payload[key] = body[key];
        if (c.has("kelas") && payload.kelas === undefined) payload.kelas = requested;
        if (c.has("rombel") && payload.rombel === undefined) payload.rombel = requested;
        if (!payload.jenis) payload.jenis = String(body.type || "").trim();
        if (!payload.mapel) payload.mapel = String(body.subject || "").trim();
        const cols = Object.keys(payload).filter(k => c.has(k));
        if (!cols.length) return json({ok:false,message:"Tidak ada kolom data perangkat yang cocok dengan struktur D1."},400);
        const vals = cols.map(k => payload[k]);
        const r = await env.DB.prepare(`INSERT INTO perangkat (${cols.join(",")}) VALUES (${cols.map(()=>"?").join(",")}) RETURNING *`).bind(...vals).first();
        return json({ok:true,data:r});
      }

      if (url.pathname.startsWith("/api/perangkat/") && ["PUT","DELETE"].includes(request.method)) {
        const id = url.pathname.split("/").pop();
        if (!/^\\d+$/.test(id)) return json({ok:false,message:"ID perangkat tidak valid."},400);
        const existing = await env.DB.prepare("SELECT * FROM perangkat WHERE id=?").bind(Number(id)).first();
        if (!existing) return json({ok:false,message:"Perangkat tidak ditemukan."},404);
        const own = cleanRombel(user.rombel || user.kelas || "");
        const er = cleanRombel(existing.rombel || existing.kelas || "");
        if (user.role !== "admin" && er !== own) return json({ok:false,message:"Akses rombel ditolak."},403);
        if (request.method === "DELETE") {
          await env.DB.prepare("DELETE FROM perangkat WHERE id=?").bind(Number(id)).run();
          return json({ok:true,message:"Perangkat dihapus."});
        }
        const body = await request.json();
        const c = await columns(env, "perangkat");
        const allowed = ["jenis","mapel","kelas","rombel","judul","isi","konten","tahun","semester","bab","metadata"];
        const sets=[]; const vals=[];
        for (const key of allowed) if (c.has(key) && body[key] !== undefined) { sets.push(`${key}=?`); vals.push(body[key]); }
        if (!sets.length) return json({ok:false,message:"Tidak ada perubahan yang valid."},400);
        if (c.has("rombel") && user.role !== "admin") { sets.push("rombel=?"); vals.push(own); }
        vals.push(Number(id));
        await env.DB.prepare(`UPDATE perangkat SET ${sets.join(",")} WHERE id=?`).bind(...vals).run();
        const r = await env.DB.prepare("SELECT * FROM perangkat WHERE id=?").bind(Number(id)).first();
        return json({ok:true,data:r});
      }

'''

if 'PERANGKAT PEMBELAJARAN - CREATE / UPDATE / DELETE' not in s:
    if perangkat_marker not in s:
        raise SystemExit('marker perangkat tidak ditemukan')
    s = s.replace(perangkat_marker, perangkat_block + perangkat_marker, 1)

rpm_marker = '      return json({ ok: false, message: "Endpoint tidak ditemukan." }, 404);'
rpm_block = '''      // RPM - CREATE / UPDATE / DELETE
      if (url.pathname === "/api/rpm" && request.method === "POST") {
        const body = await request.json();
        const requested = cleanRombel(body.rombel || body.kelas || user.rombel || user.kelas || "");
        const own = cleanRombel(user.rombel || user.kelas || "");
        if (user.role !== "admin" && requested !== own) return json({ok:false,message:"Akses rombel ditolak."},403);
        const c=await columns(env,"rpm");
        const allowed=["mapel","kelas","rombel","judul","isi","konten","tahun","semester","bab","metadata","materi","tujuan","aktivitas"];
        const payload={};
        for(const key of allowed) if(c.has(key)&&body[key]!==undefined) payload[key]=body[key];
        if(c.has("kelas")&&payload.kelas===undefined) payload.kelas=requested;
        if(c.has("rombel")&&payload.rombel===undefined) payload.rombel=requested;
        if(!payload.mapel) payload.mapel=String(body.subject||"").trim();
        const cols=Object.keys(payload).filter(k=>c.has(k));
        if(!cols.length)return json({ok:false,message:"Tidak ada kolom data RPM yang cocok dengan struktur D1."},400);
        const vals=cols.map(k=>payload[k]);
        const r=await env.DB.prepare(`INSERT INTO rpm (${cols.join(",")}) VALUES (${cols.map(()=>"?").join(",")}) RETURNING *`).bind(...vals).first();
        return json({ok:true,data:r});
      }

      if(url.pathname.startsWith("/api/rpm/")&&["PUT","DELETE"].includes(request.method)){
        const id=url.pathname.split("/").pop();
        if(!/^\\d+$/.test(id))return json({ok:false,message:"ID RPM tidak valid."},400);
        const existing=await env.DB.prepare("SELECT * FROM rpm WHERE id=?").bind(Number(id)).first();
        if(!existing)return json({ok:false,message:"RPM tidak ditemukan."},404);
        const own=cleanRombel(user.rombel||user.kelas||""); const er=cleanRombel(existing.rombel||existing.kelas||"");
        if(user.role!=="admin"&&er!==own)return json({ok:false,message:"Akses rombel ditolak."},403);
        if(request.method==="DELETE"){await env.DB.prepare("DELETE FROM rpm WHERE id=?").bind(Number(id)).run();return json({ok:true,message:"RPM dihapus."});}
        const body=await request.json(); const c=await columns(env,"rpm"); const allowed=["mapel","kelas","rombel","judul","isi","konten","tahun","semester","bab","metadata","materi","tujuan","aktivitas"]; const sets=[]; const vals=[];
        for(const key of allowed)if(c.has(key)&&body[key]!==undefined){sets.push(`${key}=?`);vals.push(body[key]);}
        if(!sets.length)return json({ok:false,message:"Tidak ada perubahan yang valid."},400);
        if(c.has("rombel")&&user.role!=="admin"){sets.push("rombel=?");vals.push(own);}
        vals.push(Number(id)); await env.DB.prepare(`UPDATE rpm SET ${sets.join(",")} WHERE id=?`).bind(...vals).run();
        const r=await env.DB.prepare("SELECT * FROM rpm WHERE id=?").bind(Number(id)).first(); return json({ok:true,data:r});
      }

'''

if 'RPM - CREATE / UPDATE / DELETE' not in s:
    if rpm_marker not in s:
        raise SystemExit('marker RPM tidak ditemukan')
    s = s.replace(rpm_marker, rpm_block + rpm_marker, 1)

p.write_text(s, encoding='utf-8')
print('patched', len(s), 'bytes')
