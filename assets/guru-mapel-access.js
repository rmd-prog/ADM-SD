/* ADM-SD — Guru Mapel subject access guard */
(function(){
'use strict';
if(window.__ADM_GURU_MAPEL_ACCESS_CORE__)return;
window.__ADM_GURU_MAPEL_ACCESS_CORE__=true;
const SUBJECTS=['Pendidikan Agama dan Budi Pekerti','PJOK','Bahasa Inggris'];
const normalize=v=>String(v??'').trim().toLowerCase().replace(/\s+/g,' ');
const normalizeSubject=v=>{const s=normalize(v);if(s==='pai'||s.includes('pendidikan agama'))return 'pendidikan agama dan budi pekerti';if(s==='pjok'||s.includes('pendidikan jasmani'))return 'pjok';if(s.includes('bahasa inggris')||s==='english')return 'bahasa inggris';return s};
function getUser(){try{return JSON.parse(localStorage.getItem('siAuthUser')||localStorage.getItem('siLogin')||'null')}catch{return null}}
function own(){const u=getUser();return normalizeSubject(u?.subject||u?.mapel||u?.mataPelajaran||u?.user?.subject||u?.user?.mapel||'')}
function filterValue(v,subject){if(Array.isArray(v))return v.filter(x=>{const s=normalizeSubject(x?.mapel||x?.mataPelajaran||x?.subject||'');return !SUBJECTS.some(a=>normalize(a)===s)||s===subject});if(v&&typeof v==='object'){const o={...v};['data','rows','items','students','siswa'].forEach(k=>{if(Array.isArray(o[k]))o[k]=filterValue(o[k],subject)});return o}return v}
const originalFetch=window.fetch.bind(window);
if(!window.__ADM_GURU_MAPEL_FETCH__){
  window.__ADM_GURU_MAPEL_FETCH__=true;
  window.fetch=async function(input,init){
    const res=await originalFetch(input,init);
    try{const url=typeof input==='string'?input:input?.url||'';const subject=own();if(!subject||!url.includes('/api/'))return res;const ct=res.headers.get('content-type')||'';if(!ct.includes('application/json'))return res;const data=await res.clone().json();return new Response(JSON.stringify(filterValue(data,subject)),{status:res.status,statusText:res.statusText,headers:res.headers})}catch{return res}
  };
}
function lockSubjectSelects(){const subject=own();if(!subject)return;document.querySelectorAll('select').forEach(sel=>{const opts=[...sel.options];opts.forEach(o=>{const s=normalizeSubject(o.value||o.textContent||'');if(SUBJECTS.some(x=>normalize(x)===normalize(s))&&normalize(s)!==subject){o.hidden=true;o.disabled=true}});const good=opts.find(o=>!o.disabled&&normalizeSubject(o.value||o.textContent||'')===subject);if(good)sel.value=good.value})}
const obs=new MutationObserver(()=>{try{lockSubjectSelects()}catch{}});
function boot(){lockSubjectSelects();obs.observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();