/* SIAP GURU — Rekap Nilai Smart Fix
   Recalculates weighted results from saved assessment items.
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
function students(){const a=window.db?.students||window.students||[];const r=rombel();return Array.isArray(a)?a.map((s,i)=>({id:String(s.id??s.nisn??s.nis??i),name:String(s.name??s.nama??s.nama_siswa??'').trim(),rombel:normR(s.rombel??s.kelas??'')})).filter(s=>s.name&&(!r||r==='ALL'||!s.rombel||s.rombel===r)):[]}
function weights(d){return {formative:+d.weights?.formative||0,task:+d.weights?.task||0,chapter:+d.weights?.chapter||0,summative:+d.weights?.summative||0}}
function avg(a){return a.length?a.reduce((x,y)=>x+y,0)/a.length:null}
function render(){
 const p=$('#penilaianPro');if(!p||!p.classList.contains('active'))return;
 const tab=$('.sg-tab.active',p);if(!tab||tab.dataset.at!=='rekap')return;
 const host=$('#sgAssessmentBody');if(!host)return;
 const d=read(KEY,{weights:{formative:20,task:20,chapter:30,summative:30},rows:{}}),w=weights(d),rows=Object.values(d.rows||{}),by={};
 rows.forEach(x=>{if(!x||String(x.key||'').endsWith('|abs'))return;const jenis=String(x.jenis||'').toLowerCase();let k;if(jenis.includes('formatif'))k='formative';else if(jenis.includes('tugas'))k='task';else if(jenis.includes('bab'))k='chapter';else if(jenis.includes('sumatif'))k='summative';else return;const id=String(x.studentId??'');const g=`${id}|${x.mapel||''}|${x.semester||''}`;(by[g]??={studentId:id,mapel:String(x.mapel||''),semester:String(x.semester||''),formative:[],task:[],chapter:[],summative:[]})[k].push(+x.nilai||0)});
 const out=Object.values(by).map(x=>{const f=avg(x.formative),t=avg(x.task),c=avg(x.chapter),s=avg(x.summative);const parts=[[f,w.formative],[t,w.task],[c,w.chapter],[s,w.summative]].filter(([v,b])=>v!==null&&b>0);const denom=parts.reduce((a,[,b])=>a+b,0);const final=denom?Math.round(parts.reduce((a,[v,b])=>a+v*b,0)/denom):0;const st=students().find(z=>String(z.id)===String(x.studentId));return {...x,f,t,c,s,final,name:st?.name||x.studentId}});
 const all=a=>a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length):0;
 host.innerHTML=`<div class="sg-summary"><div class="stat"><span>Formatif</span><div class="sg-kpi">${all(out.filter(x=>x.f!==null).map(x=>x.f))}</div></div><div class="stat"><span>Tugas</span><div class="sg-kpi">${all(out.filter(x=>x.t!==null).map(x=>x.t))}</div></div><div class="stat"><span>Ulangan BAB</span><div class="sg-kpi">${all(out.filter(x=>x.c!==null).map(x=>x.c))}</div></div><div class="stat"><span>Nilai Akhir</span><div class="sg-kpi">${all(out.map(x=>x.final))}</div></div></div><div class="sg-note">Bobot aktif: Formatif ${w.formative}% • Tugas ${w.task}% • Ulangan BAB ${w.chapter}% • Sumatif ${w.summative}%. Komponen yang belum memiliki nilai tidak dihitung sebagai nol.</div><div class="tablewrap"><table class="table" style="min-width:900px"><thead><tr><th>No</th><th>Nama</th><th>Mapel</th><th>Formatif</th><th>Tugas</th><th>Ulangan BAB</th><th>Sumatif</th><th>Nilai Akhir</th></tr></thead><tbody>${out.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.name)}</td><td>${esc(x.mapel)}</td><td>${x.f===null?'—':x.f.toFixed(1)}</td><td>${x.t===null?'—':x.t.toFixed(1)}</td><td>${x.c===null?'—':x.c.toFixed(1)}</td><td>${x.s===null?'—':x.s.toFixed(1)}</td><td><b>${x.final}</b></td></tr>`).join('')||'<tr><td colspan="8">Belum ada data nilai.</td></tr>'}</tbody></table></div>`;
}
function wire(){const p=$('#penilaianPro');if(!p||p.__rekapSmart)return false;p.__rekapSmart=true;p.addEventListener('click',e=>{const b=e.target.closest?.('.sg-tab[data-at="rekap"]');if(b)setTimeout(render,50)});return true}
setInterval(()=>{wire();render()},1000);setTimeout(()=>{wire();render()},300);
window.addEventListener('storage',e=>{if(e.key===KEY)setTimeout(render,60)});
document.addEventListener('adm:assessment-saved',()=>setTimeout(render,60));
})();
