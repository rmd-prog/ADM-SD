/* SIAP GURU — DASHBOARD CLEAN V1
 * Replaces the legacy crowded dashboard presentation with a minimal base.
 * Frontend-only. No D1/Worker/student/login changes.
 */
(function(){'use strict';
if(window.__GURU_SD_DASHBOARD_CLEAN_V1__)return;
window.__GURU_SD_DASHBOARD_CLEAN_V1__=1;
function clean(){
  const d=document.getElementById('dashboard');
  if(!d)return;
  d.innerHTML=`
    <div class="dash-clean">
      <div class="dash-clean-hero">
        <div class="dash-clean-kicker">SIAP GURU • 2026/2027</div>
        <h2>Selamat datang 👋</h2>
        <p>Portal sederhana untuk mengelola kegiatan guru.</p>
      </div>
      <div class="dash-clean-grid">
        <button class="dash-clean-card" data-v10-page="scores">
          <span>📝</span><b>Penilaian</b><small>Kelola penilaian siswa</small>
        </button>
        <button class="dash-clean-card" data-v10-page="students">
          <span>👥</span><b>Data Siswa</b><small>Lihat data peserta didik</small>
        </button>
      </div>
    </div>`;
}
function boot(){clean();setTimeout(clean,350);setTimeout(clean,1200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.GURU_SD_DASHBOARD_CLEAN={clean};
})();

(function(){
  const s=document.createElement('style');
  s.textContent='.dash-clean{max-width:900px;margin:0 auto}.dash-clean-hero{padding:24px;border-radius:20px;background:linear-gradient(135deg,#1d4ed8,#4338ca);color:#fff;box-shadow:0 12px 30px #1d4ed822}.dash-clean-kicker{font-size:11px;font-weight:900;letter-spacing:.12em;opacity:.85}.dash-clean-hero h2{font-size:28px!important;margin:7px 0 5px!important}.dash-clean-hero p{margin:0;color:#e0e7ff}.dash-clean-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:14px}.dash-clean-card{border:1px solid #e2e8f0;background:#fff;border-radius:18px;padding:20px;text-align:left;display:flex;flex-direction:column;gap:5px;box-shadow:0 8px 24px #0f172a0a}.dash-clean-card span{font-size:27px}.dash-clean-card b{font-size:17px}.dash-clean-card small{color:#64748b}.dash-clean-card:active{transform:translateY(1px)}@media(max-width:520px){.dash-clean-grid{grid-template-columns:1fr}.dash-clean-hero{padding:20px}.dash-clean-hero h2{font-size:24px!important}}';
  (document.head||document.documentElement).appendChild(s);
})();