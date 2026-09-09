/* ADM-SD — role-specific navigation + AI Brain V3.5 renderer */
(function(){
  'use strict';
  const getUser=()=>{try{const x=JSON.parse(localStorage.getItem('siLogin')||'null');return x?.user||x||null}catch{return null}};
  const isAdmin=()=>String(getUser()?.role||'').toLowerCase()==='admin';
  const norm=s=>String(s||'').trim().toLowerCase().replace(/\s+/g,' ');
  function applyRoleMenu(){
    const admin=isAdmin();
    document.querySelectorAll('.navbtn,.navgroup,.menu-group').forEach(el=>{
      const text=norm(el.textContent),page=norm(el.getAttribute('data-page'));
      const isTeacher=page==='teachers'||text.includes('data guru'),isSystem=page==='system'||page==='settings'||text==='sistem'||text.includes('menu sistem'),isSibi=page==='reference'||text.includes('referensi sibi')||text.includes('sibi');
      if(!admin&&(isTeacher||isSystem||isSibi))el.style.display='none';
      if(admin&&(isTeacher||isSystem||isSibi))el.style.display='';
    });
    document.querySelectorAll('.menu-group').forEach(group=>{if(admin){group.style.display='';return}const visible=[...group.querySelectorAll('.navbtn')].some(x=>getComputedStyle(x).display!=='none');const title=norm(group.querySelector('.navgroup')?.textContent);if(title.includes('sistem')||title.includes('referensi sibi'))group.style.display='none';else if(group.querySelector('.submenu')&&!visible)group.style.display='none'});
    const current=document.querySelector('.page.active');if(!admin&&current&&norm(current.id)==='teachers'){const dash=document.querySelector('[data-page="dashboard"]');if(dash)dash.click()}
  }
  function loadMultiRombel(){if(window.__ADM_MULTI_ROMBEL_LOADED)return;window.__ADM_MULTI_ROMBEL_LOADED=true;const s=document.createElement('script');s.src='assets/multi-rombel.js?v=1';s.async=false;document.head.appendChild(s)}

  /* ===== AI BRAIN V3.5 =====
     The frontend is the final safety gate. A generated document is never allowed to
     leak another document type, raw HTML/SVG, or ASCII diagrams into the teacher UI. */
  const decode=s=>String(s||'').replace(/\\/g,'').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'\"').replace(/&#39;/gi,"'");
  const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');
  function visual(type,a={}){
    const label=esc(a.label||'Stimulus visual');
    const wrap=inner=>`<div class="ai-visual" style="margin:12px 0;text-align:center;padding:8px 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" width="100%" role="img" aria-label="${label}" style="max-width:640px;height:auto;border:1px solid #d9dee8;border-radius:14px;background:#fff">${inner}</svg></div>`;
    if(type==='bar'){
      const labels=String(a.labels||'Januari|Februari|Maret|April').split('|').slice(0,6),vals=String(a.values||'240|180|120|80').split('|').map(Number).slice(0,6),max=Math.max(1,...vals);let s=`<text x="320" y="28" text-anchor="middle" font-size="19" font-weight="700">${label}</text><line x1="58" y1="228" x2="600" y2="228" stroke="#334155" stroke-width="2"/>`;labels.forEach((lb,i)=>{const v=Math.max(0,vals[i]||0),h=150*v/max,x=72+i*125,y=228-h;s+=`<rect x="${x}" y="${y}" width="72" height="${h}" rx="8" fill="#60a5fa" stroke="#1e3a8a" stroke-width="2"/><text x="${x+36}" y="${y-8}" text-anchor="middle" font-size="14" font-weight="700">${v}</text><text x="${x+36}" y="250" text-anchor="middle" font-size="14">${esc(lb)}</text>`});return wrap(s)}
    if(type==='light'){
      const rays=[-28,-14,0,14,28].map(d=>{const r=d*Math.PI/180;return `<line x1="${112+48*Math.cos(r)}" y1="${112+48*Math.sin(r)}" x2="245" y2="${112+d*1.6}" stroke="#f59e0b" stroke-width="6"/>`}).join('');
      const ticks=[0,45,90,135,180,225,270,315].map(d=>{const r=d*Math.PI/180;return `<line x1="${112+55*Math.cos(r)}" y1="${112+55*Math.sin(r)}" x2="${112+72*Math.cos(r)}" y2="${112+72*Math.sin(r)}" stroke="#b45309" stroke-width="5"/>`}).join('');
      return wrap(`<defs><marker id="aiArr" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 Z" fill="#334155"/></marker></defs><rect x="18" y="18" width="604" height="244" rx="18" fill="#fffbeb"/><circle cx="112" cy="112" r="42" fill="#f59e0b" stroke="#b45309" stroke-width="4"/>${ticks}<text x="112" y="175" text-anchor="middle" font-size="15" font-weight="700">Sumber cahaya</text>${rays}<rect x="255" y="74" width="125" height="76" rx="10" fill="#64748b" stroke="#334155" stroke-width="3"/><text x="317" y="119" text-anchor="middle" font-size="18" font-weight="700" fill="#fff">Benda</text><line x1="385" y1="112" x2="520" y2="112" stroke="#334155" stroke-width="7" marker-end="url(#aiArr)"/><rect x="520" y="50" width="18" height="125" rx="4" fill="#475569"/><path d="M520 94 H450 V175 H520" fill="#94a3b8" opacity=".65"/><text x="529" y="198" text-anchor="middle" font-size="14" font-weight="700">Layar</text><text x="317" y="245" text-anchor="middle" font-size="14">Cahaya → benda → bayangan pada layar</text>`)}
    if(type==='fraction'){const n=Math.max(0,Math.min(20,Number(a.n||3))),d=Math.max(1,Math.min(20,Number(a.d||4))),x=155,y=75,w=330,h=90,p=w/d;let s=`<text x="320" y="35" text-anchor="middle" font-size="19" font-weight="700">${label}</text>`;for(let i=0;i<d;i++)s+=`<rect x="${x+i*p}" y="${y}" width="${Math.max(1,p-3)}" height="${h}" rx="4" fill="${i<n?'#60a5fa':'#fff'}" stroke="#334155" stroke-width="2"/>`;return wrap(s+`<text x="320" y="210" text-anchor="middle" font-size="24" font-weight="700">${n}/${d}</text>`)}
    if(type==='clock'){const h=Number(a.hour||3)%12,m=Math.max(0,Math.min(59,Number(a.minute||0))),cx=320,cy=145,ha=(h+m/60)*Math.PI/6-Math.PI/2,ma=m*Math.PI/30-Math.PI/2;let ticks='';for(let i=0;i<12;i++){const r=i*Math.PI/6-Math.PI/2;ticks+=`<line x1="${cx+62*Math.cos(r)}" y1="${cy+62*Math.sin(r)}" x2="${cx+72*Math.cos(r)}" y2="${cy+72*Math.sin(r)}" stroke="#334155" stroke-width="3"/>`}return wrap(`<text x="320" y="30" text-anchor="middle" font-size="19" font-weight="700">${label}</text><circle cx="320" cy="145" r="84" fill="#fff" stroke="#1e3a8a" stroke-width="4"/>${ticks}<line x1="320" y1="145" x2="${320+42*Math.cos(ha)}" y2="${145+42*Math.sin(ha)}" stroke="#0f172a" stroke-width="7"/><line x1="320" y1="145" x2="${320+62*Math.cos(ma)}" y2="${145+62*Math.sin(ma)}" stroke="#2563eb" stroke-width="4"/><circle cx="320" cy="145" r="6" fill="#0f172a"/>`)}
    if(type==='shape'){const sh=String(a.shape||'triangle').toLowerCase();const p=sh==='circle'?'<circle cx="320" cy="145" r="86" fill="#bfdbfe" stroke="#1e3a8a" stroke-width="4"/>':sh==='square'?'<rect x="235" y="60" width="170" height="170" rx="7" fill="#bfdbfe" stroke="#1e3a8a" stroke-width="4"/>':'<polygon points="320,45 160,230 480,230" fill="#bfdbfe" stroke="#1e3a8a" stroke-width="4"/>';return wrap(`<text x="320" y="30" text-anchor="middle" font-size="19" font-weight="700">${label}</text>${p}`)}
    if(type==='numberline'){const min=Number(a.min||0),max=Number(a.max||10),point=Number(a.point||6),span=Math.max(1,max-min);let s=`<text x="320" y="35" text-anchor="middle" font-size="19" font-weight="700">${label}</text><line x1="60" y1="140" x2="580" y2="140" stroke="#334155" stroke-width="4"/>`;for(let i=0;i<=span;i++){const x=60+520*i/span,v=min+i;s+=`<line x1="${x}" y1="126" x2="${x}" y2="154" stroke="#334155" stroke-width="2"/><text x="${x}" y="180" text-anchor="middle" font-size="14">${v}</text>`}const px=60+520*(point-min)/span;return wrap(s+`<circle cx="${px}" cy="140" r="11" fill="#2563eb"/><text x="${px}" y="108" text-anchor="middle" font-size="15" font-weight="700">${point}</text>`)}
    return '';
  }
  function cleanAIText(raw,jenis){
    let s=decode(raw);
    /* Remove model meta/reference chatter. */
    s=s.replace(/^\s*SUMBER\s+BUKU\s+TERKUNCI[\s\S]*?(?=\n\s*(?:SOAL|KISI[- ]?KISI|1[.)])|$)/gim,'');
    s=s.replace(/^\s*(Judul buku|Sumber|Tahun\/Edisi|Daftar\s+BAB\/?UNIT\s+terverifikasi|Daftar\s+BAB\s+Terverifikasi)\s*:.*$/gim,'');
    s=s.replace(/^\s*.*struktur\s+BAB\s+dari\s+PDF\s+referensi.*$/gim,'');
    s=s.replace(/^\s*Catatan\s*:\s*Bab\/subbab.*$/gim,'');
    if(jenis==='soal_sumatif'||jenis==='soal_formatif'){
      /* These are never part of the requested final package. */
      s=s.replace(/^\s*(KISI[- ]?KISI|KISI[- ]?KISI SOAL|BLUEPRINT|TABEL KISI[- ]?KISI)[\s\S]*?(?=\n\s*(?:SOAL|PETUNJUK|NAMA|1[.)])|$)/gim,'');
      s=s.replace(/^\s*(RENCANA PELAKSANAAN PEMBELAJARAN|RPP|MODUL AJAR|LKPD|PROGRAM SEMESTER|PROTA|PROMES|RINGKASAN MATERI)\b[\s\S]*?(?=\n\s*(?:SOAL|PETUNJUK|1[.)])|$)/gim,'');
    }
    /* Never let an old document continue after a hard document boundary. */
    s=s.replace(/\n\s*(?:KISI[- ]?KISI|DOKUMEN SEBELUMNYA|DOKUMEN LAIN|LAMPIRAN DOKUMEN)[\s\S]*$/i,'');
    /* Convert controlled visual tokens. */
    s=s.replace(/\[\[GAMBAR\s+([^\]]+)\]\]/gi,(m,rawAttrs)=>{const a={};String(rawAttrs).replace(/([a-zA-Z]+)\s*=\s*[\"']([^\"']*)[\"']/g,(_,k,v)=>a[k]=v);return visual(String(a.type||'').toLowerCase(),a)});
    /* Convert escaped controlled visual blocks returned by older worker versions. */
    s=s.replace(/<div\s+class=[\"']ai-visual[\"'][\s\S]*?<\/div>/gi,m=>m);
    /* Remove ASCII light diagrams; the visual is generated from semantics instead. */
    if(/Sumber\s+cahaya/i.test(s)&&/Benda/i.test(s)&&/(Bayangan|Layar)/i.test(s)&&/[\\/|*]/.test(s)){
      s=s.replace(/Sumber\s+cahaya[\s\S]{0,1800}/i,visual('light',{label:'Sumber cahaya, benda, dan bayangan'}));
    }
    return s.replace(/\n{3,}/g,'\n\n').trim();
  }
  function installAIFetchGuard(){
    if(window.__ADM_AI_FETCH_V35)return;
    const native=window.fetch.bind(window);window.__ADM_AI_FETCH_V35=true;
    window.fetch=async function(input,init){
      const req=input instanceof Request?input:new Request(input,init);
      let res=await native(req);
      try{
        const u=new URL(req.url,location.href);
        if(!/\/api\/ai\/generate$/.test(u.pathname)||!res.ok)return res;
        const body=await req.clone().json().catch(()=>null);const jenis=String(body?.jenis||'').toLowerCase();
        const data=await res.clone().json();if(data&&typeof data.text==='string'){data.text=cleanAIText(data.text,jenis);data.aiBrain='V3.5-FRONTEND-GUARD';}
        const h=new Headers(res.headers);h.set('Content-Type','application/json');return new Response(JSON.stringify(data),{status:res.status,statusText:res.statusText,headers:h});
      }catch{return res}
    };
  }
  function installAIRenderObserver(){
    if(window.__ADM_AI_DOM_V35)return;window.__ADM_AI_DOM_V35=true;
    const run=()=>{document.querySelectorAll('.markdown-clean').forEach(el=>{const raw=el.innerHTML||'';if(/&lt;div|&lt;svg|<div[^>]+ai-visual/i.test(raw)){const cleaned=cleanAIText(el.textContent||el.innerHTML,'soal_sumatif');if(cleaned&&cleaned!==el.innerHTML)el.innerHTML=cleaned}})};
    const obs=new MutationObserver(()=>requestAnimationFrame(run));if(document.body)obs.observe(document.body,{childList:true,subtree:true});setTimeout(run,500);setTimeout(run,1800);
  }
  function boot(){applyRoleMenu();loadMultiRombel();installAIFetchGuard();installAIRenderObserver();const obs=new MutationObserver(()=>applyRoleMenu());if(document.body)obs.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','data-page']});window.__ADM_APPLY_ROLE_MENU=applyRoleMenu}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
