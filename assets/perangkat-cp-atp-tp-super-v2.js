/* GURU+ SD — CP/ATP/TP SUPER v2
 * Adaptive per fase + mapel + BAB. Local-only; no D1/Worker changes.
 * Generated wording is a working template, not an official quotation.
 */
(function(){'use strict';if(window.__CP_ATP_TP_SUPER_V2__)return;window.__CP_ATP_TP_SUPER_V2__=1;
const R=['IA','IB','IIA','IIB','IIIA','IIIB','IVA','IVB','V','VI'],M=['Bahasa Indonesia','Pendidikan Pancasila','Matematika','IPAS','PJOK','Seni Rupa','Seni Musik','Seni Tari','Seni Teater','Bahasa Inggris','Pendidikan Agama dan Budi Pekerti'];
const G={IA:1,IB:1,IIA:2,IIB:2,IIIA:3,IIIB:3,IVA:4,IVB:4,V:5,VI:6};const fase=r=>G[r]<=2?'A':G[r]<=4?'B':'C';
const F={
'Bahasa Indonesia':['menyimak dan memirsa','berbicara dan mempresentasikan','membaca dan memirsa','menulis'],
'Pendidikan Pancasila':['memahami nilai Pancasila','menunjukkan sikap kewargaan','menganalisis keberagaman dan aturan','berpartisipasi secara bertanggung jawab'],
'Matematika':['memahami konsep dan representasi matematis','bernalar dan memecahkan masalah','menggunakan prosedur secara tepat','mengomunikasikan strategi matematis'],
'IPAS':['mengamati fenomena','mengajukan pertanyaan dan menyelidiki','mengolah informasi/data','menjelaskan dan menerapkan konsep sains-sosial'],
'PJOK':['mempraktikkan gerak dasar/keterampilan gerak','menjaga kebugaran dan kesehatan','menerapkan keselamatan dan aturan','menunjukkan sportivitas dan tanggung jawab'],
'Seni Rupa':['mengamati dan mengeksplorasi unsur rupa','mencoba teknik dan media','menciptakan karya','mengapresiasi dan merefleksikan karya'],
'Seni Musik':['mengamati bunyi dan musik','menirukan/mengeksplorasi ritme dan melodi','berpraktik bermusik','menampilkan dan merefleksikan karya musik'],
'Seni Tari':['mengamati gerak','mengeksplorasi ruang-waktu-tenaga','menyusun dan mempraktikkan rangkaian gerak','menampilkan dan merefleksikan karya tari'],
'Seni Teater':['mengolah tubuh dan suara','mengeksplorasi karakter dan imajinasi','memerankan adegan/dialog','menampilkan dan merefleksikan pementasan'],
'Bahasa Inggris':['memahami makna ujaran sederhana','berinteraksi lisan sesuai konteks','memahami teks pendek','menghasilkan ungkapan/teks sederhana'],
'Pendidikan Agama dan Budi Pekerti':['memahami ajaran dan nilai','menunjukkan pembiasaan akhlak','mempraktikkan nilai/ibadah sesuai materi','merefleksikan penerapan dalam kehidupan']};
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function selected(){return {r:$('pkR')?.value||'V',m:$('pkM')?.value||'IPAS',b:$('pkB')?.value||'BAB 1'} };
function build(){const s=selected(),f=F[s.m]||F.IPAS;const cp='Pada Kelas '+s.r+' / Fase '+fase(s.r)+', peserta didik mengembangkan kemampuan '+f.join(', ')+' melalui pengalaman belajar yang kontekstual, bertahap, aktif, reflektif, dan sesuai karakter mata pelajaran pada '+s.b+'.';const atp=f.map((x,i)=>({no:i+1,text:'Peserta didik mampu '+x+' pada '+s.b+' melalui pengalaman belajar yang sesuai karakter '+s.m+'.'}));return {s,cp,atp}}
function render(){const host=$('pkatV2')||$('perangkatSuperPanel');if(!host)return;let box=$('cpAtpTpV2');if(!box){box=document.createElement('div');box.id='cpAtpTpV2';box.style='margin-top:14px;padding:14px;border-radius:14px;background:#f8fafc;border:1px solid #dbe4f0';host.appendChild(box)}const d=build();box.innerHTML='<h3 style="margin:0 0 8px">🧠 CP → ATP → TP Adaptive</h3><div style="font-size:12px;color:#475569;margin-bottom:10px">'+esc(d.s.r)+' • Fase '+fase(d.s.r)+' • '+esc(d.s.m)+' • '+esc(d.s.b)+'</div><b>CP kerja</b><p>'+esc(d.cp)+'</p><b>ATP / TP</b><ol>'+d.atp.map(x=>'<li style="margin:7px 0"><b>TP '+x.no+':</b> '+esc(x.text)+'</li>').join('')+'</ol><div style="font-size:11px;color:#64748b">Catatan: rumusan ini adalah template kerja adaptif. Untuk dokumen resmi, gunakan redaksi CP/ATP yang telah diverifikasi dari dokumen satuan pendidikan/SIBI.</div><button id="cpAtpCopy" style="margin-top:9px;padding:9px 12px;border:0;border-radius:10px">📋 Salin CP + ATP + TP</button>';if($('cpAtpCopy'))$('cpAtpCopy').onclick=()=>{const t=d.cp+'\n\n'+d.atp.map(x=>'TP '+x.no+': '+x.text).join('\n');navigator.clipboard?.writeText(t).then(()=>{ $('cpAtpCopy').textContent='✓ Tersalin';setTimeout(()=>{$('cpAtpCopy').textContent='📋 Salin CP + ATP + TP'},1200)})}}
function boot(){document.addEventListener('change',e=>{if(['pkR','pkM','pkB'].includes(e.target.id))setTimeout(render,60)},true);setInterval(render,1800);render()};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();