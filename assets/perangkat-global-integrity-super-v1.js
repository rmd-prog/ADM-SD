/* GURU+ SD — GLOBAL INTEGRITY SUPER V1
 * One curriculum source: GURU_SD_MASTER.
 * Legacy curriculum storage is read-only compatibility, never a source of truth.
 * Synchronizes AI SUPER controls to the canonical Master context.
 * Local-only. Never touches D1, Worker, students, login, or assessment bridge.
 */
(function(){'use strict';
if(window.__GURU_SD_GLOBAL_INTEGRITY_V1__)return;window.__GURU_SD_GLOBAL_INTEGRITY_V1__=1;
const KEY='guru_sd_pembelajaran_master_v1';
const LEGACY=['guru_sd_perangkat_super_v1','guru_sd_cp_atp_tp_super_v1','guru_sd_rpm_super_v2','guru_sd_prota_promes_super_v2','guru_sd_lkpd_asesmen_super_v1','guru_sd_lkpd_asesmen_super_v2'];
const $=id=>document.getElementById(id);
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}};
function master(){return window.GURU_SD_MASTER?.get?.()||read()}
function legacyValue(key){const x=master();if(!x||!x.babId)return null;const base={source:'GURU_SD_MASTER',rombel:x.rombel,mapel:x.mapel,babId:x.babId,babNo:x.babNo,material:x.material,jp:x.jp,semester:x.semester,tp:x.tp||[],dpl:x.dpl||[],modelPembelajaran:x.modelPembelajaran||'',fase:x.fase||'',tahunPelajaran:x.tahunPelajaran||'2026/2027'};if(key==='guru_sd_cp_atp_tp_super_v1')return {source:base.source,rombel:base.rombel,mapel:base.mapel,babId:base.babId,babNo:base.babNo,material:base.material,tp:base.tp};if(key.indexOf('lkpd_asesmen')>=0)return {source:base.source,selected:base,meetings:[],kind:'BOTH'};return base}
function patchStorage(){if(window.__GURU_SD_GLOBAL_STORAGE_PATCH__)return;const p=Storage.prototype.getItem;Storage.prototype.getItem=function(k){if(LEGACY.includes(k)){const v=legacyValue(k);if(v)return JSON.stringify(v)}return p.call(this,k)};window.__GURU_SD_GLOBAL_STORAGE_PATCH__=1}
function syncAI(x){if(!x)return;const map=[['aiSuperRombel',x.rombel],['aiSuperMapel',x.mapel],['aiSuperMaterial',x.material],['aiSuperJP',x.jp]];map.forEach(([id,v])=>{const e=$(id);if(!e||v===undefined||v===null)return;if(e.value!==String(v)){e.value=String(v);e.dispatchEvent(new Event('change',{bubbles:true}))}});const boxes=[...document.querySelectorAll('#aiSuperDpl input[type=checkbox]')];if(boxes.length&&Array.isArray(x.dpl)){boxes.forEach(e=>e.checked=x.dpl.includes(e.value))}}
function audit(){const x=master();if(!x||!x.babId)return {ok:false,reason:'MASTER_EMPTY'};syncAI(x);return {ok:true,source:'GURU_SD_MASTER',context:x.babId,material:x.material,rombel:x.rombel,mapel:x.mapel,jp:x.jp}}
patchStorage();
window.GURU_SD_GLOBAL_INTEGRITY={audit,master};
function boot(){audit();window.addEventListener('guruSdMasterChanged',()=>setTimeout(audit,0));document.addEventListener('change',e=>{if(['pkR','pkM','pkB'].includes(e.target.id)){setTimeout(()=>{window.GURU_SD_MASTER?.sync?.();audit()},0)}},true);setInterval(audit,1200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();