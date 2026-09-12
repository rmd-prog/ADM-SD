/* ADM-SD UI RECOVERY V9 — login submit safety + non-invasive UI fallback */
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

  function showLoginError(message){
    const e=$('loginError');
    if(e){
      e.textContent=String(message||'Login gagal.');
      e.className='alert';
      e.style.display='block';
    } else {
      console.error('ADM-SD login:',message);
    }
  }

  function bindLogin(){
    const form=$('loginForm');
    if(!form || form.__admLoginV9)return;
    form.__admLoginV9=true;

    /* This is the final safety net: prevent the browser's native POST/reload.
       Existing SAFE LOGIN remains the owner when it is available. */
    form.addEventListener('submit',async function(e){
      e.preventDefault();
      e.stopPropagation();

      if(typeof window.__ADM_LOGIN!=='function'){
        showLoginError('Modul login belum siap. Silakan muat ulang halaman.');
        return false;
      }

      const user=$('loginUser');
      const pass=$('loginPass');
      const btn=form.querySelector('button[type="submit"],button:not([type])');
      const username=String(user&&user.value||'').trim();
      const password=String(pass&&pass.value||'');

      if(!username||!password){
        showLoginError('NIP dan password wajib diisi.');
        return false;
      }

      if(btn){btn.disabled=true;btn.dataset.oldText=btn.textContent;btn.textContent='MEMERIKSA...'}
      try{
        await window.__ADM_LOGIN(username,password);
      }catch(err){
        const token=String(localStorage.getItem('siAuthToken')||'').trim();
        if(!token){
          const login=$('loginScreen'),app=$('app');
          if(login)login.style.display='grid';
          if(app)app.style.display='none';
          showLoginError(err&&err.message?err.message:'Login gagal. Periksa NIP dan password.');
        }else{
          console.warn('Login succeeded but UI completion reported an error:',err);
        }
      }finally{
        if(btn){btn.disabled=false;btn.textContent=btn.dataset.oldText||'MASUK KE SISTEM'}
      }
      return false;
    },false);
  }

  function bind(){
    hideOverlays();
    bindLogin();

    if(!document.__uiRecoveryV9){
      document.__uiRecoveryV9=true;
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
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  [100,500,1200,2500].forEach(ms=>setTimeout(bindLogin,ms));
})();
