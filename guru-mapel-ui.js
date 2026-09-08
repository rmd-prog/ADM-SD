/* GURU+ SD — UI Guru Mapel */
(function(){
  'use strict';
  const SUBJECTS=['Pendidikan Agama dan Budi Pekerti','PJOK','Bahasa Inggris'];
  const ROMBELS=['IA','IB','IIA','IIB','IIIA','IIIB','IVA','IVB','V','VI'];
  const API='https://adm-sd.adm-sd.workers.dev/api';
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const normR=v=>{const s=String(v??'').trim().toUpperCase().replace(/\s+/g,'');const m={'1A':'IA','1B':'IB','2A':'IIA','2B':'IIB','3A':'IIIA','3B':'IIIB','4A':'IVA','4B':'IVB','5':'V','6':'VI'};return m[s]||s};
  const token=()=>localStorage.getItem('siAuthToken')||'';
  const api=async(path,opt={})=>{const h=Object.assign({'Accept':'application/json'},opt.headers||{});if(token())h.Authorization='Bearer '+token();if(opt.body)h['Content-Type']='application/json';const r=await fetch(API+path,Object.assign({},opt,{headers:h}));let p={};try{p=await r.json()}catch{}if(!r.ok||p.ok===false)throw Error(p.message||'Permintaan gagal.');return p};

  /* ===== POPUP LOADING AI OTOMATIS ===== */
  const AI_PROCESS={
    cp:['🎯','Menyusun Capaian Pembelajaran','Menganalisis fase, mata pelajaran, dan acuan CP'],
    tp:['🎯','Merancang Tujuan Pembelajaran','Menurunkan tujuan dari CP dan karakteristik kelas'],
    atp:['🧭','Menyusun Alur Tujuan Pembelajaran','Mengurutkan tujuan dari dasar hingga penerapan'],
    prota:['🗓️','Menyusun Program Tahunan','Menyusun alokasi materi dan asesmen selama satu tahun'],
    prosem:['📅','Menyusun Program Semester','Membagi pembelajaran ke dalam minggu dan semester'],
    rpm:['🧠','Merancang RPM Mendalam','Menyusun pengalaman belajar mindful, meaningful, dan joyful'],
    lkpd:['📋','Membuat LKPD','Merancang aktivitas, instruksi, dan lembar kerja peserta didik'],
    soal_sumatif:['📝','Membuat Soal Sumatif','Menyusun soal dan kunci sesuai bentuk serta tingkat kesulitan'],
    soal_formatif:['✏️','Membuat Soal Formatif','Menyusun asesmen formatif untuk memantau proses belajar']
  };
  let aiPopupTimer=null,aiPopupStep=0,aiPopupDepth=0;
  function ensureAIPopup(){
    if(document.getElementById('gmAIPopup'))return;
    const style=document.createElement('style');style.id='gmAIPopupStyle';style.textContent=`
      #gmAIPopup{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(15,23,42,.48);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px)}
      #gmAIPopup.show{display:flex;animation:gmFadeIn .18s ease}
      #gmAIPopupCard{width:min(440px,100%);background:#fff;border:1px solid #e2e8f0;border-radius:24px;box-shadow:0 25px 80px rgba(15,23,42,.28);padding:26px;text-align:center;position:relative;overflow:hidden}
      #gmAIPopupGlow{position:absolute;width:180px;height:180px;border-radius:50%;left:50%;top:-115px;transform:translateX(-50%);background:radial-gradient(circle,#dbeafe,transparent 68%);pointer-events:none}
      #gmAIPopupIcon{position:relative;margin:0 auto 13px;width:68px;height:68px;border-radius:20px;display:grid;place-items:center;font-size:34px;background:#eff6ff;border:1px solid #bfdbfe;box-shadow:0 10px 28px rgba(37,99,235,.16);animation:gmPulse 1.45s ease-in-out infinite}
      #gmAIPopupTitle{font-size:19px;font-weight:900;color:#172033;margin:0 0 6px}
      #gmAIPopupDesc{font-size:13px;line-height:1.5;color:#64748b;min-height:39px}
      #gmAIPopupStatus{font-size:12px;font-weight:800;color:#2563eb;margin:15px 0 9px}
      #gmAIPopupBar{height:7px;background:#e2e8f0;border-radius:99px;overflow:hidden}
      #gmAIPopupBar>i{display:block;height:100%;width:18%;border-radius:99px;background:linear-gradient(90deg,#2563eb,#7c3aed,#06b6d4);animation:gmProgress 2.2s ease-in-out infinite}
      #gmAIPopupSteps{display:flex;justify-content:center;gap:6px;margin-top:15px}
      #gmAIPopupSteps span{width:8px;height:8px;border-radius:50%;background:#cbd5e1;transition:.25s}
      #gmAIPopupSteps span.on{background:#2563eb;transform:scale(1.25)}
      #gmAIPopupHint{margin-top:13px;font-size:11px;color:#94a3b8}
      @keyframes gmFadeIn{from{opacity:0;transform:scale(.98)}to{opacity:1;transform:scale(1)}}
      @keyframes gmPulse{50%{transform:scale(1.07) rotate(2deg);box-shadow:0 14px 35px rgba(37,99,235,.23)}}
      @keyframes gmProgress{0%{transform:translateX(-120%);width:24%}50%{width:46%}100%{transform:translateX(330%);width:24%}}
      @media(max-width:520px){#gmAIPopup{padding:14px}#gmAIPopupCard{padding:22px 18px;border-radius:20px}}
    `;document.head.appendChild(style);
    const box=document.createElement('div');box.id='gmAIPopup';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.innerHTML=`<div id="gmAIPopupCard"><div id="gmAIPopupGlow"></div><div id="gmAIPopupIcon">🤖</div><h3 id="gmAIPopupTitle">AI Guru sedang bekerja</h3><div id="gmAIPopupDesc">Mohon tunggu sebentar...</div><div id="gmAIPopupStatus">Menganalisis permintaan<span class="gmDots">...</span></div><div id="gmAIPopupBar"><i></i></div><div id="gmAIPopupSteps"><span></span><span></span><span></span></div><div id="gmAIPopupHint">Jangan tutup halaman selama proses berlangsung.</div></div>`;document.body.appendChild(box)
  }
  function aiKindFromBody(body){try{const x=typeof body==='string'?JSON.parse(body):body;if(x&&x.jenis)return String(x.jenis)}catch{}return ''}
  function showAIPopup(type){
    ensureAIPopup();const cfg=AI_PROCESS[type]||['🤖','Membuat Dokumen dengan AI','AI sedang menganalisis permintaan dan menyusun hasil terbaik'];
    const box=document.getElementById('gmAIPopup');if(!box)return;aiPopupDepth++;aiPopupStep=0;
    document.getElementById('gmAIPopupIcon').textContent=cfg[0];document.getElementById('gmAIPopupTitle').textContent=cfg[1];document.getElementById('gmAIPopupDesc').textContent=cfg[2];box.classList.add('show');document.body.style.overflow='hidden';
    clearInterval(aiPopupTimer);aiPopupTimer=setInterval(()=>{aiPopupStep=(aiPopupStep+1)%3;const names=['Menganalisis kebutuhan','Menyusun materi','Finalisasi dokumen'];document.getElementById('gmAIPopupStatus').innerHTML=names[aiPopupStep]+'<span class="gmDots">...</span>';document.querySelectorAll('#gmAIPopupSteps span').forEach((e,i)=>e.classList.toggle('on',i===aiPopupStep))},1150);
  }
  function hideAIPopup(){if(aiPopupDepth>0)aiPopupDepth--;if(aiPopupDepth>0)return;clearInterval(aiPopupTimer);const box=document.getElementById('gmAIPopup');if(box)box.classList.remove('show');document.body.style.overflow=''}
  function hookAIFetch(){
    if(window.__gmAIFetchHook)return;window.__gmAIFetchHook=true;const nativeFetch=window.fetch.bind(window);
    window.fetch=async function(input,init){
      const url=typeof input==='string'?input:(input&&input.url)||'';const isAI=/\/ai\/generate(?:\?|$)/.test(url);
      if(!isAI)return nativeFetch(input,init);
      let body=init&&init.body;if(body==null&&input&&typeof input!=='string')body=input.body;const kind=aiKindFromBody(body);showAIPopup(kind);
      try{return await nativeFetch(input,init)}finally{hideAIPopup()}
    }
  }
  function initPopupHook(){ensureAIPopup();hookAIFetch()}

  function inject(){
    const sec=document.getElementById('teachers');
    if(!sec||document.getElementById('gmPanel'))return;
    const panel=document.createElement('div');panel.id='gmPanel';panel.className='card panel';
    panel.innerHTML=`<div class="student-head"><div><h3>🎓 Data Guru Mapel</h3><p class="muted">Akun guru mapel tersimpan di Cloudflare D1. Guru Mapel dapat mengakses semua rombel tetapi hanya mata pelajaran yang ditetapkan.</p></div><button class="btn secondary" id="gmRefresh">↻ Muat Ulang</button></div><div class="grid" style="grid-template-columns:1.2fr 1.2fr 1fr 1fr 1fr"><div><label>Nama Guru</label><input id="gmNama" placeholder="Nama lengkap"></div><div><label>Username</label><input id="gmUsername" placeholder="Username login"></div><div><label>Password</label><input id="gmPassword" type="password" placeholder="Password (kosong = tetap)"></div><div><label>Mata Pelajaran</label><select id="gmMapel">${SUBJECTS.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('')}</select></div><div><label>Rombel</label><select id="gmRombel"><option value="ALL">SEMUA ROMBEL</option>${ROMBELS.map(x=>`<option value="${x}">${x}</option>`).join('')}</select></div></div><div class="toolbar"><button class="btn primary" id="gmSave">💾 Buat Akun Guru Mapel</button><button class="btn secondary" id="gmCancel" style="display:none">Batal Edit</button><button class="btn secondary" id="gmReset">Reset</button></div><div id="gmMsg" class="alert"></div><div class="tablewrap" style="margin-top:12px"><table class="table"><thead><tr><th>Username</th><th>Nama</th><th>Peran</th><th>Mapel</th><th>Rombel</th><th>Aksi</th></tr></thead><tbody id="gmTable"><tr><td colspan="6" class="muted">Memuat data...</td></tr></tbody></table></div>`;
    sec.insertBefore(panel,sec.firstChild);
    document.getElementById('gmSave')?.addEventListener('click',save);
    document.getElementById('gmRefresh')?.addEventListener('click',load);
    document.getElementById('gmReset')?.addEventListener('click',resetForm);document.getElementById('gmCancel')?.addEventListener('click',resetForm);
    load();
  }
  function msg(text,ok){const e=document.getElementById('gmMsg');if(!e)return;e.textContent=text;e.className='alert'+(ok?' successbox':'');e.style.display='block'}
  async function load(){const tb=document.getElementById('gmTable');if(!tb)return;tb.innerHTML='<tr><td colspan="6" class="muted">Memuat...</td></tr>';try{const p=await api('/guru');const rows=Array.isArray(p.data)?p.data:[];tb.innerHTML=rows.map(x=>`<tr><td><b>${esc(x.username)}</b></td><td>${esc(x.nama)}</td><td><span class="badge">${x.role==='guru_mapel'?'Guru Mapel':x.role==='admin'?'Administrator':'Guru Kelas'}</span></td><td>${esc(x.mapel||'-')}</td><td>${esc(normR(x.rombel||x.kelas)||'Semua')}</td><td><button class="btn secondary gmEdit" data-id="${esc(x.id)}" data-username="${esc(x.username)}" data-nama="${esc(x.nama)}" data-mapel="${esc(x.mapel||'')}" data-rombel="${esc(normR(x.rombel||x.kelas)||'ALL')}">✏️ Edit</button></td></tr>`).join('')||'<tr><td colspan="6" class="muted">Belum ada akun.</td></tr>'}catch(e){tb.innerHTML=`<tr><td colspan="6" class="danger-text">${esc(e.message)}</td></tr>`}document.querySelectorAll('.gmEdit').forEach(b=>b.addEventListener('click',()=>startEdit(b.dataset)))}
  function resetForm(){['gmNama','gmUsername','gmPassword'].forEach(x=>{const e=document.getElementById(x);if(e)e.value=''});const id=document.getElementById('gmEditId');if(id)id.value='';const b=document.getElementById('gmSave');if(b)b.textContent='💾 Buat Akun Guru Mapel';const c=document.getElementById('gmCancel');if(c)c.style.display='none'}
  function startEdit(x){let id=document.getElementById('gmEditId');if(!id){id=document.createElement('input');id.type='hidden';id.id='gmEditId';document.getElementById('gmPanel')?.appendChild(id)}id.value=x.id;document.getElementById('gmNama').value=x.nama||'';document.getElementById('gmUsername').value=x.username||'';document.getElementById('gmPassword').value='';document.getElementById('gmMapel').value=x.mapel||'';document.getElementById('gmRombel').value=x.rombel||'ALL';document.getElementById('gmSave').textContent='💾 Simpan Perubahan';document.getElementById('gmCancel').style.display='inline-block'}
  async function save(){const nama=document.getElementById('gmNama')?.value.trim(),username=document.getElementById('gmUsername')?.value.trim(),password=document.getElementById('gmPassword')?.value||'',mapel=document.getElementById('gmMapel')?.value||'',rombel=document.getElementById('gmRombel')?.value||'ALL',editId=document.getElementById('gmEditId')?.value||'';if(!nama||!username||!mapel||(!editId&&!password))return msg(editId?'Nama, username, dan mapel wajib diisi.':'Nama, username, password, dan mapel wajib diisi.');try{const body={nama,username,mapel,rombel,role:'guru_mapel'};if(password)body.password=password;await api(editId?'/guru/'+encodeURIComponent(editId):'/guru',{method:editId?'PUT':'POST',body:JSON.stringify(editId?body:{...body,password})});msg(editId?'✓ Data Guru Mapel berhasil diperbarui.':'✓ Akun Guru Mapel berhasil dibuat.',true);resetForm();await load()}catch(e){msg(e.message||'Gagal menyimpan data.')}}
  function bind(){inject()}
  function hook(){const nav=document.querySelector('.navbtn[data-page="teachers"]');if(nav&&!nav.dataset.gmHook){nav.dataset.gmHook='1';const old=nav.onclick;nav.onclick=function(e){if(typeof old==='function')old.call(this,e);setTimeout(bind,20)}}if(document.getElementById('teachers')?.classList.contains('active'))bind()}
  function boot(){initPopupHook();hook()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0),{once:true});else setTimeout(boot,0);
})();