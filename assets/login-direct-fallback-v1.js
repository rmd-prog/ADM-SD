/* ADM-SD UI REPAIR V2: keep native login, make post-login UI deterministic */
(function(){'use strict';
const $=id=>document.getElementById(id);
function unlock(){
  try{
    ['welcomeOverlay','admLoadingOverlay'].forEach(id=>{const el=$(id);if(el){el.classList.remove('show','active','open');el.style.display='none';el.style.visibility='hidden';el.style.opacity='0';el.style.pointerEvents='none';el.setAttribute('aria-hidden','true')}});
    document.body.style.pointerEvents='auto';
    document.querySelectorAll('.navbtn[data-page]').forEach(b=>{b.style.pointerEvents='auto';b.disabled=false});
  }catch(e){console.warn('ui unlock',e)}
}
function page(p){try{const pages=document.querySelectorAll('.page');pages.forEach(x=>x.classList.remove('active'));const el=$(p);if(!el)return false;el.classList.add('active');document.querySelectorAll('.navbtn[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===p));unlock();return true}catch(e){console.error('page',e);return false}}
function bind(){
  unlock();
  document.querySelectorAll('.navbtn[data-page]').forEach(b=>{if(b.__uiRepairV2)return;b.__uiRepairV2=1;b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();page(this.dataset.page)},true)});
  document.querySelectorAll('.navgroup').forEach(b=>{if(b.__uiGroupV2)return;b.__uiGroupV2=1;b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();this.parentElement.classList.toggle('open')},true)});
}
function install(){bind();const app=$( 'app');if(app&&app.style.display!=='none'&&getComputedStyle(app).display!=='none')page(document.querySelector('.page.active')?.id||'dashboard')}
try{window.showWelcome=function(){unlock()}}catch(e){}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
[100,300,700,1500,2500,4000].forEach(ms=>setTimeout(install,ms));
})();