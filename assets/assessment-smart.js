/* SIAP GURU — Smart Assessment UI
   Frontend only: no D1/schema/index.js changes. */
(function(){
'use strict';
if(window.__ADM_ASSESS_SMART__)return;window.__ADM_ASSESS_SMART__=true;
const A='siapGuruAssessmentV1';
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
function login(){try{return JSON.parse(localStorage.getItem('siLogin')||'null')||{}}catch{return {}}}
function user(){const x=login();return x.user||x||{}}
function rombel(){const u=user();return String(u.activeRombel||u.rombel||u.kelas||'').trim()}
function classNum(){const r=rombel().toUpperCase();const m=r.match(/^[IVX]+/);const roman=m?m[0]:'';return ({I:1,II:2,III:3,IV:4,V:5,VI:6})[roman]||0}
function normalizeMapel(v){return String(v||'').replace(/_/g,' ').replace(/\s+/g,' ').trim()}
function mapelList(){
 const u=user(), out=[];
 const add=v=>{if(!v)return;if(Array.isArray(v))return v.forEach(add);if(typeof v==='object'){['mapel','mataPelajaran','subject','name','nama'].forEach(k=>add(v[k]));return}String(v).split(/[;,|]/).map(normalizeMapel).filter(Boolean).forEach(v=>{if(!out.some(x=>x.toLowerCase()===v.toLowerCase()))out.push(v)})};
 ['mapel','mapels','mataPelajaran','mataPelajaranList','subjects','subject'].forEach(k=>add(u[k]));
 if(!out.length){
  const role=String(u.role||'').toLowerCase();
  if(role==='guru_mapel'||role==='guru mapel') return ['Pendidikan Agama','PJOK','Bahasa Inggris'];
  return ['Bahasa Indonesia','Matematika','Pendidikan Pancasila','IPAS','Seni dan Budaya','PJOK','Pendidikan Agama','Bahasa Inggris'];
 }
 return out;
}
const chapterSeed={
 'Bahasa Indonesia':['BAB 1','BAB 2','BAB 3','BAB 4','BAB 5','BAB 6','BAB 7','BAB 8'],
 'Matematika':['BAB 1','BAB 2','BAB 3','BAB 4','BAB 5','BAB 6','BAB 7','BAB 8'],
 'Pendidikan Pancasila':['BAB 1','BAB 2','BAB 3','BAB 4','BAB 5','BAB 6'],
 'IPAS':['BAB 1','BAB 2','BAB 3','BAB 4','BAB 5','BAB 6','BAB 7','BAB 8'],
 'Seni dan Budaya':['BAB 1','BAB 2','BAB 3','BAB 4','BAB 5','BAB 6'],
 'PJOK':['BAB 1','BAB 2','BAB 3','BAB 4','BAB 5','BAB 6'],
 'Pendidikan Agama':['BAB 1','BAB 2','BAB 3','BAB 4','BAB 5','BAB 6'],
 'Bahasa Inggris':['BAB 1','BAB 2','BAB 3','BAB 4','BAB 5','BAB 6']
};
function chapters(mapel){
 const candidates=[window.curriculumData,window.CURRICULUM,window.silabusData,window.atpData,window.ATP,window.tpData,window.TP,window.db?.curriculum];
 let arr=[];
 candidates.forEach(src=>{
  if(!src)return;
  const scan=x=>{if(!x)return;if(Array.isArray(x)){x.forEach(scan);return}if(typeof x!=='object')return;const mv=normalizeMapel(x.mapel||x.mataPelajaran||x.subject||x.mapelName);if(mv&&mv.toLowerCase()===mapel.toLowerCase()){const c=x.bab||x.chapter||x.materi||x.chapters;if(Array.isArray(c))arr.push(...c.map(v=>typeof v==='object'?(v.nama||v.name||v.title||v.bab||v.chapter):v))}Object.keys(x).slice(0,80).forEach(k=>{if(typeof x[k]==='object')scan(x[k])})};
  try{scan(src)}catch{}
 });
 arr=arr.map(normalizeMapel).filter(Boolean);
 if(arr.length)return [...new Set(arr)];
 const key=Object.keys(chapterSeed).find(k=>k.toLowerCase()===mapel.toLowerCase());
 return chapterSeed[key]||Array.from({length:8},(_,i)=>`BAB ${i+1}`);
}
function students(){const a=window.db?.students||window.students||[];const r=rombel();return Array.isArray(a)?a.map((s,i)=>({id:String(s.id??s.nisn??s.nis??i),name:String(s.name??s.nama??s.nama_siswa??'').trim(),rombel:String(s.rombel??s.kelas??'').trim()})).filter(s=>s.name&&(!r||!s.rombel||s.rombel===r)):[]}
function selectedValue(id){return $(id)?.value||''}
function setSmartInput(){
 const p=$('#penilaianPro');if(!p||!p.classList.contains('active'))return;
 const host=$('#sgAssessmentBody');if(!host||host.dataset.smart==='1')return;
 const mapels=mapelList(), defaultMapel=mapels[0]||'';
 const currentMapel=selectedValue('#sgMapel')||defaultMapel;
 const ch=chapters(currentMapel);
 const jenis=selectedValue('#sgJenis')||'Formatif';
 const item=selectedValue('#sgItem');
 const ss=students(), d=read(A,{weights:{formative:20,task:20,chapter:30,summative:30},rows:{}});
 host.dataset.smart='1';
 host.innerHTML=`<div class="sg-grid">
 <label>Rombel<input value="${esc(rombel()||'Semua rombel')}" readonly></label>
 <label>Mapel<select id="sgMapelSmart">${mapels.map(x=>`<option ${x===currentMapel?'selected':''}>${esc(x)}</option>`).join('')}</select></label>
 <label>Jenis Penilaian<select id="sgJenisSmart"><option>Formatif</option><option>Tugas Terstruktur</option><option>Ulangan BAB</option><option>Sumatif</option></select></label>
 <label>Semester<select id="sgSemSmart"><option>1</option><option>2</option></select></label>
 </div>
 <div class="sg-grid" style="margin-top:10px"><label id="sgItemWrap">BAB / Materi / TP<select id="sgItemSmart">${ch.map(x=>`<option ${x===item?'selected':''}>${esc(x)}</option>`).join('')}</select></label><label>Siswa terdeteksi<input value="${ss.length} siswa" readonly></label></div>
 <div class="sg-actions"><button class="btn primary" id="sgSaveSmart">💾 Simpan Semua Nilai</button><button class="btn secondary" id="sgReloadSmart">↻ Perbarui Data</button></div>
 <div class="sg-note">⚡ Otomatis: rombel, mapel, BAB, dan daftar siswa diambil dari sesi guru/data siswa. Untuk Ulangan BAB, pilih BAB dari daftar—tidak perlu mengetik.</div>
 <div class="tablewrap"><table class="table sg-table" style="min-width:900px"><thead><tr><th>No</th><th>Nama Siswa</th><th>Nilai 0–100</th><th>Catatan</th></tr></thead><tbody id="sgSmartBody">${ss.length?ss.map((s,i)=>{const mapel=currentMapel,sem=selectedValue('#sgSem')||'1',key=`${s.id}|${mapel}|${sem}|${jenis}|${item||ch[0]||''}`,row=d.rows[key]||{};return `<tr data-sid="${esc(s.id)}"><td>${i+1}</td><td><b>${esc(s.name)}</b><div class="muted">${esc(s.rombel)}</div></td><td><input class="sgSmartScore" type="number" min="0" max="100" value="${row.nilai??''}" inputmode="numeric" placeholder="-"></td><td><input class="sgSmartNote" value="${esc(row.catatan||'')}" placeholder="opsional"></td></tr>`}).join(''):'<tr><td colspan="4">Data siswa belum masuk ke sesi. Tekan Perbarui Data.</td></tr>'}</tbody></table></div>`;
 $('#sgJenisSmart').value=jenis;
 $('#sgSemSmart').value=selectedValue('#sgSem')||'1';
 function rerenderRows(){host.dataset.smart='';setSmartInput()}
 $('#sgMapelSmart').onchange=()=>rerenderRows();
 $('#sgJenisSmart').onchange=()=>rerenderRows();
 $('#sgSemSmart').onchange=()=>rerenderRows();
 $('#sgItemSmart').onchange=()=>{const chosen=$('#sgItemSmart').value;$$('#sgSmartBody tr[data-sid]').forEach(tr=>{tr.querySelector('.sgSmartScore').dataset.item=chosen})};
 $('#sgReloadSmart').onclick=()=>{host.dataset.smart='';setSmartInput();window.ADM_UI?.success?.('Data penilaian diperbarui.')};
 $('#sgSaveSmart').onclick=()=>{
  const mapel=$('#sgMapelSmart').value, j=$('#sgJenisSmart').value, sem=$('#sgSemSmart').value, item2=$('#sgItemSmart').value;
  let n=0;const now=read(A,{weights:{formative:20,task:20,chapter:30,summative:30},rows:{}});now.rows=now.rows||{};
  $$('#sgSmartBody tr[data-sid]').forEach(tr=>{const val=tr.querySelector('.sgSmartScore')?.value;if(val==='')return;const id=tr.dataset.sid;now.rows[`${id}|${mapel}|${sem}|${j}|${item2}`]={studentId:id,mapel,semester:sem,jenis:j,item:item2,nilai:Math.max(0,Math.min(100,+val)),catatan:tr.querySelector('.sgSmartNote')?.value||''};n++});
  write(A,now);window.ADM_UI?.success?.(`${n} nilai ${esc(j)} tersimpan.`);
 };
}
function enhance(){
 const nav=$('#navPenilaianPro');if(nav&&!nav.__smartNav){nav.__smartNav=true;nav.addEventListener('click',()=>setTimeout(()=>{const h=$('#sgAssessmentBody');if(h)h.dataset.smart='';setSmartInput()},30))}
 const page=$('#penilaianPro');if(!page||!page.classList.contains('active'))return;
 const tabs=$$('.sg-tab',page);tabs.forEach(b=>{if(!b.__smartTab){b.__smartTab=true;b.addEventListener('click',()=>{if(b.dataset.at==='input')setTimeout(()=>{const h=$('#sgAssessmentBody');if(h)h.dataset.smart='';setSmartInput()},25)})}});
 setSmartInput();
}
document.addEventListener('adm:students-ready',()=>setTimeout(enhance,50));
setInterval(enhance,1200);setTimeout(enhance,400);
})();