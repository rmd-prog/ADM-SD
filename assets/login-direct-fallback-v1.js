/* ADM-SD UI RECOVERY V7 — restore navigation + global actions without touching native rendering */
(function(){'use strict';
  const $=id=>document.getElementById(id);

  function hideOverlays(){
    ['welcomeOverlay','admLoadingOverlay'].forEach(n=>{
      const e=$(n); if(!e)return;
      e.classList.remove('show','active','open');
      e.style.display='none';
      e.style.visibility='hidden';
      e.style.opacity='0';
      e.style.pointerEvents='none';
      e.setAttribute('aria-hidden','true');
    });
    document.body.style.pointerEvents='auto';
  }

  function nativeNavigate(p,btn){
    hideOverlays();
    try{
      if(typeof window.showPage==='function'){
        window.showPage(p);
        return true;
      }
    }catch(e){console.warn('native navigation error',e)}
    return false;
  }

  function fallbackNavigate(p,btn){
    const page=$(p); if(!page)return;
    document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
    page.classList.add('active');
    document.querySelectorAll('.navbtn[data-page]').forEach(x=>x.classList.toggle('active',x===btn));
    const side=$('sidebar');
    if(side&&innerWidth<=850)side.classList.remove('open');
  }

  function navigate(p,btn){
    if(!nativeNavigate(p,btn))fallbackNavigate(p,btn);
  }

  function doLogout(){
    hideOverlays();
    try{
      if(typeof window.logout==='function' && !window.logout.__uiRecoveryWrapped){
        return window.logout();
      }
    }catch(e){console.warn('native logout error',e)}
    try{
      ['siAuthToken','siLogin','authToken','token','currentUser','userSession','sessionUser'].forEach(k=>{
        try{localStorage.removeItem(k)}catch(e){}
        try{sessionStorage.removeItem(k)}catch(e){}
      });
    }catch(e){}
    const app=$('app'),login=$('loginScreen');
    if(app){app.style.display='none';app.classList.remove('active','show')}
    if(login){login.style.display='grid';login.classList.add('active')}
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    window.scrollTo(0,0);
  }

  function bind(){
    hideOverlays();

    document.querySelectorAll('.navbtn[data-page]').forEach(b=>{
      if(b.__uiRecoveryV7)return;
      b.__uiRecoveryV7=true;
      b.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        navigate(this.dataset.page,this);
      },true);
    });

    document.querySelectorAll('.navgroup').forEach(b=>{
      if(b.__uiGroupV7)return;
      b.__uiGroupV7=true;
      b.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        this.parentElement.classList.toggle('open');
        hideOverlays();
      },true);
    });

    const menu=document.querySelector('[data-menu-toggle],#menuBtn,#menuToggle,.menu-mobile');
    if(menu&&!menu.__uiMenuV7){
      menu.__uiMenuV7=true;
      menu.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        const side=$('sidebar');
        if(side)side.classList.toggle('open');
        hideOverlays();
      },true);
    }

    const logout=$('logoutBtn') || document.querySelector('[data-action="logout"]');
    if(logout&&!logout.__uiLogoutV7){
      logout.__uiLogoutV7=true;
      logout.addEventListener('click',function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        doLogout();
      },true);
    }

    /* Keep ordinary controls clickable. This only repairs accidental pointer blocking;
       it does not replace their native handlers. */
    document.querySelectorAll('button,input,select,textarea,a').forEach(el=>{
      if(el.closest('#welcomeOverlay,#admLoadingOverlay'))return;
      if(el.__uiPointerV7)return;
      el.__uiPointerV7=true;
      el.style.pointerEvents='auto';
      el.style.touchAction='manipulation';
    });
  }

  function install(){bind();hideOverlays()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  [100,300,700,1200,2500,5000].forEach(ms=>setTimeout(install,ms));
})();
