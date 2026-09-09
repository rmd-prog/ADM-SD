/* ADM-SD AI Brain V3.7 — stable formatter */
(function(){
'use strict';
if(window.__ADM_AI_V37)return;window.__ADM_AI_V37=true;
const dec=s=>String(s??'').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'");
function math(s){let t=String(s||'');
 t=t.replace(/\\?frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g,(_,a,b)=>`<span class="ai-math-frac"><span>${a}</span><span>${b}</span></span>`);
 t=t.replace(/\\?sqrt\s*\{([^{}]+)\}/g,'<span class="ai-math-sqrt">√<span>$1</span></span>');
 t=t.replace(/\^\{([^{}]+)\}/g,'<sup>$1</sup>').replace(/_\{([^{}]+)\}/g,'<sub>$1</sub>');
 t=t.replace(/\\times|(?<![A-Za-z])times(?![A-Za-z])/g,'×').replace(/\\div|(?<![A-Za-z])div(?![A-Za-z])/g,'÷').replace(/\\pm/g,'±').replace(/\\leq/g,'≤').replace(/\\geq/g,'≥').replace(/\\neq/g,'≠').replace(/\\cdot/g,'·');
 t=t.replace(/\\(?:text|mathrm)\s*\{([^{}]*)\}/g,'$1').replace(/\\left|\\right/g,'');
 return t;
}
function normalize(s){let t=dec(s).replace(/\r/g,'');
 // Recover structure even when the model returned one long paragraph.
 t=t.replace(/\s*(🔒\s*)?SUMBER\s+BUKU\s+TERKUNCI\s*/ig,'');
 t=t.replace(/\s*(Catatan\s+keterbatasan|Catatan)\s*:\s*[^\n]*(?=Petunjuk|A\.\s*Pilihan|\d+[.)]|$)/ig,'');
 t=t.replace(/\s*(Judul\s+buku|Sumber(?:\s+buku)?|Tahun\/Edisi|Daftar\s+BAB\/?UNIT\s+terverifikasi|Daftar\s+BAB\s+Terverifikasi)\s*:\s*[^\n]*(?=Petunjuk|A\.\s*Pilihan|\d+[.)]|$)/ig,'');
 // For generated sumatif/formatif, everything from KISI-KISI onward is a forbidden attachment.
 t=t.replace(/\s*(KISI[- ]?KISI(?:\s+SOAL)?|BLUEPRINT|TABEL\s+KISI[- ]?KISI)\b[\s\S]*$/i,'');
 t=t.replace(/\s*(DOKUMEN\s+SEBELUMNYA|DOKUMEN\s+LAIN|LAMPIRAN\s+DOKUMEN)\b[\s\S]*$/i,'');
 // Force clean paragraph boundaries.
 t=t.replace(/\s*(Petunjuk\s+Pengerjaan)\s*/ig,'\n\n$1\n');
 t=t.replace(/\s*(A\.\s*Pilihan\s+Ganda)\s*/ig,'\n\n$1\n');
 t=t.replace(/\s*(B\.\s*Isian(?:\s+Singkat)?)\s*/ig,'\n\n$1\n');
 t=t.replace(/\s*(C\.\s*Uraian)\s*/ig,'\n\n$1\n');
 t=t.replace(/\s*(Stimulus\s+\d+)\s*/ig,'\n\n$1\n');
 // Questions and options always start on their own line.
 t=t.replace(/\s+(?=(\d{1,3})[.)]\s)/g,'\n');
 t=t.replace(/\s+(?=([A-D])[.)\-:]\s)/g,'\n');
 // Separate answer/key sections if present, but never let KISI-KISI survive.
 t=t.replace(/\s*(KUNCI\s+JAWABAN)\s*/ig,'\n\n$1\n');
 t=t.replace(/\s*(Nama\s*:\s*[_\.]+\s*Nomor\s*:\s*[_\.]+\s*Tanggal\s*:\s*[_\.]+)\s*/ig,'\n$1\n');
 t=t.replace(/[ \t]{2,}/g,' ');
 t=t.replace(/\n[ \t]+/g,'\n').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
 return t;
}
function render(s,jenis){let t=normalize(s);t=math(t);
 // Consistent markdown layout; do not wrap questions in nested divs.
 t=t.split('\n').map(line=>{let x=line.trim();
   if(/^A\.\s*Pilihan\s+Ganda$/i.test(x))return '### A. Pilihan Ganda';
   if(/^B\.\s*Isian(?:\s+Singkat)?$/i.test(x))return '### B. Isian Singkat';
   if(/^C\.\s*Uraian$/i.test(x))return '### C. Uraian';
   if(/^Petunjuk\s+Pengerjaan$/i.test(x))return '**Petunjuk Pengerjaan**';
   if(/^Stimulus\s+\d+$/i.test(x))return '**'+x+'**';
   let q=x.match(/^(\d{1,3})[.)]\s*(.+)$/);if(q)return `**${q[1]}.** ${q[2]}`;
   let c=x.match(/^([A-D])[.)\-:]\s*(.+)$/);if(c)return `- **${c[1]}.** ${c[2]}`;
   return x;
 }).join('\n\n');
 return t.replace(/\n{3,}/g,'\n\n').trim();
}
function style(){if(document.getElementById('ai-v37-style'))return;const s=document.createElement('style');s.id='ai-v37-style';s.textContent='.ai-math-frac{display:inline-flex;vertical-align:middle;flex-direction:column;text-align:center;line-height:1;min-width:1.1em;margin:0 .14em}.ai-math-frac>span:first-child{border-bottom:1.5px solid currentColor;padding:0 .18em .08em}.ai-math-frac>span:last-child{padding:.08em .18em 0}.ai-math-sqrt{display:inline-flex;align-items:flex-start}.ai-math-sqrt>span{border-top:1px solid currentColor;padding:0 .15em}.markdown-clean h3{margin:16px 0 8px}.markdown-clean li{margin:4px 0}.markdown-clean p{line-height:1.55}';document.head.appendChild(s)}
function install(){style();if(window.__ADM_AI_V37_FETCH)return;window.__ADM_AI_V37_FETCH=true;const native=window.fetch.bind(window);window.fetch=async function(input,init){const req=input instanceof Request?input:new Request(input,init);const res=await native(req);try{const u=new URL(req.url,location.href);if(!/\/api\/ai\/generate$/.test(u.pathname)||!res.ok)return res;const body=await req.clone().json().catch(()=>({}));const data=await res.clone().json();if(data&&typeof data.text==='string'){data.text=render(data.text,String(body.jenis||''));data.aiBrain='V3.7-STABLE';}const h=new Headers(res.headers);h.set('Content-Type','application/json');return new Response(JSON.stringify(data),{status:res.status,headers:h})}catch{return res}}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();