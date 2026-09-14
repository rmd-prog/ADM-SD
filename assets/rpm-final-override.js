/* SIAP GURU — RPM FINAL OVERRIDE
 * Isolated RPM-only compatibility layer.
 * Does not touch D1, Worker, login, dashboard, or persistence.
 */
(function(){
  'use strict';
  if(window.__SIAP_GURU_RPM_FINAL_OVERRIDE__) return;
  window.__SIAP_GURU_RPM_FINAL_OVERRIDE__ = true;

  const TEXT = [
    'D. PENGALAMAN BELAJAR MENDALAM',
    'Memahami: Guru mengaitkan materi dengan konteks atau pengalaman yang dekat dengan peserta didik. Peserta didik mengingat pengalaman awal, mengamati contoh atau fenomena, menjawab pertanyaan pemantik, mengidentifikasi informasi penting, dan menyampaikan pemahaman awal.',
    'Mengaplikasi: Peserta didik mengeksplorasi informasi, berdiskusi atau berkolaborasi, melakukan praktik atau pemecahan masalah, menggunakan sumber belajar yang tersedia, lalu menghasilkan bukti belajar berupa jawaban, catatan, karya, produk, atau unjuk kerja. Guru memfasilitasi dan memberi umpan balik selama proses.',
    'Merefleksi: Peserta didik menyampaikan hasil, membandingkan proses atau hasil dengan kriteria keberhasilan, menerima umpan balik dari teman dan guru, menuliskan hal yang sudah dipahami dan yang masih perlu diperbaiki, lalu menentukan langkah perbaikan berikutnya.'
  ];

  const HTML = '<ol>' +
    '<li><b>Memahami:</b> Guru mengaitkan materi dengan konteks atau pengalaman yang dekat dengan peserta didik. Peserta didik mengingat pengalaman awal, mengamati contoh atau fenomena, menjawab pertanyaan pemantik, mengidentifikasi informasi penting, dan menyampaikan pemahaman awal.</li>' +
    '<li><b>Mengaplikasi:</b> Peserta didik mengeksplorasi informasi, berdiskusi atau berkolaborasi, melakukan praktik atau pemecahan masalah, menggunakan sumber belajar yang tersedia, lalu menghasilkan bukti belajar berupa jawaban, catatan, karya, produk, atau unjuk kerja. Guru memfasilitasi dan memberi umpan balik selama proses.</li>' +
    '<li><b>Merefleksi:</b> Peserta didik menyampaikan hasil, membandingkan proses atau hasil dengan kriteria keberhasilan, menerima umpan balik dari teman dan guru, menuliskan hal yang sudah dipahami dan yang masih perlu diperbaiki, lalu menentukan langkah perbaikan berikutnya.</li>' +
    '</ol>';

  function isRPMText(s){
    s=String(s||'').toUpperCase();
    return s.includes('RENCANA PEMBELAJARAN MENDALAM (RPM)') || s.includes('PENGALAMAN BELAJAR MENDALAM');
  }
  function cleanText(s){
    if(!isRPMText(s)) return s;
    const out=String(s);
    const start=/D\.\s*PENGALAMAN BELAJAR MENDALAM/i.exec(out);
    const end=/\n\s*E\.\s*ASESMEN/i.exec(out);
    if(start&&end&&end.index>start.index) return out.slice(0,start.index)+TEXT.join('\n')+out.slice(end.index);
    return out;
  }
  function patchTextareas(root){
    (root||document).querySelectorAll('textarea').forEach(el=>{
      if(isRPMText(el.value)){
        const v=cleanText(el.value);
        if(v!==el.value){el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));}
      }
    });
  }
  function patchHTML(root){
    (root||document).querySelectorAll('.ads-result,.doc-preview-body').forEach(box=>{
      const h=[...box.querySelectorAll('h4')].find(x=>/D\.\s*Pengalaman Belajar Mendalam/i.test(x.textContent||''));
      if(!h||h.dataset.rpmFinal==='1') return;
      h.dataset.rpmFinal='1';
      let n=h.nextElementSibling;
      while(n&&!(/^E\./i.test((n.textContent||'').trim())||(n.tagName==='H4'&&/Asesmen/i.test((n.textContent||'').trim())))){
        const next=n.nextElementSibling;n.remove();n=next;
      }
      h.insertAdjacentHTML('afterend',HTML);
    });
  }
  function patch(){patchHTML(document);patchTextareas(document);}
  const obs=new MutationObserver(patch);
  function boot(){patch();obs.observe(document.body,{subtree:true,childList:true,characterData:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
