/* SIAP GURU — HYBRID VISUAL SHELL v3
 * Visual/navigation shell only. Existing auth, navigation engine, data and API remain untouched.
 */
(function(){
  'use strict';
  function ready(fn){
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true});
    else fn();
  }
  function go(page){
    if(typeof window.showPage==='function') window.showPage(page);
  }
  function icon(name){
    var paths={
      home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
      book:'<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 4.5v17M8 6h8M8 10h8"/>',
      check:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="m8 12 2.5 2.5L16 9"/>',
      users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
      files:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
      chevron:'<path d="m9 18 6-6-6-6"/>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+(paths[name]||'')+'</svg>';
  }
  function addHomeCards(){
    var d=document.getElementById('dashboard');
    if(!d || d.querySelector('.sg-home-actions')) return;
    var hero=d.querySelector('.v10-hero');
    if(!hero) return;
    var box=document.createElement('section');
    box.className='sg-home-actions';
    box.innerHTML='<div class="sg-section-head"><div><span class="sg-eyebrow">RUANG KERJA</span><h3>Akses cepat</h3><p>Pilih pekerjaan yang ingin dikerjakan.</p></div></div>'+
      '<div class="sg-action-grid">'+
      '<button class="sg-action" data-sg-page="students"><span class="sg-action-icon">'+icon('users')+'</span><span><b>Data Siswa</b><small>Kelola data & rombel</small></span><i>›</i></button>'+
      '<button class="sg-action" data-sg-page="rpm"><span class="sg-action-icon">'+icon('book')+'</span><span><b>Perangkat</b><small>CP, ATP, TP, RPM & dokumen</small></span><i>›</i></button>'+
      '<button class="sg-action" data-sg-page="aiGenerate"><span class="sg-action-icon">'+icon('files')+'</span><span><b>AI Generator</b><small>Buat materi & administrasi</small></span><i>›</i></button>'+
      '<button class="sg-action" data-sg-page="scores"><span class="sg-action-icon">'+icon('check')+'</span><span><b>Penilaian</b><small>Input & kelola nilai</small></span><i>›</i></button>'+
      '<button class="sg-action" data-sg-page="report"><span class="sg-action-icon">'+icon('files')+'</span><span><b>Rapor & Rekap</b><small>Lihat hasil dan laporan</small></span><i>›</i></button>'+ 
      '</div>';
    hero.insertAdjacentElement('afterend',box);
    box.addEventListener('click',function(e){
      var b=e.target.closest('[data-sg-page]'); if(!b) return;
      go(b.getAttribute('data-sg-page'));
    });
  }
  function modernMenu(){
    var side=document.getElementById('sidebar');
    if(!side || side.dataset.modernMenu==='1') return;
    side.dataset.modernMenu='1';
    var title=side.querySelector('.side-title');
    side.querySelectorAll('.navbtn,.menu-group').forEach(function(el){el.remove();});
    if(title) title.textContent='MENU UTAMA';
    var wrap=document.createElement('div');
    wrap.className='sg-modern-menu';
    var groups=[
      {label:'Pembelajaran',icon:'book',items:[['CP — Capaian Pembelajaran','cp'],['TP — Tujuan Pembelajaran','tp'],['ATP — Alur Tujuan Pembelajaran','atp'],['Program Tahunan','prota'],['Program Semester','prosem'],['RPM / Modul Ajar','rpm'],['AI Generate','aiGenerate']]},
      {label:'Asesmen',icon:'check',items:[['Input Nilai','scores'],['Rekap / Rapor','report'],['Analisis Hasil','aiGenerate'],['Soal & Kisi-kisi','aiGenerate'],['Rubrik','aiGenerate']]},
      {label:'Peserta Didik',icon:'users',items:[['Data Siswa','students']]},
      {label:'Dokumen',icon:'files',items:[['Laporan & Rapor','report'],['Referensi SIBI','reference']]}
    ];
    var home=document.createElement('button');
    home.type='button'; home.className='sg-modern-home active';
    home.innerHTML='<span class="sg-menu-icon">'+icon('home')+'</span><span>Beranda</span>';
    home.addEventListener('click',function(){go('dashboard');setActive(home,wrap);});
    wrap.appendChild(home);
    groups.forEach(function(group,index){
      var section=document.createElement('div');section.className='sg-modern-group'+(index===0?' open':'');
      var head=document.createElement('button');head.type='button';head.className='sg-modern-head';
      head.innerHTML='<span><span class="sg-menu-icon">'+icon(group.icon)+'</span><span>'+group.label+'</span></span><span class="sg-chevron">'+icon('chevron')+'</span>';
      var sub=document.createElement('div');sub.className='sg-modern-sub';
      group.items.forEach(function(item){
        var b=document.createElement('button');b.type='button';b.className='sg-modern-item';b.innerHTML='<span>'+item[0]+'</span><span class="sg-item-arrow">›</span>';
        b.addEventListener('click',function(){go(item[1]);setActive(b,wrap);});
        sub.appendChild(b);
      });
      head.addEventListener('click',function(){section.classList.toggle('open');});
      section.appendChild(head);section.appendChild(sub);wrap.appendChild(section);
    });
    side.appendChild(wrap);
    var style=document.createElement('style');style.id='siapGuruModernMenuStyle';style.textContent='\
      .sg-modern-menu{display:grid;gap:5px;margin-top:4px}\
      .sg-modern-home,.sg-modern-head,.sg-modern-item{font:inherit;color:#cbd5e1;border:0;background:transparent;width:100%;text-align:left;cursor:pointer}\
      .sg-modern-home{display:flex;align-items:center;gap:10px;min-height:43px;padding:10px 12px;border-radius:11px;font-weight:800}\
      .sg-modern-home.active,.sg-modern-item.active{background:rgba(37,99,235,.92);color:#fff}\
      .sg-modern-home:hover,.sg-modern-head:hover,.sg-modern-item:hover{background:rgba(255,255,255,.08);color:#fff}\
      .sg-modern-head{display:flex;align-items:center;justify-content:space-between;min-height:43px;padding:10px 12px;border-radius:11px;font-weight:800}\
      .sg-modern-head>span:first-child{display:flex;align-items:center;gap:10px}\
      .sg-menu-icon{width:20px;height:20px;display:inline-grid;place-items:center;flex:none}\
      .sg-menu-icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}\
      .sg-chevron{display:grid;transition:transform .2s ease}.sg-chevron svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}\
      .sg-modern-group.open .sg-chevron{transform:rotate(90deg)}\
      .sg-modern-sub{display:none;padding:2px 0 5px 30px}.sg-modern-group.open .sg-modern-sub{display:grid;gap:2px}\
      .sg-modern-item{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 10px;border-radius:9px;font-size:13px;line-height:1.25}\
      .sg-item-arrow{opacity:.5;font-size:16px}.sg-modern-item.active .sg-item-arrow{opacity:.9}\
      @media(max-width:850px){.sg-modern-menu{padding-bottom:20px}.sg-modern-item{font-size:13px}}\
    ';document.head.appendChild(style);
  }
  function setActive(active,root){
    root.querySelectorAll('.sg-modern-home,.sg-modern-item').forEach(function(x){x.classList.remove('active');});
    active.classList.add('active');
  }
  ready(function(){
    if(!document.getElementById('siapGuruVisualV2')){
      var link=document.createElement('link');
      link.id='siapGuruVisualV2';
      link.rel='stylesheet';
      link.href='assets/siap-guru-visual-v1.css?v=2';
      (document.head||document.documentElement).appendChild(link);
    }
    setTimeout(addHomeCards,80);
    setTimeout(modernMenu,450);
  });
  window.__SIAP_GURU_NEW_UI_DISABLED__=false;
  window.__SIAP_GURU_HYBRID_VISUAL__='v3-modern-menu';
})();
