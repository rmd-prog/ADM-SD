/* SIAP GURU — RPM FINAL OVERRIDE V4
 * RPM-only. Hooks the real seedRPM output and also repairs visible RPM previews.
 * Does not touch D1, Worker, login, dashboard, student data, or persistence.
 */
(function(){
'use strict';
if(window.__SIAP_GURU_RPM_FINAL_V4__)return;
window.__SIAP_GURU_RPM_FINAL_V4__=true;

function r5(n){return Math.max(5,Math.round(n/5)*5)}
function times(jp){
  jp=Math.max(1,Number(jp)||2);const total=jp*35;
  let awal=r5(total*.15),penutup=r5(total*.15);
  if(awal+penutup>=total){awal=5;penutup=5}
  const inti=total-awal-penutup;
  let memahami=r5(inti*.30),mengaplikasi=r5(inti*.50),merefleksi=inti-memahami-mengaplikasi;
  if(merefleksi<5){merefleksi=5;mengaplikasi=Math.max(5,inti-memahami-merefleksi)}
  return{awal,inti,memahami,mengaplikasi,merefleksi,penutup,total}
}
function detectJP(s){
  const text=String(s||'');
  for(const re of [/alokasi(?:\s+waktu)?\s*[:：-]\s*(\d+)\s*JP/i,/alokasi\s*[:：-]?\s*(\d+)\s*JP/i,/durasi\s*[:：-]?\s*(\d+)\s*JP/i]){
    const m=text.match(re);if(m)return Math.max(1,Number(m[1]))
  }
  return 2
}
function rpmBlock(jp){
  const t=times(jp);
  return [
    'D. KEGIATAN PEMBELAJARAN','',
    `Kegiatan Awal — ${t.awal} menit`,
    '• Guru membuka pembelajaran, membangun kesiapan belajar, dan menciptakan suasana yang aman, positif, dan menyenangkan.',
    '• Guru mengaitkan pembelajaran dengan pengalaman atau konteks yang dekat dengan peserta didik.',
    '• Peserta didik merespons pertanyaan pemantik dan menyampaikan pemahaman awal.',
    '• Guru menyampaikan arah kegiatan dan kriteria keberhasilan.','',
    `Kegiatan Inti — ${t.inti} menit`,
    `1. Memahami — ${t.memahami} menit`,
    '   Peserta didik mengamati, mengeksplorasi sumber belajar, mengidentifikasi informasi penting, berdiskusi, dan membangun pemahaman melalui pengalaman belajar yang relevan.',
    `2. Mengaplikasi — ${t.mengaplikasi} menit`,
    '   Peserta didik melakukan praktik, mengerjakan tugas/LKPD, berkolaborasi atau memecahkan masalah kontekstual, menghasilkan bukti belajar, dan memperoleh umpan balik selama proses.',
    `3. Merefleksi — ${t.merefleksi} menit`,
    '   Peserta didik mengomunikasikan hasil, mencermati bukti belajar, menerima umpan balik, serta mengidentifikasi hal yang sudah dikuasai dan yang masih perlu diperbaiki.','',
    `Kegiatan Penutup — ${t.penutup} menit`,
    '• Guru dan peserta didik menyimpulkan pembelajaran.',
    '• Peserta didik melakukan refleksi singkat terhadap proses dan hasil belajar.',
    '• Guru memberikan penguatan dan tindak lanjut, termasuk remedial atau pengayaan bila diperlukan.'
  ].join('\n')
}
function normalizeRPM(s){
  s=String(s||'');
  if(!/RENCANA PEMBELAJARAN MENDALAM/i.test(s))return s;
  const startMatch=s.match(/(?:^|\n)D\.\s*(?:PENGALAMAN BELAJAR MENDALAM|KEGIATAN PEMBELAJARAN)/i);
  if(!startMatch)return s;
  const start=startMatch.index+(s[startMatch.index]==='\n'?1:0);
  const tail=s.slice(start);
  const end=tail.search(/\nE\.\s*ASESMEN/i);
  if(end<0)return s;
  return s.slice(0,start)+rpmBlock(detectJP(s))+tail.slice(end)
}
function hookSeedRPM(){
  if(typeof window.seedRPM!=='function'||window.seedRPM.__rpmFinalV4)return false;
  const original=window.seedRPM;
  function wrappedSeedRPM(){return normalizeRPM(original.apply(this,arguments))}
  wrappedSeedRPM.__rpmFinalV4=true;
  wrappedSeedRPM.__original=original;
  window.seedRPM=wrappedSeedRPM;
  return true
}
function patchTextareas(){
  document.querySelectorAll('textarea').forEach(el=>{
    const before=String(el.value||'');
    if(!/RENCANA PEMBELAJARAN MENDALAM/i.test(before))return;
    const after=normalizeRPM(before);
    if(after!==before){el.value=after;el.dispatchEvent(new Event('input',{bubbles:true}))}
  })
}
function patchPreview(box){
  if(!box||box.dataset.rpmV4==='1')return;
  const text=String(box.innerText||box.textContent||'');
  if(!/RENCANA PEMBELAJARAN MENDALAM/i.test(text))return;
  const h=[...box.querySelectorAll('h4')].find(x=>/D\.\s*(Pengalaman Belajar Mendalam|Kegiatan Pembelajaran)/i.test(x.textContent||''));
  const e=[...box.querySelectorAll('h4')].find(x=>/^E\.\s*Asesmen/i.test((x.textContent||'').trim()));
  if(!h||!e)return;
  const normalized=normalizeRPM(text);if(normalized===text)return;
  const frag=document.createDocumentFragment();
  const lines=normalized.slice(normalized.indexOf('D. KEGIATAN PEMBELAJARAN')).split('\n');
  lines.forEach(line=>{
    if(!line.trim())return;
    let x;
    if(/^D\.\s/.test(line))x=document.createElement('h4');
    else if(/^Kegiatan (Awal|Inti|Penutup)/.test(line))x=document.createElement('h5');
    else x=document.createElement('div');
    x.textContent=line.replace(/^\s*\d\.\s*/,'').replace(/^\s*•\s?/,'');
    if(x.tagName==='DIV')x.style.margin='4px 0';
    frag.appendChild(x)
  });
  let n=h;while(n.nextElementSibling&&n.nextElementSibling!==e)n.nextElementSibling.remove();
  h.replaceWith(frag);box.dataset.rpmV4='1'
}
function run(){
  hookSeedRPM();
  patchTextareas();
  document.querySelectorAll('#adsResult,.ads-result,.doc-preview-body').forEach(patchPreview)
}
function boot(){
  run();
  if(document.body)new MutationObserver(run).observe(document.body,{subtree:true,childList:true,characterData:true})
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
