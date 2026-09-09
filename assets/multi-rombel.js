/* ADM-SD — Multi-rombel support for Bu Annisa (IIA + IIB) */
(function(){
  'use strict';
  const TARGET='199304252024212021';
  const ROMBELS=['IIA','IIB'];
  const LABEL={IIA:'Kelas 2A',IIB:'Kelas 2B'};
  const getSession=()=>{try{return JSON.parse(localStorage.getItem('siLogin')||'null')}catch{return null}};
  const getUser=()=>{const s=getSession();return s?.user||s||null};
  const isTarget=()=>String(getUser()?.username||'').trim()===TARGET;
  const norm=v=>String(v||'').trim().toUpperCase().replace(/\s+/g,'');
  const canon=v=>{const r=norm(v);return r==='2A'||r==='KELASIIA'||r==='IIA'?'IIA':r==='2B'||r==='KELASIIB'||r==='IIB'?'IIB':r};
  function b64json(s){try{return JSON.parse(atob(s))}catch{return null}}
  function enc(o){try{return btoa(JSON.stringify(o))}catch{return ''}}
  function active(){const s=getSession();return canon(s?.user?.activeRombel||s?.user?.rombel||localStorage.getItem('admActiveRombel')||'IIA')==='IIB'?'IIB':'IIA'}
  function setSessionRombel(r){
    if(!isTarget()) return;
    r=canon(r); if(!ROMBELS.includes(r)) r='IIA';
    localStorage.setItem('admActiveRombel',r);
    const s=getSession(); if(!s)return;
    const u=s.user||s;
    u.rombels=ROMBELS.slice(); u.activeRombel=r; u.rombel=r; u.kelas=r;
    if(s.user) s.user=u;
    let tok=s.token||u.token||'';
    const t=b64json(String(tok).replace(/^Bearer\s+/i,''));
    if(t){t.rombels=ROMBELS.slice();t.activeRombel=r;t.rombel=r;t.kelas=r;s.token=enc(t);u.token=s.token;}
    localStorage.setItem('siLogin',JSON.stringify(s));
    window.__ADM_ACTIVE_ROMBEL=r;
    document.dispatchEvent(new CustomEvent('adm-rombel-change',{detail:{rombel:r,rombels:ROMBELS.slice()}}));
  }
  function getToken(){const s=getSession();return String(s?.token||s?.user?.token||'').replace(/^Bearer\s+/i,'')}
  function rewriteBody(text,r){
    try{const o=JSON.parse(text);if(!o||typeof o!=='object')return text;for(const k of ['rombel','kelas','class','class_id','kelas_id'])if(k in o)o[k]=r;return JSON.stringify(o)}catch{return text}
  }
  function installFetch(){
    if(window.__ADM_MULTI_ROMBEL_FETCH)return;
    window.__ADM_MULTI_ROMBEL_FETCH=true;
    const native=window.fetch.bind(window);
    window.fetch=async function(input,init){
      if(!isTarget())return native(input,init);
      const r=active();
      try{
        let req=input instanceof Request?input:new Request(input,init);
        const url=new URL(req.url,location.href);
        if(!/\/api\//.test(url.pathname))return native(input,init);
        const token=getToken();
        if(token){const h=new Headers(req.headers);h.set('Authorization','Bearer '+token);req=new Request(req,{headers:h});}
        if(url.searchParams.has('rombel'))url.searchParams.set('rombel',r);
        if(url.searchParams.has('kelas'))url.searchParams.set('kelas',r);
        const ct=req.headers.get('content-type')||'';
        if(ct.includes('application/json')&&!['GET','HEAD'].includes(req.method)){
          const txt=await req.clone().text();
          req=new Request(new Request(req,{body:rewriteBody(txt,r)}));
        }
        return native(req);
      }catch{return native(input,init)}
    };
  }
  function render(){
    if(!isTarget())return;
    let box=document.getElementById('admMultiRombel');
    const host=document.querySelector('.top-right');
    if(!host)return;
    if(!box){
      box=document.createElement('div');box.id='admMultiRombel';box.style.cssText='display:flex;align-items:center;gap:6px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:999px;padding:4px 8px;font-size:12px;font-weight:800;box-shadow:0 3px 12px #2563eb18;';
      box.innerHTML='<span style="white-space:nowrap">📚 Kelas</span><select id="admMultiRombelSelect" style="width:auto;min-width:105px;padding:6px 24px 6px 8px;border-radius:999px;border:1px solid #93c5fd;background:#fff;font-size:12px;font-weight:800"></select>';
      host.insertBefore(box,host.firstChild);
      box.querySelector('select').addEventListener('change',e=>{setSessionRombel(e.target.value);render();});
    }
    const sel=box.querySelector('select');sel.innerHTML=ROMBELS.map(x=>`<option value="${x}">${LABEL[x]}</option>`).join('');sel.value=active();
    box.title='Pilih rombel aktif. Akses Bu Annisa dibatasi hanya Kelas 2A dan 2B.';
  }
  function boot(){installFetch();render();setTimeout(render,300);setTimeout(render,1000);setTimeout(render,2000);const obs=new MutationObserver(()=>render());if(document.body)obs.observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.__ADM_MULTI_ROMBEL={active,set:setSessionRombel,rombels:ROMBELS.slice};
})();
