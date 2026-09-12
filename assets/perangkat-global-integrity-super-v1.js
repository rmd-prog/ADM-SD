/* GURU+ SD — GLOBAL INTEGRITY SUPER V2
 * One curriculum source: GURU_SD_MASTER.
 * All legacy curriculum storage is compatibility/cache only.
 * AI SUPER, old AI controls, JP/RPM/LKPD caches and document bridges cannot become a second source.
 * Local-only. Never touches D1, Worker, students, login, or assessment bridge.
 */
(function(){'use strict';
if(window.__GURU_SD_GLOBAL_INTEGRITY_V2__)return;window.__GURU_SD_GLOBAL_INTEGRITY_V2__=1;
const KEY='guru_sd_pembelajaran_master_v1';
const LEGACY=['guru_sd_perangkat_super_v1','guru_sd_cp_atp_tp_super_v1','guru_sd_rpm_super_v2','guru_sd_prota_promes_super_v2','guru_sd_lkpd_asesmen_super_v1','guru_sd_lkpd_asesmen_super_v2','guru_sd_jp_allocation_super_v1','guru_plus_sd_ai_super_v1'];
const $=id=>document.getElementById(id);
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}};
function master(){return window.GURU_SD_MASTER?.get?.()||read()}
function legacyValue(key){const x=master();if(!x?.babId)return null;const base={source:'GURU_SD_MASTER',rombel:x.rombel,mapel:x.mapel,babId:x.babId,babNo:x.babNo,material:x.material,jp:Number(x.jp)||0,semester:Number(x.semester)||1,tp:Array.isArray(x.tp)?x.tp:[],dpl:Array.isArray(x.dpl)?x.dpl:[],modelPembelajaran:x.modelPembelajaran||'',fase:x.fase||'',tahunPelajaran:x.tahunPelajaran||'2026/2027'};if(key==='guru_sd_cp_atp_tp_super_v1')return {...base};if(key==='guru_sd_jp_allocation_super_v1')return {...base,bab:base.material,totalJP:base.jp};if(key.indexOf('lkpd_asesmen')>=0)return {source:base.source,selected:base,meetings:[],kind:'BOTH'};return base}
function patchStorage(){if(window.__GURU_SD_GLOBAL_STORAGE_PATCH_V2__)return;const p=Storage.prototype.getItem;Storage.prototype.getItem=function(k){if(LEGACY.includes(k)){const v=legacyValue(k);if(v)return JSON.stringify(v)}return p.call(this,k)};window.__GURU_SD_GLOBAL_STORAGE_PATCH_V2__=1}
function syncAi(x){if(!x)return;const ids=[['aiSuperRombel',x.rombel],['aiSuperMapel',x.mapel],['aiSuperJP',x.jp]];ids.forEach(([id,v])=>{const e=$(id);if(e&&v!==undefined&&v!==null)e.value=String(v)});const mat=$('aiSuperMaterial');if(mat){const opts=[...mat.options];const i=opts.findIndex(o=>String(o.textContent||'').trim().toLowerCase()===String(x.material||'').trim().toLowerCase());if(i>=0)mat.selectedIndex=i}const boxes=[...document.querySelectorAll('#aiSuperDpl input[type=checkbox]')];if(boxes.length&&Array.isArray(x.dpl))boxes.forEach(e=>e.checked=x.dpl.includes(e.value));const model=$('aiSuperModel');if(model&&x.modelPembelajaran)model.value=x.modelPembelajaran}
function syncLegacyAi(x){if(!x)return;const r=$('aiKelas'),m=$('aiMapel'),b=$('aiBabSelector');if(r)r.value=x.rombel;if(m)m.value=x.mapel;if(b){const i=[...b.options].findIndex(o=>String(o.textContent||'').trim().toLowerCase()===String(x.material||'').trim().toLowerCase());if(i>=0)b.selectedIndex=i}}
function audit(){const x=master();if(!x?.babId)return {ok:false,reason:'MASTER_EMPTY'};syncAi(x);syncLegacyAi(x);return {ok:true,source:'GURU_SD_MASTER',context:x.babId,material:x.material,rombel:x.rombel,mapel:x.mapel,jp:x.jp,tpCount:Array.isArray(x.tp)?x.tp.length:0,dplCount:Array.isArray(x.dpl)?x.dpl.length:0,model:x.modelPembelajaran||''}}
function guardGenerate(){if(window.__GURU_SD_AUTO_GENERATE_GUARD__)return;window.__GURU_SD_AUTO_GENERATE_GUARD__=1;document.addEventListener('click',e=>{const b=e.target?.closest?.('#aiSuperGenerate');if(!b)return;setTimeout(()=>{const x=master();if(x?.babId)window.GURU_SD_AUTO_CHAIN?.run?.()},0)},true)}
patchStorage();guardGenerate();window.GURU_SD_GLOBAL_INTEGRITY={audit,master,legacyKeys:LEGACY.slice()};
function boot(){audit();window.addEventListener('guruSdMasterChanged',()=>setTimeout(audit,0));document.addEventListener('change',e=>{if(['pkR','pkM','pkB'].includes(e.target?.id))setTimeout(()=>{window.GURU_SD_MASTER?.sync?.();audit()},0)},true);setInterval(audit,1200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();