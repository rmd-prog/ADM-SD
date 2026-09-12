/* SIAP GURU — GLOBAL UI FOUNDATION v10
 * Dashboard remains intentionally empty during rebuild.
 * Each application page is treated as its own room: when one page is opened,
 * other pages and stray legacy UI outside page containers are hidden.
 * Frontend-only. Does not touch D1, Worker, student data, or login backend.
 */
(function(){'use strict';
if(window.__SIAP_GURU_GLOBAL_FOUNDATION_V10__)return;
window.__SIAP_GURU_GLOBAL_FOUNDATION_V10__=1;
const $=id=>document.getElementById(id);
const BRAND_OLD='GURU+ SD';
const BRAND_NEW='SIAP GURU';

function emptyDashboard(){
 const d=$('dashboard');if(!d)return;
 d.innerHTML='';
 d.removeAttribute('style');
 d.setAttribute('data-dashboard-empty','true');
}

function cleanMenu(){
 const side=$('sidebar');if(!side)return;
 const norm=s=>String(s||'').replace(/\s+/g,' ').trim().toLowerCase();
 side.querySelectorAll('.menu-group').forEach(g=>{
   const h=g.querySelector('.navgroup');
   if(h&&!norm(h.textContent).includes('data siswa'))g.remove();
 });
 side.querySelectorAll('.navbtn').forEach(b=>{
   const p=String(b.dataset.page||''),t=norm(b.textContent);
   if(p!=='dashboard'&&p!=='students'&&!t.includes('dashboard')&&!t.includes('daftar siswa'))b.remove();
 });
 const title=side.querySelector('.side-title');if(title)title.textContent='MENU UTAMA';
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
 const root=document.querySelector('main.main, main, .main');
 if(!root)return;
 document.querySelectorAll('.page').forEach(p=>{
   p.style.removeProperty('z-index');
 });
 const active=document.querySelector('.page.active');
 document.querySelectorAll('.page').forEach(p=>{
   if(p!==active)p.classList.remove('active');
 });
 // Legacy scripts sometimes inject UI directly into <main> instead of a page.
 // Keep the main workspace clean: only an actual .page may occupy the room.
 root.querySelectorAll(':scope > :not(.page)').forEach(el=>{
   if(!el.closest('.login'))el.setAttribute('data-siap-guru-stray','true');
 });
}

function enforceRoomVisibility(){
 const root=document.querySelector('main.main, main, .main');
 if(!root)return;
 let style=$('siapGuruRoomStyle');
 if(!style){
   style=document.createElement('style');style.id='siapGuruRoomStyle';
   style.textContent='.main>.page:not(.active){display:none!important}.main>[data-siap-guru-stray="true"]{display:none!important}#dashboard[data-dashboard-empty="true"]{display:block!important;min-height:0!important;padding:0!important;margin:0!important}#dashboard[data-dashboard-empty="true"]>*{display:none!important}';
   document.head.appendChild(style);
 }
}

function handleNavigation(){
 document.querySelectorAll('.navbtn').forEach(btn=>{
   if(btn.__siapRoomBound)return;
   btn.__siapRoomBound=1;
   btn.addEventListener('click',()=>setTimeout(()=>{
     isolateRooms();enforceRoomVisibility();renameBrand(document);
     if((btn.dataset.page||'')==='dashboard')emptyDashboard();
   },0),true);
 });
}

function boot(){
 emptyDashboard();
 cleanMenu();
 enforceRoomVisibility();
 isolateRooms();
 renameBrand(document);
 handleNavigation();
 [100,300,700,1500,3000].forEach(ms=>setTimeout(()=>{
   renameBrand(document);enforceRoomVisibility();isolateRooms();handleNavigation();
   if(document.querySelector('#dashboard.active'))emptyDashboard();
 },ms));
 const root=document.querySelector('main.main, main, .main')||document.body;
 if(!root.__siapRoomObserver){
   root.__siapRoomObserver=1;
   new MutationObserver(()=>{
     enforceRoomVisibility();
     renameBrand(document);
     handleNavigation();
   }).observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','title','aria-label','placeholder','alt']});
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,100));
else setTimeout(boot,100);
window.SIAP_GURU_UI={emptyDashboard,cleanMainMenu:cleanMenu,isolateRooms,enforceRoomVisibility,renameBrand,canonical:true};
})();