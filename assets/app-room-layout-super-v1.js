/* ADM-SD — ROOM LAYOUT SUPER v2
   Visual room isolation without destructive DOM guessing.
   Canonical rule: one selected page/submenu owns the visible workspace.
   Unknown containers are NEVER hidden just because they failed a text match.
   No D1/Worker changes.
*/
(function(){
'use strict';
if(window.__ADM_ROOM_LAYOUT_SUPER)return;
window.__ADM_ROOM_LAYOUT_SUPER=true;

const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9\u00c0-\u024f\s]/gi,' ').replace(/\s+/g,' ').trim();
const text=e=>norm(e?.innerText||e?.textContent||'');
const buttons=()=>[...document.querySelectorAll('.navbtn')];
const pages=()=>[...document.querySelectorAll('.page')];
const key=s=>norm(s).replace(/\s+/g,'');

const ROOM_GROUPS={
 assessment:['penilaian','input nilai','input penilaian','rekap nilai','rekap penilaian','matriks bab','bab matrix','matrix bab','absensi','kehadiran','kokurikuler'],
 perangkat:['perangkat pembelajaran','cp','atp','tp','prota','promes','rpm','lkpd','asesmen perangkat'],
 ai:['ai generate','ai generator','generator ai','soal sumatif','kisi kisi','kisi-kisi','rubrik','deskripsi hasil','remedial','pengayaan','jurnal','refleksi','bahan ajar'],
 students:['data siswa','siswa','peserta didik'],
 admin:['buku administrasi','surat resmi','dokumen guru','jurnal dan refleksi','jurnal & refleksi','remedial dan pengayaan','remedial & pengayaan'],
 dashboard:['dashboard','beranda','home']
};

function targetFor(btn){return btn?.getAttribute('data-page')||'';}
function labelFor(btn){return text(btn);}
function groupFor(label,pageId){
 const s=norm(label+' '+pageId);
 for(const [g,words] of Object.entries(ROOM_GROUPS))if(words.some(w=>s.includes(norm(w))))return g;
 return '';
}
function tokensFor(label,pageId){
 const s=norm(label+' '+pageId);
 const out=new Set([s]);
 Object.values(ROOM_GROUPS).forEach(words=>words.forEach(w=>{if(s.includes(norm(w)))out.add(norm(w));}));
 return [...out].filter(Boolean);
}
function meta(el){return norm((el.id||'')+' '+(el.className||'')+' '+(el.getAttribute?.('data-tab')||'')+' '+(el.getAttribute?.('data-panel')||'')+' '+(el.getAttribute?.('data-section')||'')+' '+text(el));}
function score(el,tokens){
 const m=meta(el), ids=key((el.id||'')+' '+(el.className||''));
 let s=0;
 tokens.forEach(t=>{
   const n=norm(t), k=key(t);
   if(!n)return;
   if(m===n)s+=20;
   else if(m.includes(n))s+=6;
   if(k && ids.includes(k))s+=10;
 });
 return s;
}
function clearRoom(page){
 if(!page)return;
 page.querySelectorAll('[data-adm-room-hidden]').forEach(el=>{el.style.removeProperty('display');el.removeAttribute('data-adm-room-hidden');});
 page.querySelectorAll('[data-adm-room-dim]').forEach(el=>{el.style.removeProperty('display');el.removeAttribute('data-adm-room-dim');});
 delete page.dataset.admRoom;
}
function candidateContainers(page){
 const selectors=[':scope > .panel',':scope > .card',':scope > .doc-hero',':scope > .doc-preview',':scope > .student-pane',':scope > .assessment-pane',':scope > .tab-pane',':scope > [data-tab-panel]',':scope > [data-panel]',':scope > [data-section]',':scope > section'];
 const set=new Set();
 selectors.forEach(sel=>{try{page.querySelectorAll(sel).forEach(e=>set.add(e));}catch(_){}});
 return [...set].filter(e=>e.nodeType===1 && !e.matches('.page-title,.page-head,.breadcrumb'));
}
function isolateExplicit(page,tokens){
 const items=candidateContainers(page);
 if(items.length<2)return false;
 const scored=items.map(el=>({el,s:score(el,tokens)}));
 const matches=scored.filter(x=>x.s>=6).sort((a,b)=>b.s-a.s);
 if(!matches.length)return false;
 const best=matches[0].s;
 const winners=matches.filter(x=>x.s===best).map(x=>x.el);
 // Only hide competing containers when there is an explicit, strong match.
 items.forEach(el=>{
   if(winners.includes(el)){
     el.style.removeProperty('display');
     el.removeAttribute('data-adm-room-hidden');
   }else{
     el.style.display='none';
     el.setAttribute('data-adm-room-hidden','1');
   }
 });
 page.dataset.admRoom=tokens[0]||'room';
 return true;
}
function isolateInternalTabs(page,tokens){
 const candidates=[...page.querySelectorAll('[data-tab],[data-panel],[data-section],.student-pane,.assessment-pane,.tab-pane,.submenu-panel')];
 if(candidates.length<2)return false;
 const scored=candidates.map(el=>({el,s:score(el,tokens)})).filter(x=>x.s>=6);
 if(!scored.length)return false;
 const best=Math.max(...scored.map(x=>x.s));
 scored.forEach(x=>{x.el.style.display=x.s===best?'':'none';x.el.dataset.admRoomDim=x.s===best?'0':'1';});
 return true;
}
function cleanDashboard(page){
 if(!page)return;
 clearRoom(page);
 const all=[...page.children].filter(e=>e.nodeType===1);
 all.forEach(el=>{
   const m=meta(el);
   const isNoise=/data siswa|ai generate|ai generator|perangkat pembelajaran|input nilai|rekap nilai|matriks bab|absensi|kokurikuler|rpm|lkpd|cp atp tp|administrasi|surat resmi|dokumen guru/.test(m);
   const isDash=/selamat datang|ringkasan|statistik|aktivitas|akses cepat|dashboard|beranda|tahun pelajaran/.test(m);
   if(isNoise&&!isDash){el.style.display='none';el.dataset.admDashboardHidden='1';}
 });
 page.dataset.admDashboardClean='1';
}
function restoreDashboard(page){
 if(!page)return;
 page.querySelectorAll('[data-adm-dashboard-hidden]').forEach(el=>{el.style.removeProperty('display');el.removeAttribute('data-adm-dashboard-hidden');});
 delete page.dataset.admDashboardClean;
}
function activate(btn){
 const pageId=targetFor(btn), page=document.getElementById(pageId);
 if(!page)return;
 pages().filter(p=>p!==page).forEach(p=>{if(p.dataset.admDashboardClean)restoreDashboard(p);});
 clearRoom(page);
 const label=labelFor(btn);
 if(/dashboard|beranda|home/.test(norm(label+' '+pageId))){cleanDashboard(page);return;}
 const tokens=tokensFor(label,pageId);
 // Prefer explicit internal panels/tabs. If the page has no explicit match, keep it intact.
 if(isolateExplicit(page,tokens))return;
 isolateInternalTabs(page,tokens);
}
function run(){
 const active=document.querySelector('.page.active');
 if(!active)return;
 const btn=buttons().find(b=>targetFor(b)===active.id&&b.classList.contains('active'))||buttons().find(b=>targetFor(b)===active.id);
 if(btn)activate(btn);
}
document.addEventListener('click',e=>{const b=e.target.closest?.('.navbtn');if(b)setTimeout(run,50);},true);
new MutationObserver(()=>{clearTimeout(window.__admRoomTimer);window.__admRoomTimer=setTimeout(run,100)}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-page']});
window.addEventListener('load',()=>setTimeout(run,300));
window.ADM_ROOM_LAYOUT={run,activate,clearRoom};
})();