/* GURU+ SD — AI GENERATE SUPER SMART LAYER
 * Complete selectable Materi/BAB catalog for grades 1-6 and all supported subjects.
 * D1, Worker and assessment bridge are not touched.
 */
(function(){
  'use strict';
  if(window.__AI_SUPER_SMART__) return;
  window.__AI_SUPER_SMART__=true;

  const DPL=[
    'Keimanan dan ketakwaan kepada Tuhan Yang Maha Esa','Kewargaan','Penalaran kritis','Kreativitas',
    'Kolaborasi','Kemandirian','Kesehatan','Komunikasi'
  ];
  const ROMBELS=['IA','IB','IIA','IIB','IIIA','IIIB','IVA','IVB','V','VI'];
  const MAPEL=['Bahasa Indonesia','Pendidikan Pancasila','Matematika','IPAS','PJOK','Seni Rupa','Seni Musik','Seni Tari','Seni Teater','Bahasa Inggris','Pendidikan Agama dan Budi Pekerti'];

  // Catalog is intentionally local so Generate remains usable without AI quota.
  const BOOK={
    'Bahasa Indonesia':{
      1:['Aku yang Unik','Teman dan Keluargaku','Lingkungan Sekitarku','Cerita dan Pengalamanku','Kegemaranku','Bermain dan Belajar'],
      2:['Keluargaku Unik','Bermain dan Belajar','Hidup Bersih dan Sehat','Lingkunganku','Cerita di Sekitarku','Pengalaman Berkesan'],
      3:['Membaca dan Menemukan Informasi','Cerita dan Pesan','Ide Pokok','Menulis Pengalaman','Petunjuk dan Prosedur','Puisi dan Ungkapan'],
      4:['Aku dan Lingkunganku','Bertukar atau Membayar','Lihat Sekitar','Membaca dan Memirsa','Menulis dan Berbicara','Berita dan Informasi'],
      5:['Aku yang Unik','Buku Jendela Dunia','Ekspresi Diri Melalui Hobi','Belajar Berwirausaha','Menjadi Warga Dunia','Cinta Indonesia','Sayangi Bumi','Bergerak Bersama'],
      6:['Bangga Menjadi Anak Indonesia','Musisi Indonesia di Pentas Dunia','Taman Nasional dan Situs Warisan Dunia','Jeda untuk Iklim','Anak-Anak yang Mengubah Dunia','Berbicara dengan Santun']
    },
    'Matematika':{
      1:['Bilangan sampai 20','Penjumlahan dan Pengurangan','Bentuk dan Pola','Pengukuran Sederhana','Bangun Datar','Data Sederhana'],
      2:['Bilangan sampai 100','Penjumlahan dan Pengurangan','Perkalian dan Pembagian','Pecahan Sederhana','Pengukuran','Bangun Datar dan Ruang'],
      3:['Bilangan Cacah','Operasi Hitung','Pecahan','Pengukuran','Bangun Datar','Data dan Diagram'],
      4:['Bilangan Cacah Besar','Pecahan','Desimal dan Persen','Kelipatan dan Faktor','Bangun Datar','Data dan Diagram'],
      5:['Bilangan Cacah sampai 100.000','KPK dan FPB','Bilangan Pecahan','Keliling Bangun Datar','Luas Daerah Bangun Datar','Sudut','Membandingkan Ciri-Ciri Bangun Datar','Data','Bilangan Cacah sampai 1.000.000'],
      6:['Bilangan Bulat','Operasi Pecahan','Rasio dan Proporsi','Bangun Ruang','Lingkaran','Peluang dan Data','Kecepatan dan Debit','Koordinat dan Transformasi']
    },
    'IPAS':{
      1:['Aku dan Tubuhku','Benda di Sekitarku','Lingkungan Rumahku','Tumbuhan dan Hewan','Cuaca','Kebersihan Lingkungan'],
      2:['Hidup Bersama','Merawat Hewan dan Tumbuhan','Benda dan Sifatnya','Lingkungan Sekolah','Perubahan Cuaca','Kebutuhan Sehari-hari'],
      3:['Makhluk Hidup','Energi dan Perubahannya','Lingkungan dan Sumber Daya','Gaya dan Gerak','Cuaca dan Iklim','Bumi dan Antariksa'],
      4:['Tumbuhan dan Fotosintesis','Wujud Zat','Gaya di Sekitar Kita','Energi dan Perubahannya','Siklus Air','Keanekaragaman Hayati','Lingkungan dan Sumber Daya'],
      5:['Melihat karena Cahaya, Mendengar karena Bunyi','Harmoni dalam Ekosistem','Magnet, Listrik, dan Teknologi untuk Kehidupan','Ayo Berkenalan dengan Bumi Kita','Bagaimana Kita Hidup dan Bertumbuh','Indonesiaku Kaya Raya','Daerahku Kebanggaanku','Bumiku Sayang, Bumiku Malang'],
      6:['Energi dan Perubahannya','Sistem Organ Tubuh','Ekosistem','Bumi dan Tata Surya','Indonesia dan Dunia','Teknologi dan Masa Depan','Perubahan Lingkungan','Pelestarian Alam']
    },
    'Pendidikan Pancasila':{
      1:['Aku Mengenal Pancasila','Aku Anak yang Disiplin','Hidup Rukun','Aku dan Lingkunganku','Aturan di Rumah dan Sekolah'],
      2:['Pancasila dalam Kehidupanku','Aturan di Sekitarku','Keragaman di Sekitarku','Aku Peduli Lingkungan','Gotong Royong'],
      3:['Aku Anak Indonesia','Aturan dan Norma','Keragaman Indonesia','Hak dan Kewajiban','Musyawarah dan Gotong Royong'],
      4:['Pancasila sebagai Nilai Hidup','Konstitusi dan Aturan','Keragaman Budaya','Hak dan Kewajiban','Musyawarah dan Persatuan'],
      5:['Pancasila dalam Kehidupanku','Norma dalam Kehidupanku','Keragaman Budaya Indonesiaku','Aku dan Lingkungan Sekitarku','Musyawarah dan Gotong Royong'],
      6:['Pancasila dan Kehidupan Berbangsa','Norma dan Konstitusi','Bhinneka Tunggal Ika','Negara Kesatuan Republik Indonesia','Gotong Royong dan Musyawarah']
    },
    'PJOK':{
      1:['Gerak Dasar Lokomotor','Gerak Dasar Nonlokomotor','Gerak Dasar Manipulatif','Permainan dan Aktivitas Jasmani','Kebugaran Jasmani','Hidup Bersih dan Sehat'],
      2:['Gerak Lokomotor dan Nonlokomotor','Permainan Bola Sederhana','Aktivitas Senam','Aktivitas Ritmik','Kebugaran Jasmani','Pola Hidup Sehat'],
      3:['Variasi Gerak Dasar','Permainan Bola','Atletik Dasar','Senam Lantai','Aktivitas Ritmik','Kebugaran dan Kesehatan'],
      4:['Permainan Bola Besar','Permainan Bola Kecil','Atletik','Senam','Aktivitas Gerak Berirama','Kebugaran Jasmani','Pola Hidup Sehat'],
      5:['Permainan Bola Besar','Permainan Bola Kecil','Atletik dan Lari','Senam dan Gerak Berirama','Aktivitas Kebugaran','Kesehatan Diri dan Lingkungan'],
      6:['Permainan Bola','Atletik','Senam','Aktivitas Ritmik','Kebugaran Jasmani','Keselamatan dan Kesehatan','Pola Hidup Sehat']
    },
    'Seni Rupa':{
      1:['Garis dan Bentuk','Warna di Sekitarku','Menggambar Pengalaman','Membuat Kolase','Karya dari Bahan Alam','Pameran Karya Sederhana'],
      2:['Garis, Bentuk, dan Tekstur','Warna dan Komposisi','Menggambar Cerita','Kolase dan Montase','Karya Tiga Dimensi','Apresiasi Karya'],
      3:['Unsur Seni Rupa','Prinsip Komposisi','Menggambar Dekoratif','Membuat Poster','Karya Tiga Dimensi','Apresiasi Seni Rupa'],
      4:['Garis dan Bentuk','Warna dan Tekstur','Ilustrasi','Poster dan Tipografi','Karya Dekoratif','Karya Tiga Dimensi'],
      5:['Proporsi dan Komposisi','Ilustrasi dan Cerita Visual','Poster Persuasi','Motif Hias Nusantara','Karya Tiga Dimensi','Pameran dan Apresiasi'],
      6:['Eksplorasi Unsur Seni Rupa','Perspektif dan Proporsi','Ilustrasi dan Komik','Desain Poster','Karya Seni Nusantara','Pameran Seni dan Kritik Karya']
    },
    'Seni Musik':{
      1:['Bunyi di Sekitarku','Bernyanyi Bersama','Irama dan Tempo','Alat Musik Sederhana','Musik dan Gerak','Pertunjukan Musik'],
      2:['Bernyanyi dengan Ekspresi','Irama dan Pola Ketukan','Tempo dan Dinamika','Alat Musik Ritmis','Lagu Anak Nusantara','Pertunjukan Musik'],
      3:['Unsur Musik','Bernyanyi Unisono','Pola Irama','Alat Musik Tradisional','Lagu Daerah','Membuat Musik Sederhana'],
      4:['Notasi dan Irama','Melodi dan Harmoni','Tempo dan Dinamika','Lagu Nusantara','Alat Musik Tradisional','Pertunjukan Musik'],
      5:['Eksplorasi Bunyi','Melodi dan Ritme','Ekspresi dan Interpretasi','Lagu Daerah Indonesia','Musik Tradisional dan Modern','Kreasi Komposisi Sederhana'],
      6:['Musik Nusantara','Aransemen Sederhana','Ekspresi Vokal dan Instrumental','Musik Tradisi dan Identitas','Kreasi Musik','Pementasan dan Apresiasi']
    },
    'Seni Tari':{
      1:['Gerak Tubuh','Ruang dan Arah','Tempo Gerak','Meniru Gerak Alam','Gerak dan Musik','Tari Sederhana'],
      2:['Gerak Dasar Tari','Ruang dan Pola Lantai','Tempo dan Irama','Gerak Hewan dan Tumbuhan','Tari Daerah','Pertunjukan Tari'],
      3:['Unsur Tari','Level dan Arah Gerak','Pola Lantai','Ekspresi dalam Tari','Tari Tradisional','Kreasi Tari Sederhana'],
      4:['Ragam Gerak Tari','Pola Lantai','Ruang, Waktu, Tenaga','Tari Tradisional Nusantara','Kreasi Gerak','Pementasan Tari'],
      5:['Eksplorasi Gerak','Ruang dan Pola Lantai','Tenaga dan Dinamika','Tari Tradisional','Kreasi Tari Berkelompok','Pementasan dan Apresiasi'],
      6:['Komposisi Gerak','Pola Lantai dan Formasi','Karakter dan Ekspresi','Tari Nusantara','Koreografi Sederhana','Pementasan Tari']
    },
    'Seni Teater':{
      1:['Tubuh dan Suara','Ekspresi Wajah','Meniru Tokoh','Cerita Sederhana','Bermain Peran','Pementasan Mini'],
      2:['Olahraga Tubuh dan Vokal','Ekspresi dan Emosi','Tokoh dan Karakter','Dialog Sederhana','Bermain Peran','Pementasan'],
      3:['Dasar Akting','Tokoh dan Penokohan','Dialog dan Improvisasi','Cerita dan Naskah','Properti Panggung','Pementasan Drama'],
      4:['Olah Tubuh','Olah Vokal','Karakter dan Penokohan','Dialog','Naskah Drama','Pementasan Teater'],
      5:['Eksplorasi Peran','Karakter dan Konflik','Improvisasi','Naskah Teater','Tata Panggung','Pementasan dan Evaluasi'],
      6:['Teknik Akting','Penokohan Mendalam','Improvisasi dan Blocking','Penulisan Naskah','Produksi Pertunjukan','Pementasan dan Apresiasi']
    },
    'Bahasa Inggris':{
      1:['Greetings and Introductions','Myself and My Family','Numbers and Colors','Things Around Me','My Daily Activities','My School'],
      2:['Greetings and Feelings','My Family','My Classroom','Daily Activities','Food and Drinks','My House'],
      3:['Hello, My Friends','My Family and Friends','My Classroom','My Daily Routines','Food and Drinks','My Hobbies'],
      4:['My Friends and Family','My House','My Daily Activities','My Hobbies','Food and Drinks','My School'],
      5:['About Me','My Family and Friends','My Daily Life','My Hobbies','My Healthy Life','Places Around Me','Shopping and Money'],
      6:['Introducing Myself','Family and Community','Daily Routines','Hobbies and Experiences','Directions and Places','Healthy Lifestyle','Simple Information and Messages']
    },
    'Pendidikan Agama dan Budi Pekerti':{
      1:['Mengenal Tuhan dan Diri Sendiri','Kasih Sayang dan Kebaikan','Doa dan Ibadah','Hidup Bersih dan Sehat','Jujur dan Disiplin','Berbagi dan Menolong'],
      2:['Syukur kepada Tuhan','Ibadah dan Doa','Akhlak Terpuji','Hidup Rukun','Menjaga Kebersihan','Berbagi dengan Sesama'],
      3:['Keimanan dan Syukur','Ibadah dalam Kehidupan','Akhlak Terpuji','Kisah Teladan','Tanggung Jawab','Peduli Sesama'],
      4:['Iman dan Ketakwaan','Ibadah dan Pengamalannya','Akhlak Mulia','Kisah Teladan','Kerukunan dan Toleransi','Tanggung Jawab Sosial'],
      5:['Mengenal dan Menghayati Ajaran Agama','Ibadah dan Kehidupan Sehari-hari','Akhlak Terpuji','Kisah Teladan','Toleransi dan Kerukunan','Peduli Lingkungan dan Sesama'],
      6:['Keimanan dan Ketakwaan','Ibadah dan Pengamalan','Akhlak dalam Kehidupan','Kisah Teladan dan Keteladanan','Kerukunan dan Toleransi','Tanggung Jawab dan Kepedulian','Persiapan Menjadi Pribadi Dewasa']
    }
  };

  const fallback=['Unit 1','Unit 2','Unit 3','Unit 4','Unit 5','Unit 6','Unit 7','Unit 8'];
  const grade=r=>({IA:1,IB:1,IIA:2,IIB:2,IIIA:3,IIIB:3,IVA:4,IVB:4,V:5,VI:6}[String(r||'').toUpperCase()]||1);
  const $=id=>document.getElementById(id);
  function units(mapel,rombel){return (BOOK[mapel]&&BOOK[mapel][grade(rombel)])||fallback;}
  function key(text){return String(text||'').toLowerCase();}
  function autoDpl(mapel,material){
    const t=key(mapel+' '+material),score={}; DPL.forEach(x=>score[x]=0);
    const add=(name,n)=>score[name]+=n;
    if(/pancasila|norma|kewarg|budaya|keragaman|musyawarah|gotong|hak|kewajiban|indonesia/.test(t)){add(DPL[1],6);add(DPL[0],2);add(DPL[5],2);add(DPL[7],3);}
    if(/matematika|bilangan|pecahan|kpk|fpb|sudut|luas|keliling|data|diagram|rasio|peluang|debit|koordinat/.test(t)){add(DPL[2],6);add(DPL[3],3);add(DPL[5],2);add(DPL[7],2);}
    if(/ipas|cahaya|bunyi|ekosistem|magnet|listrik|bumi|tumbuhan|hewan|energi|sains|cuaca|lingkungan|organ/.test(t)){add(DPL[2],4);add(DPL[3],4);add(DPL[4],3);add(DPL[6],3);}
    if(/bahasa|membaca|menulis|cerita|puisi|informasi|berbicara|memirsa|komunikasi|hobi|buku|english|greetings|family/.test(t)){add(DPL[7],6);add(DPL[2],3);add(DPL[3],3);add(DPL[4],2);}
    if(/pjok|olahraga|gerak|kesehatan|tubuh|senam|permainan|kebugaran/.test(t)){add(DPL[6],7);add(DPL[5],3);add(DPL[4],3);}
    if(/seni|musik|tari|teater|rupa|gambar|lukis|karya|kreasi|akting|pementasan/.test(t)){add(DPL[3],7);add(DPL[7],3);add(DPL[4],3);add(DPL[5],2);}
    if(/agama|iman|tuhan|akhlak|ibadah|budi pekerti|doa|syukur|teladan/.test(t)){add(DPL[0],8);add(DPL[5],3);add(DPL[7],2);}
    if(/kelompok|kolaborasi|diskusi|proyek|praktik|presentasi|berkelompok/.test(t)){add(DPL[4],4);add(DPL[7],3);}
    if(/mandiri|refleksi|diri sendiri/.test(t)){add(DPL[5],4);}
    return DPL.map((x,i)=>[x,score[x],i]).sort((a,b)=>b[1]-a[1]||a[2]-b[2]).slice(0,4).map(x=>x[0]);
  }
  function setDpl(material,mapel){
    const wanted=new Set(autoDpl(mapel,material));
    document.querySelectorAll('#aiSuperDpl input').forEach(cb=>cb.checked=wanted.has(cb.value));
    const status=$('aiSuperStatus'); if(status) status.textContent='⚡ DPL otomatis disesuaikan dengan materi — tetap bisa diedit manual.';
  }
  function rebuild(){
    const r=$('aiSuperRombel'),m=$('aiSuperMapel'),mat=$('aiSuperMaterial'); if(!r||!m||!mat)return;
    const old=mat.value;
    if(mat.tagName.toLowerCase()!=='select'){
      const s=document.createElement('select'); s.id='aiSuperMaterial'; s.title='Pilih Materi/BAB'; mat.parentNode.replaceChild(s,mat);
    }
    const sel=$('aiSuperMaterial'),list=units(m.value,r.value);
    sel.innerHTML='<option value="">Pilih Materi/BAB...</option>'+list.map(x=>'<option>'+x+'</option>').join('');
    if(list.includes(old))sel.value=old;
    sel.onchange=()=>setDpl(sel.value,m.value);
    setDpl(sel.value||list[0],m.value);
  }
  function mount(){
    const panel=$('aiGenerateSuperPanel'); if(!panel)return false;
    const r=$('aiSuperRombel'),m=$('aiSuperMapel'); if(!r||!m)return false;
    rebuild();
    r.onchange=rebuild; m.onchange=rebuild;
    return true;
  }
  let tries=0;const timer=setInterval(()=>{if(mount()||++tries>80)clearInterval(timer)},250);
})();