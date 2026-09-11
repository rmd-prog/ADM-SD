/* ADM-SD — ROOM LAYOUT SUPER v1
   Each menu/submenu gets its own visual room. No D1/Worker changes.
   Keeps existing business logic; only controls visible UI panels.
*/
(function(){
'use strict';
if(window.__ADM_ROOM_LAYOUT_SUPER)return;
window.__ADM_ROOM_LAYOUT_SUPER=true;

const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9\u00c0-\u024f\s]/gi,' ').replace(/\s+/g,' ').trim();
const text=e=>norm(e?.innerText||e?.textContent||'');
const buttons=()=>[...document.querySelectorAll('.navbtn')];
const pages=()=>[...document.querySelectorAll('.page')];

const aliases={
 'input nilai':['input nilai','input penilaian','nilai siswa','penilaian'],
 'rekap nilai':['rekap nilai','rekap penilaian','rekap'],
 'matriks bab':['matriks bab','bab matrix','matrix bab'],
 'absensi':['absensi','kehadiran'],
 'kokurikuler':['kokurikuler','kokurikuler siswa'],
 'perangkat':['perangkat pembelajaran','cp','atp','tp','prota','promes','rpm','lkpd'],
 'ai':['ai generate','ai generator','generator ai'],
 'data siswa':['data siswa','siswa'],
 'dashboard':['dashboard','beranda','home']
};
function targetFor(btn){
 const raw=btn.getAttribute('data-page')||'';
 return raw||'';
}
function labelFor(btn){return text(btn);}
function keywordSet(label){
 const out=new Set([label]);
 Object.keys(aliases).forEach(k=>{if(label.includes(k)) aliases[k].forEach(x=>out.add(norm(x)))});
 return [...out].filter(Boolean);
}
function directContainers(page){
 return [...page.children].filter(e=>{
   if(!e || e.nodeType!==1)return false;
   if(['SCRIPT','STYLE','TEMPLATE'].includes(e.tagName))return false;
   if(e.matches('.page-title,.page-head,.breadcrumb'))return false;
   return true;
 });
}
function score(el,keys){
 const t=text(el), id=norm(el.id), cls=norm(el.className);
 if(!t && !id && !cls)return -1;
 let s=0;
 keys.forEach(k=>{
   if(!k)return;
   if(t===k)s+=12;
   else if(t.includes(k))s+=7;
   if(id.includes(k.replace(/\s/g,'')))s+=9;
   if(cls.includes(k.replace(/\s/g,'')))s+=5;
 });
 return s;
}
function markRoom(page,keys){
 const items=directContainers(page);
 if(items.length<2)return;
 const scored=items.map((el,i)=>({el,i,s:score(el,keys)}));
 const best=scored.filter(x=>x.s>0).sort((a,b)=>b.s-a.s);
 // Only isolate when we have a meaningful match. Never hide the page blindly.
 if(!best.length)return;
 const winner=best[0];
 items.forEach(el=>{el.dataset.admRoomHidden=el===winner?'0':'1';el.style.display=el===winner?'':'none'});
 page.dataset.admRoom=keys[0]||'room';
}
function clearRoom(page){
 [...page.children].forEach(el=>{if(el.dataset&&el.dataset.admRoomHidden){delete el.dataset.admRoomHidden;el.style.display=''}});
 delete page.dataset.admRoom;
}
function isolateByInternalTabs(page,label){
 // Some modules render their own tab buttons. Use visible text matching when possible.
 const keys=keywordSet(label);
 const candidates=[...page.querySelectorAll('[data-tab],[data-panel],[data-section],.student-pane,.assessment-pane,.tab-pane,.submenu-panel')];
 if(!candidates.length)return;
 const matched=candidates.map(el=>({el,s:score(el,keys)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s);
 if(!matched.length)return;
 const top=matched[0].s;
 matched.forEach(x=>x.el.style.display=x.s>=top?'':'none');
}
function activate(btn){
 const pageId=targetFor(btn);
 const page=document.getElementById(pageId);
 if(!page)return;
 // Reset any previous room state inside this page.
 clearRoom(page);
 const label=labelFor(btn);
 // Dashboard is intentionally a clean landing room.
 if(pageId==='dashboard'){
   [...page.children].forEach(el=>{
     const t=text(el), id=norm(el.id), cls=norm(el.className);
     const keep=/dashboard|beranda|selamat datang|ringkasan|statistik|stat|aktivitas|akses cepat/.test(t+' '+id+' '+cls);
     const clutter=/data siswa|ai generate|ai generator|perangkat|penilaian|rekap|input nilai|lkpd|rpm|cp atp tp|administrasi|dokumen/.test(t);
     if(clutter&&!keep)el.style.display='none';
   });
   page.dataset.admDashboardClean='1';
   return;
 }
 markRoom(page,keywordSet(label));
 isolateByInternalTabs(page,label);
}
function restoreDashboard(page){
 if(!page||page.dataset.admDashboardClean!=='1')return;
 [...page.children].forEach(el=>{if(!el.dataset.admRoomHidden)el.style.display=''});
 delete page.dataset.admDashboardClean;
}
function run(){
 const active=document.querySelector('.page.active');
 if(active){
   pages().filter(p=>p!==active).forEach(restoreDashboard);
   const btn=buttons().find(b=>targetFor(b)===active.id && b.classList.contains('active')) || buttons().find(b=>targetFor(b)===active.id);
   if(btn)activate(btn);
 }
}
document.addEventListener('click',e=>{
 const b=e.target.closest?.('.navbtn');
 if(!b)return;
 setTimeout(run,40);
});
new MutationObserver(()=>{clearTimeout(window.__admRoomTimer);window.__admRoomTimer=setTimeout(run,80)}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
window.addEventListener('load',()=>setTimeout(run,250));
window.ADM_ROOM_LAYOUT={run,activate,clearRoom};
})();