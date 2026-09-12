/* SIAP GURU — RPM SUPER v1
 * Builds RPM per real date/meeting from saved schedule + TP/JP allocation.
 * Local-first; no D1/Worker changes.
 */
(function(){'use strict';
if(window.__RPM_SUPER_V1__)return;window.__RPM_SUPER_V1__=true;
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ST={
'Bahasa Indonesia':['menyimak/membaca stimulus','berdiskusi dan menemukan informasi','menghasilkan teks/presentasi','merevisi dan merefleksi'],
'Pendidikan Pancasila':['mengamati situasi','mengidentifikasi nilai/aturan','simulasi atau aksi kewargaan','refleksi penerapan'],
'Matematika':['eksplorasi representasi','menemukan pola/konsep','memecahkan masalah','mengomunikasikan strategi'],
'IPAS':['mengamati fenomena','bertanya dan menyelidiki','mengolah temuan/data','menyimpulkan dan merefleksi'],
'PJOK':['pemanasan dan kesiapan','demonstrasi serta latihan','permainan/unjuk kerja','pendinginan dan refleksi'],
'Seni Rupa':['mengamati karya','eksplorasi unsur/teknik','berkarya','presentasi dan apresiasi'],
'Seni Musik':['menyimak','eksplorasi ritme/melodi','praktik bermusik','tampil dan refleksi'],
'Seni Tari':['mengamati gerak','eksplorasi ruang/waktu/tenaga','menyusun rangkaian','tampil dan apresiasi'],
'Seni Teater':['olah tubuh/suara','eksplorasi karakter','latihan adegan','pementasan dan refleksi'],
'Bahasa Inggris':['listening','speaking','reading/writing','performance and reflection'],
'Pendidikan Agama dan Budi Pekerti':['mengamati/membaca','dialog dan pemahaman','praktik/pembiasaan','refleksi penerapan']};
const DAYS={Minggu:0,Senin:1,Selasa:2,Rabu:3,Kamis:4,Jumat:5,Sabtu:6};
function read(k,d){try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(e){return d}}
function get(){let s=read('guru_sd_kurikulum_super_schedule_v2',null);let a=read('guru_sd_jp_allocation_super_v1',null);return {sch:s,alloc:a}}
function selected(){let st=read('guru_sd_perangkat_super_v1',{}),r=$('pkR')?.value||st.rombel||'V',m=$('pkM')?.value||st.mapel||'IPAS',b=$('pkB')?.value||st.material||'Materi/BAB';return {r,m,b}}
function tp(){let x=read('guru_sd_cp_atp_tp_super_v1',null);if(x?.tp?.length)return x.tp.map(v=>typeof v==='string'?v:(v.text||v.title||''));return ['Memahami konsep '+selected().b,'Menerapkan pemahaman '+selected().b,'Mengomunikasikan hasil '+selected().b]}
function rows(){const {sch,alloc}=get(),s=selected();let rs=Array.isArray(sch?.rows)?sch.rows:Array.isArray(sch?.schedule)?sch.schedule:[];rs=rs.filter(x=>(x.rombel||x.class||x.kelas)===s.r&&(x.mapel||x.subject)===s.m);if(!rs.length)return [];
let start=new Date(sch.start||'2026-07-22T00:00:00'),end=new Date(sch.end||'2027-06-19T00:00:00');if(isNaN(start)||isNaN(end))return [];
let out=[];for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1)){let day=d.getDay();rs.filter(x=>DAYS[x.day]===day).forEach(x=>out.push({date:new Date(d),jp:Number(x.jp||x.jam||2)||2,day:x.day}));}return out.sort((a,b)=>a.date-b.date)}
function render(){const host=$('perangkatSuperPanel')||document.querySelector('main')||document.body;if($('rpmSuperPanel'))return;let b=document.createElement('section');b.id='rpmSuperPanel';b.style.cssText='margin:18px 0;padding:18px;border:1px solid #dbe4f0;border-radius:18px;background:#fff';b.innerHTML='<h2>🧠 RPM DEEP LEARNING SUPER</h2><p>RPM otomatis per <b>tanggal nyata + JP nyata + TP</b>, bukan minggu generik.</p><button id="rpmBuild">⚡ Buat RPM dari Jadwal</button> <button id="rpmPrint">🖨️ Cetak</button><div id="rpmInfo" style="margin-top:12px"></div><div id="rpmOut" style="margin-top:14px"></div>';host.appendChild(b);$('rpmBuild').onclick=build;$('rpmPrint').onclick=()=>{if(!$('rpmOut').innerHTML)build();setTimeout(()=>window.print(),100)};['pkR','pkM','pkB'].forEach(id=>$(id)?.addEventListener('change',()=>{$('rpmOut').innerHTML=''}));}
function build(){const s=selected(),rs=rows(),tps=tp(),info=$('rpmInfo'),out=$('rpmOut');if(!rs.length){info.innerHTML='⚠️ Simpan Jadwal Pelajaran untuk '+esc(s.r)+' · '+esc(s.m)+' terlebih dahulu.';out.innerHTML='';return}let total=0,ti=0,html='';for(const x of rs){if(ti>=tps.length)ti=tps.length-1;let use=Math.min(x.jp,Math.max(0,(Number(read('guru_sd_jp_allocation_super_v1',{})?.totalJP)||999)-total));if(use<=0)break;let acts=ST[s.m]||ST.IPAS,step=acts[ti%acts.length];html+='<article class="rpmPage"><h3>RENCANA PEMBELAJARAN MENDALAM</h3><p><b>Tanggal:</b> '+esc(x.date.toLocaleDateString('id-ID',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}))+' · <b>JP:</b> '+use+' · <b>Kelas:</b> '+esc(s.r)+' · <b>Mapel:</b> '+esc(s.m)+'</p><p><b>Materi/BAB:</b> '+esc(s.b)+'</p><p><b>TP:</b> '+esc(tps[ti])+'</p><h4>Mindful</h4><p>Apersepsi, tujuan belajar, fokus, dan aktivasi pengetahuan awal.</p><h4>Meaningful</h4><p>'+esc(step)+', dikaitkan dengan konteks nyata dan pengalaman peserta didik.</p><h4>Joyful</h4><p>Aktivitas aktif, aman, kolaboratif, kreatif, dan menyenangkan sesuai karakter '+esc(s.m)+'.</p><h4>Kegiatan</h4><p><b>Awal:</b> orientasi dan motivasi.<br><b>Inti:</b> memahami → mengaplikasi → merefleksi.<br><b>Penutup:</b> kesimpulan, umpan balik, refleksi, tindak lanjut.</p><h4>Asesmen</h4><p>Observasi proses + bukti kerja/produk/unjuk kerja sesuai karakter mapel.</p><h4>Dimensi Profil Lulusan</h4><p>Dipilih adaptif dari katalog dan dapat disunting guru.</p></article>';total+=use;if(total>=Number(read('guru_sd_jp_allocation_super_v1',{})?.totalJP)||999)break;if(use>=2&&ti<tps.length-1)ti++;}
info.innerHTML='✅ '+html.match(/<article/g)?.length+' pertemuan RPM dibuat dari kalender nyata.';out.innerHTML=html;localStorage.setItem('guru_sd_rpm_super_v1',JSON.stringify({selected:s,html,totalJP:total,at:new Date().toISOString()}))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else setTimeout(render,200);})();