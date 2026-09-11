/* GURU+ SD — DOCUMENT AUTO BRIDGE SUPER v3
 * Canonical document bridge. Existing Perangkat buttons consume Auto Chain;
 * LKPD/Asesmen are exposed without calling the AI endpoint.
 */
(function(){'use strict';
if(window.__GURU_SD_DOCUMENT_AUTO_BRIDGE_V3__)return;window.__GURU_SD_DOCUMENT_AUTO_BRIDGE_V3__=1;
const MAP={cp:['cpText','cpPreview'],tp:['tpText','tpPreview'],atp:['atpText','atpPreview'],prota:['protaText','protaPreview'],prosem:['prosemText','prosemPreview'],rpm:['rpmText','rpmPreview']};
function master(){return window.GURU_SD_MASTER?.get?.()||null}
function chain(){return window.GURU_SD_AUTO_CHAIN?.get?.()||window.GURU_SD_AUTO_CHAIN?.run?.()||null}
function valid(x,c){return !!(x&&c&&c.source==='GURU_SD_MASTER'&&c.rombel===x.rombel&&c.mapel===x.mapel&&c.babId===x.babId&&c.material===x.material&&String(c.jp)===String(x.jp))}
function run(type){const x=master(),c=chain();if(!valid(x,c))return false;const ids=MAP[type],text=String(c.docs?.[String(type).toUpperCase()]||'').trim();if(!ids||!text)return false;const field=document.getElementById(ids[0]);if(!field)return false;field.value=text;field.dispatchEvent(new Event('input',{bubbles:true}));const preview=document.getElementById(ids[1]);if(preview){preview.textContent='✓ '+String(type).toUpperCase()+' otomatis • '+x.material+' • '+x.jp+' JP';preview.classList.add('show')}return true}
function extra(){const x=master(),c=chain();if(!valid(x,c))return;let box=document.getElementById('perangkatAutoExtraSuper');if(!box){box=document.createElement('section');box.id='perangkatAutoExtraSuper';box.style.cssText='margin:16px 0;padding:16px;border:1px solid rgba(99,102,241,.22);border-radius:16px;background:rgba(99,102,241,.04)';box.innerHTML='<div style="font-weight:800">⚡ LKPD & Asesmen — Auto Chain SUPER</div><div id="perangkatAutoExtraContext" style="margin:8px 0;font-size:.9em;opacity:.8"></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" id="autoLkpdSuper">📘 LKPD Otomatis</button><button type="button" id="autoAsesmenSuper">📝 Asesmen Otomatis</button></div><pre id="perangkatAutoExtraOutput" style="white-space:pre-wrap;display:none;margin-top:12px"></pre>';(document.querySelector('#aiGenerator')||document.querySelector('main')||document.body).appendChild(box);box.querySelector('#autoLkpdSuper').addEventListener('click',()=>show('LKPD'));box.querySelector('#autoAsesmenSuper').addEventListener('click',()=>show('ASESMEN'))}const ctx=document.getElementById('perangkatAutoExtraContext');if(ctx)ctx.textContent=x.rombel+' • '+x.mapel+' • BAB '+x.babNo+' — '+x.material+' • '+x.jp+' JP'}
function show(type){const x=master(),c=chain();if(!valid(x,c))return;const out=document.getElementById('perangkatAutoExtraOutput');if(!out)return;out.style.display='block';out.textContent=String(c.docs?.[type]||('Dokumen '+type+' belum tersedia.')).trim()}
function ready(){Object.keys(MAP).forEach(type=>{const C=type[0].toUpperCase()+type.slice(1),el=document.getElementById('generate'+C);if(!el||el.dataset.autoBridgeV3)return;el.dataset.autoBridgeV3='1';el.addEventListener('click',e=>{if(run(type)){e.preventDefault();e.stopImmediatePropagation()}},true)});extra()}
window.GURU_SD_DOCUMENT_AUTO_BRIDGE={run,refresh:ready};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ready,900),{once:true});else setTimeout(ready,900);
window.addEventListener('guruSdMasterChanged',()=>setTimeout(ready,180));window.addEventListener('guruSdAutoChainChanged',()=>setTimeout(ready,180));
})();
