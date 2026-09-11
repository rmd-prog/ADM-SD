/* GURU+ SD — DOCUMENT AUTO BRIDGE SUPER v2
 * Canonical Perangkat UI bridge: Master -> Auto Chain.
 * No AI call is required for the base document chain.
 */
(function(){'use strict';
if(window.__GURU_SD_DOCUMENT_AUTO_BRIDGE_V2__)return;window.__GURU_SD_DOCUMENT_AUTO_BRIDGE_V2__=1;
const MAP={cp:['cpText','cpPreview'],tp:['tpText','tpPreview'],atp:['atpText','atpPreview'],prota:['protaText','protaPreview'],prosem:['prosemText','prosemPreview'],rpm:['rpmText','rpmPreview']};
function master(){return window.GURU_SD_MASTER?.get?.()||null}
function chain(){return window.GURU_SD_AUTO_CHAIN?.run?.()||window.GURU_SD_AUTO_CHAIN?.get?.()||null}
function valid(x,c){return !!(x&&c&&c.source==='GURU_SD_MASTER'&&c.rombel===x.rombel&&c.mapel===x.mapel&&c.babId===x.babId&&c.material===x.material&&String(c.jp)===String(x.jp))}
function run(type){
 const x=master(),c=chain(); if(!valid(x,c))return false;
 const key=String(type).toUpperCase(),text=String(c.docs?.[key]||'').trim(),ids=MAP[type]; if(!ids||!text)return false;
 const field=document.getElementById(ids[0]);if(!field)return false;
 field.value=text;field.dispatchEvent(new Event('input',{bubbles:true}));
 const preview=document.getElementById(ids[1]);if(preview){preview.textContent='✓ '+key+' otomatis • '+x.material+' • '+x.jp+' JP';preview.classList.add('show')}
 return true;
}
function renderExtra(){
 const x=master(),c=chain();if(!valid(x,c))return;
 let box=document.getElementById('perangkatAutoExtraSuper');
 if(!box){box=document.createElement('section');box.id='perangkatAutoExtraSuper';box.style.cssText='margin:16px 0;padding:16px;border:1px solid rgba(99,102,241,.22);border-radius:16px;background:rgba(99,102,241,.04)';
  box.innerHTML='<div style="font-weight:800;margin-bottom:10px">⚡ Perangkat SUPER Otomatis</div><div id="perangkatAutoExtraContext" style="font-size:.9em;opacity:.8;margin-bottom:12px"></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" id="autoLkpdSuper">📘 LKPD Otomatis</button><button type="button" id="autoAsesmenSuper">📝 Asesmen Otomatis</button></div><pre id="perangkatAutoExtraOutput" style="white-space:pre-wrap;display:none;margin-top:12px"></pre>';
  const anchor=document.querySelector('#aiGenerator,#ai-generator,.ai-generator')||document.querySelector('main')||document.body;anchor.appendChild(box);
  box.querySelector('#autoLkpdSuper').addEventListener('click',()=>showExtra('LKPD'));
  box.querySelector('#autoAsesmenSuper').addEventListener('click',()=>showExtra('ASESMEN'));
 }
 const ctx=document.getElementById('perangkatAutoExtraContext');if(ctx)ctx.textContent=x.rombel+' • '+x.mapel+' • BAB '+x.babNo+' — '+x.material+' • '+x.jp+' JP';
}
function showExtra(type){const x=master(),c=chain();if(!valid(x,c))return;const text=String(c.docs?.[type]||'').trim();const out=document.getElementById('perangkatAutoExtraOutput');if(!out)return;out.style.display='block';out.textContent=text||('Dokumen '+type+' belum tersedia di Auto Chain.')}
function ready(){
 Object.keys(MAP).forEach(type=>{const C=type[0].toUpperCase()+type.slice(1),el=document.getElementById('generate'+C);if(!el||el.dataset.autoBridgeV2)return;el.dataset.autoBridgeV2='1';el.addEventListener('click',e=>{if(run(type)){e.preventDefault();e.stopImmediatePropagation()}},true)});
 renderExtra();
}
window.GURU_SD_DOCUMENT_AUTO_BRIDGE={run,refresh:ready};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ready,700),{once:true});else setTimeout(ready,700);
window.addEventListener('guruSdMasterChanged',()=>setTimeout(ready,180));
window.addEventListener('guruSdAutoChainChanged',()=>setTimeout(ready,180));
})();
