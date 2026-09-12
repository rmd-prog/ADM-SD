/* SIAP GURU — GLOBAL UI FOUNDATION v10
 * SAFE COMPATIBILITY PATCH
 * Keeps existing room/navigation state intact. No DOM clearing, menu deletion,
 * forced page hiding, or MutationObserver. No D1, Worker, student data, or auth changes.
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

  function cleanMenu(){
    /* Compatibility only: the approved menu is owned by siap-guru-new-ui.js. */
    return;
  }

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

  function isolateRooms(){
    /* Navigation engine remains the single source of truth for .page.active. */
    return;
  }

  function enforceRoomVisibility(){
    /* Base CSS already controls .page visibility. Do not inject competing rules. */
    return;
  }

  function handleNavigation(){
    /* Existing navigation handlers remain untouched. */
    return;
  }

  function boot(){
    emptyDashboard();
    renameBrand(document);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();

  window.SIAP_GURU_UI={emptyDashboard,cleanMainMenu:cleanMenu,isolateRooms,enforceRoomVisibility,renameBrand,canonical:true};
})();
