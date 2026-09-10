/* GURU+ SD — Binding BAB -> TP -> JP -> DPL -> document generators
 * Local-only overlay. Does not touch D1, Worker, students, or assessment bridge.
 */
(function(){'use strict';if(window.__PBIND_V1__)return;window.__PBIND_V1__=1;
const DPL=['Keimanan dan ketakwaan kepada Tuhan Yang Maha Esa','Kewargaan','Penalaran kritis','Kreativitas','Kolaborasi','Kemandirian','Kesehatan','Komunikasi'];
const KEY='guru_sd_perangkat_super_v1', BKEY='guru_sd_perangkat_binding_v1';
function q(id){return document.getElementById(id)}
function getCatalog(){return window.GURU_SD_CATALOG_V2||null}
function selected(){const r=q('pkR'),m=q('pkM'),b=q('pkB');if(!r||!m||!b||!b.value)return null;const cat=getCatalog();if(!cat||typeof cat.get!=='function')return null;return cat.get(r.value,m.value,Number(b.value));}
function saveBinding(){const x=selected();if(!x)return null;const data={rombel:q('pkR').value,mapel:q('pkM').value,material:x.bab,jp:x.jp,tp:x.tp,dpl:x.dpl||[] ,semester:x.semester,babNo:x.no,updatedAt:new Date().toISOString()};localStorage.setItem(BKEY,JSON.stringify(data));localStorage.setItem(KEY,JSON.stringify({rombel:data.rombel,mapel:data.mapel,material:data.material,jp:data.jp,tpCount:data.tp.length||3}));return data}
function sync(){const x=saveBinding();if(!x)return;let box=q('pkBindInfo');if(!box){box=document.createElement('div');box.id='pkBindInfo';box.style='margin-top:10px;padding:11px;border-radius:12px;background:#eef6ff;border:1px solid #bfdbfe';const p=q('pkatV2');if(p)p.appendChild(box)}box.innerHTML='<b>🔗 Terhubung ke Generator</b><br>BAB '+x.babNo+' — '+x.material+' • '+x.jp+' JP • Semester '+x.semester+'<br><span style="font-size:12px">TP: '+x.tp.length+' • DPL: '+(x.dpl.length?x.dpl.join(', '):'otomatis sesuai karakter mapel')+'</span>'}
function bindCatalog(){const r=q('pkR'),m=q('pkM'),b=q('pkB');if(!r||!m||!b)return setTimeout(bindCatalog,400);['change','input'].forEach(ev=>document.addEventListener(ev,e=>{if(e.target===r||e.target===m||e.target===b)setTimeout(sync,0)},true));sync()}
function clickSync(e){const t=(e.target.closest('button')||e.target.closest('[role="button"]'));if(!t)return;const text=(t.textContent||'').trim().toLowerCase();if(/cp|tp|atp|prota|promes|rpm|lkpd|asesmen/.test(text))saveBinding()}
function expose(){window.GURU_SD_BINDING={get:selected,sync:sync,getStored:function(){try{return JSON.parse(localStorage.getItem(BKEY)||'null')}catch(e){return null}}};document.addEventListener('click',clickSync,true)}
function boot(){expose();bindCatalog()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();