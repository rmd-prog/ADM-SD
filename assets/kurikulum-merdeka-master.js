/* ADM-SD — MASTER KURIKULUM MERDEKA
 * Fondasi bersama RPM, LKPD, Asesmen, Materi, Soal, dan AI Generate SUPER.
 * Hanya metadata/sumber yang dapat dipertanggungjawabkan yang diberi status verified.
 */
(function(){
  'use strict';
  const phases={A:{label:'Fase A',classes:['1','2']},B:{label:'Fase B',classes:['3','4']},C:{label:'Fase C',classes:['5','6']}};
  const subjects=['Bahasa Indonesia','Matematika','IPAS','Pendidikan Pancasila','Pendidikan Agama Islam dan Budi Pekerti','PJOK','Bahasa Inggris','Seni Rupa','Seni Musik','Seni Tari','Seni Teater','Koding dan Kecerdasan Artifisial'];
  const books=[
    {subject:'Matematika',class:'1',title:'Matematika untuk SD/MI Kelas I',isbn:'978-602-244-877-8',verified:true,tocVerified:false,officialCatalog:'https://buku.kemendikdasmen.go.id/katalog/matematika-untuk-sdmi-kelas-i'},
    {subject:'Matematika',class:'2',title:'Matematika untuk SD/MI Kelas II',isbn:'978-602-427-915-8',verified:true,tocVerified:false,officialCatalog:'https://buku.kemendikdasmen.go.id/katalog/matematika-untuk-sdmi-kelas-ii'},
    {subject:'Matematika',class:'3',title:'Matematika untuk SD/MI Kelas III',isbn:'978-602-427-935-6',verified:true,tocVerified:false,officialCatalog:'https://buku.kemendikdasmen.go.id/katalog/matematika-untuk-sdmi-kelas-iii'},
    {subject:'Matematika',class:'4',title:'Matematika untuk SD/MI Kelas IV',isbn:'978-602-244-908-9',verified:true,tocVerified:false,officialCatalog:'https://buku.kemendikdasmen.go.id/katalog/matematika-untuk-sdmi-kelas-iv'},
    {subject:'Matematika',class:'5',title:'Matematika untuk SD/MI Kelas V',isbn:'978-602-427-916-5',verified:true,tocVerified:false,officialCatalog:'https://buku.kemendikdasmen.go.id/katalog/matematika-untuk-sdmi-kelas-v'},
    {subject:'Matematika',class:'6',title:'Matematika untuk SD/MI Kelas VI',isbn:'978-602-427-917-2',verified:true,tocVerified:false,officialCatalog:'https://buku.kemendikdasmen.go.id/katalog/matematika-untuk-sdmi-kelas-vi'},
    {subject:'Bahasa Indonesia',class:'1',title:'Bahasa Indonesia Aku Bisa! untuk SD/MI Kelas I (Edisi Revisi)',isbn:'978-623-118-362-0',verified:true,tocVerified:false,officialCatalog:'https://buku.kemendikdasmen.go.id/katalog/bahasa-indonesia-aku-bisa-untuk-sd-mi-kelas-i-edisi-revisi'},
    {subject:'Bahasa Indonesia',class:'4',title:'Bahasa Indonesia Lihat Sekitar untuk SD/MI Kelas IV (Edisi Revisi)',isbn:'978-623-118-363-7',verified:true,tocVerified:false,officialCatalog:'https://buku.kemendikdasmen.go.id/katalog/bahasa-indonesia-lihat-sekitar-untuk-sdmi-kelas-iv-edisi-revisi'},
    {subject:'PJOK',class:'1',title:'Pendidikan Jasmani, Olahraga, dan Kesehatan untuk SD/MI Kelas I',isbn:'978-623-388-543-0',verified:true,tocVerified:false,officialCatalog:'https://buku.kemendikdasmen.go.id/katalog/pendidikan-jasmani-olahraga-dan-kesehatan-untuk-sd-mi-kelas-i'},
    {subject:'Pendidikan Pancasila',class:'1',title:'Pendidikan Pancasila untuk SD/MI Kelas I',isbn:'978-623-194-615-7',verified:true,tocVerified:false,officialCatalog:'https://buku.kemendikdasmen.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-i'},
    {subject:'Pendidikan Pancasila',class:'2',title:'Pendidikan Pancasila untuk SD/MI Kelas II',isbn:'978-623-194-630-0',verified:true,tocVerified:false,officialCatalog:'https://buku.kemendikdasmen.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-ii'},
    {subject:'Pendidikan Pancasila',class:'4',title:'Pendidikan Pancasila untuk SD/MI Kelas IV',isbn:'978-623-194-650-8',verified:true,tocVerified:false,officialCatalog:'https://buku.kemendikdasmen.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-iv'},
    {subject:'Pendidikan Pancasila',class:'6',title:'Pendidikan Pancasila untuk SD/MI Kelas VI',isbn:'978-623-194-652-2',verified:true,tocVerified:false,officialCatalog:'https://buku.kemendikdasmen.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-vi'},
    {subject:'Bahasa Inggris',class:'5',title:'English for Nusantara Kids untuk SD/MI Kelas V — Panduan Guru',isbn:'978-623-388-254-5',verified:true,tocVerified:false,teacherGuide:true,officialCatalog:'https://buku.kemendikdasmen.go.id/katalog/'},
    {subject:'Koding dan Kecerdasan Artifisial',class:'5',title:'Koding dan Kecerdasan Artifisial untuk SD/MI Kelas V',isbn:'978-623-014-757-9',verified:true,tocVerified:false}
  ];
  window.ADM_KURIKULUM_MASTER={version:'1.0.1',curriculum:'Kurikulum Merdeka',jenjang:'SD/MI',phases,subjects,books,source:'SIBI — Sistem Informasi Perbukuan Indonesia'};
})();
