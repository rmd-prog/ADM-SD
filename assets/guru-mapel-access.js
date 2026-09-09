/* ADM-SD — Guru Mapel subject access guard */
(function(){
  'use strict';
  const SUBJECTS=['Pendidikan Agama dan Budi Pekerti','PJOK','Bahasa Inggris'];
  const normalize=v=>String(v??'').trim().toLowerCase().replace(/\s+/g,' ');
  const normalizeSubject=v=>{const s=normalize(v);if(s==='pai'||s.includes('pendidikan agama'))return 'pendidikan agama dan budi pekerti';if(s==='pjok'||s.includes('pendidikan jasmani'))return 'pjok';if(s.includes('bahasa inggris')||s==='english')return 'bahasa inggris';return s};
  function getUser(){try{return JSON.parse(localStorage.getItem('siAuthUser')||'null')}catch{return null}}
  function own(){return normalizeSubject(getUser()?.subject||getUser()?.mapel||getUser()?.mataPelajaran||'')}
  function lockSubjectSelects(){const subject=own();if(!subject)return;document.querySelectorAll('select').forEach(sel=>{const opts=[...sel.options];opts.forEach(o=>{const s=normalizeSubject(o.value||o.textContent||'');if(SUBJECTS.some(x=>normalizeSubject(x)===s)&&s!==subject){o.hidden=true;o.disabled=true}});const good=opts.find(o=>!o.disabled&&normalizeSubject(o.value||o.textContent||'')===subject);if(good)sel.value=good.value})}
  const obs=new MutationObserver(lockSubjectSelects);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{lockSubjectSelects();obs.observe(document.body,{childList:true,subtree:true})},{once:true});else{lockSubjectSelects();obs.observe(document.body,{childList:true,subtree:true})}
})();

/* ADM-SD — Index menu finishing pack loader. Additive only; does not touch auth/D1/rombel/absensi. */
(function(){
  'use strict';
  if(window.__ADM_INDEX_FINISHING_LOADER__)return;
  window.__ADM_INDEX_FINISHING_LOADER__=true;
  function load(src,mark){if(document.querySelector('script['+mark+']'))return;const s=document.createElement('script');s.src=src;s.async=false;s.setAttribute(mark,'1');s.onload=()=>console.info('[ADM] '+src+' aktif.');s.onerror=()=>console.warn('[ADM] '+src+' gagal dimuat.');document.body.appendChild(s)}
  function boot(){load('assets/index-menu-finishing.js','data-adm-index-finishing');setTimeout(()=>load('assets/index-menu-finishing-v2.js','data-adm-index-finishing-v2'),250);setTimeout(()=>load('assets/index-menu-finishing-v3.js','data-adm-index-finishing-v3'),500)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
