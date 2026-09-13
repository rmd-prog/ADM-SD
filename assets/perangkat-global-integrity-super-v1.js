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
          .v10-hero.sg-welcome-modern{position:relative;overflow:hidden;min-height:180px;padding-right:290px;display:flex;flex-direction:column;justify-content:center}
          .v10-hero.sg-welcome-modern h2,.v10-hero.sg-welcome-modern p,.v10-hero.sg-welcome-modern .v10-kicker{position:relative;z-index:2}
          .v10-hero.sg-welcome-modern h2{max-width:650px}
          .v10-hero.sg-welcome-modern p{max-width:620px}
          .v10-hero.sg-welcome-modern:after{content:"";position:absolute;right:20px;bottom:0;width:255px;height:165px;background-repeat:no-repeat;background-position:center bottom;background-size:contain;opacity:.92;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 420 270'%3E%3Cg fill='none' stroke='%231d4ed8' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='220' y='72' width='155' height='102' rx='8' fill='%23fff'/%3E%3Cpath d='M205 190h185l-18 12H223z' fill='%23dbeafe'/%3E%3Cpath d='M260 174v16m75-16v16'/%3E%3Ccircle cx='118' cy='66' r='30' fill='%23fff'/%3E%3Cpath d='M91 63c4-27 54-36 68 2'/%3E%3Cpath d='M88 112c8-27 62-29 75 0l18 65H75z' fill='%23eff6ff'/%3E%3Cpath d='M139 112l28 36 29 8'/%3E%3Cpath d='M109 177l-24 51m69-51 25 51'/%3E%3Cpath d='M169 141l51-31'/%3E%3Cpath d='M220 110l22 13'/%3E%3Ccircle cx='245' cy='123' r='4' fill='%231d4ed8'/%3E%3Cpath d='M250 110h102M250 127h82M250 144h91' stroke='%2393c5fd'/%3E%3C/g%3E%3C/svg%3E")}
          @media(max-width:700px){.v10-hero.sg-welcome-modern{min-height:220px;padding-right:20px;padding-bottom:125px}.v10-hero.sg-welcome-modern:after{right:8px;width:190px;height:125px;opacity:.75}}
        `;
        document.head.appendChild(s);
      }
    }catch(e){}
  }

  function boot(){
    emptyDashboard();
    renameBrand(document);
    patchWelcome();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
  [500,1200,2500].forEach(ms=>setTimeout(patchWelcome,ms));

  window.SIAP_GURU_UI={emptyDashboard,cleanMainMenu:cleanMenu,isolateRooms,enforceRoomVisibility,renameBrand,canonical:true};
})();