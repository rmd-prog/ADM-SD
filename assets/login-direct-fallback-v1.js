/* ADM-SD UI RECOVERY V10 — hard login interception */
(function(){'use strict';
  const $=id=>document.getElementById(id);
  let busy=false;

  function hideOverlays(){
    ['welcomeOverlay','admLoadingOverlay'].forEach(n=>{
      const e=$(n); if(!e)return;
      e.classList.remove('show','active','open');
      e.style.display='none'; e.style.visibility='hidden';
      e.style.opacity='0'; e.style.pointerEvents='none';
      e.setAttribute('aria-hidden','true');
    });
  }

  function showLoginError(message){
    const e=$('loginError');
    if(e){e.textContent=String(message||'Login gagal.');e.className='alert';e.style.display='block';}
    else console.error('ADM-SD login:',message);
  }

  function isLoginForm(form){
    if(!form)return false;
    if(form.id==='loginForm'||form.id==='login')return true;
    return !!(form.querySelector('#loginUser')&&form.querySelector('#loginPass'));
  }

  async function doLogin(form){
    if(busy)return;
    if(typeof window.__ADM_LOGIN!=='function'){
      showLoginError('Modul login belum siap. Muat ulang halaman.');
      return;
    }
    const user=$('loginUser')||form&&form.querySelector('input[type="text"],input[name="username"],input[name="nip"]');
    const pass=$('loginPass')||form&&form.querySelector('input[type="password"]');
    const username=String(user&&user.value||'').trim();
    const password=String(pass&&pass.value||'');
    if(!username||!password){showLoginError('NIP dan password wajib diisi.');return;}
    const btn=form&&form.querySelector('button[type="submit"],button');
    busy=true;
    if(btn){btn.disabled=true;btn.dataset.oldText=btn.textContent;btn.textContent='MEMERIKSA...';}
    try{
      await window.__ADM_LOGIN(username,password);
    }catch(err){
      const token=String(localStorage.getItem('siAuthToken')||'').trim();
      if(!token)showLoginError(err&&err.message?err.message:'Login gagal. Periksa NIP dan password.');
      else console.warn('Login berhasil tetapi UI completion error:',err);
    }finally{
      busy=false;
      if(btn){btn.disabled=false;btn.textContent=btn.dataset.oldText||'MASUK KE SISTEM';}
    }
  }

  function bindLogin(){
    /* Capture on WINDOW is intentionally the outermost safety net. */
    if(!window.__admHardLoginBound){
      window.__admHardLoginBound=true;
      window.addEventListener('submit',function(e){
        const form=e.target;
        if(!isLoginForm(form))return;
        e.preventDefault();
        e.stopImmediatePropagation();
        doLogin(form);
      },true);
      window.addEventListener('click',function(e){
        const el=e.target&&e.target.closest?e.target.closest('button,input[type="submit"]'):null;
        if(!el)return;
        const form=el.closest&&el.closest('form');
        const login=form&&isLoginForm(form) ? form : (el.id==='loginBtn'||/masuk/i.test(el.textContent||'') ? (document.getElementById('loginForm')||el.closest('form')) : null);
        if(!login)return;
        e.preventDefault();
        e.stopImmediatePropagation();
        doLogin(login);
      },true);
    }
  }

  function fallbackNav(btn){
    const p=btn&&btn.dataset&&btn.dataset.page, page=p&&$(p);
    if(!page)return;
    if(typeof window.showPage==='function'){try{window.showPage(p);return;}catch(e){}}
    document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
    page.classList.add('active');
  }

  function fallbackLogout(){
    ['siAuthToken','siLogin','authToken','token','currentUser','userSession','sessionUser'].forEach(k=>{try{localStorage.removeItem(k)}catch(e){}try{sessionStorage.removeItem(k)}catch(e){}});
    const app=$('app'),login=$('loginScreen');
    if(app){app.style.display='none';app.classList.remove('active','show')}
    if(login){login.style.display='grid';login.classList.add('active')}
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  }

  function bind(){
    hideOverlays(); bindLogin();
    if(!document.__uiRecoveryV10){
      document.__uiRecoveryV10=true;
      document.addEventListener('click',function(e){
        const nav=e.target.closest&&e.target.closest('.navbtn[data-page]');
        if(nav)setTimeout(function(){const p=$(nav.dataset.page);if(p&&!p.classList.contains('active'))fallbackNav(nav)},0);
        const logout=e.target.closest&&e.target.closest('#logoutBtn,[data-action="logout"]');
        if(logout&&typeof window.logout!=='function')setTimeout(fallbackLogout,0);
      },false);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
  [100,300,700,1200,2500,5000].forEach(ms=>setTimeout(bindLogin,ms));
})();
