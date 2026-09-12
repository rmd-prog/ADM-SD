/* SIAP GURU — LOGIN VISUAL v4
 * VISUAL ONLY. Authentication, form IDs, handlers and backend are untouched.
 * This stylesheet deliberately neutralizes the legacy login decoration and
 * presents one clean, responsive login card.
 */
(function(){
  'use strict';
  if(window.__SIAP_GURU_LOGIN_UI_V4__) return;
  window.__SIAP_GURU_LOGIN_UI_V4__=true;

  const css=`
  /* ===== HARD RESET LEGACY LOGIN DECORATION ===== */
  html,body{margin:0!important;min-height:100%!important}
  body.v10-login{background:#f5f9ff!important;overflow-x:hidden!important}
  body.v10-login #loginScreen.login{
    position:relative!important;
    display:flex!important;
    flex-direction:column!important;
    align-items:center!important;
    justify-content:center!important;
    width:100%!important;
    min-height:100dvh!important;
    height:auto!important;
    margin:0!important;
    padding:28px 18px!important;
    gap:0!important;
    overflow:hidden!important;
    background:
      radial-gradient(circle at 10% 8%,rgba(59,130,246,.13),transparent 30%),
      radial-gradient(circle at 92% 86%,rgba(96,165,250,.12),transparent 32%),
      linear-gradient(145deg,#f8fbff 0%,#eef5ff 48%,#f8fbff 100%)!important;
  }

  /* Old header / footer / feature navigation must not participate in layout. */
  body.v10-login #loginScreen .login-topbar,
  body.v10-login #loginScreen .login-features,
  body.v10-login #loginScreen .login-footer,
  body.v10-login #loginScreen .login-city-badge,
  body.v10-login #loginScreen .login-quote,
  body.v10-login #loginScreen .login-decor,
  body.v10-login #loginScreen .login-skyline{display:none!important}

  /* Decorative background only; never an interactive layer. */
  body.v10-login #loginScreen:before{
    content:''!important;
    position:absolute!important;
    inset:0!important;
    z-index:0!important;
    pointer-events:none!important;
    background-image:
      linear-gradient(rgba(37,99,235,.028) 1px,transparent 1px),
      linear-gradient(90deg,rgba(37,99,235,.028) 1px,transparent 1px)!important;
    background-size:36px 36px!important;
    mask-image:linear-gradient(to bottom,rgba(0,0,0,.55),transparent 72%)!important;
  }
  body.v10-login #loginScreen:after{
    content:''!important;
    position:absolute!important;
    width:420px!important;height:420px!important;
    right:-220px!important;bottom:-240px!important;
    border-radius:50%!important;
    background:rgba(37,99,235,.055)!important;
    filter:blur(4px)!important;
    pointer-events:none!important;
    z-index:0!important;
  }

  body.v10-login #loginScreen .login-mid{
    position:relative!important;
    z-index:2!important;
    display:flex!important;
    align-items:center!important;
    justify-content:center!important;
    width:100%!important;
    max-width:460px!important;
    min-height:0!important;
    height:auto!important;
    margin:0!important;
    padding:0!important;
  }

  /* One card. No legacy transform/scale/width can shrink it. */
  body.v10-login #loginScreen .login-card,
  body.v10-login #loginScreen .card.login-card{
    position:relative!important;
    z-index:3!important;
    display:block!important;
    width:100%!important;
    max-width:430px!important;
    min-width:0!important;
    height:auto!important;
    min-height:0!important;
    margin:0!important;
    padding:26px!important;
    box-sizing:border-box!important;
    transform:none!important;
    scale:1!important;
    opacity:1!important;
    border:1px solid rgba(148,163,184,.28)!important;
    border-radius:24px!important;
    background:rgba(255,255,255,.97)!important;
    box-shadow:0 24px 70px rgba(15,23,42,.14),0 8px 22px rgba(37,99,235,.06)!important;
    overflow:hidden!important;
    backdrop-filter:blur(14px)!important;
    -webkit-backdrop-filter:blur(14px)!important;
  }

  /* Remove any legacy generated heading/banner. */
  body.v10-login #loginScreen .login-card:before{content:none!important;display:none!important}

  body.v10-login #loginScreen .login-card-mini{
    display:flex!important;
    align-items:center!important;
    gap:12px!important;
    width:100%!important;
    margin:0 0 22px!important;
    padding:0 0 18px!important;
    border-bottom:1px solid #eaf0f7!important;
  }
  body.v10-login #loginScreen .login-card-mini-logo{
    display:grid!important;
    place-items:center!important;
    flex:0 0 50px!important;
    width:50px!important;height:50px!important;
    border-radius:15px!important;
    overflow:hidden!important;
    background:#eff6ff!important;
    border:1px solid #dbeafe!important;
    box-shadow:0 6px 16px rgba(37,99,235,.10)!important;
  }
  body.v10-login #loginScreen .login-card-mini-logo img{
    display:block!important;width:100%!important;height:100%!important;object-fit:contain!important
  }
  body.v10-login #loginScreen .login-brand-title{
    margin:0!important;font-size:18px!important;font-weight:900!important;
    line-height:1.15!important;color:#173b82!important;letter-spacing:-.025em!important
  }
  body.v10-login #loginScreen .login-brand-sub{
    display:block!important;margin:4px 0 0!important;
    font-size:11px!important;line-height:1.4!important;color:#64748b!important
  }

  body.v10-login #loginScreen .login-card-title{
    display:block!important;margin:0 0 6px!important;
    font-size:24px!important;line-height:1.2!important;
    font-weight:900!important;letter-spacing:-.035em!important;color:#172033!important
  }
  body.v10-login #loginScreen .login-card-sub{
    display:block!important;margin:0 0 18px!important;
    font-size:13px!important;line-height:1.5!important;color:#64748b!important
  }
  body.v10-login #loginScreen .login-card label{
    display:block!important;margin:14px 0 7px!important;
    font-size:12px!important;line-height:1.2!important;
    font-weight:800!important;color:#334155!important
  }
  body.v10-login #loginScreen .login-card input{
    display:block!important;width:100%!important;height:48px!important;min-height:48px!important;
    padding:12px 13px!important;box-sizing:border-box!important;
    border:1px solid #d7e0eb!important;border-radius:12px!important;
    background:#f8fafc!important;color:#172033!important;
    outline:none!important;box-shadow:none!important
  }
  body.v10-login #loginScreen .login-card input:focus{
    border-color:#60a5fa!important;background:#fff!important;
    box-shadow:0 0 0 4px rgba(37,99,235,.10)!important
  }
  body.v10-login #loginScreen .login-card .password{position:relative!important;width:100%!important}
  body.v10-login #loginScreen .login-card .password input{padding-right:72px!important}
  body.v10-login #loginScreen .login-card .toggle{
    position:absolute!important;right:6px!important;top:6px!important;
    display:inline-flex!important;align-items:center!important;justify-content:center!important;
    width:auto!important;min-width:46px!important;height:36px!important;min-height:36px!important;
    margin:0!important;padding:7px 10px!important;
    border:0!important;border-radius:9px!important;
    background:transparent!important;color:#2563eb!important;
    font-size:12px!important;font-weight:800!important
  }
  body.v10-login #loginScreen .login-card #loginBtn,
  body.v10-login #loginScreen .login-card button[type=submit]{
    display:flex!important;align-items:center!important;justify-content:center!important;
    width:100%!important;height:48px!important;min-height:48px!important;
    margin:18px 0 0!important;padding:12px 16px!important;
    border:0!important;border-radius:12px!important;
    background:linear-gradient(135deg,#2563eb,#1d4ed8)!important;
    color:#fff!important;font-size:14px!important;font-weight:900!important;
    box-shadow:0 9px 22px rgba(37,99,235,.22)!important
  }
  body.v10-login #loginScreen .login-card .alert{margin-top:12px!important;border-radius:11px!important;font-size:12px!important}
  body.v10-login #loginScreen .login-card .demo{margin-top:16px!important;padding:11px 12px!important;border-radius:12px!important;font-size:11px!important}

  @media(max-width:520px){
    body.v10-login #loginScreen.login{padding:18px 12px!important}
    body.v10-login #loginScreen .login-card,
    body.v10-login #loginScreen .card.login-card{max-width:390px!important;padding:21px!important;border-radius:20px!important}
    body.v10-login #loginScreen .login-card-mini{margin-bottom:18px!important;padding-bottom:15px!important}
    body.v10-login #loginScreen .login-card-mini-logo{flex-basis:46px!important;width:46px!important;height:46px!important}
    body.v10-login #loginScreen .login-card-title{font-size:22px!important}
  }

  /* If a legacy child tries to create a second visual header, hide only that presentation. */
  body.v10-login #loginScreen .login-brand:not(.login-card-mini .login-brand){display:none!important}
  `;

  function boot(){
    let s=document.getElementById('siapGuruLoginUIV4Style');
    if(!s){s=document.createElement('style');s.id='siapGuruLoginUIV4Style';s.textContent=css;document.head.appendChild(s)}
    const title=document.querySelector('#loginScreen .login-brand-title');
    if(title) title.textContent='SIAP GURU';
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
