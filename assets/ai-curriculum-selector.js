/* ADM-SD — AI Generate hierarchical curriculum selector
   Adds Bab + Sub Bab after Mata Pelajaran and constrains AI context to the selection.
   Curriculum is read from the maintained LKPD curriculum source so the same material map
   drives LKPD and the central AI generator. */
(function(){
  'use strict';
  const esc=s=>String(s??'').replace(/[<>]/g,'');
  const norm=s=>String(s??'').trim().toLowerCase().replace(/\s+/g,' ');
  const root=()=>document.getElementById('aiGenerate');
  const findSelectByLabel=(rx)=>{
    const r=root(); if(!r)return null;
    for(const label of r.querySelectorAll('label')){
      if(rx.test(label.textContent||'')){
        const id=label.htmlFor; if(id){const x=document.getElementById(id);if(x&&x.tagName==='SELECT')return x}
        const x=label.parentElement?.querySelector('select'); if(x)return x;
      }
    }
    return null;
  };
  function getMapel(){
    const r=root(); if(!r)return null;
    return document.getElementById('aiMapel')||findSelectByLabel(/mata\s*pelajaran|mapel/i)||r.querySelector('select');
  }
  function getKelas(){
    const r=root(); if(!r)return null;
    return document.getElementById('aiKelas')||findSelectByLabel(/kelas|rombel/i);
  }
  function getCategory(){
    const r=root(); if(!r)return '';
    return document.getElementById('aiJenis')||findSelectByLabel(/kategori|jenis/i)?.value||'';
  }
  let curriculum=null;
  async function loadCurriculum(){
    if(curriculum)return curriculum;
    try{
      const base=new URL('lkpd.html',location.href).href;
      const text=await (await fetch(base,{cache:'no-store'})).text();
      const m=text.match(/const\s+curriculum\s*=\s*(\{[\s\S]*?\})\s*;\s*\n/);
      if(!m)throw Error('curriculum tidak ditemukan');
      curriculum=Function('return ('+m[1]+')')();
    }catch(e){
      console.warn('[AI curriculum]',e);
      curriculum={};
    }
    return curriculum;
  }
  function currentRoleSubject(){
    try{const x=JSON.parse(localStorage.getItem('siLogin')||'null');const u=x?.user||x;return norm(u?.role)==='guru_mapel'?String(u?.mapel||''):''}catch{return ''}
  }
  function currentKelas(){const x=getKelas();return x?String(x.value||'').replace(/[^0-9]/g,''):''}
  function ensureUI(){
    const r=root(); if(!r||document.getElementById('aiBabSelector'))return !!r;
    const mapel=getMapel(); if(!mapel)return false;
    const box=document.createElement('div');box.id='aiCurriculumBox';box.style.cssText='grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:2px';
    box.innerHTML=`<div><label for="aiBabSelector">📚 Bab / Materi</label><select id="aiBabSelector" disabled><option value="">Pilih Bab / Materi</option></select></div><div><label for="aiSubbabSelector">📖 Sub Bab / Topik</label><select id="aiSubbabSelector" disabled><option value="">Pilih Sub Bab / Topik</option></select></div>`;
    const target=mapel.closest('.field')||mapel.parentElement;
    target?.after(box);
    const bab=document.getElementById('aiBabSelector'),sub=document.getElementById('aiSubbabSelector');
    mapel.addEventListener('change',()=>refreshBab());
    getKelas()?.addEventListener('change',()=>refreshBab());
    bab.addEventListener('change',()=>refreshSub());
    sub.addEventListener('change',syncPrompt);
    loadCurriculum().then(refreshBab);
    return true;
  }
  function fill(sel,items,placeholder){sel.innerHTML=`<option value="">${placeholder}</option>`;for(const x of items){const o=document.createElement('option');o.value=x;o.textContent=x;sel.appendChild(o)}sel.disabled=!items.length}
  async function refreshBab(){
    const data=await loadCurriculum(),mapel=getMapel(),bab=document.getElementById('aiBabSelector'),sub=document.getElementById('aiSubbabSelector');
    if(!mapel||!bab||!sub)return;
    const kelas=currentKelas(), own=currentRoleSubject(), wanted=mapel.value;
    if(own&&norm(own)!==norm(wanted)){
      const opt=[...mapel.options].find(o=>norm(o.value)===norm(own)||norm(o.textContent)===norm(own));if(opt){mapel.value=opt.value}}
    const subject=mapel.value||own; const src=data[subject]||data[Object.keys(data).find(k=>norm(k)===norm(subject))]||{};
    const byClass=src[kelas]||{};
    fill(bab,Object.keys(byClass),'Pilih Bab / Materi');fill(sub,[],'Pilih Sub Bab / Topik');syncPrompt();
  }
  function refreshSub(){
    const data=curriculum||{},mapel=getMapel(),bab=document.getElementById('aiBabSelector'),sub=document.getElementById('aiSubbabSelector'),kelas=currentKelas();
    if(!mapel||!bab||!sub)return;
    const src=data[mapel.value]||{}, arr=src[kelas]?.[bab.value]||[];fill(sub,arr,'Pilih Sub Bab / Topik');syncPrompt();
  }
  function findPrompt(){
    const r=root();if(!r)return null;
    return document.getElementById('aiPrompt')||r.querySelector('textarea')||[...r.querySelectorAll('input')].find(x=>x.type==='text');
  }
  function syncPrompt(){
    const r=root(),p=findPrompt(),bab=document.getElementById('aiBabSelector'),sub=document.getElementById('aiSubbabSelector');
    if(!r||!p)return;
    const marker='[KONTEKS KURIKULUM ADM-SD]';
    const old=String(p.value||'').split(marker)[0].trim();
    if(bab?.value&&sub?.value){p.value=old+'\n\n'+marker+'\nBab/Materi: '+bab.value+'\nSub Bab/Topik: '+sub.value+'\nGunakan materi ini sebagai fokus utama. Jangan melebar ke bab atau subbab lain.';p.dispatchEvent(new Event('input',{bubbles:true}))}else p.value=old;
  }
  function guardGenerate(){
    const r=root();if(!r||r.dataset.curriculumGuard)return;r.dataset.curriculumGuard='1';
    r.addEventListener('click',e=>{
      const b=e.target.closest('button');if(!b)return;
      if(!/generate\s+dengan\s+ai/i.test(b.textContent||''))return;
      const bab=document.getElementById('aiBabSelector'),sub=document.getElementById('aiSubbabSelector');
      if(!bab?.value||!sub?.value){e.preventDefault();e.stopImmediatePropagation();alert('Pilih Bab/Materi dan Sub Bab/Topik terlebih dahulu agar AI tidak membuat materi secara global.');return}
      syncPrompt();
    },true);
  }
  function start(){
    if(!ensureUI())return;
    guardGenerate();
    const r=root();
    new MutationObserver(()=>{if(!document.getElementById('aiBabSelector'))ensureUI()}).observe(r,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,150));else setTimeout(start,150);
})();
