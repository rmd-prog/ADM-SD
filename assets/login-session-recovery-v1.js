/* ADM-SD login session recovery v2
 * Recover a valid saved session only when the login screen is actually visible.
 * Never overwrite an already active page or user navigation.
 */
(function(){'use strict';
  var done=false;
  function visible(el){
    if(!el)return false;
    try{return getComputedStyle(el).display!=='none' && el.offsetParent!==null;}catch(e){return false;}
  }
  function recover(){
    if(done)return;
    try{
      var token=String(localStorage.getItem('siAuthToken')||'').trim();
      var raw=localStorage.getItem('siLogin');
      if(!token||!raw)return;
      var saved=JSON.parse(raw||'null');
      if(!saved)return;
      var login=document.getElementById('loginScreen');
      var app=document.getElementById('app');
      if(!login||!app)return;

      var active=document.querySelector('.page.active');
      if(!visible(login) && visible(app)){
        done=true;
        return;
      }

      if(typeof window.finishLogin==='function'){
        try{window.finishLogin(saved);}catch(e){console.warn('finishLogin recovery:',e);}
      }
      login.style.display='none';
      login.classList.remove('active');
      app.style.display='block';

      /* Only choose dashboard when no page is already active. */
      if(!active){
        var dashboard=document.querySelector('.page[data-page="dashboard"]')||document.getElementById('dashboard');
        if(dashboard)dashboard.classList.add('active');
        var db=document.querySelector('.navbtn[data-page="dashboard"]');
        if(db)db.classList.add('active');
      }
      done=true;
    }catch(e){console.warn('Session recovery skipped:',e);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(recover,0);},{once:true});
  else setTimeout(recover,0);
})();
