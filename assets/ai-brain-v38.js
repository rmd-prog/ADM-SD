/* ADM-SD AI Brain V3.8 — deterministic question numbering + real visual stimuli */
(function(){
'use strict';
const SOAL=new Set(['soal_sumatif','soal_formatif']);
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const appleSvg=()=>'<div class="ai-visual ai-visual-apple" style="margin:14px 0;text-align:center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 250" width="100%" role="img" aria-label="Gambar enam apel" style="max-width:620px;height:auto;border:1px solid #d9dee8;border-radius:14px;background:#fff"><text x="310" y="30" text-anchor="middle" font-size="20" font-weight="700">Stimulus Visual 1 — Amati gambar apel</text><g stroke="#166534" stroke-width="3"><path d="M103 77 Q100 48 117 39" fill="none"/><path d="M104 55 Q75 37 58 55 Q82 65 104 55" fill="#86efac"/><path d="M207 77 Q204 48 221 39" fill="none"/><path d="M208 55 Q179 37 162 55 Q186 65 208 55" fill="#86efac"/><path d="M311 77 Q308 48 325 39" fill="none"/><path d="M312 55 Q283 37 266 55 Q290 65 312 55" fill="#86efac"/><path d="M415 77 Q412 48 429 39" fill="none"/><path d="M416 55 Q387 37 370 55 Q394 65 416 55" fill="#86efac"/><path d="M519 77 Q516 48 533 39" fill="none"/><path d="M520 55 Q491 37 474 55 Q498 65 520 55" fill="#86efac"/></g><g fill="#ef4444" stroke="#991b1b" stroke-width="3"><circle cx="100" cy="112" r="38"/><circle cx="204" cy="112" r="38"/><circle cx="308" cy="112" r="38"/><circle cx="412" cy="112" r="38"/><circle cx="516" cy="112" r="38"/><circle cx="152" cy="188" r="38"/></g><text x="310" y="232" text-anchor="middle" font-size="18" font-weight="700">Jumlah apel = 6</text></svg></div>';
function math(s){return String(s).replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g,'$1⁄$2').replace(/\\sqrt\s*\{([^{}]+)\}/g,'√($1)').replace(/\\times/g,'×').replace(/\\div/g,'÷').replace(/\\leq/g,'≤').replace(/\\geq/g,'≥').replace(/\\ne/g,'≠').replace(/\^\{([^{}]+)\}/g,'<sup>$1</sup>').replace(/_\{([^{}]+)\}/g,'<sub>$1</sub>');}
function cleanText(s,jenis){let t=String(s??'').replace(/\r/g,'');
 t=t.replace(/(?:🔒\s*)?SUMBER\s+BUKU\s+TERKUNCI\s*/gi,'');
 t=t.replace(/Catatan\s+keterbatasan\s*:\s*[^\n]*(?=(?:Capaian Pembelajaran|Petunjuk|Stimulus|\d+\.|$))/gi,'');
 if(SOAL.has(jenis)) t=t.replace(/\s*(?:KISI\s*-?\s*KISI(?:\s+SOAL)?|KISI KISI SOAL)[\s\S]*$/i,'');
 t=t.replace(/\s+(?=(?:Capaian Pembelajaran \(CP\)|Satuan Pendidikan:|Kelas\/Rombel:|Fase:|Mata Pelajaran:|Tahun Pelajaran:|Rumusan Capaian Pembelajaran|Petunjuk Pengerjaan|Stimulus\s+Visual\s*\d+|Stimulus\s+\d+|[A-D]\.\s+(?:Pilihan Ganda|Isian(?: Singkat)?|Uraian)))/g,'\n\n');
 t=t.replace(/\s+(?=(?:\d+)[.)]\s+)/g,'\n');
 t=t.replace(/\s+(?=[A-D][.)]\s+)/g,'\n');
 t=t.replace(/\n{3,}/g,'\n\n').trim();
 return t;
}
function renumberQuestions(t){
 const parts=t.split(/(\bKUNCI\s+JAWABAN\b)/i);let body=parts.shift()||'';let n=0;
 body=body.replace(/(^|\n\s*)(?:Soal\s*)?\d+[.)]\s*/g,(m,p)=>p+(++n)+'. ');
 return [body,...parts].join('');
}
function prepare(raw,jenis){let t=cleanText(raw,jenis);if(SOAL.has(jenis)){
  const low=t.toLowerCase();
  if(/banyak\s+apel\s+pada\s+gambar|gambar\s+(?:apel|buah)/i.test(t) && !/<svg|\[\[GAMBAR/i.test(t)){
    t='Stimulus Visual 1\n[[ADM_APPLE_VISUAL]]\n'+t.replace(/^Stimulus\s+Visual\s+1\s*$/im,'').trim();
  }
  t=renumberQuestions(t);
 }
 return t.replace(/\n{3,}/g,'\n\n').trim();
}
function renderTextToHtml(root,jenis){
 const src=root.innerHTML||''; if(!src || /<svg\b/i.test(src) || /class=["']ai-visual/i.test(src)) return false;
 const prepared=prepare(root.textContent||'',jenis); let lines=prepared.split('\n'); let html='';
 for(const raw of lines){const x=raw.trim();if(!x){html+='<div class="ai-gap"></div>';continue;}
  if(x==='[[ADM_APPLE_VISUAL]]'){html+=appleSvg();continue;}
  if(/^(A|B|C|D)\.\s+(Pilihan Ganda|Isian(?: Singkat)?|Uraian)$/i.test(x)){html+='<h3>'+esc(x)+'</h3>';continue;}
  if(/^Stimulus\s+(?:Visual\s+)?\d+/i.test(x)){html+='<h3>'+esc(x)+'</h3>';continue;}
  if(/^(Petunjuk Pengerjaan|Kunci Jawaban|Rumusan Capaian Pembelajaran)$/i.test(x)){html+='<h3>'+esc(x)+'</h3>';continue;}
  if(/^\d+\.\s/.test(x)){html+='<div class="ai-question">'+math(esc(x))+'</div>';continue;}
  if(/^[A-D]\.\s/.test(x)){html+='<div class="ai-choice">'+math(esc(x))+'</div>';continue;}
  html+='<div class="ai-paragraph">'+math(esc(x))+'</div>';
 }
 root.innerHTML=html;root.dataset.aiBrain38='1';return true;
}
function style(){if(document.getElementById('ai-brain-38-style'))return;const s=document.createElement('style');s.id='ai-brain-38-style';s.textContent='.markdown-clean .ai-question{margin:16px 0 5px;line-height:1.75;font-weight:600}.markdown-clean .ai-choice{margin:4px 0 4px 26px;line-height:1.7}.markdown-clean .ai-gap{height:8px}.markdown-clean .ai-paragraph{margin:7px 0;line-height:1.7}.markdown-clean h3{margin:20px 0 10px;line-height:1.45}.markdown-clean .ai-visual{display:block}.markdown-clean sup,.markdown-clean sub{font-size:.78em}';document.head.appendChild(s)}
function findJenis(){return String(document.querySelector('#aiJenis,#aiType,[name="jenis"],select[id*="jenis"]')?.value||'').toLowerCase().trim()}
function processRoots(){style();document.querySelectorAll('.markdown-clean').forEach(r=>{if(r.dataset.aiBrain38==='1')return;renderTextToHtml(r,findJenis())})}
function transformResponse(obj,jenis){if(!obj||typeof obj!=='object')return obj;const keys=['data','text','content','hasil','output','answer','response','result'];for(const k of keys){if(typeof obj[k]==='string')obj[k]=prepare(obj[k],jenis);else if(obj[k]&&typeof obj[k]==='object')transformResponse(obj[k],jenis)}return obj}
function hookFetch(){if(window.__ADM_AI_V38_FETCH)return;window.__ADM_AI_V38_FETCH=true;const orig=window.fetch;window.fetch=async function(input,init){const res=await orig.apply(this,arguments);try{const u=typeof input==='string'?input:(input?.url||'');if(/\/api\/ai\/generate(?:\?|$)/i.test(u)){const clone=res.clone();const data=await clone.json();const jenis=String((init?.body&&JSON.parse(init.body)?.jenis)||findJenis()).toLowerCase();transformResponse(data,jenis);return new Response(JSON.stringify(data),{status:res.status,statusText:res.statusText,headers:new Headers(res.headers)});}}catch(e){}return res}}
function boot(){style();hookFetch();processRoots();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.__ADM_AI_V38={prepare,renumberQuestions,renderTextToHtml};
})();
