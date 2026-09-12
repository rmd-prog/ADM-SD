/* GURU+ SD — DASHBOARD RESET v9
 * Temporary clean foundation. Dashboard is intentionally EMPTY.
 * Keeps backend, D1, student data and login untouched.
 */
(function(){'use strict';
if(window.__GURU_SD_GLOBAL_INTEGRITY_V9__)return;window.__GURU_SD_GLOBAL_INTEGRITY_V9__=1;
const $=id=>document.getElementById(id);
function emptyDashboard(){
 const d=$('dashboard');if(!d)return;
 d.innerHTML='';
 d.removeAttribute('style');
}
function cleanMenu(){
 const side=$('sidebar');if(!side)return;
 const norm=s=>String(s||'').replace(/\s+/g,' ').trim().toLowerCase();
 side.querySelectorAll('.menu-group').forEach(g=>{const h=g.querySelector('.navgroup');if(h&&!norm(h.textContent).includes('data siswa'))g.remove()});
 side.querySelectorAll('.navbtn').forEach(b=>{const p=String(b.dataset.page||''),t=norm(b.textContent);if(p!=='dashboard'&&p!=='students'&&!t.includes('dashboard')&&!t.includes('daftar siswa'))b.remove()});
 const title=side.querySelector('.side-title');if(title)title.textContent='MENU UTAMA';
}
function boot(){
 emptyDashboard();cleanMenu();
 setTimeout(emptyDashboard,100);setTimeout(emptyDashboard,300);setTimeout(emptyDashboard,700);setTimeout(emptyDashboard,1500);
 setTimeout(cleanMenu,300);setTimeout(cleanMenu,1000);
 const d=$('dashboard');if(d&&!d.__emptyGuard){d.__emptyGuard=1;new MutationObserver(()=>{if(d.childElementCount) d.innerHTML=''}).observe(d,{childList:true});}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,100));else setTimeout(boot,100);
window.GURU_SD_GLOBAL_INTEGRITY={emptyDashboard,cleanMainMenu:cleanMenu,canonical:true};
})();