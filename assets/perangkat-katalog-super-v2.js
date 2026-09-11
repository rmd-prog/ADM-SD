/* GURU+ SD — KATALOG BAB SUPER v3
 * Single source of truth: BOOK_CATALOG from index.html.
 * No duplicate chapter/unit fallback is kept here.
 * Local only; no D1/Worker access.
 */
(function(){'use strict';
if(window.__PKAT_V3__)return;window.__PKAT_V3__=1;
const R=['IA','IB','IIA','IIB','IIIA','IIIB','IVA','IVB','V','VI'];
const M=['Bahasa Indonesia','Pendidikan Pancasila','Matematika','IPAS','PJOK','Seni Rupa','Seni Musik','Seni Tari','Seni Teater','Bahasa Inggris','Pendidikan Agama dan Budi Pekerti'];
const N={IA:1,IB:1,IIA:2,IIB:2,IIIA:3,IIIB:3,IVA:4,IVB:4,V:5,VI:6};
const F=n=>n<3?'A':n<5?'B':'C';
function catalog(){
  try{return typeof BOOK_CATALOG!=='undefined'&&BOOK_CATALOG&&typeof BOOK_CATALOG==='object'?BOOK_CATALOG:null}catch(e){return null}
}
function list(r,m){
  const g=N[r], book=catalog()?.[m]?.[g];
  return Array.isArray(book?.chapters)?book.chapters.slice():[];
}
const focus={'Bahasa Indonesia':'literasi dan komunikasi','Pendidikan Pancasila':'nilai Pancasila dan kewargaan','Matematika':'konsep, penalaran dan pemecahan masalah','IPAS':'pengamatan dan penyelidikan sains-sosial','PJOK':'gerak, kebugaran dan kesehatan','Seni Rupa':'eksplorasi visual dan berkarya','Seni Musik':'bunyi, ritme, melodi dan ekspresi','Seni Tari':'gerak, ruang, waktu dan ekspresi','Seni Teater':'tubuh, suara, karakter dan pementasan','Bahasa Inggris':'komunikasi bahasa Inggris','Pendidikan Agama dan Budi Pekerti':'pemahaman ajaran dan akhlak'};
function tp(r,m,b,i){const v=['mengidentifikasi','menjelaskan','menerapkan','menganalisis','mengomunikasikan','merefleksikan'][i%6];return 'Peserta didik mampu '+v+' '+b+' untuk mengembangkan '+(focus[m]||m)+' melalui pengalaman belajar yang aktif, kontekstual, bermakna, dan sesuai tahap perkembangan Kelas '+N[r]+'.'}
function data(r,m){return list(r,m).map((b,i)=>({no:i+1,bab:b,semester:i<Math.ceil(list(r,m).length/2)?1:2,jp:6,tp:[0,1,2].map(j=>tp(r,m,b,j))}));}
function q(id){return document.getElementById(id)}
function mount(){
  let p=q('perangkatSuperPanel');if(!p)return setTimeout(mount,500);if(q('pkatV3'))return;
  let box=document.createElement('div');box.id='pkatV3';box.style='margin-top:14px;padding:14px;border:1px solid #dbe4f0;border-radius:14px;background:#f8fafc';
  box.innerHTML='<b>🧠 Katalog BAB & TP SUPER</b><div style="display:grid;gap:8px;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin-top:10px"><label>Kelas<select id="pkR" style="width:100%;padding:9px">'+R.map(x=>'<option>'+x+'</option>').join('')+'</select></label><label>Mapel<select id="pkM" style="width:100%;padding:9px">'+M.map(x=>'<option>'+x+'</option>').join('')+'</select></label><label>BAB / Materi<select id="pkB" style="width:100%;padding:9px"></select></label></div><div id="pkI" style="margin-top:10px;padding:10px;background:#fff;border-radius:10px"></div><small style="display:block;margin-top:8px;color:#64748b">Sumber BAB tunggal: BOOK_CATALOG aplikasi. Tidak ada katalog fallback.</small>';
  p.appendChild(box);
  function rb(){const r=q('pkR').value,m=q('pkM').value,a=data(r,m),b=q('pkB');b.innerHTML='<option value="">Pilih BAB / Materi</option>'+a.map(x=>'<option value="'+x.no+'">BAB '+x.no+' — '+x.bab+' ('+x.jp+' JP)</option>').join('');ri()}
  function ri(){const a=data(q('pkR').value,q('pkM').value),x=a.find(z=>String(z.no)===q('pkB').value),i=q('pkI');if(!x){i.textContent='Pilih BAB untuk melihat TP otomatis.';return}i.innerHTML='<b>BAB '+x.no+' — '+x.bab+'</b><br>'+x.jp+' JP • Semester '+x.semester+'<ol>'+x.tp.map(t=>'<li>'+t+'</li>').join('')+'</ol>';window.dispatchEvent(new CustomEvent('guruSdMaterialChanged',{detail:{rombel:q('pkR').value,mapel:q('pkM').value,babNo:x.no,material:x.bab,jp:x.jp,semester:x.semester,tp:x.tp}})}
  q('pkR').onchange=rb;q('pkM').onchange=rb;q('pkB').onchange=ri;rb();
}
window.GURU_SD_KATALOG={source:'BOOK_CATALOG',grades:R,subjects:M,list,data,get:(r,m)=>{const a=list(r,m);return a.map((bab,i)=>({no:i+1,bab}))},ready:()=>!!catalog()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();

/* Canonical reference bridge: the visible reference page must never read legacy BAB. */
function patchReference(){
  if(typeof renderReference!=='function'||window.__PKAT_REFERENCE_V3__)return;
  const canonical=window.GURU_SD_KATALOG;
  if(!canonical||typeof canonical.list!=='function')return;
  window.__PKAT_REFERENCE_V3__=1;
  renderReference=function(){
    const host=q('babReference');
    if(!host)return;
    let html='<h3 style="margin-top:20px">BAB yang tersedia di aplikasi</h3><p class="muted">Daftar berikut membaca satu sumber katalog canonical: BOOK_CATALOG.</p>';
    R.forEach(r=>M.forEach(m=>{
      const arr=canonical.list(r,m);
      if(!arr.length)return;
      html+='<div style="margin:12px 0"><b>'+esc(m)+'</b><div style="margin-top:5px">Rombel '+esc(r)+': '+arr.map((x,i)=>'<span class="badge" style="margin:2px">'+esc('BAB '+(i+1)+' — '+x)+'</span>').join('')+'</div></div>';
    }));
    host.innerHTML=html;
  };
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(patchReference,0),{once:true});else setTimeout(patchReference,0);
})();