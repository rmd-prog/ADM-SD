/* ADM-SD — INDEX MENU FINISHING V8: visual cleanup only */
(function(){
'use strict';
if(window.__ADM_INDEX_FINISHING_V8__)return;
window.__ADM_INDEX_FINISHING_V8__=true;

function css(){
 if(document.getElementById('adm-index-v8-style'))return;
 const s=document.createElement('style');
 s.id='adm-index-v8-style';
 s.textContent=`
   /* Remove duplicated helper/result chrome from earlier additive layers. */
   #aiGenerate .adm-ai-finish-bar{display:none!important}
   #aiGenerate .adm-prompt-tools:has(.adm-prompt-head){display:none!important}
   #aiGenerate .adm-result-tools{display:none!important}

   /* Keep the useful V7 action row, but make it compact on mobile. */
   #aiGenerate .adm-v7-tools{margin:8px 0 12px}
   #aiGenerate .adm-v7-tools button{min-height:38px}

   /* Reduce nested-card fatigue without changing the core controls. */
   @media(max-width:700px){
     #aiGenerate .adm-v4-banner{padding:11px 12px;margin-bottom:10px;border-radius:14px}
     #aiGenerate .adm-v4-icon{width:36px;height:36px}
     #aiGenerate .adm-v4-tip{margin-top:8px;padding:9px 10px}
     #aiGenerate .adm-v6-box{margin-top:9px;padding:11px;border-radius:13px}
     #aiGenerate .adm-lkpd-panel{margin-top:9px;padding:11px;border-radius:13px}
     #aiGenerate .adm-prompt-tools{margin:8px 0 10px}
     #aiGenerate .adm-v7-status{margin:8px 0;padding:8px 10px}
   }
 `;
 document.head.appendChild(s);
}

function cleanup(){
 const root=document.getElementById('aiGenerate');
 if(!root)return;
 // V1 and V3 share the adm-prompt-tools class. Keep the newer V3 "Bantu susun prompt".
 root.querySelectorAll('.adm-prompt-tools').forEach(el=>{
   const t=(el.textContent||'').toLowerCase();
   if(t.includes('prompt siap') && !t.includes('bantu susun'))el.style.display='none';
 });
 // Keep V6 result actions; remove V3's duplicate result toolbar.
 root.querySelectorAll('.adm-result-tools').forEach(el=>el.style.display='none');
 // V1's lower AI Guru ready bar duplicates the V7 action row.
 root.querySelectorAll('.adm-ai-finish-bar').forEach(el=>el.style.display='none');
}

function boot(){css();cleanup()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
[500,1200,2200,4000,6500].forEach(ms=>setTimeout(boot,ms));
const obs=new MutationObserver(boot);
obs.observe(document.body,{childList:true,subtree:true});
})();
