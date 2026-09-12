/* SIAP GURU — KATALOG BAB SUPER v4
 * Canonical catalog reader: BOOK_CATALOG from index.html.
 * This module is VIEW-ONLY: it must never create duplicate pkR/pkM/pkB controls,
 * invent TP, or overwrite the Master state.
 * Local only; no D1/Worker access.
 */
(function(){'use strict';
if(window.__PKAT_V4__)return;window.__PKAT_V4__=1;
const R=['IA','IB','IIA','IIB','IIIA','IIIB','IVA','IVB','V','VI'];
const M=['Bahasa Indonesia','Pendidikan Pancasila','Matematika','IPAS','PJOK','Seni Rupa','Seni Musik','Seni Tari','Seni Teater','Bahasa Inggris','Pendidikan Agama dan Budi Pekerti'];
const N={IA:1,IB:1,IIA:2,IIB:2,IIIA:3,IIIB:3,IVA:4,IVB:4,V:5,VI:6};
function catalog(){
  try{return typeof BOOK_CATALOG!=='undefined'&&BOOK_CATALOG&&typeof BOOK_CATALOG==='object'?BOOK_CATALOG:null}catch(e){return null}
}
function list(r,m){
  const g=N[r],book=catalog()?.[m]?.[g];
  return Array.isArray(book?.chapters)?book.chapters.slice():[];
}
function data(r,m){
  return list(r,m).map((bab,i)=>({no:i+1,bab,semester:i<Math.ceil(list(r,m).length/2)?1:2}));
}
function q(id){return document.getElementById(id)}
function mount(){
  const p=q('perangkatSuperPanel');
  if(!p)return setTimeout(mount,500);
  if(q('pkatV4'))return;
  const r=q('pkR'),m=q('pkM'),b=q('pkB');
  if(!r||!m||!b)return setTimeout(mount,500);
  const box=document.createElement('div');
  box.id='pkatV4';
  box.style='margin-top:14px;padding:14px;border:1px solid #dbe4f0;border-radius:14px;background:#f8fafc';
  box.innerHTML='<b>🧠 Katalog BAB SUPER</b><div id="pkI" style="margin-top:10px;padding:10px;background:#fff;border-radius:10px"></div><small style="display:block;margin-top:8px;color:#64748b">Sumber BAB tunggal: BOOK_CATALOG. Kontrol Kelas/Mapel/BAB memakai kontrol Perangkat utama; tidak dibuat ulang di sini.</small>';
  p.appendChild(box);
  function ri(){
    const arr=data(r.value,m.value),x=arr.find(z=>String(z.no)===String(b.value)),i=q('pkI');
    if(!i)return;
    if(!x){i.textContent='Pilih BAB untuk melihat konteks katalog.';return}
    i.innerHTML='<b>BAB '+x.no+' — '+esc(x.bab)+'</b><br>Semester '+x.semester+' • TP/JP mengikuti Master Perangkat SUPER.';
  }
  r.addEventListener('change',ri);m.addEventListener('change',ri);b.addEventListener('change',ri);ri();
}
window.GURU_SD_KATALOG={source:'BOOK_CATALOG',grades:R,subjects:M,list,data,get:(r,m)=>list(r,m).map((bab,i)=>({no:i+1,bab})),ready:()=>!!catalog()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();

/* Canonical reference bridge: the visible reference page must never read legacy BAB. */
function patchReference(){
  if(typeof renderReference!=='function'||window.__PKAT_REFERENCE_V4__)return;
  const canonical=window.GURU_SD_KATALOG;
  if(!canonical||typeof canonical.list!=='function')return;
  window.__PKAT_REFERENCE_V4__=1;
  renderReference=function(){
    const host=q('babReference');
    if(!host)return;
    let html='<h3 style="margin-top:20px">BAB yang tersedia di aplikasi</h3><p class="muted">Daftar berikut membaca satu sumber katalog canonical: BOOK_CATALOG.</p>';
    R.forEach(r=>M.forEach(m=>{
      const arr=canonical.list(r,m);if(!arr.length)return;
      html+='<div style="margin:12px 0"><b>'+esc(m)+'</b><div style="margin-top:5px">Rombel '+esc(r)+': '+arr.map((x,i)=>'<span class="badge" style="margin:2px">'+esc('BAB '+(i+1)+' — '+x)+'</span>').join('')+'</div></div>';
    }));
    host.innerHTML=html;
  };
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(patchReference,0),{once:true});else setTimeout(patchReference,0);
})();