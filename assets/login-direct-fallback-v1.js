/* ADM-SD UI RECOVERY V6 — navigation fix without changing native layout */
(function(){'use strict';
  const $=id=>document.getElementById(id);
  function hideOverlays(){
    ['welcomeOverlay','admLoadingOverlay'].forEach(n=>{
      const e=$(n); if(!e)return;
      e.classList.remove('show','active','open');
      e.style.display='none';e.style.visibility='hidden';e.style.opacity='0';
      e.style.pointerEvents='none';e.setAttribute('aria-hidden','true');
    });
    document.body.style.pointerEvents='auto';
  }
  function navigate(p,btn){
    const page=$(p);if(!page)return;
    hideOverlays();
    try{if(typeof window.showPage==='function')window.showPage(p)}catch(e){console.warn('native navigation error',e)}
    /* Repair only page visibility. Do NOT rebuild, restyle, or rerender the page here. */
    document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
    page.classList.add('active');
    document.querySelectorAll('.navbtn[data-page]').forEach(x=>x.classList.toggle('active',x===btn));
    const side=$('sidebar');if(side&&innerWidth<=850)side.classList.remove('open');
  }
  function bind(){
    hideOverlays();
    document.querySelectorAll('.navbtn[data-page]').forEach(b=>{
      if(b.__uiRecoveryV6)return;b.__uiRecoveryV6=true;
      b.addEventListener('click',function(e){
        e.preventDefault();e.stopPropagation();navigate(this.dataset.page,this);
      },true);
    });
    document.querySelectorAll('.navgroup').forEach(b=>{
      if(b.__uiGroupV6)return;b.__uiGroupV6=true;
      b.addEventListener('click',function(e){
        e.preventDefault();e.stopPropagation();this.parentElement.classList.toggle('open');hideOverlays();
      },true);
    });
    const menu=document.querySelector('[data-menu-toggle],#menuBtn,#menuToggle,.menu-mobile');
    if(menu&&!menu.__uiMenuV6){menu.__uiMenuV6=true;menu.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();const side=$('sidebar');if(side)side.classList.toggle('open');hideOverlays()},true)}
  }
  function install(){bind();hideOverlays()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  [100,300,700,1200,2500,5000].forEach(ms=>setTimeout(install,ms));
})();