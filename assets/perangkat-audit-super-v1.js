/* SIAP GURU — DASHBOARD EMPTY RESET v10 — REMOVE ALL LEGACY INJECTIONS */
(function(){'use strict';
if(window.__AUDIT_PERANGKAT_SUPER_V10__)return;window.__AUDIT_PERANGKAT_SUPER_V10__=1;
const $=id=>document.getElementById(id);
const ALLOWED=new Set(['dashboard','students']);
let userNavUntil=0;
function removeLegacyInjected(){
 ['guruSdAutoChainSuper','kurikulumSuperMultiDay','kurikulumSuperSchedule','promesSuperCalendar','auditSuperBox'].forEach(id=>{const e=$(id);if(e)e.remove()});
 document.querySelectorAll('.ksm,.ps-panel,.ks-wrap').forEach(e=>e.remove());
}
function emptyDashboard(){
 const d=$('dashboard');if(!d)return;
 if(d.children.length)d.innerHTML='';
 d.setAttribute('data-dashboard-empty','true');
 let s=$('dashEmptyStyle');
 if(!s){s=document.createElement('style');s.id='dashEmptyStyle';s.textContent='#dashboard[data-dashboard-empty="true"]{display:block!important;min-height:0!important;padding:0!important;margin:0!important}#dashboard[data-dashboard-empty="true"]>*{display:none!important}#guruSdAutoChainSuper,#kurikulumSuperMultiDay,#kurikulumSuperSchedule,#promesSuperCalendar,.ksm,.ps-panel,.ks-wrap,#auditSuperBox{display:none!important}';document.head.appendChild(s)}
}
function setDashboard(){
 const d=$('dashboard');if(!d)return;
 document.querySelectorAll('.page').forEach(p=>{if(p.id!=='dashboard'&&p.id!=='students')p.classList.remove('active')});
 document.querySelectorAll('.navbtn').forEach(b=>b.classList.toggle('active',b.dataset.page==='dashboard'));
 d.classList.add('active');
 emptyDashboard();
 removeLegacyInjected();
}
function guard(){
 removeLegacyInjected();
 emptyDashboard();
 const active=document.querySelector('.page.active');
 if(active&&!ALLOWED.has(active.id)&&Date.now()>userNavUntil)setDashboard();
}
document.addEventListener('click',e=>{
 const b=e.target.closest('.navbtn,[data-v10-page]');
 if(!b)return;
 const target=b.dataset.page||b.dataset.v10Page||'';
 if(ALLOWED.has(target))userNavUntil=Date.now()+1500;
 else{userNavUntil=0;setTimeout(setDashboard,0)}
},true);
function boot(){
 setDashboard();
 const root=document.querySelector('main')||document.body;
 const observer=new MutationObserver(()=>guard());
 observer.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});
 [50,100,250,500,1000,2000,4000,7000,10000,15000,20000].forEach(ms=>setTimeout(guard,ms));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.GURU_SD_DASHBOARD_CLEAN={clean:emptyDashboard,force:setDashboard,removeLegacy:removeLegacyInjected};
})();