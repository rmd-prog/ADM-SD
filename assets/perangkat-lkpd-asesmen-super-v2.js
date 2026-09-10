/* GURU+ SD — LKPD & ASESMEN SUPER v2
 * Syncs BAB/TP/JP with actual meeting mapping when available.
 * Local-first. No D1/Worker/assessment bridge changes.
 */
(function(){'use strict';if(window.__LA_SUPER_V2__)return;window.__LA_SUPER_V2__=1;
const $=id=>document.getElementById(id),E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(e){return d}};
const styles={
'Bahasa Indonesia':['menyimak/memirsa','berdiskusi dan menemukan informasi','menulis/menyajikan','merevisi dan merefleksi'],
'Pendidikan Pancasila':['mengamati situasi kewargaan','mengidentifikasi nilai/aturan','simulasi/aksi nyata','refleksi tanggung jawab'],
'Matematika':['eksplorasi representasi','menemukan konsep/pola','memecahkan masalah','mengomunikasikan strategi'],
'IPAS':['mengamati fenomena','bertanya dan menyelidiki','mengolah data/temuan','menyimpulkan dan merefleksi'],
'PJOK':['pemanasan','demonstrasi/latihan','permainan atau unjuk kerja','pendinginan/refleksi'],
'Seni Rupa':['mengamati karya','eksplorasi unsur/teknik','menciptakan karya','presentasi/apresiasi'],
'Seni Musik':['menyimak','eksplorasi ritme/melodi','praktik bermusik','tampil/refleksi'],
'Seni Tari':['mengamati gerak','eksplorasi ruang/waktu/tenaga','menyusun rangkaian','tampil/apresiasi'],
'Seni Teater':['olah tubuh/suara','eksplorasi karakter','latihan adegan','pementasan/refleksi'],
'Bahasa Inggris':['listening','speaking','reading/writing','performance/reflection'],
'Pendidikan Agama dan Budi Pekerti':['membaca/mengamati','dialog/pemahaman','praktik/pembiasaan','refleksi penerapan']};
function sel(){let z=read('guru_sd_perangkat_super_v1',{}),r=$('pkR')?.value||z.rombel||'V',m=$('pkM')?.value||z.mapel||'IPAS',b=$('pkB')?.value||z.material||'Materi/BAB';return{r,m,b,jp:Number(z.jp)||0}}
function tps(){let x=read('guru_sd_cp_atp_tp_super_v1',null)?.tp||[];if(x.length)return x.map(v=>typeof v==='string'?v:(v.text||v.title||''));return['Memahami konsep utama '+sel().b,'Menerapkan pemahaman '+sel().b,'Mengomunikasikan hasil dan refleksi '+sel().b]}
function meetings(){let x=read('guru_sd_rpm_super_v2',null);if(Array.isArray(x?.rows)&&x.rows.length)return x.rows;return[]}
function mount(){let p=$('lkpdAsesmenSuperPanel');if(!p)return;let q=sel();p.innerHTML='<h2>📚 LKPD + ASESMEN SUPER v2</h2><p>Sinkron <b>BAB → TP → JP → pertemuan nyata</b>, adaptif sesuai karakter mapel.</p><div><button id="la2L">📄 Buat LKPD</button> <button id="la2A">📝 Buat Asesmen</button> <button id="la2B">⚡ LKPD + Asesmen</button> <button id="la2P">🖨️ Cetak</button></div><div id="la2Info" style="margin-top:12px"></div><div id="la2Out" style="margin-top:14px"></div>';['la2L','la2A','la2B'].forEach((id,i)=>$(id).onclick=()=>build(['LKPD','ASESMEN','BOTH'][i]));$('la2P').onclick=()=>{if(!$('la2Out').innerHTML)build('BOTH');setTimeout(()=>window.print(),100)};['pkR','pkM','pkB'].forEach(id=>$(id)?.addEventListener('change',()=>build('INFO')));build('INFO')}
function build(kind){let s=sel(),tp=tps(),mt=meetings(),st=styles[s.m]||styles.IPAS;if(kind==='INFO'){$('la2Info').innerHTML='<b>'+E(s.r)+' · '+E(s.m)+' · '+E(s.b)+'</b><br>'+ (mt.length?'📅 '+mt.length+' pertemuan nyata sudah terpetakan.':'⚠️ Pemetaan pertemuan belum tersedia — dokumen tetap dapat dibuat dari TP/BAB.');return}
let rows=mt.length?mt.map((x,i)=>'<tr><td>'+(i+1)+'</td><td>'+E(new Date(x.date).toLocaleDateString('id-ID',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}))+'</td><td>'+E(x.jp)+' JP</td><td>'+E(x.tp||tp[Math.min(i,tp.length-1)])+'</td></tr>').join(''):tp.map((x,i)=>'<tr><td>'+(i+1)+'</td><td>-</td><td>-</td><td>'+E(x)+'</td></tr>').join('');let html='<article class="la2Doc"><h3>'+E(s.m)+' — '+E(s.b)+'</h3><p><b>Kelas:</b> '+E(s.r)+'</p>';
if(kind==='LKPD'||kind==='BOTH')html+='<h3>LEMBAR KERJA PESERTA DIDIK</h3><p><b>Tujuan:</b> '+E(tp[0])+'</p><h4>Petunjuk</h4><ol><li>Amati/baca stimulus.</li><li>Kerjakan langkah sesuai pertemuan.</li><li>Catat temuan, strategi, atau proses.</li><li>Presentasikan hasil dan refleksikan.</li></ol><h4>Aktivitas Adaptif</h4><p>'+E(st.join(' → '))+'.</p><table border="1" cellpadding="6" style="border-collapse:collapse;width:100%"><tr><th>No</th><th>Pertemuan</th><th>JP</th><th>TP</th></tr>'+rows+'</table><h4>Refleksi</h4><p>Saya sudah memahami: __________________________</p><p>Yang perlu saya perbaiki: _______________________</p>';
if(kind==='ASESMEN'||kind==='BOTH')html+='<h3>ASESMEN PER BAB</h3><p>Asesmen mengikuti TP dan karakter '+E(s.m)+'.</p><table border="1" cellpadding="6" style="border-collapse:collapse;width:100%"><tr><th>TP</th><th>Bentuk</th><th>Bukti</th><th>Kriteria</th></tr>'+tp.map((x,i)=>'<tr><td>'+E(x)+'</td><td>'+E(st[i%st.length])+'</td><td>Observasi/produk/unjuk kerja/respons</td><td>Penguasaan konsep, proses, komunikasi, dan refleksi</td></tr>').join('')+'</table><h4>Skema</h4><p>Diagnostik → formatif selama proses → sumatif BAB → refleksi dan tindak lanjut. Tidak membuat STS.</p>';
html+='</article>';$('la2Info').innerHTML='✅ Dokumen '+E(kind)+' tersinkron dengan '+(mt.length?mt.length+' pertemuan nyata':'TP/BAB')+'.';$('la2Out').innerHTML=html;localStorage.setItem('guru_sd_lkpd_asesmen_super_v2',JSON.stringify({selected:s,kind,meetings:mt,html,at:new Date().toISOString()}))}
function boot(){let n=0,t=setInterval(()=>{n++;if($('lkpdAsesmenSuperPanel')){clearInterval(t);mount()}if(n>40)clearInterval(t)},250)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();})();