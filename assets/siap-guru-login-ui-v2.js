/* SIAP GURU — LOGIN UI V2
 * Presentation only. Auth, NIP/password fields, handlers, API and backend untouched.
 */
(function(){
  'use strict';
  if(window.__SIAP_GURU_LOGIN_UI_V2__) return;
  window.__SIAP_GURU_LOGIN_UI_V2__=true;

  const css=`
  .login{
    min-height:100vh!important;
    padding:16px!important;
    box-sizing:border-box!important;
    background:radial-gradient(circle at 10% 10%,rgba(37,99,235,.14),transparent 32%),radial-gradient(circle at 90% 90%,rgba(14,165,233,.12),transparent 30%),linear-gradient(135deg,#eef5ff,#f8fbff 55%,#eaf2ff)!important;
  }
  .login-card{
    width:min(430px,100%)!important;
    padding:0!important;
    overflow:hidden!important;
    border-radius:24px!important;
    border:1px solid rgba(148,163,184,.28)!important;
    box-shadow:0 24px 65px rgba(15,23,42,.14)!important;
    background:#fff!important;
  }
  .login-card::before{
    content:'SIAP GURU\\A Portal Administrasi & Pembelajaran Guru';
    white-space:pre-line;
    display:block;
    padding:30px 26px 27px;
    color:#fff;
    font-size:27px;
    line-height:1.22;
    font-weight:900;
    letter-spacing:-.035em;
    background:linear-gradient(145deg,#123c9e,#2563eb 58%,#0891b2);
  }
  .login-card .login-brand,
  .login-card .login-brand-logo,
  .login-card img[src*='logo-sekolah.png'],
  .login-card img[alt*='Logo sekolah' i]{display:none!important}
  .login-card>form,
  .login-card>.login-form,
  .login-card>div:not(.login-brand){box-sizing:border-box}
  .login-card input{
    min-height:46px!important;
    border-radius:12px!important;
    border:1px solid #d7e0ec!important;
    background:#f8fafc!important;
    padding:11px 13px!important;
    transition:.18s ease!important;
  }
  .login-card input:focus{
    outline:none!important;
    border-color:#2563eb!important;
    background:#fff!important;
    box-shadow:0 0 0 4px rgba(37,99,235,.10)!important;
  }
  .login-card button[type='submit'],
  .login-card .btn-primary,
  .login-card button.primary{
    min-height:46px!important;
    border-radius:12px!important;
    font-weight:800!important;
  }
  @media(max-width:480px){
    .login{padding:10px!important}
    .login-card{border-radius:20px!important}
    .login-card::before{padding:25px 21px 23px;font-size:24px}
  }
  `;

  function boot(){
    if(!document.getElementById('siapGuruLoginUIV2Style')){
      const s=document.createElement('style');
      s.id='siapGuruLoginUIV2Style';
      s.textContent=css;
      document.head.appendChild(s);
    }
    document.querySelectorAll('.login-brand-title').forEach(e=>e.textContent='SIAP GURU');
    document.querySelectorAll('.login-brand-ver').forEach(e=>e.textContent='TA 2026/2027');
    document.querySelectorAll('.login-brand-logo').forEach(e=>e.remove());
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
  new MutationObserver(boot).observe(document.documentElement,{subtree:true,childList:true});
})();
