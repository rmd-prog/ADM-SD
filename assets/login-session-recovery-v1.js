/* ADM-SD login session recovery v1
 * If API auth has already committed a token, never leave the UI stranded on login.
 * Production verification trigger: repaired exporter + real body loader.
 */
(function(){'use strict';
  function recover(){
    try{
      var token=String(localStorage.getItem('siAuthToken')||'').trim();
      var raw=localStorage.getItem('siLogin');
      if(!token||!raw)return;
      var saved=JSON.parse(raw||'null');
      if(!saved)return;
      var login=document.getElementById('loginScreen');
      var app=document.getElementById('app');
      if(!login||!app)return;
      if(typeof window.finishLogin==='function'){
        try{window.finishLogin(saved);}catch(e){console.warn('finishLogin recovery fallback:',e);}
      }
      login.style.display='none';
      app.style.display='block';
      var dashboard=document.querySelector('.page[data-page="dashboard"]')||document.getElementById('dashboard');
      if(dashboard)dashboard.classList.add('active');
      document.querySelectorAll('.page').forEach(function(p){
        if(p!==dashboard)p.classList.remove('active');
      });
      var db=document.querySelector('.navbtn[data-page="dashboard"]');
      if(db)db.classList.add('active');
    }catch(e){console.warn('Session recovery skipped:',e);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(recover,0);setTimeout(recover,350);setTimeout(recover,1200);},{once:true});
  else {setTimeout(recover,0);setTimeout(recover,350);setTimeout(recover,1200);}
})();
