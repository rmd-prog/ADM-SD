/* SIAP GURU — STRICT CHAIN AUDIT SUPER v3
 * Canonical source: GURU_SD_MASTER.
 * Runtime guard for BAB/TP/JP/DPL/model identity across the document chain.
 * Legacy state is never written back.
 * Local-only. Never touches D1, Worker, students, login, or assessment bridge.
 */
(function(){'use strict';
if(window.__GURU_SD_CHAIN_AUDIT_V3__)return;window.__GURU_SD_CHAIN_AUDIT_V3__=1;
const $=id=>document.getElementById(id);
function master(){return window.GURU_SD_MASTER?.get?.()||null}
function identity(x){return x?{rombel:String(x.rombel||''),mapel:String(x.mapel||''),babId:String(x.babId||''),babNo:Number(x.babNo||0),material:String(x.material||''),semester:Number(x.semester||1),jp:Number(x.jp||0),tp:Array.isArray(x.tp)?x.tp:[],dpl:Array.isArray(x.dpl)?x.dpl:[],modelPembelajaran:String(x.modelPembelajaran||''),fase:String(x.fase||''),tahunPelajaran:String(x.tahunPelajaran||'')} : null}
function syncRpm(x){const el=$('rpmBab');if(!el||!x?.material)return;let found=[...el.options].findIndex(o=>String(o.textContent||'').trim().toLowerCase().includes(x.material.toLowerCase()));if(found<0){el.innerHTML='';const o=document.createElement('option');o.value='0';o.textContent='BAB '+(x.babNo||1)+' — '+x.material+(x.jp?' ('+x.jp+' JP)':'');el.appendChild(o);found=0}el.selectedIndex=found}
function audit(){const x=identity(master()),issues=[];if(!x)issues.push('MASTER_EMPTY');else{if(!x.rombel||!x.mapel)issues.push('CONTEXT_EMPTY');if(!x.babId||!x.material)issues.push('BAB_EMPTY');if(!x.jp||x.jp<1)issues.push('JP_EMPTY');if(!x.tp.length)issues.push('TP_EMPTY');if(!x.dpl.length)issues.push('DPL_EMPTY');if(!x.modelPembelajaran)issues.push('MODEL_EMPTY');if(!x.tahunPelajaran)issues.push('YEAR_EMPTY');syncRpm(x)}window.__GURU_SD_CHAIN_AUDIT__={ok:issues.length===0,issues,master:x,checkedAt:new Date().toISOString(),source:'GURU_SD_MASTER'};return window.__GURU_SD_CHAIN_AUDIT__}
function patchPayload(){if(typeof window.docPayload!=='function'||window.docPayload.__masterWrapped)return;const original=window.docPayload;const wrapped=function(type){const p=original.apply(this,arguments)||{},x=identity(master());if(!x)return p;return Object.assign(p,{rombel:x.rombel,mapel:x.mapel,material:x.material,babId:x.babId,babNo:x.babNo,semester:x.semester,jp:x.jp,fase:x.fase,dpl:x.dpl,modelPembelajaran:x.modelPembelajaran,tahunPelajaran:x.tahunPelajaran,tp:x.tp})};wrapped.__masterWrapped=true;window.docPayload=wrapped}
function boot(){audit();patchPayload();document.addEventListener('change',e=>{if(['pkR','pkM','pkB','rpmBab','modelPembelajaran','model','pkModel','modelPembelajaranSelect'].includes(e.target.id||e.target.name))setTimeout(()=>{window.GURU_SD_MASTER?.sync?.();audit();patchPayload()},0)},true);window.addEventListener('guruSdMasterChanged',()=>{audit();patchPayload()});setInterval(()=>{audit();patchPayload()},1500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();