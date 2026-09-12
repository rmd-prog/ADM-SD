/* GURU+ SD — DASHBOARD EMPTY RESET v7 */
(function(){'use strict';
if(window.__AUDIT_PERANGKAT_SUPER_V7__)return;window.__AUDIT_PERANGKAT_SUPER_V7__=1;
const $=id=>document.getElementById(id);
function emptyDashboard(){
 const d=$('dashboard');if(!d)return;
 d.innerHTML='';
 d.setAttribute('data-dashboard-empty','true');
 let s=$('dashEmptyStyle');
 if(!s){s=document.createElement('style');s.id='dashEmptyStyle';s.textContent='#dashboard[data-dashboard-empty="true"]{display:block!important;min-height:0!important;padding:0!important;margin:0!important}#dashboard[data-dashboard-empty="true"]>*{display:none!important}';document.head.appendChild(s)}
}
function forceDashboard(){
 document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
 const d=$('dashboard');if(d)d.classList.add('active');
 document.querySelectorAll('.navbtn').forEach(b=>b.classList.toggle('active',b.dataset.page==='dashboard'));
 emptyDashboard();
 const old=$('auditSuperBox');if(old)old.remove();
}
function boot(){
 forceDashboard();
 setTimeout(forceDashboard,300);
 setTimeout(forceDashboard,1000);
 setTimeout(forceDashboard,2500);
 setTimeout(forceDashboard,4000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.GURU_SD_DASHBOARD_CLEAN={clean:emptyDashboard,force:forceDashboard};
})();