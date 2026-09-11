/* GURU+ SD — DOCUMENT AUTO BRIDGE SUPER v1
 * UI document buttons use the canonical AUTO CHAIN.
 * AI remains optional and is never required for the base Perangkat chain.
 */
(function(){'use strict';
if(window.__GURU_SD_DOCUMENT_AUTO_BRIDGE_V1__)return;window.__GURU_SD_DOCUMENT_AUTO_BRIDGE_V1__=1;
const MAP={cp:['cpText','cpPreview'],tp:['tpText','tpPreview'],atp:['atpText','atpPreview'],prota:['protaText','protaPreview'],prosem:['prosemText','prosemPreview'],rpm:['rpmText','rpmPreview']};
function run(type){
  const master=window.GURU_SD_MASTER?.get?.();
  const chain=window.GURU_SD_AUTO_CHAIN?.run?.()||window.GURU_SD_AUTO_CHAIN?.get?.();
  if(!master||!chain||chain.material!==master.material||chain.babId!==master.babId)return false;
  const ids=MAP[type],text=String(chain.docs?.[String(type).toUpperCase()]||'').trim();
  if(!ids||!text)return false;
  const field=document.getElementById(ids[0]);if(!field)return false;
  field.value=text;field.dispatchEvent(new Event('input',{bubbles:true}));
  const preview=document.getElementById(ids[1]);if(preview){preview.textContent='✓ '+String(type).toUpperCase()+' otomatis • '+master.material+' • '+master.jp+' JP';preview.classList.add('show');}
  return true;
}
function ready(){
  ['cp','tp','atp','prota','prosem','rpm'].forEach(type=>{
    const C=type[0].toUpperCase()+type.slice(1),el=document.getElementById('generate'+C);
    if(!el||el.dataset.autoBridgeV1)return;
    el.dataset.autoBridgeV1='1';
    el.addEventListener('click',e=>{if(run(type)){e.preventDefault();e.stopImmediatePropagation();}},true);
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ready,900),{once:true});else setTimeout(ready,900);
})();