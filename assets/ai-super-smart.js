/* GURU+ SD — AI GENERATE SUPER SMART LAYER
 * Enhances the existing AI Generate SUPER panel without touching D1/Worker.
 * Material/BAB becomes selectable and 8 DPL are auto-selected from context.
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
  const BOOK={
    'Bahasa Indonesia':{
      1:['Aku yang Unik','Teman dan Keluargaku','Lingkungan Sekitarku','Cerita dan Pengalamanku','Kegemaranku','Bermain dan Belajar'],
      2:['Aku dan Teman-Temanku','Kegiatan Sehari-hari','Hidup Bersih dan Sehat','Cerita di Sekitarku','Lingkungan dan Alam','Pengalaman Berkesan'],
      3:['Membaca dan Menemukan Informasi','Cerita dan Pesan','Ide Pokok','Menulis Pengalaman','Petunjuk dan Prosedur','Puisi dan Ungkapan'],
      4:['Aku dan Lingkunganku','Bertukar atau Membayar','Lihat Sekitar','Membaca dan Memirsa','Bertukar atau Membayar','Menulis dan Berbicara'],
      5:['Aku yang Unik','Buku Jendela Dunia','Ekspresi Diri Melalui Hobi','Belajar Berwirausaha','Menjadi Warga Dunia','Cinta Indonesia','Sayangi Bumi','Bergerak Bersama'],
      6:['Bangga Menjadi Anak Indonesia','Musisi Indonesia di Pentas Dunia','Taman Nasional dan Situs Warisan Dunia','Jeda untuk Iklim','Anak-Anak yang Mengubah Dunia','Berbicara dengan Santun']
    },
    'Matematika':{
      1:['Bilangan sampai 20','Penjumlahan dan Pengurangan','Bentuk dan Pola','Pengukuran Sederhana','Bangun Datar','Data Sederhana'],
      2:['Bilangan sampai 100','Penjumlahan dan Pengurangan','Perkalian dan Pembagian','Pecahan Sederhana','Pengukuran','Bangun Datar dan Ruang'],
      3:['Bilangan Cacah','Operasi Hitung','Pecahan','Pengukuran','Bangun Datar','Data dan Diagram'],
      4:['Bilangan Cacah Besar','Pecahan','Desimal dan Persen','Kelipatan dan Faktor','Bangun Datar','Data dan Diagram'],
      5:['Bilangan Cacah Sampai 100.000','KPK dan FPB','Bilangan Pecahan','Keliling Bangun Datar','Luas Daerah Bangun Datar','Sudut','Membandingkan Ciri-Ciri Bangun Datar','Data','Bilangan Cacah Sampai 1.000.000'],
      6:['Bilangan Bulat','Operasi Pecahan','Rasio dan Proporsi','Bangun Ruang','Lingkaran','Peluang dan Data']
    },
    'IPAS':{
      1:['Aku dan Tubuhku','Benda di Sekitarku','Lingkungan Rumahku','Tumbuhan dan Hewan','Cuaca','Kebersihan Lingkungan'],
      2:['Hidup Bersama','Merawat Hewan dan Tumbuhan','Benda dan Sifatnya','Lingkungan Sekolah','Perubahan Cuaca','Kebutuhan Sehari-hari'],
      3:['Makhluk Hidup','Energi dan Perubahannya','Lingkungan dan Sumber Daya','Gaya dan Gerak','Cuaca dan Iklim','Bumi dan Antariksa'],
      4:['Tumbuhan dan Fotosintesis','Wujud Zat','Gaya di Sekitar Kita','Energi dan Perubahannya','Siklus Air','Keanekaragaman Hayati'],
      5:['Melihat karena Cahaya, Mendengar karena Bunyi','Harmoni dalam Ekosistem','Magnet, Listrik, dan Teknologi untuk Kehidupan','Ayo Berkenalan dengan Bumi Kita','Bagaimana Kita Hidup dan Bertumbuh','Indonesiaku Kaya Raya','Daerahku Kebanggaanku','Bumiku Sayang, Bumiku Malang'],
      6:['Energi dan Perubahan','Sistem Organ Tubuh','Ekosistem','Bumi dan Tata Surya','Indonesia dan Dunia','Teknologi dan Masa Depan']
    },
    'Pendidikan Pancasila':{
      1:['Aku Mengenal Pancasila','Aku Anak yang Disiplin','Hidup Rukun','Aku dan Lingkunganku'],
      2:['Pancasila dalam Kehidupanku','Aturan di Sekitarku','Keragaman di Sekitarku','Aku Peduli Lingkungan'],
      3:['Aku Anak Indonesia','Aturan dan Norma','Keragaman Indonesia','Hak dan Kewajiban'],
      4:['Pancasila sebagai Nilai Hidup','Konstitusi dan Aturan','Keragaman Budaya','Hak dan Kewajiban'],
      5:['Pancasila dalam Kehidupanku','Norma dalam Kehidupanku','Keragaman Budaya Indonesiaku','Aku dan Lingkungan Sekitarku','Musyawarah dan Gotong Royong'],
      6:['Pancasila dan Kehidupan Berbangsa','Norma dan Konstitusi','Bhinneka Tunggal Ika','Negara Kesatuan Republik Indonesia','Gotong Royong dan Musyawarah']
    }
  };
  const fallback=['Unit 1','Unit 2','Unit 3','Unit 4','Unit 5','Unit 6','Unit 7','Unit 8'];
  const grade=r=>({IA:1,IB:1,IIA:2,IIB:2,IIIA:3,IIIB:3,IVA:4,IVB:4,V:5,VI:6}[String(r||'').toUpperCase()]||1);
  const $=id=>document.getElementById(id);
  function units(mapel,rombel){return (BOOK[mapel]&&BOOK[mapel][grade(rombel)])||fallback;}
  function key(text){return String(text||'').toLowerCase();}
  function autoDpl(mapel,material){
    const t=key(mapel+' '+material);
    const score={}; DPL.forEach(x=>score[x]=0);
    const add=(name,n=3)=>{score[name]=(score[name]||0)+n};
    if(/pancasila|norma|kewarg|budaya|keragaman|musyawarah|gotong|indonesia|hak|kewajiban/.test(t)){add(DPL[1],6);add(DPL[0],2);add(DPL[5],2);add(DPL[7],3);}
    if(/matematika|bilangan|pecahan|kpk|fpb|sudut|luas|keliling|data|diagram|rasio|peluang/.test(t)){add(DPL[2],6);add(DPL[3],3);add(DPL[5],2);add(DPL[7],2);}
    if(/ipas|cahaya|bunyi|ekosistem|magnet|listrik|bumi|tumbuhan|hewan|energi|sains|cuaca|lingkungan/.test(t)){add(DPL[2],4);add(DPL[3],4);add(DPL[4],3);add(DPL[6],3);}
    if(/bahasa|membaca|menulis|cerita|puisi|informasi|berbicara|memirsa|komunikasi|hobi|buku/.test(t)){add(DPL[7],6);add(DPL[2],3);add(DPL[3],3);add(DPL[4],2);}
    if(/pjok|olahraga|gerak|kesehatan|tubuh|senam|permainan/.test(t)){add(DPL[6],7);add(DPL[5],3);add(DPL[4],3);}
    if(/seni|musik|tari|teater|rupa|gambar|lukis|karya|kreasi/.test(t)){add(DPL[3],7);add(DPL[7],3);add(DPL[4],3);add(DPL[5],2);}
    if(/agama|iman|tuhan|akhlak|ibadah|budi pekerti/.test(t)){add(DPL[0],8);add(DPL[5],3);add(DPL[7],2);}
    if(/kelompok|kolaborasi|diskusi|proyek|praktik|presentasi/.test(t)){add(DPL[4],4);add(DPL[7],3);}
    if(/mandiri|refleksi|diri sendiri/.test(t)){add(DPL[5],4);}
    return DPL.map((x,i)=>[x,score[x],i]).sort((a,b)=>b[1]-a[1]||a[2]-b[2]).slice(0,4).map(x=>x[0]);
  }
  function setDpl(material,mapel){
    const wanted=new Set(autoDpl(mapel,material));
    document.querySelectorAll('#aiSuperDpl input').forEach(cb=>cb.checked=wanted.has(cb.value));
    const status=$('aiSuperStatus'); if(status) status.textContent='⚡ DPL otomatis disesuaikan dengan materi — tetap bisa diedit manual.';
  }
  function rebuild(){
    const r=$('aiSuperRombel'),m=$('aiSuperMapel'),mat=$('aiSuperMaterial');
    if(!r||!m||!mat) return;
    const old=mat.value;
    if(mat.tagName.toLowerCase()!=='select'){
      const s=document.createElement('select'); s.id='aiSuperMaterial'; s.title='Pilih Materi/BAB';
      mat.parentNode.replaceChild(s,mat);
    }
    const sel=$('aiSuperMaterial');
    const list=units(m.value,r.value); sel.innerHTML='<option value="">Pilih Materi/BAB...</option>'+list.map(x=>'<option>'+x+'</option>').join('');
    if(list.includes(old)) sel.value=old;
    sel.onchange=()=>setDpl(sel.value,m.value);
    setDpl(sel.value||list[0],m.value);
  }
  function mount(){
    const panel=$('aiGenerateSuperPanel'); if(!panel) return false;
    const r=$('aiSuperRombel'),m=$('aiSuperMapel'); if(!r||!m) return false;
    rebuild();
    r.addEventListener('change',rebuild); m.addEventListener('change',rebuild);
    return true;
  }
  let tries=0; const timer=setInterval(()=>{if(mount()||++tries>40) clearInterval(timer)},250);
})();