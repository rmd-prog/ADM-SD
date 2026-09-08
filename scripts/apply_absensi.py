from pathlib import Path

p=Path('src/index.js')
s=p.read_text(encoding='utf-8')
marker='      return json({ ok: false, message: "Endpoint tidak ditemukan." }, 404);'
block='''      // ABSENSI — Harian, rekap bulanan, dan upsert
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

'''
if 'url.pathname==="/api/absensi"' not in s:
    if marker not in s: raise SystemExit('worker marker missing')
    s=s.replace(marker,block+marker,1)
    p.write_text(s,encoding='utf-8')

h=Path('index.html');x=h.read_text(encoding='utf-8')
for tag in ('<script src="assets/absensi.js"></script>','<script src="guru-mapel-ui.js"></script>'):
    if tag not in x:
        pos=x.rfind('</body>')
        if pos<0: raise SystemExit('body marker missing')
        x=x[:pos]+tag+'\n'+x[pos:]
h.write_text(x,encoding='utf-8')
