/* SIAP GURU — HYBRID VISUAL SHELL v2
 * Visual enhancement only. Existing auth, navigation, data, API and page functions remain the engine.
 * No observers, no fetch overrides, no navigation replacement.
 */
(function(){
  'use strict';
  function ready(fn){
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true});
    else fn();
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
      '<button class="sg-action" data-sg-page="students"><span class="sg-action-icon">👥</span><span><b>Data Siswa</b><small>Kelola data & rombel</small></span><i>›</i></button>'+
      '<button class="sg-action" data-sg-page="rpm"><span class="sg-action-icon">📚</span><span><b>Perangkat</b><small>CP, ATP, TP, RPM & dokumen</small></span><i>›</i></button>'+
      '<button class="sg-action" data-sg-page="aiGenerate"><span class="sg-action-icon">🤖</span><span><b>AI Generator</b><small>Buat materi & administrasi</small></span><i>›</i></button>'+
      '<button class="sg-action" data-sg-page="scores"><span class="sg-action-icon">📝</span><span><b>Penilaian</b><small>Input & kelola nilai</small></span><i>›</i></button>'+
      '<button class="sg-action" data-sg-page="report"><span class="sg-action-icon">📊</span><span><b>Rapor & Rekap</b><small>Lihat hasil dan laporan</small></span><i>›</i></button>'+ 
      '</div>';
    hero.insertAdjacentElement('afterend',box);
    box.addEventListener('click',function(e){
      var b=e.target.closest('[data-sg-page]'); if(!b) return;
      var p=b.getAttribute('data-sg-page');
      var target=document.querySelector('.navbtn[data-page="'+p+'"]');
      if(target) target.click();
      else if(typeof window.showPage==='function') window.showPage(p);
    });
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
  });
  window.__SIAP_GURU_NEW_UI_DISABLED__=false;
  window.__SIAP_GURU_HYBRID_VISUAL__='v2';
})();
