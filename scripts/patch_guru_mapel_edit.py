from pathlib import Path

WORKER = Path('src/index.js')
UI = Path('guru-mapel-ui.js')

worker = WORKER.read_text(encoding='utf-8')
marker = '      // DATA SISWA - GET\n'
block = '''      // DATA GURU MAPEL - UPDATE\n      if (url.pathname.startsWith("/api/guru/") && request.method === "PUT") {\n        if (user.role !== "admin") return json({ ok:false, message:"Hanya administrator yang dapat mengubah data guru." },403);\n        const gid = url.pathname.split("/").pop();\n        if (!/^\\d+$/.test(gid)) return json({ ok:false, message:"ID guru tidak valid." },400);\n        const existing = await env.DB.prepare("SELECT * FROM users WHERE id=?").bind(Number(gid)).first();\n        if (!existing) return json({ ok:false, message:"Data guru tidak ditemukan." },404);\n        if (existing.role !== "guru_mapel") return json({ ok:false, message:"Hanya akun Guru Mapel yang dapat diedit dari menu ini." },400);\n        const body = await request.json();\n        const nama = String(body.nama ?? existing.nama ?? "").trim();\n        const username = String(body.username ?? existing.username ?? "").trim();\n        const password = String(body.password ?? "");\n        const mapel = normalizeMapel(body.mapel ?? existing.mapel ?? "");\n        const rombel = cleanRombel(body.rombel ?? existing.rombel ?? existing.kelas ?? "ALL") || "ALL";\n        if (!nama || !username || !mapel) return json({ ok:false, message:"Nama, username, dan mapel wajib diisi." },400);\n        if (!["Pendidikan Agama dan Budi Pekerti","PJOK","Bahasa Inggris"].includes(mapel)) return json({ ok:false, message:"Mata pelajaran Guru Mapel tidak valid." },400);\n        const dup = await env.DB.prepare("SELECT id FROM users WHERE username=? AND id<>?").bind(username,Number(gid)).first();\n        if (dup) return json({ ok:false, message:"Username sudah digunakan guru lain." },409);\n        const c = await columns(env,"users");\n        const sets=["nama=?","username=?","mapel=?","role=?"]; const vals=[nama,username,mapel,"guru_mapel"];\n        if(c.has("rombel")){sets.push("rombel=?");vals.push(rombel);} else {sets.push("kelas=?");vals.push(rombel);}\n        if(password) { sets.push("password=?"); vals.push(password); }\n        vals.push(Number(gid));\n        await env.DB.prepare(`UPDATE users SET ${sets.join(",")} WHERE id=?`).bind(...vals).run();\n        const r = await env.DB.prepare("SELECT id,username,nama,role,kelas,rombel,mapel FROM users WHERE id=?").bind(Number(gid)).first();\n        return json({ ok:true, data:r, message:"Data Guru Mapel berhasil diperbarui." });\n      }\n\n'''
if 'DATA GURU MAPEL - UPDATE' not in worker:
    if marker not in worker:
        raise SystemExit('worker marker missing')
    worker = worker.replace(marker, block + marker, 1)
    WORKER.write_text(worker, encoding='utf-8')

ui = UI.read_text(encoding='utf-8')
ui = ui.replace('id="gmPassword" type="password" placeholder="Password"', 'id="gmPassword" type="password" placeholder="Password (kosong = tetap)"')
ui = ui.replace('<button class="btn primary" id="gmSave">💾 Buat Akun Guru Mapel</button><button class="btn secondary" id="gmReset">Reset</button>', '<button class="btn primary" id="gmSave">💾 Buat Akun Guru Mapel</button><button class="btn secondary" id="gmCancel" style="display:none">Batal Edit</button><button class="btn secondary" id="gmReset">Reset</button>')
ui = ui.replace('<th>Rombel</th></tr></thead>', '<th>Rombel</th><th>Aksi</th></tr></thead>')
ui = ui.replace('colspan="5"', 'colspan="6"')
old_table = "tb.innerHTML=rows.map(x=>`<tr><td><b>${esc(x.username)}</b></td><td>${esc(x.nama)}</td><td><span class=\"badge\">${x.role==='guru_mapel'?'Guru Mapel':x.role==='admin'?'Administrator':'Guru Kelas'}</span></td><td>${esc(x.mapel||'-')}</td><td>${esc(normR(x.rombel||x.kelas)||'Semua')}</td></tr>`).join('')||'<tr><td colspan=\"6\" class=\"muted\">Belum ada akun.</td></tr>'"
new_table = "tb.innerHTML=rows.map(x=>`<tr><td><b>${esc(x.username)}</b></td><td>${esc(x.nama)}</td><td><span class=\"badge\">${x.role==='guru_mapel'?'Guru Mapel':x.role==='admin'?'Administrator':'Guru Kelas'}</span></td><td>${esc(x.mapel||'-')}</td><td>${esc(normR(x.rombel||x.kelas)||'Semua')}</td><td><button class=\"btn secondary gmEdit\" data-id=\"${esc(x.id)}\" data-username=\"${esc(x.username)}\" data-nama=\"${esc(x.nama)}\" data-mapel=\"${esc(x.mapel||'')}\" data-rombel=\"${esc(normR(x.rombel||x.kelas)||'ALL')}\">✏️ Edit</button></td></tr>`).join('')||'<tr><td colspan=\"6\" class=\"muted\">Belum ada akun.</td></tr>'"
if old_table in ui:
    ui = ui.replace(old_table, new_table, 1)
else:
    raise SystemExit('ui table pattern missing')
old_reset = "document.getElementById('gmReset')?.addEventListener('click',()=>['gmNama','gmUsername','gmPassword'].forEach(x=>{const e=document.getElementById(x);if(e)e.value=''}));"
new_reset = "document.getElementById('gmReset')?.addEventListener('click',resetForm);document.getElementById('gmCancel')?.addEventListener('click',resetForm);"
if old_reset in ui:
    ui = ui.replace(old_reset, new_reset, 1)
else:
    raise SystemExit('ui reset pattern missing')
old_save_start = "async function save(){const nama=document.getElementById('gmNama')?.value.trim(),username=document.getElementById('gmUsername')?.value.trim(),password=document.getElementById('gmPassword')?.value||'',mapel=document.getElementById('gmMapel')?.value||'',rombel=document.getElementById('gmRombel')?.value||'ALL';if(!nama||!username||!password||!mapel)return msg('Nama, username, password, dan mapel wajib diisi.');try{await api('/guru',{method:'POST',body:JSON.stringify({nama,username,password,mapel,rombel,role:'guru_mapel'})});msg('✓ Akun Guru Mapel berhasil dibuat.',true);['gmNama','gmUsername','gmPassword'].forEach(x=>{const e=document.getElementById(x);if(e)e.value=''});await load()}catch(e){msg(e.message||'Gagal membuat akun.')}}"
new_save = "function resetForm(){['gmNama','gmUsername','gmPassword'].forEach(x=>{const e=document.getElementById(x);if(e)e.value=''});const id=document.getElementById('gmEditId');if(id)id.value='';const b=document.getElementById('gmSave');if(b)b.textContent='💾 Buat Akun Guru Mapel';const c=document.getElementById('gmCancel');if(c)c.style.display='none'}\n  function startEdit(x){let id=document.getElementById('gmEditId');if(!id){id=document.createElement('input');id.type='hidden';id.id='gmEditId';document.getElementById('gmPanel')?.appendChild(id)}id.value=x.id;document.getElementById('gmNama').value=x.nama||'';document.getElementById('gmUsername').value=x.username||'';document.getElementById('gmPassword').value='';document.getElementById('gmMapel').value=x.mapel||'';document.getElementById('gmRombel').value=x.rombel||'ALL';document.getElementById('gmSave').textContent='💾 Simpan Perubahan';document.getElementById('gmCancel').style.display='inline-block'}\n  async function save(){const nama=document.getElementById('gmNama')?.value.trim(),username=document.getElementById('gmUsername')?.value.trim(),password=document.getElementById('gmPassword')?.value||'',mapel=document.getElementById('gmMapel')?.value||'',rombel=document.getElementById('gmRombel')?.value||'ALL',editId=document.getElementById('gmEditId')?.value||'';if(!nama||!username||!mapel||(!editId&&!password))return msg(editId?'Nama, username, dan mapel wajib diisi.':'Nama, username, password, dan mapel wajib diisi.');try{const body={nama,username,mapel,rombel,role:'guru_mapel'};if(password)body.password=password;await api(editId?'/guru/'+encodeURIComponent(editId):'/guru',{method:editId?'PUT':'POST',body:JSON.stringify(editId?body:{...body,password})});msg(editId?'✓ Data Guru Mapel berhasil diperbarui.':'✓ Akun Guru Mapel berhasil dibuat.',true);resetForm();await load()}catch(e){msg(e.message||'Gagal menyimpan data.')}}"
if old_save_start in ui:
    ui = ui.replace(old_save_start, new_save, 1)
else:
    raise SystemExit('ui save pattern missing')
# Bind edit buttons after every table load.
needle = "async function load(){const tb=document.getElementById('gmTable');if(!tb)return;tb.innerHTML='<tr><td colspan=\"6\" class=\"muted\">Memuat...</td></tr>';try{const p=await api('/guru');const rows=Array.isArray(p.data)?p.data:[];tb.innerHTML=rows.map"
if needle not in ui:
    raise SystemExit('ui load marker missing')
# Append event binding at the end of the existing try/catch function.
old_tail = "catch(e){tb.innerHTML=`<tr><td colspan=\"6\" class=\"danger-text\">${esc(e.message)}</td></tr>`}}"
new_tail = "catch(e){tb.innerHTML=`<tr><td colspan=\"6\" class=\"danger-text\">${esc(e.message)}</td></tr>`}document.querySelectorAll('.gmEdit').forEach(b=>b.addEventListener('click',()=>startEdit(b.dataset)))}"
if old_tail in ui:
    ui = ui.replace(old_tail, new_tail, 1)
else:
    raise SystemExit('ui load tail missing')
UI.write_text(ui, encoding='utf-8')
print('Guru Mapel edit patch applied')
