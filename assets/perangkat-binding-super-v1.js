/* SIAP GURU — Binding adapter
 * SINGLE SOURCE: GURU_SD_MASTER.
 * This file only exposes compatibility hooks; it does not own curriculum state.
 * Local-only. Does not touch D1, Worker, students, or assessment bridge.
 */
(function(){'use strict';
if(window.__PBIND_V1__)return;window.__PBIND_V1__=1;
function q(id){return document.getElementById(id)}
function master(){return window.GURU_SD_MASTER?.get?.()||null}
function selected(){return master()}
function sync(){const x=master();if(!x)return null;let box=q('pkBindInfo');if(!box){box=document.createElement('div');box.id='pkBindInfo';box.style='margin-top:10px;padding:11px;border-radius:12px;background:#eef6ff;border:1px solid #bfdbfe';const p=q('pkatV2');if(p)p.appendChild(box)}box.innerHTML='<b>🔗 Master Perangkat SUPER</b><br>BAB '+x.babNo+' — '+String(x.material||'')+' • '+x.jp+' JP • Semester '+x.semester+'<br><span style="font-size:12px">TP: '+(x.tp?.length||0)+' • DPL: '+(x.dpl?.length||0)+' • Model: '+String(x.modelPembelajaran||'-')+'</span>';return x}
window.GURU_SD_BINDING={get:selected,sync,getStored:selected};
window.addEventListener('guruSdMasterChanged',sync);
function boot(){const r=q('pkR'),m=q('pkM'),b=q('pkB');if(!r||!m||!b){setTimeout(boot,300);return}sync()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();