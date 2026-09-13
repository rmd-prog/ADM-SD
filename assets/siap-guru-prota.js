/* SIAP GURU — PROTA bridge
 * Safe isolated module: uses the existing #prota page and existing document state.
 * It does NOT register navigation handlers and does NOT touch D1, Worker, Login, or Dashboard.
 */
(function(){
  'use strict';
  if(window.__SIAP_GURU_PROTA_BRIDGE__) return;
  window.__SIAP_GURU_PROTA_BRIDGE__ = 1;

  const q=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function getState(){
    const kelas=q('protaKelas')?.value||'';
    const mapel=q('protaMapel')?.value||'';
    return {kelas,mapel};
  }

  function key(type,kelas,mapel){
    if(typeof window.docKey==='function') return window.docKey(type,kelas,mapel);
    return type+'|'+kelas+'|'+mapel;
  }

  function units(kelas,mapel){
    try{
      if(typeof window.unitTitles==='function') return window.unitTitles(mapel,kelas)||[];
    }catch(e){}
    return Array.from({length:8},(_,i)=>'Unit '+(i+1));
  }

  function getTP(kelas,mapel){
    try{
      if(window.db?.texts){
        const t=window.db.texts[key('tp',kelas,mapel)];
        if(t) return String(t);
      }
    }catch(e){}
    try{
      const raw=JSON.parse(localStorage.getItem('guru_sd_db')||'null');
      const t=raw?.texts?.[key('tp',kelas,mapel)];
      if(t) return String(t);
    }catch(e){}
    return '';
  }

  function parseTP(text,items){
    const out=[];
    const lines=String(text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
    for(const line of lines){
      const m=line.match(/^(\d+)\.\s*(.+)$/);
      if(m && Number(m[1])<=items.length) out[Number(m[1])-1]=m[2];
    }
    return items.map((u,i)=>out[i]||'Tujuan Pembelajaran untuk '+u+'.');
  }

  function setStatus(text,ok){
    const el=q('sgProtaStatus');
    if(!el)return;
    el.textContent=text;
    el.style.color=ok===false?'#b91c1c':'#475569';
  }

  function buildFromTP(){
    const {kelas,mapel}=getState();
    if(!kelas||!mapel){setStatus('Pilih rombel dan mata pelajaran terlebih dahulu.',false);return;}
    if(typeof window.isGuruKelas==='function' && window.isGuruKelas() && typeof window.allowedClass==='function' && window.normalizeRombel?.(kelas)!==window.allowedClass()){
      setStatus('Akses ditolak: rombel tidak sesuai akun guru.',false);return;
    }
    const items=units(kelas,mapel);
    const tpText=getTP(kelas,mapel);
    const tp=parseTP(tpText,items);
    const half=Math.ceil(items.length/2);
    const lines=[
      'PROGRAM TAHUNAN (PROTA)',
      'Rombel '+kelas+' • Fase '+(typeof window.faseForClass==='function'?window.faseForClass(kelas):'-')+' • '+mapel,
      'Tahun Pelajaran 2026/2027','',
      ...items.map((u,i)=>[
        'No. '+(i+1),
        'Unit/Materi: '+u,
        'Tujuan Pembelajaran: '+tp[i],
        'Semester: '+(i<half?1:2),
        'Alokasi: 9 JP',
        'Asesmen: Diagnostik • Formatif • Sumatif',''
      ].join('\n')),
      'REKAP',
      'Semester 1: '+(half*9)+' JP',
      'Semester 2: '+((items.length-half)*9)+' JP'
    ];
    if(q('protaText')) q('protaText').value=lines.join('\n');
    renderPreview(kelas,mapel,items,tp);
    setStatus(tpText?'TP berhasil diambil dan dimasukkan ke rancangan PROTA.':'TP belum tersimpan; PROTA dibuat dengan TP adaptif per unit.',true);
  }

  function renderPreview(kelas,mapel,items,tp){
    const el=q('protaPreview'); if(!el)return;
    const half=Math.ceil(items.length/2);
    let html='<div class="doc-section"><h4>📅 PROTA terhubung TP</h4><div class="tablewrap"><table class="sg-prota-table"><thead><tr><th>No</th><th>Unit / Materi</th><th>Tujuan Pembelajaran</th><th>JP</th><th>Semester</th></tr></thead><tbody>';
    items.forEach((u,i)=>{
      html+='<tr><td>'+(i+1)+'</td><td><b>'+esc(u)+'</b></td><td class="sg-prota-tp">'+esc(tp[i]||'-')+'</td><td class="sg-prota-jp">9 JP</td><td>Semester '+(i<half?1:2)+'</td></tr>';
    });
    html+='</tbody></table></div><div class="doc-note">🔗 Sumber TP: dokumen TP tersimpan untuk rombel '+esc(kelas)+' • '+esc(mapel)+'. Edit tetap tersedia pada editor PROTA di bawah.</div></div>';
    el.innerHTML=html;
    const badge=q('protaBadge');if(badge)badge.textContent='TP terhubung • '+kelas;
  }

  function saveProtaBridge(){
    const {kelas,mapel}=getState();
    const text=q('protaText')?.value||'';
    if(!kelas||!mapel||!text.trim()){setStatus('Tidak ada isi PROTA yang dapat disimpan.',false);return;}
    try{
      if(window.db?.texts) window.db.texts[key('prota',kelas,mapel)]=text;
      if(typeof window.save==='function') window.save();
      renderPreview(kelas,mapel,units(kelas,mapel),parseTP(getTP(kelas,mapel),units(kelas,mapel)));
      setStatus('PROTA berhasil disimpan untuk rombel '+kelas+' • '+mapel+'.',true);
    }catch(e){setStatus('Gagal menyimpan PROTA: '+(e.message||e),false)}
  }

  function mount(){
    const page=q('prota');
    if(!page || q('sgProtaBridge')) return !!page;
    const editor=page.querySelector('.doc-editor');
    const bridge=document.createElement('div');
    bridge.id='sgProtaBridge';
    bridge.className='sg-prota-bridge';
    bridge.innerHTML='<div class="sg-prota-bridge-head"><div><div class="sg-prota-bridge-title">🔗 PROTA terhubung dengan TP</div><div class="sg-prota-bridge-sub">Ambil TP yang sudah tersimpan, jadikan dasar PROTA, lalu edit dan simpan tanpa mengubah navigasi aplikasi.</div></div></div><div class="sg-prota-bridge-actions"><button type="button" class="btn secondary" id="sgProtaTakeTp">↗ Ambil TP</button><button type="button" class="btn primary" id="sgProtaBuild">⚡ Bangun PROTA dari TP</button><button type="button" class="btn success" id="sgProtaSave">💾 Simpan PROTA</button></div><div id="sgProtaStatus" class="sg-prota-bridge-status">Siap. Pilih rombel dan mata pelajaran lalu ambil TP.</div>';
    if(editor) page.insertBefore(bridge,editor); else page.appendChild(bridge);
    q('sgProtaTakeTp').onclick=()=>{
      const {kelas,mapel}=getState();
      const t=getTP(kelas,mapel);
      if(q('protaText'))q('protaText').value=t||q('protaText').value||'';
      setStatus(t?'TP berhasil dimuat ke editor PROTA.':'TP belum ditemukan untuk kombinasi ini.',!!t);
      if(t)buildFromTP();
    };
    q('sgProtaBuild').onclick=buildFromTP;
    q('sgProtaSave').onclick=saveProtaBridge;
    ['protaKelas','protaMapel'].forEach(id=>q(id)?.addEventListener('change',()=>setStatus('Pilihan berubah. Ambil TP untuk memuat sumber terbaru.')));
    return true;
  }

  function boot(){
    if(mount()) return;
    setTimeout(boot,500);
  }

  function loadAssets(){
    if(!document.getElementById('sgProtaStyle')){
      const l=document.createElement('link');l.id='sgProtaStyle';l.rel='stylesheet';l.href='assets/siap-guru-prota.css';document.head.appendChild(l);
    }
    boot();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',loadAssets,{once:true});
  else loadAssets();
})();
