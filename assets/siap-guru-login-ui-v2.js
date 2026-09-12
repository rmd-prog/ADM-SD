/* SIAP GURU — LOGIN VISUAL v6.1
 * VISUAL ONLY. Authentication, form IDs, handlers and backend remain untouched.
 * Main login visual restored; feature icons refined in the same file.
 */
(function(){
'use strict';
if(window.__SIAP_GURU_LOGIN_UI_V61__)return;
window.__SIAP_GURU_LOGIN_UI_V61__=true;
const css=`
html,body{margin:0!important;min-height:100%!important}
body.v10-login{background:#f3f7fc!important;overflow-x:hidden!important}
body.v10-login #loginScreen.login{position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-height:100dvh!important;margin:0!important;padding:28px!important;box-sizing:border-box!important;overflow:hidden!important;background:radial-gradient(circle at 8% 10%,rgba(48,129,255,.13),transparent 32%),radial-gradient(circle at 92% 88%,rgba(23,103,197,.10),transparent 30%),linear-gradient(145deg,#f7fbff 0%,#eef4fb 100%)!important}
body.v10-login #loginScreen:before{content:''!important;position:absolute!important;inset:0!important;z-index:0!important;pointer-events:none!important;background-image:linear-gradient(rgba(36,103,190,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(36,103,190,.035) 1px,transparent 1px)!important;background-size:42px 42px!important;mask-image:linear-gradient(to bottom,black,transparent 80%)!important}
body.v10-login #loginScreen .login-topbar,body.v10-login #loginScreen .login-features,body.v10-login #loginScreen .login-footer,body.v10-login #loginScreen .login-city-badge,body.v10-login #loginScreen .login-quote,body.v10-login #loginScreen .login-decor,body.v10-login #loginScreen .login-skyline{display:none!important}
body.v10-login #loginScreen .login-mid{position:relative!important;z-index:3!important;display:flex!important;align-items:stretch!important;justify-content:center!important;width:min(1040px,100%)!important;max-width:1040px!important;min-height:0!important;margin:0!important;padding:0!important;gap:0!important}
body.v10-login #loginScreen .sg-login-showcase{position:relative!important;display:flex!important;flex:1 1 55%!important;min-height:610px!important;padding:48px 42px!important;box-sizing:border-box!important;overflow:hidden!important;border-radius:30px 0 0 30px!important;background:linear-gradient(145deg,#176bd1 0%,#258be9 52%,#54a7f4 100%)!important;color:#fff!important;box-shadow:0 28px 70px rgba(20,62,110,.18)!important}
body.v10-login #loginScreen .sg-login-showcase:before{content:''!important;position:absolute!important;width:360px!important;height:360px!important;right:-130px!important;top:-120px!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:50%!important;box-shadow:0 0 0 55px rgba(255,255,255,.035),0 0 0 110px rgba(255,255,255,.025)!important}
body.v10-login #loginScreen .sg-login-showcase:after{content:''!important;position:absolute!important;width:210px!important;height:210px!important;left:-100px!important;bottom:-95px!important;border-radius:50%!important;background:rgba(255,255,255,.08)!important}
body.v10-login #loginScreen .sg-login-showcase-inner{position:relative!important;z-index:2!important;max-width:500px!important;margin:auto 0!important}
body.v10-login #loginScreen .sg-login-kicker{display:inline-flex!important;align-items:center!important;gap:8px!important;margin-bottom:20px!important;padding:7px 11px!important;border:1px solid rgba(255,255,255,.20)!important;border-radius:999px!important;background:rgba(255,255,255,.10)!important;font-size:10px!important;font-weight:900!important;letter-spacing:.12em!important;text-transform:uppercase!important}
body.v10-login #loginScreen .sg-login-kicker:before{content:''!important;width:7px!important;height:7px!important;border-radius:50%!important;background:#dff1ff!important;box-shadow:0 0 0 4px rgba(255,255,255,.10)!important}
body.v10-login #loginScreen .sg-login-showcase h1{margin:0!important;max-width:490px!important;font-size:43px!important;line-height:1.06!important;letter-spacing:-.045em!important;font-weight:900!important;color:#fff!important}
body.v10-login #loginScreen .sg-login-showcase p{margin:18px 0 28px!important;max-width:470px!important;font-size:14px!important;line-height:1.7!important;color:rgba(255,255,255,.86)!important}
body.v10-login #loginScreen .sg-login-benefits{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:10px!important;max-width:500px!important}
body.v10-login #loginScreen .sg-login-benefit{padding:13px 12px!important;border:1px solid rgba(255,255,255,.14)!important;border-radius:15px!important;background:rgba(255,255,255,.09)!important;backdrop-filter:blur(8px)!important}
body.v10-login #loginScreen .sg-login-benefit-icon{display:grid!important;place-items:center!important;width:38px!important;height:38px!important;margin-bottom:9px!important;border-radius:12px!important;background:rgba(255,255,255,.13)!important;border:1px solid rgba(255,255,255,.14)!important;font-size:0!important;position:relative!important}
body.v10-login #loginScreen .sg-login-benefit-icon:before{display:block!important;font-size:19px!important;line-height:1!important;font-weight:700!important}
body.v10-login #loginScreen .sg-login-benefit:nth-child(1) .sg-login-benefit-icon:before{content:'▤'!important}
body.v10-login #loginScreen .sg-login-benefit:nth-child(2) .sg-login-benefit-icon:before{content:'✦'!important}
body.v10-login #loginScreen .sg-login-benefit:nth-child(3) .sg-login-benefit-icon:before{content:'↗'!important}
body.v10-login #loginScreen .sg-login-benefit b{display:block!important;font-size:11px!important;line-height:1.3!important;color:#fff!important}
body.v10-login #loginScreen .sg-login-benefit small{display:block!important;margin-top:3px!important;font-size:9px!important;line-height:1.35!important;color:rgba(255,255,255,.68)!important}
body.v10-login #loginScreen .sg-login-card-wrap{display:flex!important;align-items:center!important;justify-content:center!important;flex:0 0 43%!important;box-sizing:border-box!important;padding:28px!important;border:1px solid rgba(148,163,184,.24)!important;border-left:0!important;border-radius:0 30px 30px 0!important;background:rgba(255,255,255,.98)!important;box-shadow:0 28px 70px rgba(20,62,110,.14)!important}
body.v10-login #loginScreen .login-card,body.v10-login #loginScreen .card.login-card{position:relative!important;z-index:4!important;display:block!important;width:100%!important;max-width:370px!important;min-width:0!important;height:auto!important;margin:0!important;padding:4px!important;box-sizing:border-box!important;transform:none!important;scale:1!important;opacity:1!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;overflow:visible!important}
body.v10-login #loginScreen .login-card:before{content:none!important;display:none!important}
body.v10-login #loginScreen .login-card-mini{display:block!important;width:100%!important;margin:0 0 27px!important;padding:0 0 18px!important;border-bottom:1px solid #edf1f6!important}
body.v10-login #loginScreen .login-card-mini-logo{display:none!important}
body.v10-login #loginScreen .login-brand-title{margin:0!important;font-size:20px!important;font-weight:900!important;line-height:1.15!important;color:#1767c5!important;letter-spacing:-.025em!important}
body.v10-login #loginScreen .login-brand-sub{display:block!important;margin:5px 0 0!important;font-size:11px!important;line-height:1.4!important;color:#7b8798!important}
body.v10-login #loginScreen .login-card-title{display:block!important;margin:0 0 7px!important;font-size:27px!important;line-height:1.18!important;font-weight:900!important;letter-spacing:-.04em!important;color:#172033!important}
body.v10-login #loginScreen .login-card-sub{display:block!important;margin:0 0 22px!important;font-size:13px!important;line-height:1.55!important;color:#718096!important}
body.v10-login #loginScreen .login-card label{display:block!important;margin:15px 0 7px!important;font-size:11px!important;font-weight:850!important;color:#334155!important}
body.v10-login #loginScreen .login-card input{display:block!important;width:100%!important;height:49px!important;padding:12px 14px!important;box-sizing:border-box!important;border:1px solid #d9e2ed!important;border-radius:12px!important;background:#f8fafc!important;color:#172033!important;outline:none!important;box-shadow:none!important;font-size:13px!important}
body.v10-login #loginScreen .login-card input:focus{border-color:#5c9fee!important;background:#fff!important;box-shadow:0 0 0 4px rgba(37,99,235,.09)!important}
body.v10-login #loginScreen .login-card .password{position:relative!important;width:100%!important}
body.v10-login #loginScreen .login-card .password input{padding-right:72px!important}
body.v10-login #loginScreen .login-card .toggle{position:absolute!important;right:5px!important;top:6px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:47px!important;height:37px!important;margin:0!important;padding:7px 10px!important;border:0!important;border-radius:9px!important;background:transparent!important;color:#2563eb!important;font-size:11px!important;font-weight:850!important}
body.v10-login #loginScreen .login-card #loginBtn,body.v10-login #loginScreen .login-card button[type=submit]{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;height:49px!important;margin:20px 0 0!important;padding:12px 16px!important;border:0!important;border-radius:12px!important;background:linear-gradient(135deg,#2388e8,#1767c5)!important;color:#fff!important;font-size:13px!important;font-weight:900!important;box-shadow:0 10px 24px rgba(35,136,232,.22)!important;cursor:pointer!important}
body.v10-login #loginScreen .login-card #loginBtn:hover,body.v10-login #loginScreen .login-card button[type=submit]:hover{filter:brightness(1.03)!important;transform:translateY(-1px)!important}
body.v10-login #loginScreen .login-card .alert{margin-top:12px!important;border-radius:11px!important;font-size:12px!important}
body.v10-login #loginScreen .login-card .demo{margin-top:17px!important;padding:11px 12px!important;border-radius:12px!important;font-size:10px!important}
body.v10-login #loginScreen .sg-login-note{display:flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;margin-top:20px!important;font-size:10px!important;color:#94a3b8!important}
body.v10-login #loginScreen .sg-login-note:before{content:'✓'!important;display:grid!important;place-items:center!important;width:16px!important;height:16px!important;border-radius:50%!important;background:#eaf6ee!important;color:#2f8f55!important;font-size:10px!important;font-weight:900!important}
@media(max-width:820px){body.v10-login #loginScreen.login{padding:18px 12px!important}body.v10-login #loginScreen .login-mid{width:min(460px,100%)!important;display:block!important}body.v10-login #loginScreen .sg-login-showcase{display:none!important}body.v10-login #loginScreen .sg-login-card-wrap{display:block!important;padding:25px 22px!important;border:1px solid rgba(148,163,184,.24)!important;border-radius:24px!important;background:rgba(255,255,255,.98)!important;box-shadow:0 22px 60px rgba(20,62,110,.14)!important}body.v10-login #loginScreen .login-card{max-width:410px!important;margin:0 auto!important}}
@media(max-width:520px){body.v10-login #loginScreen.login{padding:12px 9px!important}body.v10-login #loginScreen .sg-login-card-wrap{padding:21px 18px!important;border-radius:20px!important}body.v10-login #loginScreen .login-card-title{font-size:23px!important}body.v10-login #loginScreen .login-card-mini{margin-bottom:22px!important}}
`;
function buildVisual(){
const screen=document.getElementById('loginScreen');
const mid=screen&&screen.querySelector('.login-mid');
const card=screen&&mid&&mid.querySelector('.login-card');
if(!screen||!mid||!card||screen.querySelector('.sg-login-showcase'))return;
const showcase=document.createElement('section');
showcase.className='sg-login-showcase';
showcase.innerHTML='<div class="sg-login-showcase-inner"><span class="sg-login-kicker">PLATFORM GURU SD</span><h1>Semua kebutuhan guru, dalam satu ruang kerja.</h1><p>Kelola perangkat pembelajaran, data siswa, penilaian, rapor, dan berbagai pekerjaan administrasi dengan lebih rapi dan praktis.</p><div class="sg-login-benefits"><div class="sg-login-benefit"><span class="sg-login-benefit-icon">📚</span><b>Perangkat</b><small>CP, ATP, TP & RPM</small></div><div class="sg-login-benefit"><span class="sg-login-benefit-icon">🤖</span><b>AI Generator</b><small>Bantu pekerjaan guru</small></div><div class="sg-login-benefit"><span class="sg-login-benefit-icon">📊</span><b>Penilaian</b><small>Nilai & rapor terkelola</small></div></div></div>';
const wrap=document.createElement('div');
wrap.className='sg-login-card-wrap';
mid.insertBefore(showcase,card);wrap.appendChild(card);mid.appendChild(wrap);
if(!screen.querySelector('.sg-login-note')){const n=document.createElement('div');n.className='sg-login-note';n.textContent='Akses aman untuk akun guru';card.appendChild(n)}
}
function boot(){let s=document.getElementById('siapGuruLoginUIV61Style');if(!s){s=document.createElement('style');s.id='siapGuruLoginUIV61Style';s.textContent=css;document.head.appendChild(s)}const t=document.querySelector('#loginScreen .login-brand-title');if(t)t.textContent='SIAP GURU';buildVisual()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();