/* ADM-SD — GLOBAL APP INTEGRITY SUPER v1 SAFE */
(function(){
'use strict';
if(window.__ADM_GLOBAL_INTEGRITY_SUPER_SAFE__)return;
window.__ADM_GLOBAL_INTEGRITY_SUPER_SAFE__=true;
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
function buttonSafety(){qa('button').forEach(b=>{if(!b.getAttribute('type'))b.setAttribute('type','button')})}
function dedupeNav(){const side=q('.side');if(!side)return;const seen=new Set();qa('.navbtn,.navgroup',side).forEach(el=>{const key=(el.id||'')+'|'+(el.getAttribute('onclick')||'')+'|'+(el.textContent||'').replace(/\s+/g,' ').trim();if(!key||key==='|')return;if(seen.has(key))el.remove();else seen.add(key)})}
function mobileNav(){qa('.side .navbtn,.side .navgroup').forEach(el=>{if(el.__admGlobalBound)return;el.__admGlobalBound=true;el.addEventListener('click',()=>{if(window.innerWidth<=850)q('.side')?.classList.remove('open')},{capture:true})})}
function normalizePages(){const pages=qa('.page');if(!pages.length)return;const active=pages.filter(p=>p.classList.contains('active'));if(active.length>1)active.slice(1).forEach(p=>p.classList.remove('active'))}
function repair(){buttonSafety();dedupeNav();mobileNav();normalizePages();window.dispatchEvent(new CustomEvent('admGlobalIntegrityReady'))}
window.GURU_SD_GLOBAL_APP_INTEGRITY={repair,version:'safe-v1'};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',repair,{once:true});else repair();
/* Intentionally no MutationObserver. DOM repairs are invoked by the application when needed. */
})();
