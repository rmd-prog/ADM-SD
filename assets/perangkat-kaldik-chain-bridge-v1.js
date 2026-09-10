/* GURU+ SD — KALDIK CHAIN BRIDGE v1
 * Safety layer: filters generated local perangkat dates against Kaldik.
 * Does not touch D1, Worker, login or assessment bridge.
 */
(()=>{'use strict';if(window.__GURU_SD_KALDIK_CHAIN_BRIDGE_V1__)return;window.__GURU_SD_KALDIK_CHAIN_BRIDGE_V1__=1;
const keys=['guru_sd_pertemuan_super_v2','guru_sd_prota_promes_super_v2','guru_sd_rpm_super_v2','guru_sd_lkpd_asesmen_super_v2'];
function kal(){return window.GURU_SD_KALDIK}
function clean(v){const k=kal();if(!k||!v)return v;const ok=d=>!d||k.isEffective(d);const walk=x=>{if(Array.isArray(x))return x.filter(a=>ok(a?.date||a?.tanggal||a?.hariTanggal)).map(walk);if(x&&typeof x==='object'){const y={...x};for(const p of Object.keys(y))if(Array.isArray(y[p]))y[p]=y[p].filter(a=>ok(a?.date||a?.tanggal||a?.hariTanggal)).map(walk);return y}return x};return walk(v)}
function run(){const k=kal();if(!k)return;keys.forEach(key=>{try{const raw=localStorage.getItem(key);if(!raw)return;const v=JSON.parse(raw),c=clean(v);localStorage.setItem(key,JSON.stringify(c))}catch(e){}});window.dispatchEvent(new CustomEvent('guruSdKaldikChainSanitized'))}
function boot(){setTimeout(run,1700);window.addEventListener('guruSdKaldikChanged',run)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();})();