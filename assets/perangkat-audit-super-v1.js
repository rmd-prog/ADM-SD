/* GURU+ SD — DASHBOARD EMPTY RESET v8 — HARD PAGE GUARD */
(function(){'use strict';
if(window.__AUDIT_PERANGKAT_SUPER_V8__)return;window.__AUDIT_PERANGKAT_SUPER_V8__=1;
const $=id=>document.getElementById(id);
const ALLOWED=new Set(['dashboard','students']);
let userNavUntil=0;
function emptyDashboard(){
 const d=$('dashboard');if(!d)return;
 d.innerHTML='';
 d.setAttribute('data-dashboard-empty','true');
 let s=$('dashEmptyStyle');
 if(!s){s=document.createElement('style');s.id='dashEmptyStyle';s.textContent='#dashboard[data-dashboard-empty="true"]{display:block!important;min-height:0!important;padding:0!important;margin:0!important}#dashboard[data-dashboard-empty="true"]>*{display:none!important}';document.head.appendChild(s)}
}
function setDashboard(){
 const d=$('dashboard');if(!d)return;
 document.querySelectorAll('.page').forEach(p=>{if(p.id!=='dashboard'&&p.id!=='students')p.classList.remove('active')});
 document.querySelectorAll('.navbtn').forEach(b=>b.classList.toggle('active',b.dataset.page==='dashboard'));
 d.classList.add('active');
 emptyDashboard();
 const old=$('auditSuperBox');if(old)old.remove();
}
function guard(){
 emptyDashboard();
 const active=document.querySelector('.page.active');
 if(active && !ALLOWED.has(active.id) && Date.now()>userNavUntil)setDashboard();
}
document.addEventListener('click',e=>{
 const b=e.target.closest('.navbtn,[data-v10-page]');
 if(!b)return;
 const target=b.dataset.page||b.dataset.v10Page||'';
 if(ALLOWED.has(target))userNavUntil=Date.now()+1500;
 else {userNavUntil=0;setTimeout(setDashboard,0)}
},true);
function boot(){
 setDashboard();
 setTimeout(guard,100);setTimeout(guard,500);setTimeout(guard,1000);setTimeout(guard,2000);setTimeout(guard,4000);
 const root=document.querySelector('main')||document.body;
 new MutationObserver(()=>guard()).observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.GURU_SD_DASHBOARD_CLEAN={clean:emptyDashboard,force:setDashboard};
})();