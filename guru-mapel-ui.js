/* GURU+ SD — UI Guru Mapel */
(function(){
  'use strict';
  const SUBJECTS=['Pendidikan Agama dan Budi Pekerti','PJOK','Bahasa Inggris'];
  const ROMBELS=['IA','IB','IIA','IIB','IIIA','IIIB','IVA','IVB','V','VI'];
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const normR=v=>{const s=String(v??'').trim().toUpperCase().replace(/\s+/g,'');const m={'1A':'IA','1B':'IB','2A':'IIA','2B':'IIB','3A':'IIIA','3B':'IIIB','4A':'IVA','4B':'IVB','5':'V','6':'VI'};return m[s]||s};
  const token=()=>localStorage.getItem('siAuthToken')||'';
  const api=async(path,opt={})=>{const h=Object.assign({'Accept':'application/json'},opt.headers||{});if(token())h.Authorization='Bearer '+token();if(opt.body)h['Content-Type']='application/json';const r=await fetch((window.API_BASE||'')+path,Object.assign({},opt,{headers:h}));let p={};try{p=await r.json()}catch{}if(!r.ok||p.ok===false)throw Error(p.message||'Permintaan gagal.');return p};
  function injectPage(){
    if(document.getElementById('teachers'))return;
    const anchor=document.getElementById('importScores');
    if(!anchor)return;
    const sec=document.createElement('section');sec.id='teachers';sec.className='page';
    sec.innerHTML=`<div class="student-head"><div><h2>👨‍🏫 Data Guru</h2><p class="muted">Kelola akun guru dan Guru Mapel. Akun Guru Mapel dibatasi otomatis ke mata pelajaran dan rombel yang dipilih.</p></div><button class="btn secondary" id="gmRefresh">↻ Muat Ulang</button></div>
      <div class="card panel"><h3>➕ Buat Akun Guru Mapel</h3><div class="grid" style="grid-template-columns:1fr 1fr"><div><label>Nama Guru</label><input id="gmNama" placeholder="Nama lengkap"></div><div><label>Username</label><input id="gmUsername" placeholder="contoh: guru.pjok"></div></div>
      <div class="grid" style="grid-template-columns:1fr 1fr 1fr"><div><label>Password</label><input id="gmPassword" type="password" placeholder="Password login"></div><div><label>Mata Pelajaran</label><select id="gmMapel"></select></div><div><label>Rombel</label><select id="gmRombel"></select></div></div>
      <div class="toolbar"><button class="btn primary" id="gmSave">💾 Buat Akun</button><button class="btn secondary" id="gmReset">Reset</button></div><div id="gmMsg" class="alert"></div></div>
      <div class="card panel"><div class="student-head"><div><h3>📋 Daftar Akun</h3><p class="muted">Data diambil langsung dari D1.</p></div></div><div class="tablewrap"><table class="table"><thead><tr><th>Username</th><th>Nama</th><th>Role</th><th>Mapel</th><th>Rombel</th></tr></thead><tbody id="gmTable"></tbody></table></div></div>`;
    anchor.parentNode.insertBefore(sec,anchor);
  }
  function fill(){
    const m=document.getElementById('gmMapel'),r=document.getElementById('gmRombel');if(!m||!r)return;
    m.innerHTML=SUBJECTS.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');
    r.innerHTML=ROMBELS.map(x=>`<option value="${x}">${x}</option>`).join('');
  }
  function msg(text,ok){const e=document.getElementById('gmMsg');if(!e)return;e.textContent=text;e.className='alert'+(ok?' successbox':'');e.style.display='block'}
  async function load(){
    const tb=document.getElementById('gmTable');if(!tb)return;tb.innerHTML='<tr><td colspan="5" class="muted">Memuat...</td></tr>';
    try{const p=await api('/guru');const rows=Array.isArray(p.data)?p.data:[];tb.innerHTML=rows.map(x=>`<tr><td><b>${esc(x.username)}</b></td><td>${esc(x.nama)}</td><td><span class="badge">${x.role==='guru_mapel'?'Guru Mapel':x.role==='admin'?'Administrator':'Guru Kelas'}</span></td><td>${esc(x.mapel||'-')}</td><td>${esc(normR(x.rombel||x.kelas)||'Semua')}</td></tr>`).join('')||'<tr><td colspan="5" class="muted">Belum ada akun.</td></tr>'}catch(e){tb.innerHTML=`<tr><td colspan="5" class="danger-text">${esc(e.message)}</td></tr>`}
  }
  async function save(){
    const nama=document.getElementById('gmNama')?.value.trim(),username=document.getElementById('gmUsername')?.value.trim(),password=document.getElementById('gmPassword')?.value||'',mapel=document.getElementById('gmMapel')?.value||'',rombel=document.getElementById('gmRombel')?.value||'';
    if(!nama||!username||!password||!mapel||!rombel)return msg('Nama, username, password, mapel, dan rombel wajib diisi.');
    try{await api('/guru',{method:'POST',body:JSON.stringify({nama,username,password,mapel,rombel,role:'guru_mapel'})});msg('Akun Guru Mapel berhasil dibuat. Bisa langsung login.',true);document.getElementById('gmNama').value='';document.getElementById('gmUsername').value='';document.getElementById('gmPassword').value='';await load()}catch(e){msg(e.message||'Gagal membuat akun.')}
  }
  function bind(){
    injectPage();fill();
    document.getElementById('gmSave')?.addEventListener('click',save);document.getElementById('gmRefresh')?.addEventListener('click',load);document.getElementById('gmReset')?.addEventListener('click',()=>{['gmNama','gmUsername','gmPassword'].forEach(x=>{const e=document.getElementById(x);if(e)e.value=''})});
    load();
  }
  const oldShow=window.showPage;
  if(typeof oldShow==='function'){
    window.showPage=function(p){oldShow(p);if(p==='teachers')bind()};
  }
  document.addEventListener('DOMContentLoaded',()=>{setTimeout(()=>{if(typeof window.showPage==='function'){const orig=window.showPage;if(!orig.__gm){window.showPage=function(p){orig(p);if(p==='teachers')bind()};window.showPage.__gm=true}}},0)});
})();
