/* ADM-SD UI RECOVERY V8 — non-invasive fallback only */
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
  }

  function fallbackNav(btn){
    const p=btn&&btn.dataset&&btn.dataset.page;
    const page=p&&$(p);
    if(!page)return;
    if(typeof window.showPage==='function'){
      try{ window.showPage(p); return; }catch(e){ console.warn('showPage fallback:',e); }
    }
    document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
    page.classList.add('active');
    document.querySelectorAll('.navbtn[data-page]').forEach(x=>x.classList.toggle('active',x===btn));
    const side=$('sidebar');
    if(side&&innerWidth<=850)side.classList.remove('open');
  }

  function fallbackLogout(){
    ['siAuthToken','siLogin','authToken','token','currentUser','userSession','sessionUser'].forEach(k=>{
      try{localStorage.removeItem(k)}catch(e){}
      try{sessionStorage.removeItem(k)}catch(e){}
    });
    const app=$('app'),login=$('loginScreen');
    if(app){app.style.display='none';app.classList.remove('active','show')}
    if(login){login.style.display='grid';login.classList.add('active')}
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    window.scrollTo(0,0);
  }

  function bind(){
    hideOverlays();

    /* Native handlers own navigation. This listener is bubble-phase only and never
       cancels the event. It repairs navigation only when the native handler did not. */
    if(!document.__uiRecoveryV8){
      document.__uiRecoveryV8=true;
      document.addEventListener('click',function(e){
        const nav=e.target.closest&&e.target.closest('.navbtn[data-page]');
        if(nav){
          const p=nav.dataset.page;
          setTimeout(function(){
            const page=$(p);
            if(page && !page.classList.contains('active')) fallbackNav(nav);
          },0);
          return;
        }

        const logout=e.target.closest&&e.target.closest('#logoutBtn,[data-action="logout"]');
        if(logout && typeof window.logout!=='function'){
          setTimeout(fallbackLogout,0);
        }
      },false);
    }
  }

  function install(){bind();hideOverlays()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
