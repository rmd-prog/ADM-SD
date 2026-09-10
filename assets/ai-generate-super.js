/* GURU+ SD — AI GENERATE SUPER / ANTI-LIMIT
 * Local-first generator. AI is optional; generation never depends on quota.
 * No D1, Worker, assessment bridge, or OpenAI calls.
 */
(function(){
  'use strict';
  if(window.__AI_GENERATE_SUPER__) return;
  window.__AI_GENERATE_SUPER__=true;

  const KEY='guru_plus_sd_ai_super_v1';
  const ROMBELS=['IA','IB','IIA','IIB','IIIA','IIIB','IVA','IVB','V','VI'];
  const MAPEL=['Bahasa Indonesia','Pendidikan Pancasila','Matematika','IPAS','PJOK','Seni Rupa','Seni Musik','Seni Tari','Seni Teater','Bahasa Inggris','Pendidikan Agama dan Budi Pekerti'];
  const TYPES=[['rpm','RPM Deep Learning'],['prota','Program Tahunan'],['prosem','Program Semester'],['atp','ATP'],['tp','TP'],['cp','CP'],['lkpd','LKPD'],['asesmen','Asesmen per BAB']];
  const DPL=['Keimanan dan ketakwaan kepada Tuhan Yang Maha Esa','Kewargaan','Penalaran kritis','Kreativitas','Kolaborasi','Kemandirian','Kesehatan','Komunikasi'];
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const grade=r=>({IA:1,IB:1,IIA:2,IIB:2,IIIA:3,IIIB:3,IVA:4,IVB:4,V:5,VI:6}[String(r||'').toUpperCase()]||Number(r)||1);
  const fase=r=>grade(r)<=2?'A':grade(r)<=4?'B':'C';
  const units=(m,r)=>{
    const g=grade(r);
    const book={
      'Bahasa Indonesia':['Aku yang Unik','Buku Jendela Dunia','Ekspresi Diri Melalui Hobi','Belajar Berwirausaha','Menjadi Warga Dunia','Cinta Indonesia','Sayangi Bumi','Bergerak Bersama'],
      'IPAS':['Melihat karena Cahaya, Mendengar karena Bunyi','Harmoni dalam Ekosistem','Magnet, Listrik, dan Teknologi untuk Kehidupan','Ayo Berkenalan dengan Bumi Kita','Bagaimana Kita Hidup dan Bertumbuh','Indonesiaku Kaya Raya','Daerahku Kebanggaanku','Bumiku Sayang, Bumiku Malang'],
      'Matematika':['Bilangan Cacah Sampai 100.000','KPK dan FPB','Bilangan Pecahan','Keliling Bangun Datar','Luas Daerah Bangun Datar','Sudut','Membandingkan Ciri-Ciri Bangun Datar','Data','Bilangan Cacah Sampai 1.000.000'],
      'Pendidikan Pancasila':['Pancasila dalam Kehidupanku','Norma dalam Kehidupanku','Keragaman Budaya Indonesiaku','Aku dan Lingkungan Sekitarku']
    };
    if(g===5&&book[m]) return book[m];
    return ['Unit 1','Unit 2','Unit 3','Unit 4','Unit 5','Unit 6','Unit 7','Unit 8'];
  };
  function get(id){return document.getElementById(id)}
  function detect(){
    return {
      rombel:get('adsRombel')?.value||get('rombel')?.value||localStorage.getItem('rombel')||'V',
      mapel:get('adsMapel')?.value||get('mapel')?.value||localStorage.getItem('mapel')||'Bahasa Indonesia',
      material:get('adsMaterial')?.value||get('material')?.value||'Materi pembelajaran',
      jp:get('adsJP')?.value||get('jp')?.value||2,
      type:get('aiSuperType')?.value||'rpm',
      dpl:[...document.querySelectorAll('#aiSuperDpl input:checked')].map(x=>x.value)
    };
  }
  function html(d){
    const g=grade(d.rombel), f=fase(d.rombel), us=units(d.mapel,d.rombel);
    const type=TYPES.find(x=>x[0]===d.type)?.[1]||'Dokumen Pembelajaran';
    const chosen=d.dpl.length?d.dpl:DPL.slice(0,4);
    let body='';
    if(d.type==='rpm') body=`<h4>1. Identitas</h4><p>Kelas/Rombel: <b>${esc(d.rombel)}</b> • Fase <b>${f}</b> • Mapel: <b>${esc(d.mapel)}</b> • Alokasi: <b>${esc(d.jp)} JP</b></p><h4>2. Tujuan dan Materi</h4><p>Peserta didik memahami, mengaplikasikan, dan merefleksikan <b>${esc(d.material)}</b> melalui konteks kehidupan nyata.</p><h4>3. Dimensi Profil Lulusan</h4><ul>${chosen.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><h4>4. Pengalaman Belajar Mendalam</h4><ol><li><b>Memahami:</b> apersepsi, pertanyaan pemantik, pengamatan/contoh, dan penguatan konsep.</li><li><b>Mengaplikasi:</b> LKPD, diskusi, praktik atau pemecahan masalah kontekstual.</li><li><b>Merefleksi:</b> presentasi, umpan balik, refleksi diri, dan tindak lanjut.</li></ol><h4>5. Asesmen</h4><ul><li>Awal: cek kesiapan.</li><li>Proses: observasi, tanya jawab, LKPD, dan unjuk kerja.</li><li>Akhir: tugas/tes/produk sesuai tujuan.</li></ul>`;
    else if(d.type==='prota'||d.type==='prosem') body=`<h4>${type} • 2026/2027</h4><table><thead><tr><th>No</th><th>Materi/BAB</th><th>Semester</th><th>JP</th></tr></thead><tbody>${us.map((u,i)=>`<tr><td>${i+1}</td><td>${esc(u)}</td><td>${i<Math.ceil(us.length/2)?1:2}</td><td>${esc(d.jp)}</td></tr>`).join('')}</tbody></table>`;
    else if(d.type==='atp') body=`<h4>Alur Tujuan Pembelajaran</h4><table><thead><tr><th>No</th><th>Materi</th><th>Tujuan Pembelajaran</th><th>Asesmen</th></tr></thead><tbody>${us.map((u,i)=>`<tr><td>${i+1}</td><td>${esc(u)}</td><td>Peserta didik mampu memahami, menjelaskan, dan menerapkan konsep ${esc(u.toLowerCase())} sesuai konteks kelas ${g}.</td><td>Observasi, tugas, praktik/produk, dan tes sesuai tujuan.</td></tr>`).join('')}</tbody></table>`;
    else if(d.type==='tp') body=`<h4>Tujuan Pembelajaran</h4><ol><li>Peserta didik mampu menjelaskan konsep utama dari ${esc(d.material)}.</li><li>Peserta didik mampu menggunakan pengetahuan tersebut dalam situasi kontekstual.</li><li>Peserta didik mampu menunjukkan hasil belajar melalui tugas, praktik, atau produk.</li><li>Peserta didik mampu merefleksikan proses dan hasil belajarnya.</li></ol>`;
    else if(d.type==='cp') body=`<h4>Capaian Pembelajaran</h4><p>Pada akhir Fase ${f}, peserta didik diharapkan berkembang sesuai karakteristik mata pelajaran <b>${esc(d.mapel)}</b>, mampu memahami konsep dan informasi penting, menerapkannya pada konteks yang relevan, bernalar, berkomunikasi, serta merefleksikan proses dan hasil belajar.</p><p><i>Catatan: rumusan ini adalah template generator dan bukan pengganti teks CP resmi.</i></p>`;
    else if(d.type==='lkpd') body=`<h4>LKPD — ${esc(d.material)}</h4><p><b>Petunjuk:</b> baca informasi, lakukan kegiatan, diskusikan hasil, lalu tuliskan refleksi.</p><h4>A. Tujuan</h4><p>Peserta didik dapat memahami dan menerapkan ${esc(d.material)}.</p><h4>B. Aktivitas</h4><ol><li>Amati contoh/lingkungan sekitar.</li><li>Catat temuan penting.</li><li>Kerjakan tugas secara individu/kelompok.</li><li>Presentasikan hasil dan tanggapi umpan balik.</li></ol><h4>C. Refleksi</h4><p>Apa yang saya pahami? Apa yang masih sulit? Bagaimana saya akan memperbaikinya?</p>`;
    else body=`<h4>Asesmen per BAB</h4><table><thead><tr><th>No</th><th>Indikator</th><th>Bentuk</th><th>Bukti</th></tr></thead><tbody>${us.slice(0,6).map((u,i)=>`<tr><td>${i+1}</td><td>Peserta didik memahami dan menerapkan ${esc(u.toLowerCase())}.</td><td>Penugasan/tes/unjuk kerja</td><td>Hasil kerja dan catatan guru</td></tr>`).join('')}</tbody></table><p><b>Ketentuan:</b> generator ini tidak membuat STS; penilaian dapat dilanjutkan dengan ulangan jenjang semester dan akhir semester sesuai rancangan sekolah.</p>`;
    return `<div class="ais-doc"><div class="ais-badge">AI GENERATE SUPER • LOCAL MODE</div><h3>${type}</h3><p><b>Kelas:</b> ${esc(d.rombel)} • <b>Fase:</b> ${f} • <b>Mapel:</b> ${esc(d.mapel)}</p>${body}<p class="ais-foot">Mode Anti-Limit: dokumen dibuat lokal, sehingga tetap berjalan saat layanan AI/kuota tidak tersedia.</p></div>`;
  }
  function mount(){
    if(get('aiGenerateSuperPanel')) return;
    const candidates=['ai-generator','aiGenerator','menuAI','ai-generator-section'];
    let host=null; for(const id of candidates){if(get(id)){host=get(id);break}}
    if(!host){host=document.querySelector('main')||document.body}
    const box=document.createElement('section');box.id='aiGenerateSuperPanel';box.innerHTML=`<style>#aiGenerateSuperPanel{margin:16px 0;font-family:inherit}.ais-hero{padding:18px;border:1px solid #dbe4f0;border-radius:18px;background:linear-gradient(135deg,#f5f3ff,#fff,#ecfeff);box-shadow:0 12px 30px #0f172a12}.ais-top{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}.ais-k{font-size:10px;font-weight:900;letter-spacing:1.4px;color:#6d28d9}.ais-hero h3{margin:4px 0;font-size:21px}.ais-sub{font-size:12px;color:#64748b}.ais-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:12px}.ais-grid label{font-size:11px;font-weight:800;color:#475569}.ais-grid input,.ais-grid select{width:100%;box-sizing:border-box;padding:10px;border:1px solid #cbd5e1;border-radius:10px;background:#fff}.ais-full{grid-column:1/-1}.ais-checks{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:7px}.ais-checks label{padding:7px;border:1px solid #e2e8f0;border-radius:9px;background:#f8fafc}.ais-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:11px}.ais-btn{border:0;border-radius:10px;padding:10px 13px;font-weight:900;cursor:pointer}.ais-primary{background:#6d28d9;color:#fff}.ais-secondary{background:#ede9fe;color:#5b21b6}.ais-status{margin-top:9px;padding:9px;border-radius:9px;background:#ecfdf5;color:#166534;font-size:11px;font-weight:800}.ais-result{margin-top:12px;padding:15px;border:1px solid #dbe4f0;border-radius:15px;background:#fff;line-height:1.6}.ais-doc table{width:100%;border-collapse:collapse}.ais-doc th,.ais-doc td{border:1px solid #cbd5e1;padding:7px;font-size:11px;text-align:left;vertical-align:top}.ais-doc th{background:#f1f5f9}.ais-badge{display:inline-block;padding:5px 8px;border-radius:999px;background:#ede9fe;color:#5b21b6;font-size:9px;font-weight:900}.ais-foot{font-size:10px;color:#64748b;border-top:1px solid #e2e8f0;padding-top:8px}@media(max-width:650px){.ais-grid{grid-template-columns:1fr 1fr}}@media(max-width:430px){.ais-grid{grid-template-columns:1fr}}</style><div class="ais-hero"><div class="ais-top"><div><div class="ais-k">GURU+ SD • AI ENGINE</div><h3>AI Generate SUPER ⚡</h3><div class="ais-sub">Anti-Limit • Local-first • tetap jalan tanpa kuota AI</div></div><span class="ais-badge">● READY — LOCAL ENGINE</span></div><div class="ais-grid"><label>Jenis Dokumen<select id="aiSuperType">${TYPES.map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('')}</select></label><label>Kelas/Rombel<select id="aiSuperRombel">${ROMBELS.map(x=>`<option>${x}</option>`).join('')}</select></label><label>Mata Pelajaran<select id="aiSuperMapel">${MAPEL.map(x=>`<option>${x}</option>`).join('')}</select></label><label>Materi/BAB<input id="aiSuperMaterial" value="Materi pembelajaran"></label><label>Alokasi JP<input id="aiSuperJP" type="number" min="1" value="2"></label><div class="ais-full"><b style="font-size:11px">8 Dimensi Profil Lulusan</b><div id="aiSuperDpl" class="ais-checks">${DPL.map((x,i)=>`<label><input type="checkbox" value="${x}" ${i<4?'checked':''}> ${x}</label>`).join('')}</div></div></div><div class="ais-actions"><button class="ais-btn ais-primary" id="aiSuperGenerate">⚡ Generate SUPER</button><button class="ais-btn ais-secondary" id="aiSuperPrint">🖨️ Cetak</button><button class="ais-btn ais-secondary" id="aiSuperReset">↺ Reset</button></div><div id="aiSuperStatus" class="ais-status">Mesin lokal aktif. Tidak bergantung pada kuota AI.</div><div id="aiSuperResult" class="ais-result" style="display:none"></div></div></section>`;
    host.appendChild(box);
    const s=get('aiSuperStatus'), r=get('aiSuperResult');
    get('aiSuperGenerate').onclick=()=>{const d={rombel:get('aiSuperRombel').value,mapel:get('aiSuperMapel').value,material:get('aiSuperMaterial').value,jp:get('aiSuperJP').value,type:get('aiSuperType').value,dpl:[...document.querySelectorAll('#aiSuperDpl input:checked')].map(x=>x.value)};localStorage.setItem(KEY,JSON.stringify(d));s.textContent='⚡ Generate lokal selesai — mode Anti-Limit aktif.';r.innerHTML=html(d);r.style.display='block';r.scrollIntoView({behavior:'smooth',block:'start'})};
    get('aiSuperPrint').onclick=()=>{if(!r.innerHTML){get('aiSuperGenerate').click();setTimeout(()=>window.print(),100)}else window.print()};
    get('aiSuperReset').onclick=()=>{get('aiSuperMaterial').value='Materi pembelajaran';get('aiSuperJP').value=2;get('aiSuperType').value='rpm';s.textContent='↺ Form direset. Mesin lokal tetap siap.';r.style.display='none';r.innerHTML=''};
    try{const old=JSON.parse(localStorage.getItem(KEY)||'{}');if(old.rombel)get('aiSuperRombel').value=old.rombel;if(old.mapel)get('aiSuperMapel').value=old.mapel;if(old.material)get('aiSuperMaterial').value=old.material;if(old.jp)get('aiSuperJP').value=old.jp;if(old.type)get('aiSuperType').value=old.type}catch(e){}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount); else mount();
})();
