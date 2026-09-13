/* SIAP GURU — GLOBAL UI FOUNDATION v10
 * SAFE COMPATIBILITY PATCH
 * Dashboard home is owned by siap-guru-new-ui.js. This file only keeps global compatibility/brand helpers.
 * No D1, Worker, student data, auth, navigation or dashboard rendering changes.
 */
(function(){
  'use strict';
  if(window.__SIAP_GURU_GLOBAL_FOUNDATION_V10_SAFE__)return;
  window.__SIAP_GURU_GLOBAL_FOUNDATION_V10_SAFE__=1;

  const BRAND_OLD='SIAP GURU';
  const BRAND_NEW='SIAP GURU';

  function emptyDashboard(){
    const d=document.getElementById('dashboard');
    if(!d)return;
    d.removeAttribute('data-dashboard-empty');
  }
  function cleanMenu(){ return; }
  function isolateRooms(){ return; }
  function enforceRoomVisibility(){ return; }
  function handleNavigation(){ return; }

  function renameBrand(root=document){
    try{
      if(document.title.includes(BRAND_OLD))document.title=document.title.replaceAll(BRAND_OLD,BRAND_NEW);
      const attrs=['title','aria-label','placeholder','alt'];
      root.querySelectorAll?.('*').forEach(el=>attrs.forEach(a=>{
        const v=el.getAttribute?.(a);
        if(v&&v.includes(BRAND_OLD))el.setAttribute(a,v.replaceAll(BRAND_OLD,BRAND_NEW));
      }));
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
      const nodes=[];let n;
      while(n=walker.nextNode())if(n.nodeValue&&n.nodeValue.includes(BRAND_OLD))nodes.push(n);
      nodes.forEach(x=>x.nodeValue=x.nodeValue.replaceAll(BRAND_OLD,BRAND_NEW));
    }catch(e){}
  }

  function patchWelcome(){
    try{
      const hero=document.querySelector('#dashboard .v10-hero');
      if(!hero)return;
      const title=hero.querySelector('h2');
      const sub=hero.querySelector('p');
      if(title)title.textContent='Selamat datang di SIAP GURU';
      if(sub)sub.textContent='Semua kebutuhan administrasi dan pembelajaran guru, dalam satu ruang kerja.';
      hero.classList.add('sg-welcome-modern');
      if(!document.getElementById('sgWelcomeModernStyle')){
        const s=document.createElement('style');
        s.id='sgWelcomeModernStyle';
        s.textContent=`
          .v10-hero.sg-welcome-modern{position:relative;overflow:hidden;min-height:210px;padding-right:310px;display:flex;flex-direction:column;justify-content:center}
          .v10-hero.sg-welcome-modern h2,.v10-hero.sg-welcome-modern p,.v10-hero.sg-welcome-modern .v10-kicker,.v10-hero.sg-welcome-modern>*{position:relative;z-index:2}
          .v10-hero.sg-welcome-modern h2{max-width:650px}
          .v10-hero.sg-welcome-modern p{max-width:610px}
          .v10-hero.sg-welcome-modern:after{content:"";position:absolute;z-index:1;right:4px;bottom:-4px;width:300px;height:205px;background-repeat:no-repeat;background-position:center bottom;background-size:contain;opacity:1;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 520 350'%3E%3Ccircle cx='370' cy='160' r='142' fill='%23ffffff' fill-opacity='.13'/%3E%3Ccircle cx='398' cy='112' r='54' fill='%23ffffff' fill-opacity='.10'/%3E%3Cg stroke-linecap='round' stroke-linejoin='round'%3E%3C!-- desk --%3E%3Cpath d='M250 258h235' stroke='%23dbeafe' stroke-width='12'/%3E%3Cpath d='M285 265v62M453 265v62' stroke='%23bfdbfe' stroke-width='10'/%3E%3C!-- laptop --%3E%3Crect x='329' y='174' width='128' height='78' rx='9' fill='%23ffffff' stroke='%23e0f2fe' stroke-width='6'/%3E%3Crect x='342' y='186' width='102' height='55' rx='4' fill='%23eff6ff'/%3E%3Cpath d='M314 258h160l-13 15H327z' fill='%23bfdbfe'/%3E%3C!-- chair --%3E%3Cpath d='M170 211c-14 0-25 11-25 25v73c0 9 7 16 16 16h46v-93c0-12-9-21-21-21z' fill='%231e40af' fill-opacity='.92'/%3E%3Cpath d='M181 324v18M160 342h42' stroke='%23bfdbfe' stroke-width='8'/%3E%3C!-- person head --%3E%3Ccircle cx='222' cy='104' r='39' fill='%23fde7d5'/%3E%3Cpath d='M184 101c3-31 27-48 52-42 17 4 28 17 31 35-18-7-37-12-60-6-9 3-17 7-23 13z' fill='%231e293b' stroke='none'/%3E%3Cpath d='M214 132c5 7 12 10 21 8' stroke='%23d97706' stroke-width='4' fill='none'/%3E%3C!-- body --%3E%3Cpath d='M184 154c17-12 51-13 69 0l30 72-73 23-42-67c-7-12 2-22 16-28z' fill='%23ffffff' stroke='%23dbeafe' stroke-width='5'/%3E%3Cpath d='M220 157v73' stroke='%2393c5fd' stroke-width='4'/%3E%3C!-- arm reaching laptop --%3E%3Cpath d='M243 168l45 43 44-25' fill='none' stroke='%23fde7d5' stroke-width='19'/%3E%3Cpath d='M328 186l14-8' fill='none' stroke='%23fde7d5' stroke-width='13'/%3E%3C!-- other arm --%3E%3Cpath d='M190 170l-31 43 30 30' fill='none' stroke='%23fde7d5' stroke-width='19'/%3E%3C!-- legs --%3E%3Cpath d='M209 246l-9 68 47 0' fill='none' stroke='%231d4ed8' stroke-width='25'/%3E%3Cpath d='M252 246l38 60 48 0' fill='none' stroke='%231e3a8a' stroke-width='25'/%3E%3Cpath d='M194 316h60M328 306h34' stroke='%231e293b' stroke-width='12'/%3E%3C!-- small desk plant --%3E%3Cpath d='M474 224v34' stroke='%2393c5fd' stroke-width='5'/%3E%3Cpath d='M465 225c-15-12-18-28-7-37 14 5 18 18 7 37zM477 220c1-18 12-29 25-26 2 14-7 25-25 26z' fill='%23bfdbfe' stroke='%23bfdbfe' stroke-width='3'/%3E%3Cpath d='M459 258h31l-4 18h-23z' fill='%23ffffff' stroke='%23dbeafe' stroke-width='4'/%3E%3C!-- accent dots --%3E%3Ccircle cx='112' cy='75' r='5' fill='%2393c5fd' stroke='none'/%3E%3Ccircle cx='130' cy='59' r='8' fill='%23bfdbfe' stroke='none'/%3E%3Ccircle cx='105' cy='102' r='3' fill='%23ffffff' stroke='none'/%3E%3C/g%3E%3C/svg%3E")}
          @media(max-width:700px){.v10-hero.sg-welcome-modern{min-height:260px;padding-right:20px;padding-bottom:132px}.v10-hero.sg-welcome-modern h2{max-width:100%;font-size:29px;line-height:1.1}.v10-hero.sg-welcome-modern p{max-width:100%;font-size:16px;line-height:1.5}.v10-hero.sg-welcome-modern:after{right:-4px;bottom:-2px;width:235px;height:158px}}
        `;
        document.head.appendChild(s);
      }
    }catch(e){}
  }

  function loadProtaBridge(){
    try{
      if(document.getElementById('sgProtaBridgeLoader')) return;
      const s=document.createElement('script');
      s.id='sgProtaBridgeLoader';
      s.src='assets/siap-guru-prota.js';
      s.defer=true;
      document.head.appendChild(s);
    }catch(e){}
  }

  function boot(){
    emptyDashboard();
    renameBrand(document);
    patchWelcome();
    loadProtaBridge();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
  [500,1200,2500].forEach(ms=>setTimeout(patchWelcome,ms));

  window.SIAP_GURU_UI={emptyDashboard,cleanMainMenu:cleanMenu,isolateRooms,enforceRoomVisibility,renameBrand,canonical:true};
})();
