/* SIAP GURU — Rekap Nilai Smart V3
   Automatic recap from existing assessment records + BAB matrix.
   Scroll-safe rendering: preserves horizontal/vertical table position.
   Does not touch D1 or src/index.js.
*/
(function(){
'use strict';
if(window.__ADM_ASSESS_REKAP_SMART__)return;
window.__ADM_ASSESS_REKAP_SMART__=true;
const KEY='siapGuruAssessmentV1';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function login(){try{return JSON.parse(localStorage.getItem('siLogin')||'null')||{}}catch{return {}}}
function user(){const x=login();return x.user||x||{}}
function normR(v){const s=String(v??'').trim().toUpperCase().replace(/\s+/g,'');return ({'1A':'IA','1B':'IB','2A':'IIA','2B':'IIB','3A':'IIIA','3B':'IIIB','4A':'IVA','4B':'IVB','5':'V','6':'VI','KELAS1A':'IA','KELAS1B':'IB','KELAS2A':'IIA','KELAS2B':'IIB','KELAS3A':'IIIA','KELAS3B':'IIIB','KELAS4A':'IVA','KELAS4B':'IVB','KELAS5':'V','KELAS6':'VI'})[s]||s}
function rombel(){return normR(user().activeRombel||user().rombel||user().kelas||'')}
function students(){const a=window.db?.students||window.students||[];const r=rombel();return Array.isArray(a)?a.map((s,i)=>({id:String(s.id??s.nisn??s.nis??i),name:String(s.name??s.nama??s.nama_siswa??s.namaSiswa??'').trim(),rombel:normR(s.rombel??s.kelas??s.rombel_siswa??'')})).filter(s=>s.name&&(!r||r==='ALL'||!s.rombel||s.rombel===r)):[]}
function mapels(){const u=user(),out=[],add=v=>{if(Array.isArray(v))return v.forEach(add);if(!v)return;if(typeof v==='object'){['mapel','mataPelajaran','subject','name','nama'].forEach(k=>add(v[k]));return}String(v).split(/[;,|]/).map(x=>x.trim()).filter(Boolean).forEach(x=>{if(!out.some(y=>y.toLowerCase()===x.toLowerCase()))out.push(x)})};['mapel','mapels','mataPelajaran','mataPelajaranList','subjects','subject'].forEach(k=>add(u[k]));return out.length?out:['Bahasa Indonesia','Matematika','Pendidikan Pancasila','IPAS','Seni dan Budaya','PJOK','Pendidikan Agama dan Budi Pekerti','Bahasa Inggris']}
function chapters(m){const n={'Bahasa Indonesia':8,'Matematika':8,'Pendidikan Pancasila':6,'IPAS':8,'Seni dan Budaya':6,'PJOK':6,'Pendidikan Agama':6,'Pendidikan Agama dan Budi Pekerti':6,'Bahasa Inggris':6}[m]||8;return Array.from({length:n},(_,i)=>`BAB ${i+1}`)}
function active(){const p=$('#penilaianPro');return p&&p.classList.contains('active')&&$('.sg-tab.active',p)?.dataset.at==='rekap'}
function avg(a){return a.length?a.reduce((x,y)=>x+y,0)/a.length:null}
function render(force){
 const p=$('#penilaianPro');if(!active())return;
 const host=$('#sgAssessmentBody');if(!host)return;
 const oldWrap=host.querySelector('.tablewrap');const oldX=oldWrap?.scrollLeft||0,oldY=oldWrap?.scrollTop||0;
 const d=read(KEY,{weights:{formative:20,task:20,chapter:30,summative:30},rows:{}}),w={formative:+d.weights?.formative||0,task:+d.weights?.task||0,chapter:+d.weights?.chapter||0,summative:+d.weights?.summative||0},rows=Object.values(d.rows||{}),ss=students(),ms=mapels();
 let m=host.dataset.rekapMapel||ms[0]||'',sem=host.dataset.rekapSem||'1';
 if(!ms.includes(m))m=ms[0]||'';
 const ch=chapters(m),sig=[m,sem,ss.length,Object.keys(d.rows||{}).length,w.formative,w.task,w.chapter,w.summative].join('|');
 if(!force&&host.dataset.rekapSig===sig&&host.querySelector('#sgRekapAuto'))return;
 host.dataset.rekapSig=sig;host.dataset.rekapMapel=m;host.dataset.rekapSem=sem;
 const index={};
 rows.forEach(x=>{if(!x||String(x.key||'').endsWith('|abs'))return;const jenis=String(x.jenis||'').toLowerCase(),id=String(x.studentId??'');if(!id)return;const xm=String(x.mapel||''),xs=String(x.semester||'');if(xm!==m||xs!==sem)return;const g=index[id]??={formative:[],task:[],chapter:{},summative:[]};const v=Number(x.nilai);if(!Number.isFinite(v))return;if(jenis.includes('formatif'))g.formative.push(v);else if(jenis.includes('tugas'))g.task.push(v);else if(jenis.includes('bab'))g.chapter[String(x.item||'')]=v;else if(jenis.includes('sumatif'))g.summative.push(v)});
 const out=ss.map(s=>{const g=index[s.id]||{formative:[],task:[],chapter:{},summative:[]};const f=avg(g.formative),t=avg(g.task),cvals=ch.map(b=>g.chapter[b]).filter(v=>Number.isFinite(v)),c=avg(cvals),su=avg(g.summative);const parts=[[f,w.formative],[t,w.task],[c,w.chapter],[su,w.summative]].filter(([v,b])=>v!==null&&b>0);const denom=parts.reduce((a,[,b])=>a+b,0);const final=denom?Math.round(parts.reduce((a,[v,b])=>a+v*b,0)/denom):0;return {...s,g,f,t,c,su,final}});
 const mean=a=>a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length):0;const fAll=out.filter(x=>x.f!==null).map(x=>x.f),tAll=out.filter(x=>x.t!==null).map(x=>x.t),cAll=out.filter(x=>x.c!==null).map(x=>x.c),sAll=out.filter(x=>x.su!==null).map(x=>x.su),finalAll=out.filter(x=>x.final>0).map(x=>x.final);
 host.innerHTML=`<div id="sgRekapAuto"><div class="sg-grid"><label>Mapel<select id="sgRekapMapel">${ms.map(x=>`<option ${x===m?'selected':''}>${esc(x)}</option>`).join('')}</select></label><label>Semester<select id="sgRekapSem"><option ${sem==='1'?'selected':''}>1</option><option ${sem==='2'?'selected':''}>2</option></select></label><label>Rombel<input value="${esc(rombel()||'Semua rombel')}" readonly></label><label>Data<input value="${out.length} siswa" readonly></label></div><div class="sg-summary"><div class="stat"><span>Formatif</span><div class="sg-kpi">${mean(fAll)}</div></div><div class="stat"><span>Tugas</span><div class="sg-kpi">${mean(tAll)}</div></div><div class="stat"><span>Rata-rata BAB</span><div class="sg-kpi">${mean(cAll)}</div></div><div class="stat"><span>Sumatif</span><div class="sg-kpi">${mean(sAll)}</div></div><div class="stat"><span>Nilai Akhir</span><div class="sg-kpi">${mean(finalAll)}</div></div></div><div class="sg-note"><b>Rekap otomatis.</b> Setiap nilai BAB yang disimpan di tabel Input Nilai langsung dibaca di sini. Nilai BAB yang kosong tidak dihitung sebagai nol. Bobot aktif: Formatif ${w.formative}% • Tugas ${w.task}% • Ulangan BAB ${w.chapter}% • Sumatif ${w.summative}%.</div><div class="tablewrap"><table class="table" style="min-width:${920+ch.length*78}px"><thead><tr><th>No</th><th>Nama Siswa</th>${ch.map(b=>`<th>${b}</th>`).join('')}<th>Rata-rata BAB</th><th>Formatif</th><th>Tugas</th><th>Sumatif</th><th>Nilai Akhir</th></tr></thead><tbody>${out.map((x,i)=>`<tr><td>${i+1}</td><td><b>${esc(x.name)}</b><div class="muted">${esc(x.rombel)}</div></td>${ch.map(b=>`<td>${x.g.chapter[b]??'—'}</td>`).join('')}<td><b>${x.c===null?'—':x.c.toFixed(1)}</b></td><td>${x.f===null?'—':x.f.toFixed(1)}</td><td>${x.t===null?'—':x.t.toFixed(1)}</td><td>${x.su===null?'—':x.su.toFixed(1)}</td><td><b>${x.final||'—'}</b></td></tr>`).join('')||'<tr><td colspan="20">Data siswa belum tersedia.</td></tr>'}</tbody></table></div></div>`;
 $('#sgRekapMapel').onchange=e=>{host.dataset.rekapMapel=e.target.value;host.dataset.rekapSig='';render(true)};
 $('#sgRekapSem').onchange=e=>{host.dataset.rekapSem=e.target.value;host.dataset.rekapSig='';render(true)};
 const nw=host.querySelector('.tablewrap');if(nw){nw.scrollLeft=oldX;nw.scrollTop=oldY;requestAnimationFrame(()=>{nw.scrollLeft=oldX;nw.scrollTop=oldY})}
}
function wire(){const p=$('#penilaianPro');if(!p||p.__rekapSmart)return false;p.__rekapSmart=true;p.addEventListener('click',e=>{const b=e.target.closest?.('.sg-tab[data-at="rekap"]');if(b)setTimeout(()=>render(true),50)});return true}
setInterval(()=>{wire();render(false)},1000);setTimeout(()=>{wire();render(true)},300);
window.addEventListener('storage',e=>{if(e.key===KEY)setTimeout(()=>render(true),60)});
document.addEventListener('adm:assessment-saved',()=>setTimeout(()=>render(true),60));
})();
