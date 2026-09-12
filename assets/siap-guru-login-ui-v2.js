/* SIAP GURU — LOGIN VISUAL v6.1
 * VISUAL ONLY. Authentication, form IDs, handlers and backend remain untouched.
 */
(function(){
'use strict';
if(window.__SIAP_GURU_LOGIN_UI_V61__)return;
window.__SIAP_GURU_LOGIN_UI_V61__=true;
const css=`
.sg-login-benefit-icon{display:grid!important;place-items:center!important;width:38px!important;height:38px!important;margin-bottom:9px!important;border-radius:12px!important;background:rgba(255,255,255,.13)!important;border:1px solid rgba(255,255,255,.14)!important;font-size:0!important;position:relative!important}
.sg-login-benefit-icon:before{display:block!important;font-size:19px!important;line-height:1!important}
.sg-login-benefit:nth-child(1) .sg-login-benefit-icon:before{content:'▤'!important}
.sg-login-benefit:nth-child(2) .sg-login-benefit-icon:before{content:'✦'!important}
.sg-login-benefit:nth-child(3) .sg-login-benefit-icon:before{content:'↗'!important}
`;
function boot(){let s=document.getElementById('siapGuruLoginUIV61Style');if(!s){s=document.createElement('style');s.id='siapGuruLoginUIV61Style';s.textContent=css;document.head.appendChild(s)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();