/* SIAP GURU — GLOBAL UI FOUNDATION v10
 * SAFE COMPATIBILITY PATCH
 * Keeps existing room/navigation state intact. No D1, Worker, student data, or auth changes.
 * Also recovers #dashboard if an older cached UI script emptied it before this file ran.
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

  function isolateRooms(){ return; }
  function enforceRoomVisibility(){ return; }
  function handleNavigation(){ return; }

  async function recoverDashboard(){
    const d=document.getElementById('dashboard');
    if(!d)return;
    d.removeAttribute('data-dashboard-empty');
    if(d.children.length)return;
    try{
      const res=await fetch(location.href,{cache:'no-store',credentials:'same-origin'});
      if(!res.ok)return;
      const html=await res.text();
      const doc=new DOMParser().parseFromString(html,'text/html');
      const source=doc.getElementById('dashboard');
      if(source&&source.children.length){
        d.innerHTML=source.innerHTML;
        d.className=source.className||'page active';
        d.classList.add('page','active');
        d.removeAttribute('data-dashboard-empty');
        renameBrand(d);
      }
    }catch(e){ console.warn('Dashboard recovery skipped:',e); }
  }

  function boot(){
    emptyDashboard();
    renameBrand(document);
    recoverDashboard();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();

  window.SIAP_GURU_UI={emptyDashboard,cleanMainMenu:cleanMenu,isolateRooms,enforceRoomVisibility,renameBrand,canonical:true,recoverDashboard};
})();