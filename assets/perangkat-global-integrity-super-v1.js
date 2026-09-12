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

  function installSimpleHome(){
    const d=document.getElementById('dashboard');
    if(!d || d.querySelector('.sg-home-actions'))return;
    const hero=d.querySelector('.v10-hero');
    if(!hero)return;
    const box=document.createElement('section');
    box.className='sg-home-actions sg-home-actions-recovered';
    box.innerHTML='<div class="sg-section-head"><div><span class="sg-eyebrow">RUANG KERJA</span><h3>Akses cepat</h3><p>Empat pekerjaan utama guru, tanpa memenuhi layar.</p></div></div>'+
      '<div class="sg-action-grid sg-action-grid-simple">'+
      '<button type="button" class="sg-action" data-sg-page="students"><span class="sg-action-icon">👥</span><span><b>Data Siswa</b><small>Kelola data & rombel</small></span><i>›</i></button>'+ 
      '<button type="button" class="sg-action" data-sg-page="rpm"><span class="sg-action-icon">📘</span><span><b>Perangkat</b><small>CP, ATP, TP & RPM</small></span><i>›</i></button>'+ 
      '<button type="button" class="sg-action" data-sg-page="aiGenerate"><span class="sg-action-icon">✨</span><span><b>AI Generate</b><small>Buat perangkat & materi</small></span><i>›</i></button>'+ 
      '<button type="button" class="sg-action" data-sg-page="scores"><span class="sg-action-icon">📝</span><span><b>Penilaian</b><small>Input & kelola nilai</small></span><i>›</i></button>'+ 
      '</div>';
    hero.insertAdjacentElement('afterend',box);
    box.addEventListener('click',function(e){
      const b=e.target.closest('[data-sg-page]');
      if(!b)return;
      const page=b.getAttribute('data-sg-page');
      if(typeof window.showPage==='function')window.showPage(page);
    });
    const old=d.querySelectorAll('.v10-services,.v10-stat-grid,.v10-workflow,.v10-quick,.v10-section-title');
    old.forEach(el=>el.style.display='none');
    const teacher=d.querySelector('#teacherClassBox');
    if(teacher)teacher.style.marginBottom='18px';
  }

  async function recoverDashboard(){
    const d=document.getElementById('dashboard');
    if(!d)return;
    d.removeAttribute('data-dashboard-empty');
    if(d.children.length){installSimpleHome();return;}
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
        installSimpleHome();
      }
    }catch(e){ console.warn('Dashboard recovery skipped:',e); }
  }

  function boot(){
    emptyDashboard();
    renameBrand(document);
    recoverDashboard();
    [250,700,1400,2500].forEach(ms=>setTimeout(installSimpleHome,ms));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();

  window.SIAP_GURU_UI={emptyDashboard,cleanMainMenu:cleanMenu,isolateRooms,enforceRoomVisibility,renameBrand,canonical:true,recoverDashboard,installSimpleHome};
})();