/* SIAP GURU — RPM FINAL OVERRIDE
 * Isolated RPM-only compatibility layer.
 * Does not touch D1, Worker, login, dashboard, or persistence.
 */
(function(){
  'use strict';
  if(window.__SIAP_GURU_RPM_FINAL_OVERRIDE__) return;
  window.__SIAP_GURU_RPM_FINAL_OVERRIDE__ = true;

  function isRPMText(s){
    s=String(s||'').toUpperCase();
    return s.includes('RENCANA PEMBELAJARAN MENDALAM (RPM)') || s.includes('PENGALAMAN BELAJAR MENDALAM');
  }
  function totalMinutes(box){
    const m=(String((box&&box.textContent)||'').match(/Alokasi:\s*(\d+)\s*JP/i)||[])[1];
    return Math.max(35,(Number(m)||2)*35);
  }
  function splitTime(total){
    const awal=Math.max(5,Math.round(total*0.14/5)*5);
    const penutup=Math.max(5,Math.round(total*0.14/5)*5);
    const inti=total-awal-penutup;
    const memahami=Math.max(5,Math.round(inti*0.30/5)*5);
    const merefleksi=Math.max(5,Math.round(inti*0.20/5)*5);
    const mengaplikasi=Math.max(5,inti-memahami-merefleksi);
    return {awal,memahami,mengaplikasi,merefleksi,penutup,inti};
  }
  function htmlFor(box){
    const t=splitTime(totalMinutes(box));
    return '<div class="rpm-activity-time">' +
      '<h5 style="margin:12px 0 6px">Kegiatan Awal — '+t.awal+' menit</h5>'+
      '<ul><li>Guru membuka pembelajaran, membangun kesiapan belajar, dan menciptakan suasana yang aman serta menyenangkan.</li><li>Guru mengaitkan materi dengan pengalaman/konteks yang dekat dengan peserta didik.</li><li>Peserta didik menjawab pertanyaan pemantik dan menyampaikan pemahaman awal.</li><li>Guru menyampaikan arah kegiatan dan kriteria keberhasilan.</li></ul>' +
      '<h5 style="margin:12px 0 6px">Kegiatan Inti — '+t.inti+' menit</h5>'+
      '<ol><li><b>Memahami — '+t.memahami+' menit:</b> peserta didik mengamati, mengeksplorasi informasi, mengidentifikasi hal penting, berdiskusi, dan membangun pemahaman awal melalui sumber belajar yang tersedia.</li>' +
      '<li><b>Mengaplikasi — '+t.mengaplikasi+' menit:</b> peserta didik melakukan praktik, menyelesaikan tugas/LKPD, berkolaborasi atau memecahkan masalah kontekstual, lalu menghasilkan bukti belajar berupa jawaban, catatan, karya, produk, atau unjuk kerja. Guru memberikan umpan balik selama proses.</li>' +
      '<li><b>Merefleksi — '+t.merefleksi+' menit:</b> peserta didik menyampaikan hasil, mencermati bukti belajar, menerima umpan balik, dan mengidentifikasi hal yang sudah dipahami serta yang masih perlu diperbaiki.</li></ol>' +
      '<h5 style="margin:12px 0 6px">Kegiatan Penutup — '+t.penutup+' menit</h5>'+
      '<ul><li>Peserta didik bersama guru menyimpulkan pembelajaran.</li><li>Peserta didik melakukan refleksi singkat terhadap proses dan hasil belajar.</li><li>Guru memberikan penguatan, tindak lanjut, remedial/pengayaan bila diperlukan, kemudian menutup pembelajaran.</li></ul>' +
      '</div>';
  }
  function cleanText(s){
    if(!isRPMText(s)) return s;
    const out=String(s);
    const start=/D\.\s*PENGALAMAN BELAJAR MENDALAM/i.exec(out);
    const end=/\n\s*E\.\s*ASESMEN/i.exec(out);
    if(start&&end&&end.index>start.index){
      return out.slice(0,start.index)+'D. PENGALAMAN BELAJAR MENDALAM\n'+
        'Kegiatan Awal — alokasi waktu otomatis\n'+
        'Kegiatan Inti — Memahami, Mengaplikasi, Merefleksi\n'+
        'Kegiatan Penutup — alokasi waktu otomatis\n'+out.slice(end.index);
    }
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
      if(!h||h.dataset.rpmFinal==='2') return;
      h.dataset.rpmFinal='2';
      let n=h.nextElementSibling;
      while(n&&(!(/^E\./i.test((n.textContent||'').trim())||(n.tagName==='H4'&&/Asesmen/i.test((n.textContent||'').trim()))))){
        const next=n.nextElementSibling;n.remove();n=next;
      }
      h.insertAdjacentHTML('afterend',htmlFor(box));
    });
  }
  function patch(){patchHTML(document);patchTextareas(document);}
  const obs=new MutationObserver(patch);
  function boot(){patch();obs.observe(document.body,{subtree:true,childList:true,characterData:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
