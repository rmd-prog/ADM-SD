/* ADM-SD — role menu + AI Brain V4.1 loader */
(function(){
'use strict';
const getUser=()=>{try{const x=JSON.parse(localStorage.getItem('siLogin')||'null');return x?.user||x||null}catch{return null}};
const isAdmin=()=>String(getUser()?.role||'').toLowerCase()==='admin';
const norm=s=>String(s||'').trim().toLowerCase().replace(/\s+/g,' ');
function applyRoleMenu(){const admin=isAdmin();document.querySelectorAll('.navbtn,.navgroup,.menu-group').forEach(el=>{const text=norm(el.textContent),page=norm(el.getAttribute('data-page'));const teacher=page==='teachers'||text.includes('data guru');const system=page==='system'||page==='settings'||text==='sistem'||text.includes('menu sistem');const sibi=page==='reference'||text.includes('referensi sibi')||text.includes('sibi');if(!admin&&(teacher||system||sibi))el.style.display='none';if(admin&&(teacher||system||sibi))el.style.display=''});document.querySelectorAll('.menu-group').forEach(g=>{if(admin){g.style.display='';return}const visible=[...g.querySelectorAll('.navbtn')].some(x=>getComputedStyle(x).display!=='none');const title=norm(g.querySelector('.navgroup')?.textContent);if(title.includes('sistem')||title.includes('referensi sibi'))g.style.display='none';else if(g.querySelector('.submenu')&&!visible)g.style.display='none'});const cur=document.querySelector('.page.active');if(!admin&&cur&&norm(cur.id)==='teachers'){const d=document.querySelector('[data-page="dashboard"]');if(d)d.click()}}
function loadScript(src,key){if(window[key])return;window[key]=true;const s=document.createElement('script');s.src=src;s.async=false;(document.head||document.documentElement).appendChild(s)}
function boot(){applyRoleMenu();loadScript('assets/multi-rombel.js?v=1','__ADM_MULTI_ROMBEL_LOADED');loadScript('assets/ai-brain-v41.js?v=41','__ADM_AI_V41_LOADED');window.__ADM_APPLY_ROLE_MENU=applyRoleMenu}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
const obs=new MutationObserver(()=>{if(!window.__ADM_AI_V41_LOADED)loadScript('assets/ai-brain-v41.js?v=41','__ADM_AI_V41_LOADED')});if(document.body)obs.observe(document.body,{childList:true,subtree:true});
})();
