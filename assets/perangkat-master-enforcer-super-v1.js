/* GURU+ SD — MASTER ENFORCER
 * Keeps legacy generator state as a derived mirror of the canonical master.
 * No D1/Worker access. No independent curriculum source.
 */
(function(){'use strict';
if(window.__GURU_SD_MASTER_ENFORCER_V1__)return;window.__GURU_SD_MASTER_ENFORCER_V1__=1;
const LEGACY='guru_sd_perangkat_super_v1';
function mirror(x){
  if(!x||!x.rombel||!x.mapel||!x.babId)return;
  try{localStorage.setItem(LEGACY,JSON.stringify({
    rombel:x.rombel,mapel:x.mapel,babId:x.babId,babNo:x.babNo,
    material:x.material,jp:Number(x.jp)||0,tp:x.tp||[],tpCount:(x.tp||[]).length,
    semester:x.semester,dpl:x.dpl||[],modelPembelajaran:x.modelPembelajaran||'Problem Based Learning',
    fase:x.fase||'',tahunPelajaran:x.tahunPelajaran||'2026/2027',updatedAt:x.updatedAt||new Date().toISOString()
  }))}catch(e){}
}
function boot(){
  if(window.GURU_SD_MASTER){mirror(window.GURU_SD_MASTER.get());}
  window.addEventListener('guruSdMasterChanged',e=>mirror(e.detail));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
