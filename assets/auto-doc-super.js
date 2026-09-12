/*
 * SIAP GURU — AUTO DOC SUPER
 * Template-first document builder. AI is optional and never required.
 * Target: Kurikulum Merdeka / Pembelajaran Mendalam 2026/2027.
 *
 * IMPORTANT:
 * - Does not call OpenAI.
 * - Does not touch D1 or the Worker.
 * - Keeps document state in localStorage until the app persistence layer is wired.
 * - Designed to be loaded by index.html after the existing application code.
 */
(function(){
  'use strict';
  if(window.__AUTO_DOC_SUPER__) return;
  window.__AUTO_DOC_SUPER__=true;

  const KEY='guru_plus_sd_auto_doc_super_v1';
  const ROMBELS=['IA','IB','IIA','IIB','IIIA','IIIB','IVA','IVB','V','VI'];
  const MAPEL=['Bahasa Indonesia','Pendidikan Pancasila','Matematika','IPAS','PJOK','Seni Rupa','Seni Musik','Seni Tari','Seni Teater','Bahasa Inggris','Pendidikan Agama dan Budi Pekerti'];
  const DPL=[
    ['keimanan','Keimanan dan ketakwaan kepada Tuhan Yang Maha Esa'],
    ['kewargaan','Kewargaan'],
    ['penalaran','Penalaran kritis'],
    ['kreativitas','Kreativitas'],
    ['kolaborasi','Kolaborasi'],
    ['kemandirian','Kemandirian'],
    ['kesehatan','Kesehatan'],
    ['komunikasi','Komunikasi']
  ];
  const MODELS=['Problem Based Learning','Project Based Learning','Discovery Learning','Inquiry Learning','Cooperative Learning','Contextual Teaching and Learning','Direct Instruction','Pembelajaran Berbasis Masalah Kontekstual'];
  const METHODS=['Diskusi','Tanya jawab','Demonstrasi','Eksperimen','Observasi','Praktik','Presentasi','Simulasi','Permainan edukatif','Penugasan'];

  const state=load();
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
  function save(){localStorage.setItem(KEY,JSON.stringify(state))}
  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function el(id){return document.getElementById(id)}
  function grade(r){return ({IA:1,IB:1,IIA:2,IIB:2,IIIA:3,IIIB:3,IVA:4,IVB:4,V:5,VI:6}[String(r||'').toUpperCase()]||Number(r)||0)}
  function fase(r){const g=grade(r);return g<=2?'A':g<=4?'B':'C'}
  function titleCase(s){return String(s||'').replace(/_/g,' ').replace(/\b\w/g,x=>x.toUpperCase())}

  const css=`
  #autoDocSuper{margin:14px 0 18px}
  #autoDocSuper .ads-hero{background:linear-gradient(135deg,#eef2ff,#fff 55%,#ecfeff);border:1px solid #dbeafe;border-radius:20px;padding:18px;box-shadow:0 14px 35px #1e3a8a12}
  #autoDocSuper .ads-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}
  #autoDocSuper .ads-kicker{font-size:10px;font-weight:900;letter-spacing:1.5px;color:#4f46e5}
  #autoDocSuper h3{margin:3px 0;font-size:22px}
  #autoDocSuper .ads-sub{color:#64748b;font-size:12px;line-height:1.5}
  #autoDocSuper .ads-pill{display:inline-flex;align-items:center;gap:5px;padding:7px 10px;border-radius:999px;background:#fff;border:1px solid #dbe4f0;font-size:11px;font-weight:800;color:#334155}
  #autoDocSuper .ads-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px}
  #autoDocSuper label{font-size:12px;margin:0 0 5px;color:#475569;font-weight:800}
  #autoDocSuper input,#autoDocSuper select,#autoDocSuper textarea{width:100%;padding:10px 11px;border:1px solid #cbd5e1;border-radius:11px;background:#fff;box-sizing:border-box}
  #autoDocSuper textarea{min-height:90px;resize:vertical}
  #autoDocSuper .ads-full{grid-column:1/-1}
  #autoDocSuper .ads-section{margin-top:12px;padding:12px;border:1px solid #e2e8f0;border-radius:15px;background:#fff}
  #autoDocSuper .ads-section-title{font-weight:900;font-size:13px;margin-bottom:9px}
  #autoDocSuper .ads-checks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
  #autoDocSuper .ads-check{display:flex;gap:7px;align-items:flex-start;padding:8px 9px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;font-size:11px;line-height:1.35}
  #autoDocSuper .ads-check input{width:auto;margin-top:2px}
  #autoDocSuper .ads-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
  #autoDocSuper .ads-btn{border:0;border-radius:11px;padding:10px 13px;font-weight:900;cursor:pointer}
  #autoDocSuper .ads-primary{color:#fff;background:linear-gradient(135deg,#4f46e5,#7c3aed)}
  #autoDocSuper .ads-secondary{color:#3730a3;background:#eef2ff}
  #autoDocSuper .ads-status{display:none;margin-top:9px;padding:9px 11px;border-radius:10px;font-size:12px;font-weight:800;background:#ecfdf5;color:#166534}
  #autoDocSuper .ads-status.show{display:block}
  #autoDocSuper .ads-result{margin-top:12px;background:#fff;border:1px solid #dbe4f0;border-radius:16px;padding:15px;line-height:1.6}
  #autoDocSuper .ads-result h4{margin:14px 0 7px;padding-bottom:6px;border-bottom:2px solid #e2e8f0;font-size:14px}
  #autoDocSuper .ads-result table{width:100%;border-collapse:collapse;margin:8px 0}
  #autoDocSuper .ads-result th,#autoDocSuper .ads-result td{border:1px solid #cbd5e1;padding:7px;text-align:left;vertical-align:top;font-size:12px}
  #autoDocSuper .ads-result th{background:#f1f5f9}
  #autoDocSuper .ads-lock{padding:9px 11px;border-radius:10px;background:#eff6ff;border:1px solid #bfdbfe;font-size:11px;margin-bottom:10px}
  @media(max-width:700px){#autoDocSuper .ads-grid{grid-template-columns:1fr 1fr}#autoDocSuper .ads-checks{grid-template-columns:1fr}}
  @media(max-width:450px){#autoDocSuper .ads-grid{grid-template-columns:1fr}#autoDocSuper h3{font-size:19px}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);

  function units(mapel,rombel){
    const g=grade(rombel);
    const book={
      'Bahasa Indonesia':{5:['Aku yang Unik','Buku Jendela Dunia','Ekspresi Diri Melalui Hobi','Belajar Berwirausaha','Menjadi Warga Dunia','Cinta Indonesia','Sayangi Bumi','Bergerak Bersama']},
      'IPAS':{5:['Melihat karena Cahaya, Mendengar karena Bunyi','Harmoni dalam Ekosistem','Magnet, Listrik, dan Teknologi untuk Kehidupan','Ayo Berkenalan dengan Bumi Kita','Bagaimana Kita Hidup dan Bertumbuh','Indonesiaku Kaya Raya','Daerahku Kebanggaanku','Bumiku Sayang, Bumiku Malang']},
      'Matematika':{5:['Bilangan Cacah Sampai 100.000','KPK dan FPB','Bilangan Pecahan','Keliling Bangun Datar','Luas Daerah Bangun Datar','Sudut','Membandingkan Ciri-Ciri Bangun Datar','Data','Bilangan Cacah Sampai 1.000.000']},
      'Pendidikan Pancasila':{5:['Pancasila dalam Kehidupanku','Norma dalam Kehidupanku','Keragaman Budaya Indonesiaku','Aku dan Lingkungan Sekitarku']}
    };
    if(book[mapel]?.[g]) return book[mapel][g];
    const generic={
      'Bahasa Indonesia':['Aku dan Lingkunganku','Cerita dan Pengalaman','Informasi di Sekitar Kita','Kegemaranku','Hidup Bersih dan Sehat','Bermain dan Bekerja Sama','Lingkungan dan Alam','Karya dan Ekspresi'],
      'Pendidikan Pancasila':['Aku dan Identitasku','Aturan dan Kesepakatan','Hak dan Kewajiban','Kebinekaan Indonesia','Gotong Royong','Pancasila dalam Kehidupan','Musyawarah dan Tanggung Jawab','Menjadi Warga Sekolah yang Baik'],
      'Matematika':['Bilangan dan Nilai Tempat','Penjumlahan dan Pengurangan','Perkalian dan Pembagian','Pecahan dan Desimal','Pengukuran','Bangun Datar dan Bangun Ruang','Pola dan Aljabar Awal','Data dan Pemecahan Masalah'],
      'IPAS':['Makhluk Hidup dan Lingkungannya','Benda dan Perubahannya','Gaya dan Gerak','Energi dalam Kehidupan','Bumi dan Cuaca','Lingkungan dan Sumber Daya','Masyarakat dan Budaya','Kegiatan Ekonomi di Sekitar Kita'],
      'PJOK':['Gerak Lokomotor dan Nonlokomotor','Manipulasi Gerak','Permainan dan Olahraga','Aktivitas Kebugaran','Senam dan Aktivitas Ritmik','Aktivitas Air dan Keselamatan','Hidup Sehat','Sportivitas dan Gaya Hidup Aktif'],
      'Seni Rupa':['Garis, Bentuk, dan Warna','Tekstur dan Pola','Menggambar dari Pengamatan','Kolase dan Karya Dua Dimensi','Karya Tiga Dimensi','Kriya dan Bahan Sekitar','Apresiasi Karya','Pameran dan Refleksi Karya'],
      'Seni Musik':['Bunyi dan Sumber Bunyi','Irama dan Ketukan','Melodi dan Lagu','Bernyanyi Bersama','Alat Musik Sederhana','Musik Tradisional','Ekspresi dan Pertunjukan','Apresiasi dan Refleksi Musik'],
      'Seni Tari':['Tubuh dan Gerak','Ruang dan Arah','Waktu dan Irama','Tenaga dan Ekspresi','Rangkaian Gerak','Tari Tradisi Daerah','Kreasi Tari Sederhana','Pementasan dan Apresiasi'],
      'Seni Teater':['Tubuh dan Ekspresi','Suara dan Artikulasi','Tokoh dan Karakter','Dialog dan Improvisasi','Cerita dan Adegan','Kerja Kelompok Pementasan','Pementasan Mini','Apresiasi dan Refleksi'],
      'Bahasa Inggris':['Greetings and Classroom Language','Myself and My Family','Numbers, Things, and Colors','Daily Activities','Food and Drinks','My Home and Neighborhood','Hobbies and Experiences','Simple Information and Presentation'],
      'Pendidikan Agama dan Budi Pekerti':['Aku Bersyukur','Aku Beribadah','Aku Berakhlak Baik','Aku Meneladani Tokoh','Aku Peduli Sesama','Aku Menjaga Lingkungan','Aku Bertanggung Jawab','Aku Merefleksikan Perbuatanku']
    };
    return generic[mapel]||['Unit 1','Unit 2','Unit 3','Unit 4','Unit 5','Unit 6','Unit 7','Unit 8'];
  }

  function makeOptions(arr,selected){return arr.map(x=>`<option value="${esc(x)}" ${String(x)===String(selected)?'selected':''}>${esc(x)}</option>`).join('')}
  function template(type,d){
    const f=fase(d.rombel), g=grade(d.rombel), jp=Math.max(1,Number(d.jp)||2);
    const dpl=d.dpl.map(x=>DPL.find(a=>a[0]===x)?.[1]).filter(Boolean);
    const material=d.material||'Materi pembelajaran';
    const ctx=d.context||'konteks kehidupan sehari-hari peserta didik';
    const model=d.model||'Problem Based Learning';
    const methods=d.methods.length?d.methods:['Diskusi','Tanya jawab','Praktik'];
    if(type==='rpm'){
      return `<h4>A. Identifikasi</h4><p><b>Materi:</b> ${esc(material)}<br><b>Kelas:</b> ${esc(d.rombel)} • <b>Fase:</b> ${f}<br><b>Alokasi:</b> ${jp} JP<br><b>Konteks:</b> ${esc(ctx)}</p>
      <h4>B. Dimensi Profil Lulusan</h4><ul>${dpl.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
      <h4>C. Desain Pembelajaran</h4><p><b>Model:</b> ${esc(model)}<br><b>Metode:</b> ${esc(methods.join(', '))}<br><b>Media:</b> ${esc(d.media||'Buku teks, LKPD, lingkungan sekitar, dan media digital bila tersedia')}<br><b>Lingkungan:</b> Kelas yang aman, inklusif, kolaboratif, dan memberi ruang bertanya serta mencoba.</p>
      <h4>D. Pengalaman Belajar Mendalam</h4><ol><li><b>Memahami:</b> apersepsi, pengalaman awal, pertanyaan pemantik, pengamatan/contoh, dan penguatan konsep.</li><li><b>Mengaplikasi:</b> peserta didik mengerjakan tugas/LKPD, berdiskusi, mempraktikkan atau memecahkan masalah kontekstual menggunakan ${esc(material)}.</li><li><b>Merefleksi:</b> presentasi/unjuk kerja, umpan balik, refleksi diri, dan rencana perbaikan.</li></ol>
      <h4>E. Asesmen</h4><ul><li>Awal: pertanyaan/aktivitas singkat untuk memetakan kesiapan.</li><li>Proses: observasi, tanya jawab, LKPD, cek pemahaman, dan unjuk kerja.</li><li>Akhir: tes/tugas produk/kinerja sesuai tujuan.</li></ul>
      <h4>F. Diferensiasi</h4><p>Konten, proses, dan produk disesuaikan dengan kesiapan, minat, serta kebutuhan dukungan peserta didik. Sediakan remedial dan pengayaan.</p>
      <h4>G. Refleksi Guru</h4><p>Apakah tujuan tercapai? Bukti belajar apa yang terlihat? Siapa yang memerlukan dukungan? Aktivitas apa yang paling bermakna? Apa perbaikan berikutnya?</p>`;
    }
    if(type==='prota'){
      const u=units(d.mapel,d.rombel),half=Math.ceil(u.length/2);
      return `<h4>Program Tahunan • Tahun Pelajaran 2026/2027</h4><table><thead><tr><th>No</th><th>Unit/Materi</th><th>Semester</th><th>Rencana JP</th><th>Asesmen</th></tr></thead><tbody>${u.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x)}</td><td>${i<half?1:2}</td><td>Disesuaikan kalender & struktur kurikulum</td><td>Diagnostik • Formatif • Sumatif</td></tr>`).join('')}</tbody></table><p><b>Catatan:</b> alokasi waktu final wajib diselaraskan dengan minggu efektif dan kalender pendidikan satuan pendidikan.</p>`;
    }
    if(type==='prosem'){
      const u=units(d.mapel,d.rombel),half=Math.ceil(u.length/2);
      const rows=(arr,sem,offset)=>arr.map((x,i)=>`<tr><td>${i+1}</td><td>Semester ${sem}</td><td>${offset+i*2+1}–${offset+i*2+2}</td><td>${esc(x)}</td><td>Disesuaikan</td><td>Formatif • Refleksi</td></tr>`).join('');
      return `<h4>Program Semester • Tahun Pelajaran 2026/2027</h4><table><thead><tr><th>No</th><th>Semester</th><th>Perkiraan Minggu</th><th>Unit/Materi</th><th>JP</th><th>Asesmen</th></tr></thead><tbody>${rows(u.slice(0,half),1,1)+rows(u.slice(half),2,1+half*2)}</tbody></table><p><b>Catatan:</b> minggu dan JP adalah rancangan awal, bukan kalender baku.</p>`;
    }
    if(type==='atp'){
      const u=units(d.mapel,d.rombel);
      return `<h4>Alur Tujuan Pembelajaran • Fase ${f}</h4><table><thead><tr><th>No</th><th>Unit/Materi</th><th>Tujuan Pembelajaran</th><th>Bukti Asesmen</th></tr></thead><tbody>${u.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x)}</td><td>Peserta didik mampu memahami konsep utama, menerapkannya pada situasi kontekstual, mengomunikasikan hasil, dan merefleksikan proses belajar.</td><td>LKPD • Observasi • Produk/Kinerja • Refleksi</td></tr>`).join('')}</tbody></table>`;
    }
    if(type==='tp'){
      const u=units(d.mapel,d.rombel);
      return `<h4>Tujuan Pembelajaran • Fase ${f}</h4><ol>${u.map(x=>`<li>Setelah mempelajari <b>${esc(x)}</b>, peserta didik mampu menjelaskan konsep/keterampilan utama dengan benar.</li><li>Peserta didik mampu menerapkan <b>${esc(x)}</b> pada ${esc(ctx)} melalui tugas atau praktik yang sesuai.</li><li>Peserta didik mampu mengomunikasikan hasil dan melakukan refleksi.</li>`).join('')}</ol>`;
    }
    if(type==='cp'){
      return `<h4>Capaian Pembelajaran • Fase ${f}</h4><p>Pada akhir Fase ${f}, peserta didik mengembangkan pemahaman dan keterampilan inti pada mata pelajaran <b>${esc(d.mapel)}</b>, mampu menggunakan pengetahuan dalam konteks nyata, mengomunikasikan gagasan, bekerja sama, bernalar kritis, dan merefleksikan proses serta hasil belajar.</p><p><b>Acuan:</b> CP resmi dan regulasi kurikulum yang berlaku. Rumusan kerja ini bukan pengganti teks CP resmi.</p>`;
    }
    return `<h4>${esc(titleCase(type))}</h4><p>Dokumen untuk materi <b>${esc(material)}</b>, kelas ${esc(d.rombel)}, fase ${f}, mata pelajaran ${esc(d.mapel)}.</p><h4>Tujuan</h4><p>Peserta didik memahami, mengaplikasikan, mengomunikasikan, dan merefleksikan pembelajaran secara berkesadaran, bermakna, dan menggembirakan.</p>`;
  }

  function render(type){
    const root=el('autoDocSuper'); if(!root)return;
    const d=readForm();
    const key=type+'|'+d.rombel+'|'+d.mapel+'|'+(d.bab||'');
    state.documents=state.documents||{};
    const html=template(type,d);
    state.documents[key]={...d,type,html,updatedAt:new Date().toISOString()};save();
    const result=el('adsResult');
    result.innerHTML=`<div class="ads-lock"><b>⚡ Auto Generate — tanpa AI</b><br>Dokumen disusun dari template terstruktur. Tidak menggunakan kuota OpenAI.</div>${html}`;
    const status=el('adsStatus');status.textContent='✅ '+label(type)+' berhasil disusun otomatis dan tersimpan di browser.';status.classList.add('show');
  }
  function label(type){return ({cp:'CP',tp:'TP',atp:'ATP',prota:'PROTA',prosem:'PROSEM',rpm:'RPM'})[type]||type}
  function readForm(){
    const d={type:el('adsType').value,rombel:el('adsClass').value,mapel:el('adsMapel').value,material:el('adsMaterial').value.trim(),jp:Number(el('adsJP').value||2),bab:el('adsBab').value,model:el('adsModel').value,media:el('adsMedia').value.trim(),context:el('adsContext').value.trim(),dpl:[...document.querySelectorAll('#autoDocSuper input[name="adsDpl"]:checked')].map(x=>x.value),methods:[...document.querySelectorAll('#autoDocSuper input[name="adsMethod"]:checked')].map(x=>x.value)};
    return d;
  }
  function syncUnits(){
    const m=el('adsMapel').value,r=el('adsClass').value,u=units(m,r);el('adsBab').innerHTML=u.map((x,i)=>`<option value="${esc(i)}">BAB ${i+1} — ${esc(x)}</option>`).join('');
    if(!el('adsMaterial').value)el('adsMaterial').value=u[0]||'';
  }
  function build(){
    if(el('autoDocSuper')) return;
    const host=el('aiGenerate'); if(!host)return;
    const wrap=document.createElement('div');wrap.id='autoDocSuper';
    wrap.innerHTML=`<div class="ads-hero">
      <div class="ads-head"><div><div class="ads-kicker">AUTO DOCUMENT ENGINE • AI OPTIONAL</div><h3>⚡ GURU+ AUTO — Perangkat Pembelajaran</h3><div class="ads-sub">Guru cukup memilih kebutuhan. Sistem menyusun dokumen otomatis tanpa memanggil AI. AI hanya dipakai nanti sebagai <b>AI Assist</b> untuk membantu bagian tertentu.</div></div><span class="ads-pill">🟢 Unlimited • Template-first</span></div>
      <div class="ads-grid">
        <div><label>Jenis Dokumen</label><select id="adsType">${makeOptions(['rpm','prota','prosem','atp','tp','cp'],'rpm')}</select></div>
        <div><label>Kelas / Rombel</label><select id="adsClass">${makeOptions(ROMBELS,window.currentTeacher?.rombel||'IA')}</select></div>
        <div><label>Mata Pelajaran</label><select id="adsMapel">${makeOptions(MAPEL,'Bahasa Indonesia')}</select></div>
        <div><label>Materi / Topik</label><input id="adsMaterial" placeholder="Contoh: Gaya dan Gerak"></div>
        <div><label>Alokasi Waktu (JP)</label><input id="adsJP" type="number" min="1" max="40" value="2"></div>
        <div><label>BAB / Unit</label><select id="adsBab"></select></div>
        <div id="adsRpmOnly" class="ads-full">
          <div class="ads-section"><div class="ads-section-title">🎯 8 Dimensi Profil Lulusan</div><div class="ads-checks">${DPL.map(x=>`<label class="ads-check"><input type="checkbox" name="adsDpl" value="${x[0]}"> <span>${esc(x[1])}</span></label>`).join('')}</div></div>
          <div class="ads-section"><div class="ads-section-title">🧠 Model Pembelajaran</div><select id="adsModel">${makeOptions(MODELS,'Problem Based Learning')}</select></div>
          <div class="ads-section"><div class="ads-section-title">🛠️ Metode</div><div class="ads-checks">${METHODS.map((x,i)=>`<label class="ads-check"><input type="checkbox" name="adsMethod" value="${esc(x)}" ${i<3?'checked':''}> <span>${esc(x)}</span></label>`).join('')}</div></div>
          <div class="ads-grid" style="margin-top:10px"><div><label>Media / Sumber</label><input id="adsMedia" placeholder="Buku, LKPD, lingkungan, video, alat praktik..."></div><div><label>Konteks Tambahan</label><input id="adsContext" placeholder="Konteks kehidupan nyata peserta didik..."></div></div>
        </div>
      </div>
      <div class="ads-actions"><button class="ads-btn ads-primary" id="adsBuild">⚡ SUSUN OTOMATIS</button><button class="ads-btn ads-secondary" id="adsSave">💾 SIMPAN</button><button class="ads-btn ads-secondary" id="adsPrint">🖨 CETAK</button><button class="ads-btn ads-secondary" id="adsReset">↺ RESET</button></div>
      <div id="adsStatus" class="ads-status"></div>
    </div><div id="adsResult" class="ads-result"><div style="color:#64748b">Pilih jenis dokumen lalu tekan <b>SUSUN OTOMATIS</b>. Tidak ada panggilan AI.</div></div>`;
    host.prepend(wrap);
    el('adsClass').addEventListener('change',syncUnits);el('adsMapel').addEventListener('change',syncUnits);el('adsType').addEventListener('change',()=>{el('adsRpmOnly').style.display=el('adsType').value==='rpm'?'block':'block';syncUnits()});
    el('adsBuild').onclick=()=>render(el('adsType').value);
    el('adsSave').onclick=()=>{render(el('adsType').value);alert('Dokumen tersimpan di perangkat ini.')};
    el('adsReset').onclick=()=>{el('adsMaterial').value='';el('adsContext').value='';el('adsMedia').value='';syncUnits();el('adsStatus').classList.remove('show')};
    el('adsPrint').onclick=()=>{const w=window.open('','_blank');if(!w){alert('Izinkan pop-up untuk mencetak.');return}w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>GURU+ AUTO</title><style>body{font-family:Arial,sans-serif;margin:25px;color:#172033}h4{border-bottom:2px solid #e2e8f0;padding-bottom:6px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #cbd5e1;padding:7px;vertical-align:top}th{background:#f1f5f9}</style></head><body>'+el('adsResult').innerHTML+'</body></html>');w.document.close();w.focus();setTimeout(()=>w.print(),400)};
    syncUnits();
  }

  function boot(){build()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0),{once:true});else setTimeout(boot,0);
  window.AutoDocSuper={build,render,template,units,state};
})();
