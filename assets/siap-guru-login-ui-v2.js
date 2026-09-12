/* SIAP GURU — LOGIN VISUAL v3
 * Visual only. Authentication, form IDs, handlers and backend remain untouched.
 * This file intentionally styles ONLY the login screen.
 */
(function(){
  'use strict';
  if(window.__SIAP_GURU_LOGIN_UI_V3__) return;
  window.__SIAP_GURU_LOGIN_UI_V3__=true;

  const css=`
  /* ===== LOGIN / PRESENTATION ONLY ===== */
  .login{
    min-height:100vh!important;
    display:grid!important;
    place-items:center!important;
    padding:24px 16px!important;
    position:relative!important;
    overflow:auto!important;
    background:
      radial-gradient(circle at 12% 12%,rgba(59,130,246,.16),transparent 30%),
      radial-gradient(circle at 88% 88%,rgba(14,165,233,.12),transparent 28%),
      linear-gradient(135deg,#f7fbff 0%,#eef5ff 52%,#f8fbff 100%)!important;
  }
  .login:before{
    content:'';position:absolute;inset:0;pointer-events:none;
    background-image:linear-gradient(rgba(37,99,235,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.035) 1px,transparent 1px);
    background-size:34px 34px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.65),transparent 75%);
  }
  .login-mid{
    width:100%!important;
    min-height:auto!important;
    display:grid!important;
    place-items:center!important;
    padding:0!important;
    position:relative!important;
    z-index:1!important;
  }
  .login-card{
    width:min(430px,100%)!important;
    margin:0!important;
    padding:24px!important;
    border-radius:24px!important;
    border:1px solid rgba(148,163,184,.28)!important;
    background:rgba(255,255,255,.96)!important;
    box-shadow:0 24px 70px rgba(15,23,42,.13),0 4px 14px rgba(37,99,235,.05)!important;
    backdrop-filter:blur(12px)!important;
    -webkit-backdrop-filter:blur(12px)!important;
    overflow:hidden!important;
    animation:sgLoginIn .38s ease-out!important;
  }
  @keyframes sgLoginIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

  /* Remove the old duplicated generated heading that made the card look broken. */
  .login-card:before{display:none!important;content:none!important}
  .login-card-mini{
    display:flex!important;
    align-items:center!important;
    gap:12px!important;
    padding:0 0 18px!important;
    margin:0 0 20px!important;
    border-bottom:1px solid #edf1f6!important;
  }
  .login-card-mini-logo{
    width:50px!important;height:50px!important;min-width:50px!important;
    border-radius:15px!important;
    display:grid!important;place-items:center!important;
    background:#eff6ff!important;
    border:1px solid #dbeafe!important;
    overflow:hidden!important;
    box-shadow:0 6px 16px rgba(37,99,235,.10)!important;
  }
  .login-card-mini-logo img{width:100%!important;height:100%!important;object-fit:contain!important}
  .login-card-mini .login-brand-title,.login-brand-title{
    font-size:18px!important;font-weight:900!important;line-height:1.15!important;
    color:#173b82!important;letter-spacing:-.025em!important;
  }
  .login-card-mini .login-brand-sub{
    display:block!important;margin-top:4px!important;
    font-size:11px!important;line-height:1.35!important;color:#64748b!important;
  }
  .login-card-title{
    margin:0 0 5px!important;
    font-size:24px!important;font-weight:900!important;
    letter-spacing:-.035em!important;color:#172033!important;
  }
  .login-card-sub{
    margin:0 0 20px!important;
    color:#64748b!important;font-size:13px!important;line-height:1.5!important;
  }
  .login-card label{
    display:block!important;margin:14px 0 7px!important;
    font-size:12px!important;font-weight:800!important;color:#334155!important;
  }
  .login-card input{
    width:100%!important;min-height:48px!important;
    padding:12px 13px!important;
    border:1px solid #d8e0eb!important;
    border-radius:12px!important;
    background:#f8fafc!important;color:#172033!important;
    box-shadow:none!important;outline:none!important;
    transition:border-color .18s ease,box-shadow .18s ease,background .18s ease!important;
  }
  .login-card input::placeholder{color:#94a3b8!important}
  .login-card input:focus{
    border-color:#60a5fa!important;background:#fff!important;
    box-shadow:0 0 0 4px rgba(37,99,235,.10)!important;
  }
  .login-card .password{position:relative!important}
  .login-card .password input{padding-right:72px!important}
  .login-card .toggle{
    position:absolute!important;right:6px!important;top:6px!important;
    min-height:36px!important;padding:7px 10px!important;
    border:0!important;border-radius:9px!important;
    background:transparent!important;color:#2563eb!important;
    font-size:12px!important;font-weight:800!important;
  }
  .login-card .toggle:hover{background:#eff6ff!important}
  .login-card #loginBtn,
  .login-card button[type='submit']{
    width:100%!important;min-height:48px!important;
    margin-top:18px!important;padding:12px 16px!important;
    border:0!important;border-radius:12px!important;
    background:linear-gradient(135deg,#2563eb,#1d4ed8)!important;
    color:#fff!important;font-size:14px!important;font-weight:900!important;
    box-shadow:0 8px 20px rgba(37,99,235,.22)!important;
    transition:transform .15s ease,box-shadow .15s ease,filter .15s ease!important;
  }
  .login-card #loginBtn:hover,
  .login-card button[type='submit']:hover{transform:translateY(-1px)!important;filter:brightness(1.03)!important;box-shadow:0 11px 25px rgba(37,99,235,.26)!important}
  .login-card #loginBtn:active,
  .login-card button[type='submit']:active{transform:none!important}
  .login-card .alert{margin-top:12px!important;border-radius:11px!important;font-size:12px!important}
  .login-card .demo{margin-top:16px!important;padding:11px 12px!important;border:1px solid #dbeafe!important;border-radius:12px!important;background:#f8fbff!important;color:#475569!important;font-size:11px!important;line-height:1.45!important}

  @media(max-width:520px){
    .login{padding:14px 10px!important}
    .login-card{padding:20px!important;border-radius:20px!important}
    .login-card-mini{padding-bottom:15px!important;margin-bottom:17px!important}
    .login-card-mini-logo{width:46px!important;height:46px!important;min-width:46px!important;border-radius:13px!important}
    .login-card-title{font-size:22px!important}
  }
  `;

  function boot(){
    if(!document.getElementById('siapGuruLoginUIV3Style')){
      const s=document.createElement('style');
      s.id='siapGuruLoginUIV3Style';
      s.textContent=css;
      document.head.appendChild(s);
    }
    const title=document.querySelector('.login-brand-title');
    if(title) title.textContent='SIAP GURU';
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
