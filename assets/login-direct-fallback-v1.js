/* ADM-SD NATIVE UI REPAIR V4: reliable navigation fallback */
(function(){'use strict';
const $=id=>document.getElementById(id);
function unlock(){try{
  ['welcomeOverlay','admLoadingOverlay'].forEach(id=>{const el=$(id);if(el){el.classList.remove('show','active','open');el.style.display='none';el.style.visibility='hidden';el.style.opacity='0';el.style.pointerEvents='none';el.setAttribute('aria-hidden','true')}});
  document.body.style.pointerEvents='auto';
  document.querySelectorAll('.navbtn[data-page]').forEach(b=>{b.style.pointerEvents='auto';b.disabled=false});
}catch(e){console.warn('ui unlock',e)}}
function directNavigate(p,b){
  if(!p)return false;
  const el=$(p);
  if(!el)return false;
  try{
    if(typeof window.showPage==='function')window.showPage(p);
  }catch(e){console.warn('showPage failed; using direct navigation',e)}
  try{
    /* Always verify and repair the visible page after native routing. */
    const active=el.classList.contains('active') && getComputedStyle(el).display!=='none';
    if(!active){
      document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
      el.classList.add('active');
    }
    document.querySelectorAll('.navbtn[data-page]').forEach(x=>x.classList.toggle('active',x===b||x.dataset.page===p));
    const side=$('.side');
    if(side&&innerWidth<=850)side.classList.remove('open');
    unlock();
    return true;
  }catch(e){console.warn('direct navigation failed',e);return false}
}
function bindNav(){
  document.querySelectorAll('.navbtn[data-page]').forEach(b=>{
    if(b.__nativeRepairV4)return;b.__nativeRepairV4=true;
    b.addEventListener('click',function(){
      const p=this.dataset.page;
      setTimeout(()=>directNavigate(p,this),0);
    },false);
  });
  document.querySelectorAll('.navgroup').forEach(b=>{
    if(b.__groupRepairV4)return;b.__groupRepairV4=true;
    b.addEventListener('click',function(){
      setTimeout(()=>{this.parentElement.classList.toggle('open');unlock()},0);
    },false);
  });
}
function install(){unlock();bindNav();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
[50,150,300,700,1200,2000,3500,5000].forEach(ms=>setTimeout(install,ms));
})();