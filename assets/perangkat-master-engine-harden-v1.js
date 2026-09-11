/* GURU+ SD — MASTER ENGINE HARDEN v1
 * One source of truth for deterministic Perangkat SUPER.
 * Master: BAB -> CP -> ATP -> TP -> JP -> Jadwal -> PROTA -> PROMES -> RPM -> LKPD -> Asesmen.
 * This runtime adapter does not touch D1, Worker, students, login, or assessment bridge.
 */
(function(){'use strict';
if(window.__GURU_SD_MASTER_ENGINE_HARDEN_V1__)return;window.__GURU_SD_MASTER_ENGINE_HARDEN_V1__=1;
const KEY='guru_sd_pembelajaran_master_v1',JPKEY='guru_sd_jp_allocation_super_v1';
const read=(k,d=null)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(e){return d}};
function master(){const x=window.GURU_SD_MASTER?.get?.()||read(KEY,null);if(!x||!x.rombel||!x.mapel||!x.material)return null;return {...x,tp:Array.isArray(x.tp)?x.tp:[],dpl:Array.isArray(x.dpl)?x.dpl:[]}}
function tp(x){return x.tp.map((t,i)=>({no:Number(t.no)||i+1,text:String(t.text||t||'').trim(),jp:Number(t.jp)||0}))}
function allocate(x){const list=tp(x);if(!list.length)return [];const total=Math.max(1,Number(x.jp)||0);const base=Math.floor(total/list.length),rem=total-base*list.length;return list.map((t,i)=>({...t,jp:Math.max(1,base+(i<rem?1:0))}))}
function chain(){const x=master();if(!x)return null;const allocated=allocate(x);const out={...x,tp:allocated,totalJP:allocated.reduce((n,t)=>n+t.jp,0),chainSource:'GURU_SD_MASTER'};try{localStorage.setItem(JPKEY,JSON.stringify({rombel:x.rombel,mapel:x.mapel,bab:x.material,babNo:x.babNo,semester:x.semester,totalJP:out.totalJP,tp:allocated,updatedAt:new Date().toISOString(),source:'GURU_SD_MASTER'}))}catch(e){}return out}
function patchAllocation(){const x=chain();if(!x)return;const b=window.GURU_SD_BINDING;if(b){b.getStored=()=>master();b.get=()=>master()}window.GURU_SD_CHAIN_DATA=x;window.__GURU_SD_DETERMINISTIC_CHAIN__={ok:true,source:'GURU_SD_MASTER',rombel:x.rombel,mapel:x.mapel,babId:x.babId,material:x.material,semester:x.semester,jp:x.jp,tp:x.tp,dpl:x.dpl,modelPembelajaran:x.modelPembelajaran,fase:x.fase,tahunPelajaran:x.tahunPelajaran,checkedAt:new Date().toISOString()}}
function patchPayload(){if(typeof window.docPayload!=='function'||window.__GURU_SD_MASTER_ENGINE_PAYLOAD__)return;const old=window.docPayload;if(old.__masterEngineWrapped)return;const wrapped=function(type){const p=old.apply(this,arguments)||{},x=master();if(!x)return p;return Object.assign(p,{source:'GURU_SD_MASTER',rombel:x.rombel,mapel:x.mapel,babId:x.babId,babNo:x.babNo,material:x.material,semester:x.semester,jp:x.jp,tp:x.tp,dpl:x.dpl,modelPembelajaran:x.modelPembelajaran,fase:x.fase,tahunPelajaran:x.tahunPelajaran})};wrapped.__masterEngineWrapped=true;window.docPayload=wrapped;window.__GURU_SD_MASTER_ENGINE_PAYLOAD__=true}
function audit(){patchAllocation();patchPayload();const x=master();if(x)window.__GURU_SD_ENGINE_AUDIT__={ok:true,source:'GURU_SD_MASTER',identity:[x.rombel,x.mapel,x.babId,x.material,x.semester,x.jp,x.modelPembelajaran].join('|'),tpCount:x.tp.length,dplCount:x.dpl.length,checkedAt:new Date().toISOString()}}
function boot(){audit();window.addEventListener('guruSdMasterChanged',audit);document.addEventListener('change',e=>{if(['pkR','pkM','pkB','pkI','rpmBab','modelPembelajaran','model','pkModel','modelPembelajaranSelect'].includes(e.target.id||e.target.name))setTimeout(audit,0)},true);setInterval(audit,2000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();