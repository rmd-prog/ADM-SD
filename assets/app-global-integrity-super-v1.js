/* ADM-SD — GLOBAL APP INTEGRITY SUPER v2 */
(function(){
'use strict';
if(window.__ADM_GLOBAL_INTEGRITY_SUPER__)return;
window.__ADM_GLOBAL_INTEGRITY_SUPER__=true;
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
function buttonSafety(){
  qa('button:not([type])').forEach(b=>{
    const form=b.closest('form');
    const isLogin=!!(form&&(['loginForm','login'].includes(form.id)||form.matches('.login-form')));
    b.setAttribute('type',isLogin?'submit':'button');
  });
}
function dedupeNav(){
  const side=q('.side');if(!side)return;
  const seen=new Set();
  qa('.navbtn,.navgroup',side).forEach(el=>{
    const key=(el.id||'')+'|'+(el.getAttribute('onclick')||'')+'|'+(el.textContent||'').replace(/\s+/g,' ').trim();
    if(!key||key==='|')return;
    if(seen.has(key)){el.remove();return}seen.add(key);
  });
}
function mobileNav(){
  qa('.side .navbtn,.side .navgroup').forEach(el=>{
    if(el.__admGlobalBound)return;
    el.__admGlobalBound=true;
    el.addEventListener('click',()=>{
      if(window.innerWidth<=850)q('.side')?.classList.remove('open');
    });
  });
}
function normalizePages(){
  const pages=qa('.page');if(!pages.length)return;
  const active=pages.filter(p=>p.classList.contains('active'));
  if(active.length>1)active.slice(1).forEach(p=>p.classList.remove('active'));
}
function repair(){buttonSafety();dedupeNav();mobileNav();normalizePages();window.dispatchEvent(new CustomEvent('admGlobalIntegrityReady'));}
window.GURU_SD_GLOBAL_APP_INTEGRITY={repair,version:'v2'};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',repair,{once:true});else repair();
new MutationObserver(()=>repair()).observe(document.documentElement,{subtree:true,childList:true});
})();