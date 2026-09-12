/* SIAP GURU — HYBRID VISUAL SHELL v4
 * Visual/navigation shell only. Existing auth, navigation engine, data and API remain untouched.
 * Sidebar hierarchy follows the approved SIAP GURU structure.
 */
(function(){
  'use strict';
  function ready(fn){
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true});
    else fn();
  }
  function go(page){
    if(page && typeof window.showPage==='function') window.showPage(page);
  }
  function icon(name){
    var paths={
      dashboard:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
      book:'<path d="M4 5a3 3 0 0 1 3-3h13v17H7a3 3 0 0 0-3 3z"/><path d="M4 5v17M8 6h8M8 10h6"/>',
      clipboard:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5M9 10l2 2 4-4M9 16h6"/>',
      users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 5.5a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 4.5 4"/>',
      files:'<path d="M7 3h10l3 3v15H7z"/><path d="M17 3v4h3M4 7v14h3M10 12h6M10 16h5"/>',
      route:'<circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 5h4a4 4 0 0 1 4 4v6a4 4 0 0 0 4 4M17 19h-4a4 4 0 0 1-4-4V9a4 4 0 0 0-4-4"/>',
      target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
      timeline:'<path d="M4 6h16M4 12h12M4 18h8"/><circle cx="20" cy="6" r="1"/><circle cx="16" cy="12" r="1"/><circle cx="12" cy="18" r="1"/>',
      flag:'<path d="M5 21V4"/><path d="M5 5c5-4 9 4 14 0v9c-5 4-9-4-14 0"/>',
      tool:'<path d="m14.5 6.5 3-3a4 4 0 0 1-5.2 5.2L6 15a2.8 2.8 0 1 0 4 4l6.3-6.3a4 4 0 0 1 5.2-5.2l-3 3"/>',
      brain:'<path d="M9 4a3 3 0 0 0-5 2 3 3 0 0 0 1 5.5A3.5 3.5 0 0 0 7 18a3 3 0 0 0 5 1V5a3 3 0 0 0-3-1z"/><path d="M15 4a3 3 0 0 1 5 2 3 3 0 0 1-1 5.5A3.5 3.5 0 0 1 17 18a3.5 3.5 0 0 1-5 1V5a3 3 0 0 1 3-1zM6 8h3M15 8h3M7 13h2M15 13h2"/>',
      note:'<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h4M9 12h6M9 16h5"/>',
      booksmall:'<path d="M5 4h13a2 2 0 0 1 2 2v14H7a2 2 0 0 0-2-2z"/><path d="M5 4v14a2 2 0 0 0 2 2M9 8h7M9 12h6"/>',
      sparkles:'<path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2z"/><path d="m19 13 .7 2.3L22 16l-2.3.7L19 19l-.7-2.3L16 16l2.3-.7z"/><path d="m5 15 .6 1.9L7.5 18l-1.9.6L5 20.5l-.6-1.9L2.5 18l1.9-.6z"/>',
      checklist:'<path d="M8 5h11M8 12h11M8 19h11"/><path d="m3 5 1.5 1.5L6 5M3 12l1.5 1.5L6 12M3 19l1.5 1.5L6 19"/>',
      list:'<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
      calendar:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 9h18"/><path d="m8 14 2 2 5-5"/>',
      certificate:'<circle cx="12" cy="10" r="6"/><path d="m9 16-1 5 4-2 4 2-1-5M10 10l1.5 1.5L15 8"/>',
      chart:'<path d="M4 19V5M4 19h17"/><rect x="7" y="12" width="3" height="5" rx=".5"/><rect x="12" y="9" width="3" height="8" rx=".5"/><rect x="17" y="6" width="3" height="11" rx=".5"/>',
      chartdots:'<path d="M4 19V5M4 19h17"/><circle cx="8" cy="15" r="1.5"/><circle cx="13" cy="11" r="1.5"/><circle cx="18" cy="7" r="1.5"/><path d="m8 15 5-4 5-4"/>',
      database:'<ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7"/>',
      group:'<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20a5.5 5.5 0 0 1 11 0M14 20a4.5 4.5 0 0 1 7 0"/>',
      user:'<circle cx="12" cy="7" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
      trend:'<path d="M4 17 10 11l4 4 6-7"/><path d="M15 8h5v5"/>',
      fileedit:'<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h4M9 17l1.5-4.5L16 11l1.5 1.5-5.5 5.5z"/>',
      filecheck:'<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h4M9 16l2 2 4-4"/>',
      template:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M10 10v10"/>',
      history:'<path d="M4 12a8 8 0 1 0 2-5"/><path d="M4 4v5h5M12 8v5l3 2"/>',
      chevron:'<path d="m9 18 6-6-6-6"/>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+(paths[name]||paths.note)+'</svg>';
  }
  function addHomeCards(){
    var d=document.getElementById('dashboard');
    if(!d || d.querySelector('.sg-home-actions')) return;
    var hero=d.querySelector('.v10-hero');
    if(!hero) return;
    var box=document.createElement('section');
    box.className='sg-home-actions';
    box.innerHTML='<div class="sg-section-head"><div><span class="sg-eyebrow">RUANG KERJA</span><h3>Akses cepat</h3><p>Empat pekerjaan utama guru, tanpa memenuhi layar.</p></div></div>'+
      '<div class="sg-action-grid sg-action-grid-simple">'+
      '<button class="sg-action" data-sg-page="students"><span class="sg-action-icon">'+icon('users')+'</span><span><b>Data Siswa</b><small>Kelola data & rombel</small></span><i>›</i></button>'+ 
      '<button class="sg-action" data-sg-page="rpm"><span class="sg-action-icon">'+icon('book')+'</span><span><b>Perangkat</b><small>CP, ATP, TP & RPM</small></span><i>›</i></button>'+ 
      '<button class="sg-action" data-sg-page="aiGenerate"><span class="sg-action-icon">'+icon('sparkles')+'</span><span><b>AI Generate</b><small>Buat perangkat & materi</small></span><i>›</i></button>'+ 
      '<button class="sg-action" data-sg-page="scores"><span class="sg-action-icon">'+icon('checklist')+'</span><span><b>Penilaian</b><small>Input & kelola nilai</small></span><i>›</i></button>'+ 
      '</div>';
    hero.insertAdjacentElement('afterend',box);
    box.addEventListener('click',function(e){var b=e.target.closest('[data-sg-page]');if(!b)return;go(b.getAttribute('data-sg-page'));});
  }
  function makeLeaf(label,page,iconName){var b=document.createElement('button');b.type='button';b.className='sg-modern-item';b.innerHTML='<span class="sg-item-main"><span class="sg-sub-icon">'+icon(iconName)+'</span><span>'+label+'</span></span>';if(page)b.addEventListener('click',function(){go(page);});return b;}
  function makeNested(label,iconName,items,open){var section=document.createElement('div');section.className='sg-modern-group nested'+(open?' open':'');var head=document.createElement('button');head.type='button';head.className='sg-modern-head nested-head';head.innerHTML='<span class="sg-head-main"><span class="sg-menu-icon">'+icon(iconName)+'</span><span>'+label+'</span></span><span class="sg-chevron">'+icon('chevron')+'</span>';var sub=document.createElement('div');sub.className='sg-modern-sub nested-sub';items.forEach(function(item){sub.appendChild(item.children?makeNested(item.label,item.icon,item.children,false):makeLeaf(item.label,item.page,item.icon));});head.addEventListener('click',function(){section.classList.toggle('open');});section.appendChild(head);section.appendChild(sub);return section;}
  function modernMenu(){var side=document.getElementById('sidebar');if(!side||side.dataset.modernMenu==='2')return;side.dataset.modernMenu='2';var title=side.querySelector('.side-title');side.querySelectorAll('.navbtn,.menu-group').forEach(function(el){el.remove();});if(title)title.textContent='MENU UTAMA';var wrap=document.createElement('div');wrap.className='sg-modern-menu';var home=document.createElement('button');home.type='button';home.className='sg-modern-home active';home.innerHTML='<span class="sg-menu-icon">'+icon('dashboard')+'</span><span>Beranda</span>';home.addEventListener('click',function(){go('dashboard');setActive(home,wrap);});wrap.appendChild(home);var structure=[{label:'Pembelajaran',icon:'book',open:true,items:[{label:'Perencanaan',icon:'route',children:[{label:'CP',page:'cp',icon:'target'},{label:'ATP',page:'atp',icon:'timeline'},{label:'TP',page:'tp',icon:'flag'}]},{label:'Perangkat',page:'rpm',icon:'tool'},{label:'RPM Deep Learning',page:'rpm',icon:'brain'},{label:'LKPD',page:'lkpd',icon:'note'},{label:'Materi',page:'materi',icon:'booksmall'},{label:'AI Generate',page:'aiGenerate',icon:'sparkles'}]},{label:'Asesmen',icon:'clipboard',items:[{label:'Penilaian',page:'scores',icon:'checklist'},{label:'Penilaian per Bab',page:'scores',icon:'list'},{label:'Ulangan Semester',page:'scores',icon:'calendar'},{label:'Akhir Semester',page:'scores',icon:'certificate'},{label:'Rekap Nilai',page:'report',icon:'chart'},{label:'Analisis',page:'aiGenerate',icon:'chartdots'}]},{label:'Peserta Didik',icon:'users',items:[{label:'Data Siswa',page:'students',icon:'database'},{label:'Rombel',page:'students',icon:'group'},{label:'Profil',page:'students',icon:'user'},{label:'Perkembangan',page:'students',icon:'trend'}]},{label:'Dokumen',icon:'files',items:[{label:'Draft',page:'report',icon:'fileedit'},{label:'Selesai',page:'report',icon:'filecheck'},{label:'Template',page:'report',icon:'template'},{label:'Riwayat',page:'report',icon:'history'}]}];structure.forEach(function(group){var section=makeNested(group.label,group.icon,group.items,!!group.open);section.classList.remove('nested');section.querySelector('.nested-head').classList.remove('nested-head');wrap.appendChild(section);});side.appendChild(wrap);var style=document.getElementById('siapGuruModernMenuStyle')||document.createElement('style');style.id='siapGuruModernMenuStyle';style.textContent='.sg-modern-menu{display:grid;gap:4px;margin-top:4px}.sg-modern-home,.sg-modern-head,.sg-modern-item{font:inherit;color:#526174;border:0;background:transparent;width:100%;text-align:left;cursor:pointer}.sg-modern-home{display:flex;align-items:center;gap:10px;min-height:42px;padding:9px 11px;border-radius:10px;font-weight:800}.sg-modern-home.active,.sg-modern-item.active{background:#edf6ff;color:#1767c5}.sg-modern-home:hover,.sg-modern-head:hover,.sg-modern-item:hover{background:#f5f8fc;color:#1767c5}.sg-modern-head{display:flex;align-items:center;justify-content:space-between;min-height:42px;padding:9px 11px;border-radius:10px;font-weight:800}.sg-head-main,.sg-item-main{display:flex;align-items:center;gap:9px;min-width:0}.sg-menu-icon{width:19px;height:19px;display:inline-grid;place-items:center;flex:none}.sg-menu-icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.sg-sub-icon{width:17px;height:17px;display:inline-grid;place-items:center;flex:none;color:#8491a3}.sg-sub-icon svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.sg-chevron{display:grid;transition:transform .18s ease;color:#9aa6b5}.sg-chevron svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.sg-modern-group.open>.sg-modern-head>.sg-chevron{transform:rotate(90deg)}.sg-modern-sub{display:none;padding:2px 0 5px 29px}.sg-modern-group.open>.sg-modern-sub{display:grid;gap:1px}.sg-modern-item{display:flex;align-items:center;gap:8px;padding:8px 9px;border-radius:8px;font-size:12.5px;line-height:1.25}.sg-modern-group.nested{padding-left:0}.sg-modern-group.nested>.sg-modern-sub{padding-left:27px}.sg-modern-group.nested .sg-modern-head{font-weight:700;font-size:12.5px;min-height:36px;padding:7px 8px}@media(max-width:850px){.sg-modern-menu{padding-bottom:20px}.sg-modern-item{font-size:13px}}';document.head.appendChild(style);}
  function setActive(active,root){root.querySelectorAll('.sg-modern-home,.sg-modern-item').forEach(function(x){x.classList.remove('active');});active.classList.add('active');}
  ready(function(){
    if(!document.getElementById('siapGuruVisualV2')){var link=document.createElement('link');link.id='siapGuruVisualV2';link.rel='stylesheet';link.href='assets/siap-guru-visual-v1.css?v=3';(document.head||document.documentElement).appendChild(link);}
    [100,500,1200,2500].forEach(function(ms){setTimeout(addHomeCards,ms);});
    setTimeout(modernMenu,450);
  });
  window.__SIAP_GURU_NEW_UI_DISABLED__=false;window.__SIAP_GURU_HYBRID_VISUAL__='v4-simple-outline-menu';
})();