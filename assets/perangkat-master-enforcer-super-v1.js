/* GURU+ SD — MASTER ENFORCER + CHAIN GUARD V8
 * Canonical source: guru_sd_pembelajaran_master_v1 / GURU_SD_MASTER.
 * Legacy state is a derived mirror only; reads are redirected to Master at runtime.
 * UI BAB catalogs remain intact for teacher selection, but RPM/AI selectors are mirrors only.
 * Active document context is always synchronized to persisted Master.
 * Inline RPM cache/selector state is also hardened so stale BAB data cannot return.
 * No D1/Worker access.
 */
(function(){'use strict';
if(window.__GURU_SD_MASTER_ENFORCER_V8__)return;window.__GURU_SD_MASTER_ENFORCER_V8__=1;
const KEY='guru_sd_pembelajaran_master_v1',LEGACY='guru_sd_perangkat_super_v1';
const nativeGet=Storage.prototype.getItem;
const q=id=>document.getElementById(id);
function master(){try{return JSON.parse(nativeGet.call(localStorage,KEY)||'null')}catch(e){return null}}
function mirror(x){if(!x||!x.rombel||!x.mapel||!x.babId)return;try{localStorage.setItem(LEGACY,JSON.stringify({...x,source:'GURU_SD_MASTER',tp:Array.isArray(x.tp)?x.tp:[],dpl:Array.isArray(x.dpl)?x.dpl:[],tpCount:Array.isArray(x.tp)?x.tp.length:0,tahunPelajaran:x.tahunPelajaran||'2026/2027'}))}catch(e){}}
function redirectLegacyReads(){if(Storage.prototype.__GURU_SD_MASTER_REDIRECT__)return;const original=Storage.prototype.getItem;function guarded(k){if(this===localStorage&&k===LEGACY){const x=master();if(x)return JSON.stringify(x)}return original.apply(this,arguments)}guarded.__GURU_SD_MASTER_REDIRECT__=true;Storage.prototype.getItem=guarded;Storage.prototype.__GURU_SD_MASTER_REDIRECT__=true}
function selectByMaster(select,x){if(!select||!x)return;const opts=[...select.options],mat=String(x.material||'').trim().toLowerCase();let i=mat?opts.findIndex(o=>String(o.textContent||'').trim().toLowerCase().includes(mat)):-1;if(i<0&&x.babNo)i=opts.findIndex(o=>new RegExp('BAB\\s*'+Number(x.babNo)+'\\b','i').test(String(o.textContent||'')));if(i>=0)select.selectedIndex=i}
function syncDom(x){if(!x)return;const r=q('pkR'),m=q('pkM'),b=q('pkB'),rpm=q('rpmBab'),ai=q('aiRpmBab');if(r&&x.rombel&&r.value!==x.rombel)r.value=x.rombel;if(m&&x.mapel&&m.value!==x.mapel)m.value=x.mapel;if(b&&x.material)selectByMaster(b,x);if(rpm&&x.material)selectByMaster(rpm,x);if(ai&&x.material)selectByMaster(ai,x)}
function guardMirrorSelectors(){document.addEventListener('change',function(e){const el=e.target;if(!el||!['rpmBab','aiRpmBab'].includes(el.id))return;const x=master();if(!x||!x.babId)return;selectByMaster(el,x);e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation()},true)}
function patchDocPayload(){if(typeof window.docPayload!=='function')return;const original=window.docPayload;if(original.__MASTER_GUARDED__)return;function guarded(type){const x=master();if(x)syncDom(x);const out=original.apply(this,arguments)||{};if(x)Object.assign(out,{rombel:x.rombel,mapel:x.mapel,material:x.material,babId:x.babId,babNo:x.babNo,semester:x.semester,jp:x.jp,fase:x.fase,dpl:x.dpl,modelPembelajaran:x.modelPembelajaran,tahunPelajaran:x.tahunPelajaran,tp:x.tp});return out}guarded.__MASTER_GUARDED__=true;window.docPayload=guarded}
function patchGenerateDoc(){if(typeof window.generateDoc!=='function')return;const original=window.generateDoc;if(original.__MASTER_GUARDED__)return;async function guarded(type){const x=master();if(!x||!x.rombel||!x.mapel||!x.babId)throw new Error('MASTER_STATE_NOT_READY');syncDom(x);window.dispatchEvent(new CustomEvent('guruSdMasterBeforeGenerate',{detail:x}));return original.apply(this,arguments)}guarded.__MASTER_GUARDED__=true;window.generateDoc=guarded}
function patchInlineRpmState(){
  if(typeof window.updateBab==='function'&&!window.updateBab.__MASTER_RPM_GUARDED__){
    const original=window.updateBab;
    function guarded(){const out=original.apply(this,arguments);const x=master();if(x&&x.babId){const rpm=q('rpmBab');if(rpm)selectByMaster(rpm,x);const ai=q('aiRpmBab');if(ai)selectByMaster(ai,x)}return out}
    guarded.__MASTER_RPM_GUARDED__=true;window.updateBab=guarded;
  }
  if(typeof window.loadDocFields==='function'&&!window.loadDocFields.__MASTER_RPM_GUARDED__){
    const original=window.loadDocFields;
    function guarded(){const out=original.apply(this,arguments);const x=master();if(x&&x.babId){syncDom(x);const rpm=q('rpmText');const engine=window.GURU_SD_PERANGKAT_ENGINE;if(rpm&&engine?.generate){const doc=engine.generate('RPM');if(doc?.text)rpm.value=doc.text}}return out}
    guarded.__MASTER_RPM_GUARDED__=true;window.loadDocFields=guarded;
  }
}
function audit(){const x=master();if(!x||!x.babId)return;redirectLegacyReads();mirror(x);syncDom(x);patchDocPayload();patchGenerateDoc();patchInlineRpmState();window.__GURU_SD_CHAIN_AUDIT__={source:'GURU_SD_MASTER',babId:x.babId,material:x.material,rombel:x.rombel,mapel:x.mapel,semester:x.semester,jp:x.jp,dpl:x.dpl,modelPembelajaran:x.modelPembelajaran,checkedAt:new Date().toISOString()}}
function boot(){guardMirrorSelectors();audit();window.addEventListener('guruSdMasterChanged',e=>{mirror(e.detail);setTimeout(audit,0)});['pkR','pkM','pkB','pkI','rpmBab','aiRpmBab'].forEach(id=>{const el=q(id);if(el)el.addEventListener('change',()=>setTimeout(audit,0))});setInterval(audit,2000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();