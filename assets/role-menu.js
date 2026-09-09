/* ADM-SD — role menu + access loaders */
(function(){
'use strict';
const getUser=()=>{try{const x=JSON.parse(localStorage.getItem('siLogin')||'null');return x?.user||x||null}catch{return null}};
const getToken=()=>{
  try{const t=String(localStorage.getItem('siAuthToken')||'').trim();if(t)return t}catch{}
  try{const x=JSON.parse(localStorage.getItem('siLogin')||'null');return String(x?.token||x?.access_token||x?.user?.token||x?.user?.access_token||'').trim()}catch{return ''}
};
const isAdmin=()=>String(getUser()?.role||'').toLowerCase()==='admin';
const norm=s=>String(s||'').trim().toLowerCase().replace(/\s+/g,' ');
function applyRoleMenu(){
  const admin=isAdmin();
  document.querySelectorAll('.navbtn,.navgroup,.menu-group').forEach(el=>{
    const text=norm(el.textContent),page=norm(el.getAttribute('data-page'));
    const teacher=page==='teachers'||text.includes('data guru');
    const system=page==='system'||page==='settings'||text==='sistem'||text.includes('menu sistem');
    const sibi=page==='reference'||text.includes('referensi sibi')||text.includes('sibi');
    if(!admin&&(teacher||system||sibi))el.style.display='none';
    if(admin&&(teacher||system||sibi))el.style.display='';
  });
  document.querySelectorAll('.menu-group').forEach(g=>{
    if(admin){g.style.display='';return}
    const visible=[...g.querySelectorAll('.navbtn')].some(x=>getComputedStyle(x).display!=='none');
    const title=norm(g.querySelector('.navgroup')?.textContent);
    if(title.includes('sistem')||title.includes('referensi sibi'))g.style.display='none';
    else if(g.querySelector('.submenu')&&!visible)g.style.display='none';
  });
  const cur=document.querySelector('.page.active');
  if(!admin&&cur&&norm(cur.id)==='teachers'){const d=document.querySelector('[data-page="dashboard"]');if(d)d.click()}
}
function loadScript(src,key){
  if(window[key])return;
  if(document.querySelector('script[data-adm-loader="'+key+'"]'))return;
  const s=document.createElement('script');
  s.src=src;s.async=false;s.dataset.admLoader=key;
  s.onload=()=>{window[key]=true};
  s.onerror=()=>{window[key]=false};
  (document.head||document.documentElement).appendChild(s);
}
function installD1SyncButtonFix(){
  const btn=document.getElementById('refreshStudents');
  if(!btn||btn.dataset.d1AuthFix==='1')return;
  btn.dataset.d1AuthFix='1';
  btn.onclick=async()=>{
    const token=getToken();
    if(!token){alert('Sesi login tidak ditemukan. Silakan login ulang.');return}
    const user=getUser()||{};
    const rombel=String(user.role||'').toLowerCase()==='guru' ? String(user.rombel||user.kelas||'').trim() : '';
    const qs=rombel?'?'+new URLSearchParams({rombel}).toString():'';
    const old=btn.textContent;
    btn.disabled=true;btn.textContent='⏳ Sinkronisasi...';
    try{
      const res=await fetch('https://adm-sd.adm-sd.workers.dev/api/siswa'+qs,{method:'GET',mode:'cors',cache:'no-store',headers:{'Accept':'application/json','Authorization':'Bearer '+token,'X-ADM-Token':token}});
      const out=await res.json().catch(()=>({}));
      if(!res.ok||out.ok===false)throw new Error(out.message||('Gagal sinkron D1 (HTTP '+res.status+').'));
      if(Array.isArray(out.data)&&typeof normalizeStudentRow==='function'&&typeof db!=='undefined'){
        db.students=out.data.map(normalizeStudentRow).filter(s=>s.name);
        if(typeof save==='function')save();
        if(typeof renderStats==='function')renderStats();
        if(typeof renderStudents==='function')renderStudents();
        if(typeof renderReport==='function')renderReport();
        if(typeof renderScores==='function')renderScores();
      }
      alert('Data siswa sudah disinkronkan dari D1.');
    }catch(e){alert(e?.message||'Sinkronisasi D1 gagal.')}finally{btn.disabled=false;btn.textContent=old}
  };
}
function boot(){
  applyRoleMenu();
  installD1SyncButtonFix();
  loadScript('assets/multi-rombel.js?v=1','__ADM_MULTI_ROMBEL_LOADED');
  loadScript('assets/guru-mapel-access.js?v=2','__ADM_GURU_MAPEL_ACCESS_LOADED');
  loadScript('assets/ai-brain-v41.js?v=411','__ADM_AI_V41_LOADED');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
const obs=new MutationObserver(()=>{
  installD1SyncButtonFix();
  if(!window.__ADM_AI_V41_LOADED)loadScript('assets/ai-brain-v41.js?v=411','__ADM_AI_V41_LOADED');
  if(!window.__ADM_GURU_MAPEL_ACCESS_LOADED)loadScript('assets/guru-mapel-access.js?v=2','__ADM_GURU_MAPEL_ACCESS_LOADED');
});
if(document.body)obs.observe(document.body,{childList:true,subtree:true});
})();
