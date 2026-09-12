/* SIAP GURU — DASHBOARD AUDIT COMPATIBILITY SHIM */
(function(){'use strict';
if(window.__AUDIT_PERANGKAT_SUPER_V10__)return;
window.__AUDIT_PERANGKAT_SUPER_V10__=true;
const $=id=>document.getElementById(id);
function emptyDashboard(){const d=$('dashboard');if(d)d.setAttribute('data-dashboard-empty','true')}
function removeLegacyInjected(){['guruSdAutoChainSuper','kurikulumSuperMultiDay','kurikulumSuperSchedule','promesSuperCalendar','auditSuperBox'].forEach(id=>{const e=$(id);if(e)e.remove()});document.querySelectorAll('.ksm,.ps-panel,.ks-wrap').forEach(e=>e.remove())}
function setDashboard(){const d=$('dashboard');if(d){d.classList.add('active');emptyDashboard()}}
function boot(){removeLegacyInjected()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.GURU_SD_DASHBOARD_CLEAN={clean:emptyDashboard,force:setDashboard,removeLegacy:removeLegacyInjected};
})();
