/* ADM-SD — role menu + access loaders */
(function(){
'use strict';
const getUser=()=>{try{const x=JSON.parse(localStorage.getItem('siLogin')||'null');return x?.user||x||null}catch{return null}};
const getToken=()=>{
  try{const t=String(localStorage.getItem('siAuthToken')||'').trim();if(t)return t}catch{}
  try{const x=JSON.parse(localStorage.getItem('siLogin')||'null');return String(x?.token||x?.access_token||x?.user?.token||x?.user?.access_token||'').trim()}catch{return ''}
};
function persistLoginToken(token,user){
  token=String(token||'').trim();
  if(!token)return;
  try{localStorage.setItem('siAuthToken',token)}catch{}
  try{
    const old=JSON.parse(localStorage.getItem('siLogin')||'null');
    const u=user||old?.user||old||{};
    const next=old&&typeof old==='object'&&!Array.isArray(old)?{...old,token,access_token:token,user:old.user?{...old.user,token,access_token:token}:old.user}:({...u,token,access_token:token});
    localStorage.setItem('siLogin',JSON.stringify(next));
  }catch{}
}
function installAuthTokenBridge(){
  if(window.__ADM_AUTH_TOKEN_BRIDGE)return;
  const nativeFetch=window.fetch;
  if(typeof nativeFetch!=='function')return;
  window.__ADM_AUTH_TOKEN_BRIDGE=true;
  window.fetch=async function(input,init){
    const reqUrl=typeof input==='string'?input:(input?.url||'');
    const url=String(reqUrl);
    const isLogin=/\/api\/login(?:\?|$)/i.test(url);
    const isWorkerApi=/https:\/\/adm-sd\.adm-sd\.workers\.dev\/api\//i.test(url)||/(^|\/)api\//i.test(url);
    let nextInit=init;
    if(!isLogin&&isWorkerApi){
      const token=getToken();
      if(token){
        try{
          const headers=new Headers(input?.headers||undefined);
          if(init?.headers){new Headers(init.headers).forEach((v,k)=>headers.set(k,v))}
          if(!headers.get('Authorization'))headers.set('Authorization','Bearer '+token);
          if(!headers.get('X-ADM-Token'))headers.set('X-ADM-Token',token);
          nextInit={...(init||{}),headers};
        }catch{}
      }
    }
    let response=await nativeFetch.call(this,input,nextInit);
    try{
      if(isLogin&&response){
        const clone=response.clone();
        const data=await clone.json().catch(()=>null);
        const token=data?.token||data?.access_token||data?.user?.token||data?.user?.access_token||'';
        if(token)persistLoginToken(token,data?.user||data);
      }
      if(response&&response.ok){
        const h=(nextInit&&nextInit.headers)||{};
        const auth=(h instanceof Headers)?h.get('Authorization'):(h?.Authorization||h?.authorization||'');
        const token=String(auth||'').replace(/^Bearer\s+/i,'').trim();
        if(token)persistLoginToken(token);
      }
    }catch{}
    return response;
  };
}
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
function installMobileTouchFix(){
  if(window.__ADM_TOUCH_FIX_V15)return;
  window.__ADM_TOUCH_FIX_V15=true;
  const style=document.createElement('style');
  style.id='adm-touch-fix-v15';
  style.textContent='.v13-sidebar .navbtn,.v13-sidebar .navgroup,.v13-sidebar .submenu{position:relative;z-index:20;pointer-events:auto!important;touch-action:manipulation;-webkit-tap-highlight-color:transparent}#app .page.active{pointer-events:auto!important}#app .page.active input,#app .page.active select,#app .page.active textarea,#app .page.active button,#app .page.active .student-tab,#app .page.active .tablewrap{pointer-events:auto!important;touch-action:manipulation}';
  (document.head||document.documentElement).appendChild(style);
  const bind=()=>{
    document.querySelectorAll('.v13-sidebar .submenu .navbtn').forEach(b=>{
      if(b.dataset.touchV15)return;
      b.dataset.touchV15='1';
      b.addEventListener('click',e=>e.stopPropagation(),false);
      b.addEventListener('touchend',e=>e.stopPropagation(),false);
    });
    document.querySelectorAll('#app .page.active input,#app .page.active select,#app .page.active textarea,#app .page.active button').forEach(el=>{el.style.pointerEvents='auto';el.style.touchAction='manipulation'});
  };
  bind();
  new MutationObserver(bind).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
}
function boot(){
  installAuthTokenBridge();
  applyRoleMenu();
  installD1SyncButtonFix();
  installMobileTouchFix();
  loadScript('assets/ui-feedback.js?v=1','__ADM_UI_FEEDBACK_LOADED');
  loadScript('assets/loading-system.js?v=1','__ADM_LOADING_SYSTEM');
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