/* GURU+ SD — Binding BAB -> TP -> JP -> DPL -> document generators
 * Local-only overlay. Does not touch D1, Worker, students, or assessment bridge.
 * FIX: current BAB is now the source of truth for CP/ATP/TP -> RPM. Stale TP is overwritten on every BAB change.
 */
(function(){'use strict';if(window.__PBIND_V1__)return;window.__PBIND_V1__=1;
const KEY='guru_sd_perangkat_super_v1',BKEY='guru_sd_perangkat_binding_v1',CKEY='guru_sd_cp_atp_tp_super_v1';
function q(id){return document.getElementById(id)}
function selected(){const r=q('pkR'),m=q('pkM'),b=q('pkB'),info=q('pkI');if(!r||!m||!b||!b.value||!info)return null;const opt=b.options[b.selectedIndex],text=opt?opt.textContent:'';const jpMatch=text.match(/\((\d+)\s*JP\)/i);const lis=[...info.querySelectorAll('li')].map(x=>x.textContent.trim()).filter(Boolean);const semMatch=info.textContent.match(/Semester\s+(\d+)/i);const babMatch=text.match(/BAB\s+(\d+)\s+—\s+(.+?)\s*\(/i);return {rombel:r.value,mapel:m.value,babNo:babMatch?Number(babMatch[1]):Number(b.value),material:babMatch?babMatch[2].trim():text.replace(/^BAB\s+\d+\s+—\s*/,'').replace(/\s*\(\d+\s*JP\).*$/i,'').trim(),jp:jpMatch?Number(jpMatch[1]):2,tp:lis,semester:semMatch?Number(semMatch[1]):(Number(b.value)<=3?1:2)} }
function saveBinding(){const x=selected();if(!x)return null;const now=new Date().toISOString();localStorage.setItem(BKEY,JSON.stringify({...x,updatedAt:now}));localStorage.setItem(KEY,JSON.stringify({rombel:x.rombel,mapel:x.mapel,babNo:x.babNo,material:x.material,jp:x.jp,tp:x.tp,tpCount:x.tp.length||3,updatedAt:now}));
const fase=({IA:'A',IB:'A',IIA:'A',IIB:'A',IIIA:'B',IIIB:'B',IVA:'B',IVB:'B',V:'C',VI:'C'})[x.rombel]||'C';
const cp=`Pada Fase ${fase}, peserta didik mengembangkan kompetensi ${x.mapel} melalui pengalaman belajar yang kontekstual, aktif, bertahap, dan reflektif pada materi ${x.material}.`;
localStorage.setItem(CKEY,JSON.stringify({rombel:x.rombel,mapel:x.mapel,babNo:x.babNo,material:x.material,jp:x.jp,semester:x.semester,cp,atp:x.tp.map((t,i)=>({no:i+1,text:t})),tp:x.tp,source:'perangkat-binding-super-v1',updatedAt:now}));
return x}
function sync(){const x=saveBinding();if(!x)return;let box=q('pkBindInfo');if(!box){box=document.createElement('div');box.id='pkBindInfo';box.style='margin-top:10px;padding:11px;border-radius:12px;background:#eef6ff;border:1px solid #bfdbfe';const p=q('pkatV2');if(p)p.appendChild(box)}box.innerHTML='<b>🔗 Terhubung ke Generator</b><br>BAB '+x.babNo+' — '+x.material+' • '+x.jp+' JP • Semester '+x.semester+'<br><span style="font-size:12px">TP: '+x.tp.length+' tersimpan • data ini menjadi input Generator SUPER</span>'}
function bindCatalog(){const r=q('pkR'),m=q('pkM'),b=q('pkB');if(!r||!m||!b)return setTimeout(bindCatalog,400);[r,m,b].forEach(el=>el.addEventListener('change',()=>setTimeout(sync,0)));sync()}
function clickSync(e){const t=e.target.closest&&e.target.closest('button,[role="button"]');if(!t)return;const text=(t.textContent||'').trim().toLowerCase();if(/\b(cp|tp|atp|prota|promes|rpm|lkpd|asesmen)\b/.test(text))saveBinding()}
window.GURU_SD_BINDING={get:selected,sync:sync,getStored:function(){try{return JSON.parse(localStorage.getItem(BKEY)||'null')}catch(e){return null}}};document.addEventListener('click',clickSync,true);bindCatalog();
})();