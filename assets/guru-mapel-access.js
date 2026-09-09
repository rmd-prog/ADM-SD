/* ADM-SD — Guru Mapel subject access guard */
(function(){
  'use strict';
  const SUBJECTS=['Pendidikan Agama dan Budi Pekerti','PJOK','Bahasa Inggris'];
  const API='https://adm-sd.adm-sd.workers.dev/api';
  const normalize=v=>String(v??'').trim().toLowerCase().replace(/\s+/g,' ');
  const normalizeSubject=v=>{
    const s=normalize(v);
    if(['agama','pai','pendidikan agama','pendidikan agama dan budi pekerti'].includes(s))return 'Pendidikan Agama dan Budi Pekerti';
    if(['pjok','pendidikan jasmani','pendidikan jasmani olahraga dan kesehatan'].includes(s))return 'PJOK';
    if(['inggris','bahasa inggris','english'].includes(s))return 'Bahasa Inggris';
    return String(v??'').trim();
  };
  const teacher=()=>{
    try{const x=JSON.parse(localStorage.getItem('siLogin')||'null');if(x)return x.user||x}catch{}
    return null;
  };
  const own=()=>{const t=teacher();return t&&String(t.role||'').toLowerCase()==='guru_mapel'?normalizeSubject(t.mapel||''):''};
  const isStudentOrAttendance=path=>path==='/api/siswa'||path==='/api/absensi';
  const subjectKeys=['mapel','mata_pelajaran','mataPelajaran','subject'];
  const getSubject=o=>{if(!o||typeof o!=='object')return '';for(const k of subjectKeys)if(o[k]!=null&&String(o[k]).trim())return normalizeSubject(o[k]);return ''};
  const stampBody=(body,subject)=>{if(!body||!subject)return body;const out=typeof body==='object'&&!Array.isArray(body)?{...body}:body;if(out&&typeof out==='object'&&!Array.isArray(out)&&!getSubject(out))out.mapel=subject;return out};
  const filterValue=(v,subject)=>{if(Array.isArray(v))return v.map(x=>filterValue(x,subject)).filter(x=>{const s=getSubject(x);return !s||s===subject});if(v&&typeof v==='object'){const o={};for(const [k,val] of Object.entries(v))o[k]=filterValue(val,subject);return o}return v};
  const originalFetch=window.fetch.bind(window);
  window.fetch=async function(input,init){
    const subject=own();if(!subject)return originalFetch(input,init);
    let url=typeof input==='string'?input:(input&&input.url)||'';let u;try{u=new URL(url,location.href)}catch{return originalFetch(input,init)}
    if(!u.pathname.startsWith('/api/')&&!u.href.startsWith(API))return originalFetch(input,init);
    const path=u.pathname.startsWith('/api/')?u.pathname:u.pathname.replace(new URL(API).pathname,'/api');
    const opts=Object.assign({},init||{});const method=String(opts.method||((input&&input.method)||'GET')).toUpperCase();
    if(!isStudentOrAttendance(path)){
      if(method==='GET'){
        if(!u.searchParams.has('mapel')&&!u.searchParams.has('mata_pelajaran')&&!u.searchParams.has('mataPelajaran')&&!u.searchParams.has('subject'))u.searchParams.set('mapel',subject);
        url=u.toString();if(typeof input==='string')input=url;else input=new Request(url,input);
      }else if(opts.body){
        try{const b=JSON.parse(opts.body);opts.body=JSON.stringify(stampBody(b,subject))}catch{}
      }
    }
    const res=await originalFetch(input,opts);if(isStudentOrAttendance(path)||!subject)return res;
    const ct=res.headers.get('content-type')||'';if(!ct.includes('application/json'))return res;
    try{const data=await res.clone().json();const filtered=filterValue(data,subject);return new Response(JSON.stringify(filtered),{status:res.status,statusText:res.statusText,headers:res.headers})}catch{return res}
  };
  function lockSubjectSelects(){const subject=own();if(!subject)return;document.querySelectorAll('select').forEach(sel=>{const opts=[...sel.options];opts.forEach(o=>{const s=normalizeSubject(o.value||o.textContent||'');if(SUBJECTS.some(x=>normalize(x)===normalize(s))&&normalize(s)!==normalize(subject)){o.hidden=true;o.disabled=true}});const good=opts.find(o=>!o.disabled&&normalizeSubject(o.value||o.textContent||'')===subject);if(good)sel.value=good.value})}
  const obs=new MutationObserver(lockSubjectSelects);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{lockSubjectSelects();obs.observe(document.body,{childList:true,subtree:true})},{once:true});else{lockSubjectSelects();obs.observe(document.body,{childList:true,subtree:true})}
})();

/* ADM-SD — Index menu finishing pack loader. Additive only; does not touch auth/D1/rombel/absensi. */
(function(){
  'use strict';
  if(window.__ADM_INDEX_FINISHING_LOADER__)return;
  window.__ADM_INDEX_FINISHING_LOADER__=true;
  function load(){
    if(document.querySelector('script[data-adm-index-finishing]'))return;
    const s=document.createElement('script');
    s.src='assets/index-menu-finishing.js';
    s.async=false;
    s.dataset.admIndexFinishing='1';
    s.onload=()=>console.info('[ADM] Index menu finishing aktif.');
    s.onerror=()=>console.warn('[ADM] Index menu finishing gagal dimuat.');
    document.body.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
