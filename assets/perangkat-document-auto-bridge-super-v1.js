/* GURU+ SD — DOCUMENT AUTO BRIDGE SUPER v1
 * UI document buttons use the canonical AUTO CHAIN.
 * AI remains optional and is never required for the base Perangkat chain.
 */
(function(){'use strict';
if(window.__GURU_SD_DOCUMENT_AUTO_BRIDGE_V1__)return;window.__GURU_SD_DOCUMENT_AUTO_BRIDGE_V1__=1;
function ready(){
  const types=['cp','tp','atp','prota','prosem','rpm'];
  const run=(type)=>{
    const master=window.GURU_SD_MASTER?.get?.();
    const chain=window.GURU_SD_AUTO_CHAIN?.run?.()||window.GURU_SD_AUTO_CHAIN?.get?.();
    if(!master||!chain||chain.material!==master.material||chain.babId!==master.babId)return false;
    const meta=typeof window.docMeta==='function'?window.docMeta(type):null;
    const key=String(type).toUpperCase();
    const text=String(chain.docs?.[key]||'').trim();
    if(!meta||!text)return false;
    const field=document.getElementById(meta[3]);
    if(!field)return false;
    field.value=text;
    if(typeof window.setDocPreview==='function')window.setDocPreview(type,'✓ '+meta[0]+' otomatis dibuat dari Master BAB '+master.material+' • '+master.jp+' JP.');
    return true;
  };
  types.forEach(type=>{
    const C=type[0].toUpperCase()+type.slice(1),el=document.getElementById('generate'+C);
    if(!el||el.dataset.autoBridgeV1)return;
    el.dataset.autoBridgeV1='1';
    el.addEventListener('click',e=>{
      if(run(type)){e.preventDefault();e.stopImmediatePropagation();}
    },true);
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ready,900),{once:true});else setTimeout(ready,900);
})();