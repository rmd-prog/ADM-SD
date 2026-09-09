/* ADM-SD — INDEX MENU FINISHING V3
   AI prompt helper + document/panel polish. Additive only.
*/
(function(){
  'use strict';
  if(window.__ADM_INDEX_FINISHING_V3__)return;
  window.__ADM_INDEX_FINISHING_V3__=true;
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  const prompts={
    lengkap:'Buat lengkap, sistematis, siap digunakan guru, dengan tujuan, langkah, aktivitas, asesmen, dan kunci/indikator yang relevan.',
    ringkas:'Buat ringkas tetapi tetap lengkap dan praktis. Hindari pengulangan dan teks yang tidak diperlukan.',
    visual:'Buat menarik untuk siswa SD, gunakan tabel/ilustrasi/ikon atau penanda visual yang relevan, tanpa mengorbankan keterbacaan.',
    asesmen:'Fokus pada asesmen yang jelas: indikator, bentuk soal/tugas, level kognitif, rubrik atau kunci jawaban bila sesuai.'
  };
  function typeLabel(){const s=$('aiType');return s?.options?.[s.selectedIndex]?.textContent||'dokumen';}
  function addPromptTools(){
    const root=$('aiGenerate'), ctx=$('aiContext');
    if(!root||!ctx||root.dataset.promptV3==='1')return;
    root.dataset.promptV3='1';
    const box=document.createElement('div');box.className='adm-prompt-tools';
    box.innerHTML='<div class="adm-prompt-head"><b>✨ Bantu susun prompt</b><span>Pilih gaya, lalu sesuaikan konteks di kolom prompt.</span></div><div class="adm-prompt-chips">'+Object.entries(prompts).map(([k,v])=>'<button type="button" data-prompt="'+k+'">'+({lengkap:'📚 Lengkap',ringkas:'⚡ Ringkas',visual:'🎨 Visual',asesmen:'📝 Asesmen'}[k])+'</button>').join('')+'</div>';
    const host=ctx.closest('.doc-box')||ctx.parentElement;
    host?.insertAdjacentElement('afterend',box);
    box.addEventListener('click',e=>{const b=e.target.closest('[data-prompt]');if(!b)return;const p=prompts[b.dataset.prompt];const current=ctx.value.trim();const cleaned=current.replace(/\n?\[GAYA:[^\]]+\]/gi,'').trim();ctx.value=(cleaned?cleaned+'\n\n':'')+'[GAYA: '+p+']';ctx.focus();box.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');});
    const note=document.createElement('div');note.className='adm-prompt-note';note.innerHTML='💡 <b>Tips:</b> tulis materi/bab, karakter siswa, jumlah soal/aktivitas, dan kebutuhan khusus. AI akan mempertahankan konteks buku acuan yang sudah dikunci.';box.appendChild(note);
  }
  function addResultActions(){
    const root=$('aiGenerate');if(!root||root.dataset.resultV3==='1')return;
    root.dataset.resultV3='1';
    const obs=new MutationObserver(()=>{
      const result=$('aiResult'),paper=result?.querySelector('.ai-paper');if(!result||!paper||paper.dataset.v3==='1')return;
      paper.dataset.v3='1';
      const bar=document.createElement('div');bar.className='adm-result-tools';
      bar.innerHTML='<span>✓ Hasil siap diedit</span><button type="button" data-act="copy">Salin teks</button><button type="button" data-act="top">Ke atas</button>';
      result.insertBefore(bar,paper);
      bar.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.act==='top'){window.scrollTo({top:0,behavior:'smooth'});return}if(b.dataset.act==='copy'){const text=paper.innerText||'';try{await navigator.clipboard.writeText(text);b.textContent='✓ Tersalin';setTimeout(()=>b.textContent='Salin teks',1600)}catch{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();b.textContent='✓ Tersalin';setTimeout(()=>b.textContent='Salin teks',1600)}}});
    });
    obs.observe($('aiResult')||root,{childList:true,subtree:true});
  }
  function css(){if($('adm-index-finishing-v3-style'))return;const s=document.createElement('style');s.id='adm-index-finishing-v3-style';s.textContent=`
    .adm-prompt-tools{margin:10px 0 14px;padding:12px 13px;border:1px solid #e0e7ff;border-radius:14px;background:linear-gradient(135deg,#f8faff,#faf5ff)}
    .adm-prompt-head{display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap;font-size:12px}.adm-prompt-head span{color:#64748b;font-size:10px}
    .adm-prompt-chips{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}.adm-prompt-chips button{border:1px solid #cbd5e1;background:#fff;border-radius:999px;padding:7px 10px;font-size:11px;font-weight:800;cursor:pointer}.adm-prompt-chips button:hover,.adm-prompt-chips button.active{border-color:#6366f1;background:#eef2ff;color:#3730a3}
    .adm-prompt-note{margin-top:9px;color:#64748b;font-size:10px;line-height:1.45}.adm-prompt-note b{color:#334155}
    .adm-result-tools{display:flex;align-items:center;gap:7px;flex-wrap:wrap;padding:8px 10px;margin:10px 0;border:1px solid #dbeafe;background:#eff6ff;border-radius:11px;font-size:11px;color:#334155}.adm-result-tools span{font-weight:900;margin-right:auto}.adm-result-tools button{border:1px solid #bfdbfe;background:#fff;border-radius:8px;padding:6px 9px;font-size:10px;font-weight:800;cursor:pointer}
    @media(max-width:600px){.adm-prompt-head{align-items:flex-start}.adm-result-tools span{width:100%;margin-right:0}}
  `;document.head.appendChild(s)}
  function boot(){css();addPromptTools();addResultActions()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  [700,1600,3000].forEach(ms=>setTimeout(boot,ms));
})();
