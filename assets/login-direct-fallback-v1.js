/* final login health verification trigger: real-body fallback remains active */
(function(){'use strict';
  const API='https://adm-sd.adm-sd.workers.dev/api';
  function setLoggedIn(user,token){
    try{localStorage.setItem('siAuthToken',token||'');localStorage.setItem('siLogin',JSON.stringify(user||{}));}catch(e){}
    try{window.currentTeacher=user||window.currentTeacher||null;}catch(e){}
    const login=document.getElementById('loginScreen')||document.querySelector('.login');
    const app=document.getElementById('app');
    if(login)login.style.display='none';
    if(app)app.style.display='block';
    try{if(typeof window.finishLogin==='function')window.finishLogin(user);}catch(e){console.warn('finishLogin fallback:',e)}
    try{if(typeof window.updateTeacherProfile==='function')window.updateTeacherProfile();}catch(e){}
    try{if(typeof window.syncRoleMenu==='function')window.syncRoleMenu();}catch(e){}
    try{if(typeof window.showPage==='function')window.showPage('dashboard');}catch(e){}
  }
  async function directLogin(username,password){
    const r=await fetch(API+'/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nip:String(username),username:String(username),password:String(password)})});
    let d=null;try{d=await r.json()}catch(e){d={ok:false,message:'Respons login tidak valid.'}};
    if(!r.ok||!d.ok)throw Error(d.message||'NIP atau password salah.');
    const token=String(d.token||d.access_token||'').trim();
    if(!token)throw Error('Login berhasil tetapi token tidak diterima.');
    setLoggedIn(d.user||{username:username},token);return d;
  }
  function install(){
    const form=document.getElementById('loginForm');
    if(!form||form.__directLoginFallback)return;
    form.__directLoginFallback=true;
    form.addEventListener('submit',async function(ev){
      ev.preventDefault();ev.stopImmediatePropagation();
      const inputs=form.querySelectorAll('input');const u=inputs[0],p=inputs[1];
      const btn=form.querySelector('button[type="submit"]');if(!u||!p)return;
      if(btn){btn.disabled=true;btn.textContent='MEMERIKSA…';}
      try{
        if(typeof window.__ADM_LOGIN==='function'){
          await window.__ADM_LOGIN(u.value.trim(),p.value);
          if(localStorage.getItem('siAuthToken')){setLoggedIn(JSON.parse(localStorage.getItem('siLogin')||'{}'),localStorage.getItem('siAuthToken'));return;}
        }
        await directLogin(u.value.trim(),p.value);
      }catch(e){
        console.error('Direct login fallback:',e);
        const err=document.querySelector('#loginError,.login-error,.error');
        if(err){err.textContent=e.message||'Login gagal.';err.style.display='block';}else alert(e.message||'Login gagal.');
      }finally{if(btn){btn.disabled=false;btn.textContent='MASUK →';}}
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  setTimeout(install,500);setTimeout(install,1500);setTimeout(install,3000);
})();
