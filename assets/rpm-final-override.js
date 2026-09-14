/* SIAP GURU — RPM FINAL OVERRIDE V3
 * RPM-only compatibility layer. Converts the generated RPM result itself.
 * No D1, Worker, login, dashboard, or persistence changes.
 */
(function(){
  'use strict';
  if(window.__SIAP_GURU_RPM_FINAL_V3__)return;
  window.__SIAP_GURU_RPM_FINAL_V3__=true;

  function isRPM(box){
    const t=String(box?.innerText||box?.textContent||'').toUpperCase();
    return t.includes('RENCANA PEMBELAJARAN MENDALAM')||t.includes('PENGALAMAN BELAJAR MENDALAM')||t.includes('MATERI:');
  }
  function jp(box){
    const m=String(box?.innerText||box?.textContent||'').match(/ALOKASI\s*:\s*(\d+)\s*JP/i);
    return Math.max(1,Number(m?.[1]||2));
  }
  function schedule(total){
    const awal=Math.max(5,Math.round(total*.15/5)*5);
    const penutup=Math.max(5,Math.round(total*.15/5)*5);
    const inti=total-awal-penutup;
    const memahami=Math.max(5,Math.round(inti*.30/5)*5);
    const merefleksi=Math.max(5,Math.round(inti*.20/5)*5);
    const mengaplikasi=Math.max(5,inti-memahami-merefleksi);
    return {awal,inti,memahami,mengaplikasi,merefleksi,penutup};
  }
  function activity(box){
    const t=schedule(jp(box)*35);
    return '<h4>D. Kegiatan Pembelajaran</h4>'+
      '<h5>Kegiatan Awal — '+t.awal+' menit</h5>'+
      '<ul><li>Guru membuka pembelajaran, membangun kesiapan belajar, dan menciptakan suasana yang aman, positif, dan menyenangkan.</li><li>Guru mengaitkan materi dengan pengalaman atau konteks yang dekat dengan peserta didik.</li><li>Peserta didik menjawab pertanyaan pemantik dan menyampaikan pemahaman awal.</li><li>Guru menyampaikan arah kegiatan dan kriteria keberhasilan.</li></ul>'+
      '<h5>Kegiatan Inti — '+t.inti+' menit</h5>'+
      '<ol><li><b>Memahami — '+t.memahami+' menit:</b> peserta didik mengamati, mengeksplorasi informasi, mengidentifikasi informasi penting, berdiskusi, dan membangun pemahaman melalui sumber belajar yang tersedia.</li><li><b>Mengaplikasi — '+t.mengaplikasi+' menit:</b> peserta didik melakukan praktik, mengerjakan tugas/LKPD, berkolaborasi atau memecahkan masalah kontekstual, lalu menghasilkan bukti belajar berupa jawaban, catatan, karya, produk, atau unjuk kerja. Guru memberi umpan balik selama proses.</li><li><b>Merefleksi — '+t.merefleksi+' menit:</b> peserta didik menyampaikan hasil, mencermati bukti belajar, menerima umpan balik, serta mengidentifikasi hal yang sudah dipahami dan yang masih perlu diperbaiki.</li></ol>'+ 
      '<h5>Kegiatan Penutup — '+t.penutup+' menit</h5>'+
      '<ul><li>Peserta didik bersama guru menyimpulkan pembelajaran.</li><li>Peserta didik melakukan refleksi singkat terhadap proses dan hasil belajar.</li><li>Guru memberikan penguatan dan tindak lanjut, termasuk remedial atau pengayaan bila diperlukan.</li></ul>';
  }
  function patch(box){
    if(!box||box.dataset.rpmV3==='1'||!isRPM(box))return;
    const h=[...box.querySelectorAll('h4')].find(x=>/D\.\s*(Pengalaman Belajar Mendalam|Kegiatan Pembelajaran)/i.test(x.textContent||''));
    if(!h)return;
    const e=[...box.querySelectorAll('h4')].find(x=>/^E\.\s*Asesmen/i.test((x.textContent||'').trim()));
    if(!e)return;
    const frag=document.createRange().createContextualFragment(activity(box));
    let n=h;
    while(n.nextElementSibling&&n.nextElementSibling!==e){n.nextElementSibling.remove();}
    h.replaceWith(frag);
    box.dataset.rpmV3='1';
  }
  function run(){
    document.querySelectorAll('#adsResult,.ads-result,.doc-preview-body').forEach(patch);
  }
  const obs=new MutationObserver(run);
  function boot(){run();if(document.body)obs.observe(document.body,{subtree:true,childList:true,characterData:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
