/* GURU+ SD — DASHBOARD CLEAN RESET v6 */
(function(){'use strict';
if(window.__AUDIT_PERANGKAT_SUPER_V6__)return;window.__AUDIT_PERANGKAT_SUPER_V6__=1;
const $=id=>document.getElementById(id);
function cleanDashboard(){
 const d=$('dashboard');if(!d)return;
 const old=$('auditSuperBox');if(old)old.remove();
 d.innerHTML='<div class="dash-reset"><section class="dash-welcome"><div class="dash-kicker">SIAP GURU V11 • 2026/2027</div><h2>Selamat Datang, Guru 👋</h2><p>Sistem Informasi Administrasi & Pembelajaran Guru</p><span>SDN • Kota Bogor</span></section><section class="dash-card" data-v10-page="students"><div class="dash-card-icon">👥</div><div><h3>Data Siswa</h3><p>Kelola data siswa, lihat daftar dan informasi peserta didik.</p></div><div class="dash-arrow">›</div></section></div>';
 if(!$('dashResetStyle')){const s=document.createElement('style');s.id='dashResetStyle';s.textContent='.dash-reset{max-width:980px;margin:0 auto;padding:8px}.dash-welcome{padding:28px 30px;border-radius:24px;background:linear-gradient(135deg,#eaf2ff,#dbeafe);border:1px solid #c7dcff;box-shadow:0 10px 28px rgba(30,64,175,.08)}.dash-kicker{font-size:11px;font-weight:800;letter-spacing:.12em;color:#2563eb}.dash-welcome h2{margin:8px 0 7px!important;font-size:30px!important;color:#172033}.dash-welcome p{margin:0 0 5px;color:#475569;font-size:17px}.dash-welcome span{color:#64748b}.dash-card{margin-top:18px;display:flex;align-items:center;gap:18px;padding:22px 24px;border:1px solid #cfe0ff;border-radius:20px;background:#fff;box-shadow:0 8px 24px rgba(15,23,42,.06);cursor:pointer}.dash-card-icon{width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:#e8f1ff;font-size:29px}.dash-card h3{margin:0 0 4px;color:#172033;font-size:20px}.dash-card p{margin:0;color:#64748b}.dash-arrow{margin-left:auto;font-size:34px;color:#2563eb}@media(max-width:600px){.dash-reset{padding:4px}.dash-welcome{padding:22px 20px}.dash-welcome h2{font-size:25px!important}.dash-welcome p{font-size:15px}.dash-card{padding:18px}.dash-card p{font-size:13px}}';document.head.appendChild(s)}
}
function removeAudit(){const x=$('auditSuperBox');if(x)x.remove()}
function boot(){cleanDashboard();removeAudit();setTimeout(cleanDashboard,250);setTimeout(cleanDashboard,800)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.GURU_SD_DASHBOARD_CLEAN={clean:cleanDashboard};
})();