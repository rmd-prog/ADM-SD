/* ADM-SD NATIVE UI REPAIR V3: overlay fix + native navigation bridge */
(function(){'use strict';
const $=id=>document.getElementById(id);
function unlock(){try{
  ['welcomeOverlay','admLoadingOverlay'].forEach(id=>{const el=$(id);if(el){el.classList.remove('show','active','open');el.style.display='none';el.style.visibility='hidden';el.style.opacity='0';el.style.pointerEvents='none';el.setAttribute('aria-hidden','true')}});
  document.body.style.pointerEvents='auto';
  document.querySelectorAll('.navbtn[data-page]').forEach(b=>{b.style.pointerEvents='auto';b.disabled=false});
}catch(e){console.warn('ui unlock',e)}}
function nativeNavigate(p){try{
  if(!p)return false;
  if(typeof window.showPage==='function'){window.showPage(p);return true}
  const el=$(p);if(!el)return false;
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));el.classList.add('active');
  document.querySelectorAll('.navbtn[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===p));
  return true;
}catch(e){console.warn('native navigate',e);return false}}
function bindNav(){
  document.querySelectorAll('.navbtn[data-page]').forEach(b=>{
    if(b.__nativeRepairV3)return;b.__nativeRepairV3=true;
    b.addEventListener('click',function(){
      const p=this.dataset.page;
      setTimeout(()=>{nativeNavigate(p);unlock()},0);
    },false);
  });
  document.querySelectorAll('.navgroup').forEach(b=>{
    if(b.__groupRepairV3)return;b.__groupRepairV3=true;
    b.addEventListener('click',function(){setTimeout(()=>{this.parentElement.classList.toggle('open');unlock()},0),false});
  });
}
function install(){unlock();bindNav();}
try{window.showWelcome=function(){unlock()}}catch(e){}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
[100,300,700,1500,2500,4000].forEach(ms=>setTimeout(install,ms));
})();