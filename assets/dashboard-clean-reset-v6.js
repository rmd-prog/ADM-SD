/* GURU+ SD — DASHBOARD CLEAN RESET v6
 * Removes all legacy Dashboard content at runtime.
 * Never touches D1, Worker, login, students or scores.
 */
(function(){'use strict';
if(window.__DASHBOARD_CLEAN_RESET_V6__)return;window.__DASHBOARD_CLEAN_RESET_V6__=1;
const $=id=>document.getElementById(id);
function clean(){const d=$('dashboard');if(!d)return;d.innerHTML='<div class="dashboard-clean-v6"><div class="dashboard-clean-v6-title">Selamat datang 👋</div><div class="dashboard-clean-v6-sub">GURU+ SD • 2026/2027</div><button class="dashboard-clean-v6-student" data-v10-page="students">👥 Data Siswa</button></div>';if(!$('dashboardCleanV6Style')){const s=document.createElement('style');s.id='dashboardCleanV6Style';s.textContent='.dashboard-clean-v6{max-width:760px;margin:24px auto;padding:28px 20px;text-align:center}.dashboard-clean-v6-title{font-size:28px;font-weight:800;color:#172033;margin-bottom:6px}.dashboard-clean-v6-sub{font-size:13px;color:#64748b;margin-bottom:22px}.dashboard-clean-v6-student{border:0;border-radius:16px;padding:14px 22px;background:#2563eb;color:#fff;font-size:16px;font-weight:800;cursor:pointer}';document.head.appendChild(s)}}
function mount(){clean();setTimeout(clean,250);setTimeout(clean,800);setTimeout(clean,1600)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();window.GURU_SD_DASHBOARD_CLEAN={clean};})();