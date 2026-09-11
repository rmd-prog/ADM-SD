/* GURU+ SD — MASTER ENFORCER + CHAIN GUARD V5
 * Canonical source: guru_sd_pembelajaran_master_v1 / GURU_SD_MASTER.
 * Legacy state is a derived mirror only; reads are redirected to Master at runtime.
 * UI BAB catalogs remain intact so teachers can choose every chapter.
 * Active document context is always read from the persisted Master.
 * No D1/Worker access.
 */
(function(){'use strict';
if(window.__GURU_SD_MASTER_ENFORCER_V5__)return;window.__GURU_SD_MASTER_ENFORCER_V5__=1;
const KEY='guru_sd_pembelajaran_master_v1',LEGACY='guru_sd_perangkat_super_v1';
const nativeGet=Storage.prototype.getItem;
function master(){try{return JSON.parse(nativeGet.call(localStorage,KEY)||'null')}catch(e){return null}}
function mirror(x){
  if(!x||!x.rombel||!x.mapel||!x.babId)return;
  try{localStorage.setItem(LEGACY,JSON.stringify({...x,source:'GURU_SD_MASTER',tp:Array.isArray(x.tp)?x.tp:[],dpl:Array.isArray(x.dpl)?x.dpl:[],tpCount:Array.isArray(x.tp)?x.tp.length:0,tahunPelajaran:x.tahunPelajaran||'2026/2027'}))}catch(e){}
}
function redirectLegacyReads(){
  if(Storage.prototype.__GURU_SD_MASTER_REDIRECT__)return;
  const original=Storage.prototype.getItem;
  function guarded(k){if(this===localStorage&&k===LEGACY){const x=master();if(x)return JSON.stringify(x)}return original.apply(this,arguments)}
  guarded.__GURU_SD_MASTER_REDIRECT__=true;Storage.prototype.getItem=guarded;Storage.prototype.__GURU_SD_MASTER_REDIRECT__=true;
}
function syncDom(x){
  if(!x)return;
  const r=document.getElementById('pkR'),m=document.getElementById('pkM'),b=document.getElementById('pkB');
  if(r&&x.rombel&&r.value!==x.rombel)r.value=x.rombel;
  if(m&&x.mapel&&m.value!==x.mapel)m.value=x.mapel;
  if(b&&x.material){const opts=[...b.options];let i=opts.findIndex(o=>String(o.textContent||'').trim().toLowerCase().includes(String(x.material).trim().toLowerCase()));if(i<0&&x.babNo)i=opts.findIndex(o=>new RegExp('BAB\\s*'+Number(x.babNo)+'\\b','i').test(String(o.textContent||'')));if(i>=0&&b.selectedIndex!==i)b.selectedIndex=i;}
}
function patchDocPayload(){
  if(typeof window.docPayload!=='function')return;const original=window.docPayload;if(original.__MASTER_GUARDED__)return;
  function guarded(type){const x=master();if(x)syncDom(x);const out=original.apply(this,arguments)||{};if(x){Object.assign(out,{rombel:x.rombel,mapel:x.mapel,material:x.material,babId:x.babId,babNo:x.babNo,semester:x.semester,jp:x.jp,fase:x.fase,dpl:x.dpl,modelPembelajaran:x.modelPembelajaran,tahunPelajaran:x.tahunPelajaran,tp:x.tp})}return out}
  guarded.__MASTER_GUARDED__=true;window.docPayload=guarded;
}
function patchGenerateDoc(){
  if(typeof window.generateDoc!=='function')return;const original=window.generateDoc;if(original.__MASTER_GUARDED__)return;
  async function guarded(type){const x=master();if(!x||!x.rombel||!x.mapel||!x.babId)throw new Error('MASTER_STATE_NOT_READY');syncDom(x);const rpm=document.getElementById('rpmBab');if(rpm){const opts=[...rpm.options];if(opts.length){const i=opts.findIndex(o=>String(o.textContent||'').toLowerCase().includes(String(x.material||'').toLowerCase()));if(i>=0)rpm.value=String(i)}}window.dispatchEvent(new CustomEvent('guruSdMasterBeforeGenerate',{detail:x}));return original.apply(this,arguments)}
  guarded.__MASTER_GUARDED__=true;window.generateDoc=guarded;
}
function audit(){const x=master();if(!x||!x.babId)return;redirectLegacyReads();mirror(x);syncDom(x);patchDocPayload();patchGenerateDoc();window.__GURU_SD_CHAIN_AUDIT__={source:'GURU_SD_MASTER',babId:x.babId,material:x.material,rombel:x.rombel,mapel:x.mapel,semester:x.semester,jp:x.jp,dpl:x.dpl,modelPembelajaran:x.modelPembelajaran,checkedAt:new Date().toISOString()}}
function boot(){audit();window.addEventListener('guruSdMasterChanged',e=>{mirror(e.detail);setTimeout(audit,0)});['pkR','pkM','pkB','pkI','rpmBab'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('change',()=>setTimeout(audit,0))});setInterval(audit,2000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();