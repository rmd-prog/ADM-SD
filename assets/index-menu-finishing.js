/* ADM-SD — INDEX MENU FINISHING PACK
   Scope: only UI/functionality exposed from index.html menus.
   Safe additive layer: no auth, D1, rombel or attendance rewrites.
*/
(function(){
  'use strict';
  if(window.__ADM_INDEX_FINISHING__)return;
  window.__ADM_INDEX_FINISHING__=true;

  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  const toast=(type,title,text)=>{
    if(window.ADMUI&&typeof window.ADMUI[type]==='function')return window.ADMUI[type](text,title);
    console[type==='error'?'error':'log'](title,text);
  };

  /* 1) AI Generator: stronger UX without changing its existing API contract. */
  function enhanceAI(){
    const root=$('aiGenerate');
    if(!root||root.dataset.finishing==='1')return;
    root.dataset.finishing='1';
    const type=$('aiType'),size=$('aiPaperSize'),orientation=$('aiPaperOrientation'),result=$('aiResult');
    if(!type||!result)return;

    const bar=document.createElement('div');
    bar.className='adm-ai-finish-bar';
    bar.innerHTML='<span class="adm-ai-finish-dot">✦</span><div><b>AI Guru siap</b><small>Hasil dapat diedit, disalin, dicetak, dan disesuaikan ukuran kertas.</small></div><button type="button" id="admAiClear">Bersihkan hasil</button>';
    const host=root.querySelector('.doc-hero');
    if(host)host.appendChild(bar);
    $('admAiClear')?.addEventListener('click',()=>{
      if(result.querySelector('.ai-paper')&&!confirm('Bersihkan hasil AI saat ini?'))return;
      result.innerHTML='<div class="muted">Pilih kebutuhan → lengkapi konteks → tekan <b>Generate dengan AI</b>.</div>';
      $('aiResultBadge').textContent='Siap membuat';
      $('aiStatus').style.display='none';
      localStorage.removeItem('admLastAIResult');
    });

    function applyPaper(){
      const paper=$('aiPaper');if(!paper)return;
      paper.classList.remove('a4','a5','b5','f4','letter','legal','landscape');
      paper.classList.add(String(size?.value||'A4').toLowerCase());
      if(orientation?.value==='landscape')paper.classList.add('landscape');
      const note=result.querySelector('.ai-print-note');
      if(note)note.innerHTML='📄 Pratinjau '+esc(size?.value||'A4')+' • '+(orientation?.value==='landscape'?'Landscape':'Portrait')+' • <span class="theme-chip">Ukuran diterapkan</span>';
    }
    size?.addEventListener('change',applyPaper);orientation?.addEventListener('change',applyPaper);

    /* Save the latest generated text locally so refresh does not erase work. */
    const originalHTML=result.innerHTML;
    const observer=new MutationObserver(()=>{
      const paper=result.querySelector('.ai-paper');
      if(!paper)return;
      applyPaper();
      const text=paper.innerText||'';
      if(text.length>80){
        try{localStorage.setItem('admLastAIResult',JSON.stringify({text,at:Date.now(),type:type.value,size:size?.value||'A4',orientation:orientation?.value||'portrait'}))}catch{}
      }
    });
    observer.observe(result,{childList:true,subtree:true});

    try{
      const saved=JSON.parse(localStorage.getItem('admLastAIResult')||'null');
      if(saved?.text&&Date.now()-Number(saved.at||0)<86400000){
        const restore=document.createElement('div');
        restore.className='adm-ai-restore';
        restore.innerHTML='<b>↩ Hasil AI terakhir tersedia</b><span>Disimpan '+new Date(saved.at).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})+'</span><button type="button">Pulihkan</button><button type="button" class="secondary">Hapus</button>';
        result.parentElement?.insertBefore(restore,result);
        restore.querySelector('button:not(.secondary)').onclick=()=>{
          const paperSize=saved.size||'A4',ori=saved.orientation||'portrait';
          if(size)size.value=paperSize;if(orientation)orientation.value=ori;
          result.innerHTML='<div class="ai-print-note">↩ Hasil AI dipulihkan dari penyimpanan perangkat.</div><div class="markdown-clean"><pre style="white-space:pre-wrap">'+esc(saved.text)+'</pre></div>';
          $('aiResultBadge').textContent='↩ Dipulihkan';
          toast('success','Hasil dipulihkan','Hasil AI terakhir tersedia kembali di halaman ini.');
        };
        restore.querySelector('button.secondary').onclick=()=>{localStorage.removeItem('admLastAIResult');restore.remove()};
      }
    }catch{}
  }

  /* 2) All document menus: print/PDF controls get a visible status instead of silent waiting. */
  function enhanceDocuments(){
    ['cp','tp','atp','prota','prosem','rpm'].forEach(t=>{
      const page=$(t);if(!page||page.dataset.finishDoc==='1')return;
      page.dataset.finishDoc='1';
      const hero=page.querySelector('.doc-hero');if(!hero)return;
      const hint=document.createElement('div');hint.className='adm-doc-hint';
      hint.innerHTML='<span>✓</span><span><b>Dokumen siap dipakai</b> • Edit isi bila perlu sebelum PDF, Word, Excel, atau Cetak.</span>';
      hero.appendChild(hint);
    });
  }

  /* 3) Dashboard quick-action feedback. */
  function enhanceDashboard(){
    const d=$('dashboard');if(!d||d.dataset.finishDash==='1')return;d.dataset.finishDash='1';
    const hero=d.querySelector('.v10-hero');if(hero){
      const b=document.createElement('div');b.className='adm-dash-ready';b.innerHTML='⚡ <b>Portal siap digunakan</b><span>Data • Perangkat • AI • Penilaian • Rapor</span>';hero.appendChild(b);
    }
  }

  /* 4) Global safe feedback for slow operations. */
  document.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b||b.disabled)return;
    const text=(b.textContent||'').trim().toLowerCase();
    if(/generate dengan ai/.test(text)&&window.ADMLoading?.process){
      const t=$('aiType')?.value||'generate';
      window.ADMLoading.process(t,{autoProgress:true});
      setTimeout(()=>window.ADMLoading.hide(),14500);
    }
  },true);

  function css(){
    if($('adm-index-finishing-style'))return;
    const s=document.createElement('style');s.id='adm-index-finishing-style';s.textContent=`
      .adm-ai-finish-bar{display:flex;align-items:center;gap:10px;margin:12px 0 0;padding:11px 13px;border:1px solid #dbeafe;border-radius:14px;background:linear-gradient(135deg,#eff6ff,#faf5ff);color:#334155}
      .adm-ai-finish-dot{width:29px;height:29px;border-radius:9px;display:grid;place-items:center;background:#4f46e5;color:#fff;font-weight:900;box-shadow:0 6px 16px #4f46e530}
      .adm-ai-finish-bar div{min-width:0;flex:1}.adm-ai-finish-bar b{display:block;font-size:12px}.adm-ai-finish-bar small{display:block;color:#64748b;font-size:11px;margin-top:2px}
      .adm-ai-finish-bar button,.adm-ai-restore button{border:1px solid #cbd5e1;background:#fff;border-radius:9px;padding:7px 9px;font-weight:800;font-size:11px;cursor:pointer}
      .adm-ai-restore{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:10px 0;padding:10px 12px;border:1px solid #bbf7d0;background:#f0fdf4;border-radius:12px;color:#166534;font-size:11px}.adm-ai-restore span{color:#64748b}.adm-ai-restore button:first-of-type{background:#16a34a;color:#fff;border-color:#16a34a}.adm-ai-restore .secondary{background:#fff;color:#475569;border-color:#cbd5e1}
      .adm-doc-hint{display:flex;align-items:center;gap:8px;margin-top:10px;padding:9px 11px;border-radius:11px;background:#f8fafc;border:1px dashed #cbd5e1;color:#64748b;font-size:11px}.adm-doc-hint span:first-child{width:21px;height:21px;border-radius:50%;display:grid;place-items:center;background:#dcfce7;color:#15803d;font-weight:900}.adm-doc-hint b{color:#334155}
      .adm-dash-ready{display:flex;align-items:center;gap:9px;position:relative;z-index:2;margin-top:14px;padding:9px 11px;width:max-content;max-width:100%;border-radius:999px;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.18);font-size:11px}.adm-dash-ready span{opacity:.8}
      @media(max-width:600px){.adm-ai-finish-bar{align-items:flex-start}.adm-ai-finish-bar button{margin-left:auto}.adm-dash-ready{width:100%;justify-content:center}.adm-ai-restore{align-items:flex-start}}
    `;document.head.appendChild(s);
  }

  function boot(){css();enhanceAI();enhanceDocuments();enhanceDashboard();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  [500,1200,2500].forEach(ms=>setTimeout(boot,ms));
})();
