/* GURU+ SD — AUTO CHAIN SUPER v4
 * Canonical deterministic chain: Master -> CP -> ATP -> TP -> JP -> PROTA -> PROMES -> RPM -> LKPD -> Asesmen.
 */
(function(){'use strict';
if(window.__GURU_SD_AUTO_CHAIN_SUPER_V4__)return;window.__GURU_SD_AUTO_CHAIN_SUPER_V4__=1;
const KEY='guru_sd_auto_chain_super_v1';
const TYPES=['CP','ATP','TP','PROTA','PROMES','RPM','LKPD','ASESMEN'];
function master(){return window.GURU_SD_MASTER?.get?.()||null}
function identity(x){return [x?.rombel,x?.mapel,x?.babId,x?.material,x?.semester,x?.jp].join('|')}
function valid(c,x){return !!(c&&x&&c.source==='GURU_SD_MASTER'&&identity(c)===identity(x))}
function clear(reason='context-changed'){localStorage.removeItem(KEY);window.GURU_SD_AUTO_CHAIN_DATA=null;localStorage.setItem('guru_sd_auto_chain_audit_v1',JSON.stringify({ok:false,stale:true,reason,updatedAt:new Date().toISOString()}))}
function docsFor(x){
 const e=window.GURU_SD_PERANGKAT_ENGINE;if(!e||typeof e.generate!=='function')return null;
 const docs={};for(const t of TYPES){const d=e.generate(t);docs[t]=typeof d==='string'?d:(d?.text||d?.content||'');}
 return docs;
}
function docHasContext(text,x){const s=String(text||'');return !!x&&s.includes(String(x.material))&&(s.includes(String(x.babId))||s.includes('BAB '+String(x.babNo))||s.includes('BAB '+String(x.babNo)+':'))}
function build(){const x=master();if(!x||!x.material||!x.babId){clear('invalid-master');return null}clear('rebuild');const docs=docsFor(x);if(!docs){clear('engine-unavailable');return null}for(const t of TYPES){if(!docHasContext(docs[t],x)){clear('document-context-invalid:'+t);return null}}
 const c={source:'GURU_SD_MASTER',rombel:x.rombel,mapel:x.mapel,babId:x.babId,babNo:x.babNo,material:x.material,semester:x.semester,jp:x.jp,tp:x.tp,dpl:x.dpl,modelPembelajaran:x.modelPembelajaran,docs,updatedAt:new Date().toISOString()};localStorage.setItem(KEY,JSON.stringify(c));window.GURU_SD_AUTO_CHAIN_DATA=c;window.dispatchEvent(new CustomEvent('guruSdAutoChainChanged',{detail:c}));return c}
function get(){const x=master();let c=null;try{c=JSON.parse(localStorage.getItem(KEY)||'null')}catch{}return valid(c,x)?c:null}
function run(){const c=get();return c||build()}
function render(){const x=master(),c=get();let box=document.getElementById('guruSdAutoChainSuper');if(!box){box=document.createElement('section');box.id='guruSdAutoChainSuper';box.style.cssText='margin:16px 0;padding:16px;border:1px solid rgba(16,185,129,.25);border-radius:16px;background:rgba(16,185,129,.04)';(document.querySelector('main')||document.body).appendChild(box)}if(!x||!c){box.innerHTML='<b>⚡ Auto Chain SUPER</b><div style="margin-top:8px">Menunggu Master yang valid.</div>';return}box.innerHTML='<b>⚡ Auto Chain SUPER AKTIF</b><div style="margin-top:8px">'+x.rombel+' • '+x.mapel+' • BAB '+x.babNo+' — '+x.material+' • '+x.jp+' JP</div><div style="margin-top:8px">BAB → CP → ATP → TP → JP → PROTA → PROMES → RPM → LKPD → Asesmen ✓</div>'}
function onContext(){clear();setTimeout(()=>{build();render()},180)}
window.GURU_SD_AUTO_CHAIN={get,run,build,clear,render};
['guruSdMasterChanged','change'].forEach(ev=>window.addEventListener(ev,onContext));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{run();render()},500),{once:true});else setTimeout(()=>{run();render()},500);
setInterval(()=>{const x=master(),c=get();if(x&&!c)build();render()},3000);
})();
