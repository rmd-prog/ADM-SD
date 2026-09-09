/* ADM-SD AI Brain V3.6 — Math + Visual + Document Quality Engine */
(function(){
'use strict';
if(window.__ADM_AI_V36)return; window.__ADM_AI_V36=true;
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const decode=s=>String(s??'').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'");
function frac(n,d){return `<span class="ai-math-frac"><span>${n}</span><span>${d}</span></span>`}
function math(s){let t=String(s||'');
 t=t.replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g,(_,a,b)=>frac(math(a),math(b)));
 t=t.replace(/\\sqrt\s*\{([^{}]+)\}/g,'<span class="ai-math-sqrt">√<span>$1</span></span>');
 t=t.replace(/\^\{([^{}]+)\}/g,'<sup>$1</sup>').replace(/_\{([^{}]+)\}/g,'<sub>$1</sub>');
 t=t.replace(/\\times/g,'×').replace(/\\div/g,'÷').replace(/\\pm/g,'±').replace(/\\leq/g,'≤').replace(/\\geq/g,'≥').replace(/\\neq/g,'≠').replace(/\\cdot/g,'·');
 t=t.replace(/\\left|\\right/g,'');
 t=t.replace(/\\(?:text|mathrm)\s*\{([^{}]*)\}/g,'$1');
 t=t.replace(/\\([a-zA-Z]+)/g,'$1');
 t=t.replace(/\[\s*([^\]]+?)\s*\]/g,(m,x)=>/frac|sqrt|times|div/.test(x)?x:m);
 t=t.replace(/\$([^$\n]+)\$/g,'<span class="ai-math">$1</span>');
 t=t.replace(/\\\(([^\n]+?)\\\)/g,'<span class="ai-math">$1</span>').replace(/\\\[([\s\S]*?)\\\]/g,'<div class="ai-math-display">$1</div>');
 return t;
}
function visual(type,a={}){type=String(type||'').toLowerCase();const label=esc(a.label||'Stimulus visual');
 const wrap=x=>`<div class="ai-visual ai-visual-v36" aria-label="${label}">${x}</div>`;
 if(type==='fraction'){let n=Math.max(0,Number(a.n??3)),d=Math.max(1,Number(a.d??4));return wrap(`<div class="frac-card"><div class="frac-title">${label}</div><div class="frac-grid" style="grid-template-columns:repeat(${Math.min(d,12)},1fr)">${Array.from({length:Math.min(d,12)},(_,i)=>`<span class="frac-cell ${i<n?'on':''}"></span>`).join('')}</div><strong>${n}/${d}</strong></div>`)}
 if(type==='bar'){const ls=String(a.labels||'A|B|C|D').split('|'),vs=String(a.values||'3|5|2|4').split('|').map(Number),mx=Math.max(1,...vs);return wrap(`<div class="bar-card"><b>${label}</b><div class="bar-stage">${ls.slice(0,8).map((x,i)=>`<div class="bar-item"><span style="height:${Math.max(8,120*(vs[i]||0)/mx)}px"></span><b>${vs[i]||0}</b><small>${esc(x)}</small></div>`).join('')}</div></div>`)}
 if(type==='clock'){let h=Number(a.hour??3)%12,m=Number(a.minute??0),ang=(h+m/60)*30,ang2=m*6;return wrap(`<div class="clock-card"><b>${label}</b><div class="clock"><i class="hand hour" style="transform:rotate(${ang}deg)"></i><i class="hand min" style="transform:rotate(${ang2}deg)"></i>${Array.from({length:12},(_,i)=>`<em style="transform:rotate(${i*30}deg) translateY(-48px)">${i||12}</em>`).join('')}</div></div>`)}
 if(type==='shape'){const sh=String(a.shape||'triangle').toLowerCase();let inner=sh==='circle'?'<div class="shape circle"></div>':sh==='square'?'<div class="shape square"></div>':sh==='rectangle'?'<div class="shape rectangle"></div>':'<div class="shape triangle"></div>';return wrap(`<div class="shape-card"><b>${label}</b>${inner}</div>`)}
 if(type==='numberline'){let min=Number(a.min??0),max=Number(a.max??10),p=Number(a.point??6);return wrap(`<div class="number-card"><b>${label}</b><div class="numberline">${Array.from({length:Math.max(2,Math.min(21,max-min+1))},(_,i)=>{let v=min+i;return `<span class="tick ${v===p?'hit':''}"><i></i><small>${v}</small></span>`}).join('')}</div></div>`)}
 if(type==='light')return wrap(`<div class="light-card"><div class="sun">☀</div><div class="light-ray r1"></div><div class="light-ray r2"></div><div class="light-ray r3"></div><div class="object">Benda</div><div class="shadow"></div><div class="screen">Layar</div><b>${label}</b></div>`);
 return '';
}
function parseVisuals(t){return t.replace(/\[\[GAMBAR\s+([^\]]+)\]\]/gi,(m,r)=>{const a={};String(r).replace(/([a-zA-Z]+)\s*=\s*["']([^"']*)["']/g,(_,k,v)=>a[k]=v);return visual(a.type,a)})}
function clean(s,jenis){let t=decode(s);
 t=t.replace(/\[AI BRAIN[^\n]*\][\s\S]*?(?=\n\s*(?:SOAL|PETUNJUK|1[.)])|$)/gi,'');
 t=t.replace(/^\s*SUMBER\s+BUKU\s+TERKUNCI[\s\S]*?(?=\n\s*(?:SOAL|PETUNJUK|1[.)])|$)/gim,'');
 t=t.replace(/^\s*(Judul buku|Sumber|Tahun\/Edisi|Daftar\s+BAB\/?UNIT\s+terverifikasi|Daftar\s+BAB\s+Terverifikasi)\s*:.*$/gim,'');
 t=t.replace(/^\s*Catatan\s*:\s*Bab\/subbab.*$/gim,'');
 if(/soal_(sumatif|formatif)/i.test(jenis)){
  t=t.replace(/^\s*(KISI[- ]?KISI(?: SOAL)?|BLUEPRINT|TABEL KISI[- ]?KISI)[\s\S]*?(?=\n\s*(?:SOAL|PETUNJUK|NAMA|1[.)])|$)/gim,'');
  t=t.replace(/^\s*(RPP|MODUL AJAR|LKPD|PROTA|PROMES|PROGRAM SEMESTER|RINGKASAN MATERI)\b[\s\S]*?(?=\n\s*(?:SOAL|PETUNJUK|NAMA|1[.)])|$)/gim,'');
 }
 t=t.replace(/\n\s*(?:DOKUMEN SEBELUMNYA|DOKUMEN LAIN|LAMPIRAN DOKUMEN)\b[\s\S]*$/i,'');
 t=parseVisuals(t); return t.trim();
}
function formatChoices(t){let s=t.replace(/\r/g,'');
 s=s.replace(/(^|\n)\s*([A-D])\s*[.)\-:]\s*/g,'$1<div class="ai-choice"><b>$2.</b> ');
 s=s.replace(/(<div class="ai-choice">[^\n]*?)(?=\s*(?:<div class="ai-choice">|\n|$))/g,'$1</div>');
 s=s.replace(/(^|\n)\s*(?:A\.|B\.|C\.|D\.)/g,'$1');
 return s;
}
function render(raw,jenis){let t=clean(raw,jenis);
 // Keep LaTeX backslashes intact until math conversion.
 t=math(t); t=formatChoices(t);
 // Improve common question numbering without changing wording.
 t=t.replace(/(^|\n)\s*(\d+)\s*[.)]\s*/g,'$1<div class="ai-question"><b>$2.</b> ');
 t=t.replace(/(<div class="ai-question">[^\n]*?)(?=\n<div class="ai-question">|\n\n|$)/g,'$1</div>');
 return t.replace(/\n{3,}/g,'\n\n').trim();
}
function style(){if(document.getElementById('ai-v36-style'))return;const s=document.createElement('style');s.id='ai-v36-style';s.textContent=`
.ai-math,.ai-math-display{font-family:Georgia,'Times New Roman',serif;font-size:1.08em}.ai-math-display{text-align:center;margin:10px 0;font-size:1.25em}.ai-math-frac{display:inline-flex;vertical-align:middle;flex-direction:column;text-align:center;line-height:1;min-width:1.2em;margin:0 .15em}.ai-math-frac>span:first-child{border-bottom:1.5px solid currentColor;padding:0 .18em .08em}.ai-math-frac>span:last-child{padding:.08em .18em 0}.ai-math-sqrt{display:inline-flex;align-items:flex-start}.ai-math-sqrt>span{border-top:1px solid currentColor;padding:0 .15em}.ai-choice{display:block;margin:5px 0 5px 22px;padding:6px 10px;border-radius:8px}.ai-choice b{display:inline-block;width:24px}.ai-question{display:block;margin:9px 0;line-height:1.55}.ai-visual-v36{margin:12px auto;max-width:680px;text-align:center}.frac-card,.bar-card,.clock-card,.shape-card,.number-card,.light-card{background:#fff;border:1px solid #dbe3ee;border-radius:16px;padding:14px;box-shadow:0 5px 18px rgba(15,23,42,.08)}.frac-grid{display:grid;gap:3px;max-width:420px;margin:12px auto}.frac-cell{height:48px;border:2px solid #475569;border-radius:5px;background:#f8fafc}.frac-cell.on{background:linear-gradient(135deg,#60a5fa,#2563eb)}.bar-stage{height:155px;display:flex;align-items:end;justify-content:center;gap:14px;padding:8px}.bar-item{display:flex;flex-direction:column;align-items:center;justify-content:end;height:145px}.bar-item>span{display:block;width:48px;border-radius:8px 8px 3px 3px;background:linear-gradient(#60a5fa,#2563eb);min-height:8px}.bar-item small{margin-top:4px}.clock{width:150px;height:150px;border:6px solid #1e3a8a;border-radius:50%;margin:10px auto;position:relative;background:radial-gradient(circle,#fff 65%,#eff6ff)}.clock em{position:absolute;left:64px;top:68px;font-style:normal;transform-origin:11px 7px}.hand{position:absolute;left:72px;top:30px;width:5px;height:47px;background:#0f172a;transform-origin:50% 100%;border-radius:5px}.hand.min{height:62px;width:3px;background:#2563eb;top:15px}.shape{margin:15px auto;width:190px;height:150px}.shape.circle{width:150px;height:150px;border-radius:50%;background:linear-gradient(135deg,#bfdbfe,#60a5fa)}.shape.square{width:145px;height:145px;background:linear-gradient(135deg,#bfdbfe,#60a5fa)}.shape.rectangle{width:210px;height:125px;margin-top:28px;background:linear-gradient(135deg,#bfdbfe,#60a5fa)}.shape.triangle{width:0;height:0;border-left:95px solid transparent;border-right:95px solid transparent;border-bottom:150px solid #60a5fa;margin-top:0}.numberline{display:flex;justify-content:center;align-items:center;margin:22px 5px}.tick{width:42px;position:relative;text-align:center}.tick i{display:block;border-left:2px solid #334155;height:22px;margin:auto}.tick:first-child,.tick:last-child{width:30px}.tick.hit i{border-left:7px solid #2563eb}.tick.hit small{font-weight:800;color:#1d4ed8}.light-card{position:relative;height:180px;overflow:hidden;background:linear-gradient(135deg,#fffbeb,#fef3c7)}.sun{position:absolute;left:45px;top:55px;font-size:55px}.light-ray{position:absolute;left:105px;width:160px;height:5px;background:#f59e0b;transform-origin:left}.r1{top:70px;transform:rotate(-12deg)}.r2{top:90px}.r3{top:110px;transform:rotate(12deg)}.object{position:absolute;left:285px;top:55px;background:#64748b;color:#fff;border-radius:10px;padding:24px 28px;font-weight:700}.shadow{position:absolute;left:380px;top:70px;width:90px;height:65px;background:rgba(51,65,85,.28);clip-path:polygon(0 0,100% 20%,100% 80%,0 100%)}.screen{position:absolute;right:35px;top:42px;width:12px;height:100px;background:#334155}.light-card>b{position:absolute;bottom:12px;left:0;right:0}
`;document.head.appendChild(s)}
function install(){style();if(window.__ADM_AI_V36_FETCH)return;window.__ADM_AI_V36_FETCH=true;const native=window.fetch.bind(window);window.fetch=async function(input,init){const req=input instanceof Request?input:new Request(input,init);const res=await native(req);try{const u=new URL(req.url,location.href);if(!/\/api\/ai\/generate$/.test(u.pathname)||!res.ok)return res;const body=await req.clone().json().catch(()=>null);const data=await res.clone().json();if(data&&typeof data.text==='string'){data.text=render(data.text,String(body?.jenis||''));data.aiBrain='V3.6-MATH-VISUAL';}const h=new Headers(res.headers);h.set('Content-Type','application/json');return new Response(JSON.stringify(data),{status:res.status,headers:h})}catch{return res}};
 const obs=new MutationObserver(muts=>{for(const m of muts)for(const n of m.addedNodes||[])if(n.nodeType===1){const els=n.matches?.('.markdown-clean')?[n]:[...(n.querySelectorAll?.('.markdown-clean')||[])];for(const el of els){if(el.dataset.aiV36==='1')continue;const raw=el.innerHTML||'';if(/frac|GAMBAR|KISI|SUMBER|(^|\n)\s*[A-D][.)]/i.test(raw)){el.innerHTML=render(el.textContent||raw,'soal_sumatif');el.dataset.aiV36='1'}}}});if(document.body)obs.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();