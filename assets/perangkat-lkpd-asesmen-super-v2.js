/* GURU+ SD — LKPD & ASESMEN SUPER v3
 * SINGLE SOURCE: GURU_SD_MASTER.
 * BAB/TP/JP/model/DPL never come from legacy curriculum keys.
 * Local-only. No D1/Worker/assessment bridge changes.
 */
(function(){'use strict';if(window.__LA_SUPER_V3__)return;window.__LA_SUPER_V3__=1;
const $=id=>document.getElementById(id),E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function master(){return window.GURU_SD_MASTER?.get?.()||null}
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
function sel(){const s=master();if(!s||s.source!=='GURU_SD_MASTER'||!s.babId||!s.material)return null;return s}
function tps(s){return Array.isArray(s?.tp)?s.tp.map(v=>typeof v==='string'?v:(v?.text||v?.title||'')).filter(Boolean):[]}
function meetings(s){const a=window.GURU_SD_JP?.get?.()||window.GURU_SD_JP_SUPER?.get?.()||null;return Array.isArray(a?.tp)?a.tp.map((x,i)=>({date:'',jp:x.jp,tp:x.text,no:i+1})):[]}
function mount(){let p=$('lkpdAsesmenSuperPanel');if(!p)return; p.innerHTML='<h2>📚 LKPD + ASESMEN SUPER</h2><p>Sinkron <b>BAB → TP → JP → pertemuan</b> dari Master Perangkat.</p><div><button id="la2L">📄 Buat LKPD</button> <button id="la2A">📝 Buat Asesmen</button> <button id="la2B">⚡ LKPD + Asesmen</button> <button id="la2P">🖨️ Cetak</button></div><div id="la2Info" style="margin-top:12px"></div><div id="la2Out" style="margin-top:14px"></div>';['la2L','la2A','la2B'].forEach((id,i)=>$(id).onclick=()=>build(['LKPD','ASESMEN','BOTH'][i]));$('la2P').onclick=()=>{if(!$('la2Out').innerHTML)build('BOTH');setTimeout(()=>window.print(),100)};['pkR','pkM','pkB'].forEach(id=>$(id)?.addEventListener('change',()=>setTimeout(()=>build('INFO'),30)));build('INFO')}
function build(kind){const s=sel();if(!s){if($('la2Info'))$('la2Info').innerHTML='⚠️ Pilih Kelas → Mapel → BAB terlebih dahulu.';return}const tp=tps(s),mt=meetings(s),st=styles[s.mapel]||styles.IPAS;if(!tp.length){$('la2Info').innerHTML='⚠️ TP Master belum tersedia.';return}if(kind==='INFO'){$('la2Info').innerHTML='<b>'+E(s.rombel)+' · '+E(s.mapel)+' · BAB '+E(s.babNo)+' — '+E(s.material)+'</b><br>🔗 Master TP '+tp.length+' • '+E(s.jp)+' JP • Semester '+E(s.semester);return}
let rows=(mt.length?mt.map((x,i)=>'<tr><td>'+(i+1)+'</td><td>-</td><td>'+E(x.jp)+' JP</td><td>'+E(x.tp||tp[Math.min(i,tp.length-1)])+'</td></tr>').join(''):tp.map((x,i)=>'<tr><td>'+(i+1)+'</td><td>-</td><td>-</td><td>'+E(x)+'</td></tr>').join(''));let html='<article class="la2Doc"><h3>'+E(s.mapel)+' — BAB '+E(s.babNo)+' — '+E(s.material)+'</h3><p><b>Kelas:</b> '+E(s.rombel)+' &nbsp; <b>Semester:</b> '+E(s.semester)+' &nbsp; <b>JP:</b> '+E(s.jp)+'</p>';
if(kind==='LKPD'||kind==='BOTH')html+='<h3>LEMBAR KERJA PESERTA DIDIK</h3><p><b>Tujuan:</b> '+E(tp[0])+'</p><h4>Petunjuk</h4><ol><li>Amati/baca stimulus.</li><li>Kerjakan langkah sesuai pertemuan.</li><li>Catat temuan, strategi, atau proses.</li><li>Presentasikan hasil dan refleksikan.</li></ol><h4>Aktivitas Adaptif</h4><p>'+E(st.join(' → '))+'.</p><table border="1" cellpadding="6" style="border-collapse:collapse;width:100%"><tr><th>No</th><th>Pertemuan</th><th>JP</th><th>TP</th></tr>'+rows+'</table><h4>Refleksi</h4><p>Saya sudah memahami: __________________________</p><p>Yang perlu saya perbaiki: _______________________</p>';
if(kind==='ASESMEN'||kind==='BOTH')html+='<h3>ASESMEN PER BAB</h3><p>Asesmen mengikuti TP dan karakter '+E(s.mapel)+'.</p><table border="1" cellpadding="6" style="border-collapse:collapse;width:100%"><tr><th>TP</th><th>Bentuk</th><th>Bukti</th><th>Kriteria</th></tr>'+tp.map((x,i)=>'<tr><td>'+E(x)+'</td><td>'+E(st[i%st.length])+'</td><td>Observasi/produk/unjuk kerja/respons</td><td>Penguasaan konsep, proses, komunikasi, dan refleksi</td></tr>').join('')+'</table><h4>Skema</h4><p>Diagnostik → formatif selama proses → sumatif BAB → refleksi dan tindak lanjut. Tidak membuat STS.</p>';
html+='</article>';$('la2Info').innerHTML='✅ '+E(kind)+' tersinkron dari Master: '+E(s.material)+'.';$('la2Out').innerHTML=html;localStorage.setItem('guru_sd_lkpd_asesmen_super_v2',JSON.stringify({source:'GURU_SD_MASTER',selected:{rombel:s.rombel,mapel:s.mapel,babId:s.babId,babNo:s.babNo,material:s.material,jp:s.jp,semester:s.semester},kind,meetings:mt,html,at:new Date().toISOString()}))}
function boot(){let n=0,t=setInterval(()=>{n++;if($('lkpdAsesmenSuperPanel')&&master()?.babId){clearInterval(t);mount()}if(n>60)clearInterval(t)},250)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();})();