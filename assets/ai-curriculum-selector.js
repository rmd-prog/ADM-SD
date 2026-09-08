/* ADM-SD — AI Generate hierarchical curriculum selector */
(function(){
  'use strict';
  const norm=s=>String(s??'').trim().toLowerCase().replace(/\s+/g,' ');
  const root=()=>document.getElementById('aiGenerate');
  const findSelectByLabel=(rx)=>{const r=root();if(!r)return null;for(const label of r.querySelectorAll('label'))if(rx.test(label.textContent||'')){const id=label.htmlFor;if(id){const x=document.getElementById(id);if(x&&x.tagName==='SELECT')return x}const x=label.parentElement?.querySelector('select');if(x)return x}return null};
  const getMapel=()=>document.getElementById('aiMapel')||findSelectByLabel(/mata\s*pelajaran|mapel/i);
  const getKelas=()=>document.getElementById('aiKelas')||findSelectByLabel(/kelas|rombel/i);
  let curriculum=null;
  async function loadCurriculum(){
    if(curriculum)return curriculum;
    try{
      const text=await(await fetch(new URL('lkpd.html',location.href).href,{cache:'no-store'})).text();
      const start=text.indexOf('const curriculum=');
      if(start<0)throw Error('curriculum tidak ditemukan');
      const brace=text.indexOf('{',start);let depth=0,end=-1,inStr=false,quote='',esc=false;
      for(let i=brace;i<text.length;i++){const c=text[i];if(inStr){if(esc)esc=false;else if(c==='\\')esc=true;else if(c===quote)inStr=false;continue}if(c==='"'||c==="'"||c==='`'){inStr=true;quote=c;continue}if(c==='{')depth++;else if(c==='}'&&--depth===0){end=i+1;break}}
      if(end<0)throw Error('akhir curriculum tidak ditemukan');
      curriculum=Function('return ('+text.slice(brace,end)+')')();
    }catch(e){console.warn('[AI curriculum]',e);curriculum={};}
    return curriculum;
  }
  function currentRoleSubject(){try{const x=JSON.parse(localStorage.getItem('siLogin')||'null');const u=x?.user||x;return norm(u?.role)==='guru_mapel'?String(u?.mapel||''):''}catch{return ''}}
  function currentKelas(){const x=getKelas();return x?String(x.value||'').replace(/[^0-9]/g,''):''}
  function applyRoleSubject(){const mapel=getMapel(),own=currentRoleSubject();if(!mapel||!own)return;const opt=[...mapel.options].find(o=>norm(o.value)===norm(own)||norm(o.textContent)===norm(own));if(opt){mapel.value=opt.value;[...mapel.options].forEach(o=>{o.hidden=o!==opt;o.disabled=o!==opt})}}
  function ensureUI(){
    const r=root();if(!r||document.getElementById('aiBabSelector'))return !!r;
    const mapel=getMapel();if(!mapel)return false;
    const box=document.createElement('div');box.id='aiCurriculumBox';box.style.cssText='grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px';
    box.innerHTML='<div><label for="aiBabSelector">📚 Bab / Materi</label><select id="aiBabSelector" disabled><option value="">Pilih Bab / Materi</option></select></div><div><label for="aiSubbabSelector">📖 Sub Bab / Topik</label><select id="aiSubbabSelector" disabled><option value="">Pilih Sub Bab / Topik</option></select></div>';
    (mapel.closest('.doc-controls')||mapel.parentElement)?.after(box);
    const bab=document.getElementById('aiBabSelector'),sub=document.getElementById('aiSubbabSelector');
    mapel.addEventListener('change',refreshBab);getKelas()?.addEventListener('change',refreshBab);bab.addEventListener('change',refreshSub);sub.addEventListener('change',syncPrompt);
    loadCurriculum().then(()=>{applyRoleSubject();refreshBab()});
    return true;
  }
  function fill(sel,items,placeholder){sel.innerHTML='<option value="">'+placeholder+'</option>';for(const x of items){const o=document.createElement('option');o.value=x;o.textContent=x;sel.appendChild(o)}sel.disabled=!items.length}
  async function refreshBab(){const data=await loadCurriculum(),mapel=getMapel(),bab=document.getElementById('aiBabSelector'),sub=document.getElementById('aiSubbabSelector');if(!mapel||!bab||!sub)return;applyRoleSubject();const kelas=currentKelas(),subject=mapel.value;const key=Object.keys(data).find(k=>norm(k)===norm(subject));const byClass=(data[key]||{})[kelas]||{};fill(bab,Object.keys(byClass),'Pilih Bab / Materi');fill(sub,[],'Pilih Sub Bab / Topik');syncPrompt()}
  function refreshSub(){const data=curriculum||{},mapel=getMapel(),bab=document.getElementById('aiBabSelector'),sub=document.getElementById('aiSubbabSelector'),kelas=currentKelas();if(!mapel||!bab||!sub)return;const key=Object.keys(data).find(k=>norm(k)===norm(mapel.value));fill(sub,(data[key]||{})[kelas]?.[bab.value]||[],'Pilih Sub Bab / Topik');syncPrompt()}
  function findPrompt(){const r=root();if(!r)return null;return document.getElementById('aiPrompt')||r.querySelector('textarea')||[...r.querySelectorAll('input')].find(x=>x.type==='text')}
  function syncPrompt(){const p=findPrompt(),bab=document.getElementById('aiBabSelector'),sub=document.getElementById('aiSubbabSelector');if(!p)return;const marker='[KONTEKS KURIKULUM ADM-SD]';const old=String(p.value||'').split(marker)[0].trim();if(bab?.value&&sub?.value){p.value=old+'\n\n'+marker+'\nBab/Materi: '+bab.value+'\nSub Bab/Topik: '+sub.value+'\nGunakan materi ini sebagai fokus utama. Jangan melebar ke bab atau subbab lain.';p.dispatchEvent(new Event('input',{bubbles:true}))}else p.value=old}
  function guardGenerate(){const r=root();if(!r||r.dataset.curriculumGuard)return;r.dataset.curriculumGuard='1';r.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!/generate\s+dengan\s+ai/i.test(b.textContent||''))return;const bab=document.getElementById('aiBabSelector'),sub=document.getElementById('aiSubbabSelector');if(!bab?.value||!sub?.value){e.preventDefault();e.stopImmediatePropagation();alert('Pilih Bab/Materi dan Sub Bab/Topik terlebih dahulu agar AI tidak membuat materi secara global.');return}syncPrompt()},true)}
  function start(){if(!ensureUI())return;guardGenerate();const r=root();new MutationObserver(()=>{if(!document.getElementById('aiBabSelector'))ensureUI()}).observe(r,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,200));else setTimeout(start,200);
})();
