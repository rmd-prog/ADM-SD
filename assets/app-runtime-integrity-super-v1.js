/* GURU+ SD — APP RUNTIME INTEGRITY SUPER V1
   Runtime hardening + self diagnostics for the complete app shell.
   Does not touch D1, students, Worker or assessment records.
*/
(function(){
'use strict';
if(window.__ADM_RUNTIME_INTEGRITY_V1__)return;
window.__ADM_RUNTIME_INTEGRITY_V1__=true;
const started=Date.now();
const state={startedAt:new Date().toISOString(),errors:[],warnings:[],checks:{},ready:false};
const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
function check(name,ok,detail){state.checks[name]={ok:!!ok,detail:detail||''};return !!ok}
function master(){try{return window.GURU_SD_MASTER?.get?.()||{}}catch(e){return {}}}
function repairButtons(){qa('button:not([type])').forEach(b=>{if(!/submit|reset/i.test(b.textContent||''))b.type='button'})}
function repairNav(){
 qa('.navbtn').forEach(b=>{
   if(!b.dataset.runtimeBound){
     b.dataset.runtimeBound='1';
     b.addEventListener('click',()=>setTimeout(()=>{
       const target=b.dataset.page;
       if(target){const p=document.getElementById(target);if(p){qa('.page').forEach(x=>x.classList.remove('active'));p.classList.add('active');qa('.navbtn').forEach(x=>x.classList.remove('active'));b.classList.add('active')}}
       const side=q('.side');if(side&&innerWidth<=850)side.classList.remove('open');
     },0),true);
   }
 })
}
function audit(){
 repairButtons();repairNav();
 const pages=qa('.page');
 check('loginPage',!!q('#login'),!!q('#login')?'ok':'missing #login');
 check('appShell',!!q('#app'),!!q('#app')?'ok':'missing #app');
 check('navigation',qa('.navbtn').length>0,qa('.navbtn').length+' nav buttons');
 check('pageTargets',qa('.navbtn[data-page]').every(b=>!b.dataset.page||!!document.getElementById(b.dataset.page)),'all nav targets exist');
 check('master',!!window.GURU_SD_MASTER?.get,'GURU_SD_MASTER available');
 check('perangkatEngine',!!window.GURU_SD_PERANGKAT_ENGINE?.generate,'deterministic engine available');
 check('autoChain',!!window.GURU_SD_AUTO_CHAIN?.run,'automatic document chain available');
 check('documentBridge',!!window.GURU_SD_DOCUMENT_AUTO_BRIDGE,'document bridge available');
 check('assessmentIntegrity',!!window.GURU_SD_ASSESSMENT_INTEGRITY,'assessment integrity available');
 check('featureComplete',!!window.GURU_SD_FEATURE_COMPLETE,'feature bridge available');
 check('uiFeedback',!!window.ADM_UI,'toast/loading UI available');
 check('aiSuper',!!window.GURU_SD_AI_SUPER || !!window.generateAISuper || !!q('#aiGenerate'),'AI SUPER surface available');
 check('dynamicScripts',qa('script[src*="assessment-"]',document).length>=1,'assessment modules requested');
 check('duplicateCustomMenus',new Set(qa('[data-feature-custom]').map(x=>x.dataset.featureCustom)).size===qa('[data-feature-custom]').length,'custom menu keys unique');
 const m=master();
 if(m.material)check('masterIdentity',!!m.rombel&&!!m.mapel&&!!m.material,'Master identity complete');
 state.ready=Object.values(state.checks).filter(x=>x&&x.ok===false).length===0;
 window.GURU_SD_RUNTIME_INTEGRITY=state;
 return state;
}
window.addEventListener('error',e=>{state.errors.push({message:String(e.message||e.error||'runtime error'),source:e.filename||'',line:e.lineno||0});window.GURU_SD_RUNTIME_INTEGRITY=state},{capture:true});
window.addEventListener('unhandledrejection',e=>{state.errors.push({message:String(e.reason?.message||e.reason||'unhandled rejection')});window.GURU_SD_RUNTIME_INTEGRITY=state});
function boot(){audit();setTimeout(audit,900);setTimeout(audit,2200);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();