/* ADM-SD — AI Generate hierarchical curriculum selector V2 */
(function(){
  'use strict';
  const norm=s=>String(s??'').trim().toLowerCase().replace(/\s+/g,' ');
  const root=()=>document.getElementById('aiGenerate');
  const findSelectByLabel=(rx)=>{
    const r=root(); if(!r)return null;
    for(const label of r.querySelectorAll('label')){
      if(!rx.test(label.textContent||''))continue;
      const id=label.htmlFor;
      if(id){const x=document.getElementById(id);if(x&&x.tagName==='SELECT')return x}
      const x=label.parentElement?.querySelector('select'); if(x)return x;
    }
    return null;
  };
  const getMapel=()=>document.getElementById('aiMapel')||findSelectByLabel(/mata\s*pelajaran|mapel/i);
  const getKelas=()=>document.getElementById('aiKelas')||findSelectByLabel(/kelas\s*\/\s*rombel|kelas|rombel/i);
  let curriculum=null;
  let loading=null;
  async function loadCurriculum(){
    if(curriculum)return curriculum;
    if(loading)return loading;
    loading=(async()=>{
      try{
        const url=new URL('lkpd.html',location.href).href;
        const res=await fetch(url,{cache:'no-store'});
        if(!res.ok)throw Error('LKPD HTTP '+res.status);
        const text=await res.text();
        const start=text.indexOf('const curriculum=');
        if(start<0)throw Error('const curriculum tidak ditemukan');
        const brace=text.indexOf('{',start); if(brace<0)throw Error('awal curriculum tidak ditemukan');
        let depth=0,end=-1,inStr=false,quote='',esc=false;
        for(let i=brace;i<text.length;i++){
          const c=text[i];
          if(inStr){if(esc)esc=false;else if(c==='\\')esc=true;else if(c===quote)inStr=false;continue}
          if(c==='"'||c==="'"||c==='`'){inStr=true;quote=c;continue}
          if(c==='{')depth++;
          else if(c==='}'&&--depth===0){end=i+1;break}
        }
        if(end<0)throw Error('akhir curriculum tidak ditemukan');
        curriculum=Function('return ('+text.slice(brace,end)+')')();
        if(!curriculum||typeof curriculum!=='object')throw Error('curriculum kosong');
      }catch(e){console.warn('[AI curriculum]',e);curriculum={};}
      finally{loading=null}
      return curriculum;
    })();
    return loading;
  }
  function classKey(){
    const x=getKelas();
    const raw=String(x?.value||x?.selectedOptions?.[0]?.textContent||'').trim().toUpperCase().replace(/\s+/g,'');
    const map={'1':'1','1A':'1','1B':'1','I':'1','IA':'1','IB':'1','2':'2','2A':'2','2B':'2','II':'2','IIA':'2','IIB':'2','3':'3','3A':'3','3B':'3','III':'3','IIIA':'3','IIIB':'3','4':'4','4A':'4','4B':'4','IV':'4','IVA':'4','IVB':'4','5':'5','V':'5','6':'6','VI':'6'};
    return map[raw]||((raw.match(/[1-6]/)||[])[0]||'');
  }
  function currentRoleSubject(){
    try{const x=JSON.parse(localStorage.getItem('siLogin')||'null');const u=x?.user||x;return norm(u?.role)==='guru_mapel'?String(u?.mapel||''):''}catch{return ''}
  }
  function canonicalSubject(value){
    const s=norm(value);
    if(['agama','pai','pendidikan agama','pendidikan agama dan budi pekerti'].includes(s))return 'Pendidikan Agama dan Budi Pekerti';
    if(['pjok','pendidikan jasmani','pendidikan jasmani olahraga dan kesehatan'].includes(s))return 'PJOK';
    if(['inggris','bahasa inggris','english'].includes(s))return 'Bahasa Inggris';
    return String(value??'').trim();
  }
  function applyRoleSubject(){
    const mapel=getMapel(),own=currentRoleSubject(); if(!mapel||!own)return;
    const opt=[...mapel.options].find(o=>norm(canonicalSubject(o.value))===norm(canonicalSubject(own))||norm(canonicalSubject(o.textContent))===norm(canonicalSubject(own)));
    if(opt){mapel.value=opt.value;[...mapel.options].forEach(o=>{const hide=o!==opt;o.hidden=hide;o.disabled=hide})}
  }
  function fill(sel,items,placeholder){
    if(!sel)return;
    sel.innerHTML='<option value="">'+placeholder+'</option>';
    for(const x of items||[]){const o=document.createElement('option');o.value=x;o.textContent=x;sel.appendChild(o)}
    sel.disabled=!(items&&items.length);
  }
  function ensureUI(){
    const r=root(); if(!r)return false;
    if(document.getElementById('aiBabSelector'))return true;
    const mapel=getMapel(); if(!mapel)return false;
    const box=document.createElement('div');
    box.id='aiCurriculumBox';
    box.style.cssText='grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px';
    box.innerHTML='<div><label for="aiBabSelector">📚 Bab / Materi</label><select id="aiBabSelector"><option value="">Memuat Bab / Materi...</option></select></div><div><label for="aiSubbabSelector">📖 Sub Bab / Topik</label><select id="aiSubbabSelector" disabled><option value="">Pilih Sub Bab / Topik</option></select></div>';
    (mapel.closest('.doc-controls')||mapel.parentElement)?.after(box);
    const bab=document.getElementById('aiBabSelector'),sub=document.getElementById('aiSubbabSelector');
    mapel.addEventListener('change',refreshBab);
    const kelas=getKelas(); kelas?.addEventListener('change',refreshBab);
    bab.addEventListener('change',refreshSub);
    sub.addEventListener('change',syncPrompt);
    loadCurriculum().then(()=>{applyRoleSubject();refreshBab()});
    return true;
  }
  async function refreshBab(){
    const data=await loadCurriculum(),mapel=getMapel(),bab=document.getElementById('aiBabSelector'),sub=document.getElementById('aiSubbabSelector');
    if(!mapel||!bab||!sub)return;
    applyRoleSubject();
    const kelas=classKey(),subject=canonicalSubject(mapel.value);
    const key=Object.keys(data).find(k=>norm(canonicalSubject(k))===norm(subject));
    const byClass=key&&data[key]&&data[key][kelas] ? data[key][kelas] : {};
    fill(bab,Object.keys(byClass),'Pilih Bab / Materi');
    fill(sub,[],'Pilih Sub Bab / Topik');
    syncPrompt();
  }
  function refreshSub(){
    const data=curriculum||{},mapel=getMapel(),bab=document.getElementById('aiBabSelector'),sub=document.getElementById('aiSubbabSelector');
    if(!mapel||!bab||!sub)return;
    const kelas=classKey(),subject=canonicalSubject(mapel.value),key=Object.keys(data).find(k=>norm(canonicalSubject(k))===norm(subject));
    const items=key&&data[key]&&data[key][kelas]&&data[key][kelas][bab.value] ? data[key][kelas][bab.value] : [];
    fill(sub,items,'Pilih Sub Bab / Topik');
    syncPrompt();
  }
  function findPrompt(){
    const r=root();if(!r)return null;
    return document.getElementById('aiPrompt')||r.querySelector('textarea')||[...r.querySelectorAll('input')].find(x=>x.type==='text');
  }
  function syncPrompt(){
    const p=findPrompt(),bab=document.getElementById('aiBabSelector'),sub=document.getElementById('aiSubbabSelector');if(!p)return;
    const marker='[KONTEKS KURIKULUM ADM-SD]';
    const old=String(p.value||'').split(marker)[0].trim();
    if(bab?.value&&sub?.value){
      p.value=old+'\n\n'+marker+'\nBab/Materi: '+bab.value+'\nSub Bab/Topik: '+sub.value+'\nGunakan materi ini sebagai fokus utama. Jangan melebar ke bab atau subbab lain.';
      p.dispatchEvent(new Event('input',{bubbles:true}));
    }else p.value=old;
  }
  function guardGenerate(){
    const r=root();if(!r||r.dataset.curriculumGuard)return;
    r.dataset.curriculumGuard='1';
    r.addEventListener('click',e=>{
      const b=e.target.closest('button');if(!b||!/generate\s+(dengan\s+ai|lkpd)/i.test(b.textContent||''))return;
      const bab=document.getElementById('aiBabSelector'),sub=document.getElementById('aiSubbabSelector');
      if(!bab?.value||!sub?.value){e.preventDefault();e.stopImmediatePropagation();alert('Pilih Bab/Materi dan Sub Bab/Topik terlebih dahulu agar AI tidak membuat materi secara global.');return}
      syncPrompt();
    },true);
  }
  let timer=0;
  function start(){
    if(timer)clearInterval(timer);
    let tries=0;
    timer=setInterval(()=>{
      tries++;
      const r=root();
      if(r&&ensureUI()){clearInterval(timer);timer=0;guardGenerate();observe(r);return}
      if(tries>40){clearInterval(timer);timer=0;}
    },250);
  }
  function observe(r){
    if(r.dataset.curriculumObserver)return;
    r.dataset.curriculumObserver='1';
    new MutationObserver(()=>{
      if(!document.getElementById('aiBabSelector')){start();return}
      const mapel=getMapel(),kelas=getKelas();
      if(mapel&&kelas&&!mapel.dataset.curriculumHook){mapel.dataset.curriculumHook='1';mapel.addEventListener('change',refreshBab);kelas.dataset.curriculumHook='1';kelas.addEventListener('change',refreshBab)}
    }).observe(r,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,100));
  else setTimeout(start,100);
})();
