/* ADM-SD — Guru Mapel subject access guard */
(function(){
  'use strict';
  const SUBJECTS=['Pendidikan Agama dan Budi Pekerti','PJOK','Bahasa Inggris'];
  const normalize=v=>String(v??'').trim().toLowerCase().replace(/\s+/g,' ');
  const normalizeSubject=v=>{const s=normalize(v);if(s==='pai'||s.includes('pendidikan agama'))return 'pendidikan agama dan budi pekerti';if(s==='pjok'||s.includes('pendidikan jasmani'))return 'pjok';if(s.includes('bahasa inggris')||s==='english')return 'bahasa inggris';return s};
  function getUser(){try{return JSON.parse(localStorage.getItem('siAuthUser')||'null')}catch{return null}}
  function own(){return normalizeSubject(getUser()?.subject||getUser()?.mapel||getUser()?.mataPelajaran||'')}
  function filterValue(v,subject){if(Array.isArray(v))return v.filter(x=>{const s=normalizeSubject(x?.mapel||x?.mataPelajaran||x?.subject||'');return !SUBJECTS.some(a=>normalize(a)===s)||s===subject});if(v&&typeof v==='object'){const o={...v};['data','rows','items','students','siswa'].forEach(k=>{if(Array.isArray(o[k]))o[k]=filterValue(o[k],subject)});return o}return v}
  const originalFetch=window.fetch.bind(window);
  window.fetch=async function(input,init){const res=await originalFetch(input,init);try{const url=typeof input==='string'?input:input?.url||'';const subject=own();if(!subject||!url.includes('/api/'))return res;const ct=res.headers.get('content-type')||'';if(!ct.includes('application/json'))return res;const data=await res.clone().json();const filtered=filterValue(data,subject);return new Response(JSON.stringify(filtered),{status:res.status,statusText:res.statusText,headers:res.headers})}catch{return res}};
  function lockSubjectSelects(){const subject=own();if(!subject)return;document.querySelectorAll('select').forEach(sel=>{const opts=[...sel.options];opts.forEach(o=>{const s=normalizeSubject(o.value||o.textContent||'');if(SUBJECTS.some(x=>normalize(x)===normalize(s))&&normalize(s)!==subject){o.hidden=true;o.disabled=true}});const good=opts.find(o=>!o.disabled&&normalizeSubject(o.value||o.textContent||'')===subject);if(good)sel.value=good.value})}
  const obs=new MutationObserver(lockSubjectSelects);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{lockSubjectSelects();obs.observe(document.body,{childList:true,subtree:true})},{once:true});else{lockSubjectSelects();obs.observe(document.body,{childList:true,subtree:true})}
})();

/* ADM-SD — Index menu finishing pack loaders */
(function(){
  'use strict';
  if(window.__ADM_INDEX_FINISHING_LOADER__)return;
  window.__ADM_INDEX_FINISHING_LOADER__=true;
  function load(src,flag){if(document.querySelector('script['+flag+']'))return;const s=document.createElement('script');s.src=src;s.async=false;s.setAttribute(flag,'1');document.body.appendChild(s)}
  function boot(){load('assets/index-menu-finishing.js','data-adm-index-finishing');setTimeout(()=>load('assets/index-menu-finishing-v2.js','data-adm-index-finishing-v2'),250);setTimeout(()=>load('assets/index-menu-finishing-v3.js','data-adm-index-finishing-v3'),450);setTimeout(()=>load('assets/index-menu-finishing-v4.js','data-adm-index-finishing-v4'),650);setTimeout(()=>load('assets/index-menu-finishing-v5.js','data-adm-index-finishing-v5'),850)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
