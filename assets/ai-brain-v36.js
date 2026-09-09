/* ADM-SD AI Brain V3.6.1 — safe document cleaner + math + visual renderer */
(function(){
'use strict';
if(window.__ADM_AI_V361)return; window.__ADM_AI_V361=true;
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const decode=s=>String(s??'').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'");
function frac(n,d){return `<span class="ai-math-frac"><span>${n}</span><span>${d}</span></span>`}
function math(s){let t=String(s||'');
 t=t.replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g,(_,a,b)=>frac(math(a),math(b)));
 t=t.replace(/(^|[^A-Za-z])frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g,(_,p,a,b)=>p+frac(math(a),math(b)));
 t=t.replace(/\\sqrt\s*\{([^{}]+)\}/g,'<span class="ai-math-sqrt">√<span>$1</span></span>');
 t=t.replace(/(^|[^A-Za-z])sqrt\s*\{([^{}]+)\}/g,'$1<span class="ai-math-sqrt">√<span>$2</span></span>');
 t=t.replace(/\^\{([^{}]+)\}/g,'<sup>$1</sup>').replace(/_\{([^{}]+)\}/g,'<sub>$1</sub>');
 t=t.replace(/\\times|(?<![A-Za-z])times(?![A-Za-z])/g,'×').replace(/\\div|(?<![A-Za-z])div(?![A-Za-z])/g,'÷').replace(/\\pm/g,'±').replace(/\\leq/g,'≤').replace(/\\geq/g,'≥').replace(/\\neq/g,'≠').replace(/\\cdot/g,'·');
 t=t.replace(/\\left|\\right/g,'');
 t=t.replace(/\\(?:text|mathrm)\s*\{([^{}]*)\}/g,'$1');
 t=t.replace(/\\([a-zA-Z]+)/g,'$1');
 t=t.replace(/\[\s*([^\]]+?)\s*\]/g,(m,x)=>/(?:frac|sqrt|times|div|pm|leq|geq|neq)/.test(x)?x:m);
 return t;
}
function visual(type,a={}){type=String(type||'').toLowerCase();const label=esc(a.label||'Stimulus visual');const wrap=x=>`<div class="ai-visual ai-visual-v36" aria-label="${label}">${x}</div>`;
 if(type==='fraction'){let n=Math.max(0,Number(a.n??3)),d=Math.max(1,Number(a.d??4));n=Math.min(n,d);return wrap(`<div class="frac-card"><b>${label}</b><div class="frac-grid" style="grid-template-columns:repeat(${Math.min(d,12)},1fr)">${Array.from({length:Math.min(d,12)},(_,i)=>`<span class="frac-cell ${i<n?'on':''}"></span>`).join('')}</div><strong>${n}/${d}</strong></div>`)}
 if(type==='shape'){let sh=String(a.shape||'triangle').toLowerCase();let inner=sh==='circle'?'<div class="shape circle"></div>':sh==='square'?'<div class="shape square"></div>':sh==='rectangle'?'<div class="shape rectangle"></div>':'<div class="shape triangle"></div>';return wrap(`<div class="shape-card"><b>${label}</b>${inner}</div>`)}
 if(type==='numberline'){let min=Number(a.min??0),max=Number(a.max??10),p=Number(a.point??6);if(max<min)[min,max]=[max,min];let n=Math.min(21,Math.max(2,max-min+1));return wrap(`<div class="number-card"><b>${label}</b><div class="numberline">${Array.from({length:n},(_,i)=>{let v=min+i;return `<span class="tick ${v===p?'hit':''}"><i></i><small>${v}</small></span>`}).join('')}</div></div>`)}
 if(type==='bar'){let ls=String(a.labels||'A|B|C|D').split('|'),vs=String(a.values||'3|5|2|4').split('|').map(Number),mx=Math.max(1,...vs);return wrap(`<div class="bar-card"><b>${label}</b><div class="bar-stage">${ls.slice(0,8).map((x,i)=>`<div class="bar-item"><span style="height:${Math.max(8,120*(vs[i]||0)/mx)}px"></span><b>${vs[i]||0}</b><small>${esc(x)}</small></div>`).join('')}</div></div>`)}
 if(type==='clock'){let h=Number(a.hour??3)%12,m=Number(a.minute??0),ang=(h+m/60)*30,ang2=m*6;return wrap(`<div class="clock-card"><b>${label}</b><div class="clock"><i class="hand hour" style="transform:rotate(${ang}deg)"></i><i class="hand min" style="transform:rotate(${ang2}deg)"></i>${Array.from({length:12},(_,i)=>`<em style="transform:rotate(${i*30}deg) translateY(-48px)">${i||12}</em>`).join('')}</div></div>`)}
 if(type==='light')return wrap(`<div class="light-card"><div class="sun">☀</div><div class="light-ray r1"></div><div class="light-ray r2"></div><div class="light-ray r3"></div><div class="object">Benda</div><div class="shadow"></div><div class="screen">Layar</div><b>${label}</b></div>`);
 return '';
}
function parseVisuals(t){return t.replace(/\[\[GAMBAR\s+([^\]]+)\]\]/gi,(m,r)=>{const a={};String(r).replace(/([a-zA-Z]+)\s*=\s*["']([^"']*)["']/g,(_,k,v)=>a[k]=v);return visual(a.type,a)})}
function removeNoise(t,jenis){let s=decode(t).replace(/\r/g,'');
 s=s.replace(/^\s*\[AI BRAIN[^\n]*\][\s\S]*?(?=\n\s*(?:SOAL|PETUNJUK|NAMA|1[.)])|$)/gim,'');
 s=s.replace(/^\s*🔒?\s*SUMBER\s+BUKU\s+TERKUNCI[\s\S]*?(?=\n\s*(?:SOAL|PETUNJUK|NAMA|1[.)])|$)/gim,'');
 s=s.replace(/^\s*(?:Catatan keterbatasan|Catatan)\s*:.*$/gim,'');
 s=s.replace(/^\s*(?:Judul buku|Sumber(?: buku)?|Tahun\/Edisi|Daftar\s+BAB\/?UNIT\s+terverifikasi|Daftar\s+BAB\s+Terverifikasi)\s*:.*$/gim,'');
 if(/soal_(sumatif|formatif)/i.test(jenis)){
   const cut=/^\s*(KISI[- ]?KISI(?: SOAL)?|BLUEPRINT|TABEL KISI[- ]?KISI)\b/im.exec(s); if(cut)s=s.slice(0,cut.index).trim();
   s=s.replace(/^\s*(RPP|MODUL AJAR|LKPD|PROTA|PROMES|PROGRAM SEMESTER|RINGKASAN MATERI)\b[\s\S]*?(?=\n\s*(?:SOAL|PETUNJUK|NAMA|A\.|B\.|C\.|1[.)])|$)/gim,'');
 }
 s=s.replace(/\n\s*(?:DOKUMEN SEBELUMNYA|DOKUMEN LAIN|LAMPIRAN DOKUMEN)\b[\s\S]*$/i,'');
 return s.replace(/\n{3,}/g,'\n\n').trim();
}
function tidy(t){
 let lines=t.split('\n').map(x=>x.trim()).filter((x,i,a)=>!(x===''&&a[i-1]===''));
 let out=[],inChoices=false;
 for(let line of lines){
   line=line.replace(/\s+(?=[A-D][.)]\s)/g,'\n');
   if(/^A\.\s+Pilihan Ganda$/i.test(line))line='### A. Pilihan Ganda';
   else if(/^B\.\s+Isian(?: Singkat)?$/i.test(line))line='### B. Isian Singkat';
   else if(/^C\.\s+Uraian$/i.test(line))line='### C. Uraian';
   else if(/^(Stimulus\s+\d+|Petunjuk Pengerjaan)$/i.test(line))line='**'+line+'**';
   const m=line.match(/^([A-D])[.)\-:]\s*(.+)$/); if(m){out.push(`- **${m[1]}.** ${m[2]}`);continue}
   const q=line.match(/^(\d+)[.)]\s*(.+)$/); if(q){out.push(`**${q[1]}.** ${q[2]}`);continue}
   out.push(line);
 }
 return out.join('\n\n').replace(/\n{3,}/g,'\n\n');
}
function render(raw,jenis){let t=removeNoise(raw,jenis);t=parseVisuals(t);t=math(t);t=tidy(t);return t.trim()}
function style(){if(document.getElementById('ai-v361-style'))return;const s=document.createElement('style');s.id='ai-v361-style';s.textContent=`
.ai-math-frac{display:inline-flex;vertical-align:middle;flex-direction:column;text-align:center;line-height:1;min-width:1.15em;margin:0 .16em}.ai-math-frac>span:first-child{border-bottom:1.5px solid currentColor;padding:0 .18em .08em}.ai-math-frac>span:last-child{padding:.08em .18em 0}.ai-math-sqrt{display:inline-flex;align-items:flex-start}.ai-math-sqrt>span{border-top:1px solid currentColor;padding:0 .15em}.ai-visual-v36{margin:12px auto;max-width:680px;text-align:center}.frac-card,.bar-card,.clock-card,.shape-card,.number-card,.light-card{background:#fff;border:1px solid #dbe3ee;border-radius:14px;padding:14px;box-shadow:0 4px 16px rgba(15,23,42,.07)}.frac-grid{display:grid;gap:3px;max-width:420px;margin:12px auto}.frac-cell{height:44px;border:2px solid #475569;border-radius:5px;background:#f8fafc}.frac-cell.on{background:#60a5fa}.bar-stage{height:150px;display:flex;align-items:end;justify-content:center;gap:12px}.bar-item{display:flex;flex-direction:column;align-items:center;justify-content:end;height:140px}.bar-item>span{display:block;width:44px;border-radius:7px 7px 2px 2px;background:#60a5fa}.bar-item small{margin-top:4px}.clock{width:145px;height:145px;border:5px solid #1e3a8a;border-radius:50%;margin:10px auto;position:relative}.clock em{position:absolute;left:62px;top:65px;font-style:normal}.hand{position:absolute;left:70px;top:28px;width:5px;height:45px;background:#0f172a;transform-origin:50% 100%;border-radius:4px}.hand.min{height:60px;width:3px;top:13px;background:#2563eb}.shape{margin:14px auto;width:180px;height:145px}.shape.circle{width:145px;height:145px;border-radius:50%;background:#93c5fd}.shape.square{width:140px;height:140px;background:#93c5fd}.shape.rectangle{width:200px;height:120px;margin-top:25px;background:#93c5fd}.shape.triangle{width:0;height:0;border-left:90px solid transparent;border-right:90px solid transparent;border-bottom:145px solid #60a5fa}.numberline{display:flex;justify-content:center;align-items:center;margin:20px 0}.tick{width:40px;text-align:center}.tick i{display:block;border-left:2px solid #334155;height:20px}.tick.hit i{border-left:6px solid #2563eb}.tick.hit small{font-weight:800}.light-card{position:relative;height:175px;overflow:hidden;background:#fffbeb}.sun{position:absolute;left:35px;top:45px;font-size:50px}.light-ray{position:absolute;left:95px;width:155px;height:5px;background:#f59e0b}.r1{top:65px;transform:rotate(-12deg)}.r2{top:87px}.r3{top:109px;transform:rotate(12deg)}.object{position:absolute;left:260px;top:52px;background:#64748b;color:#fff;border-radius:8px;padding:22px;font-weight:700}.shadow{position:absolute;left:360px;top:65px;width:100px;height:70px;background:rgba(51,65,85,.25)}.screen{position:absolute;right:28px;top:40px;width:12px;height:100px;background:#334155}
`;document.head.appendChild(s)}
function install(){style();if(window.__ADM_AI_V36_FETCH)return;window.__ADM_AI_V36_FETCH=true;const native=window.fetch.bind(window);window.fetch=async function(input,init){const req=input instanceof Request?input:new Request(input,init);const res=await native(req);try{const u=new URL(req.url,location.href);if(!/\/api\/ai\/generate$/.test(u.pathname)||!res.ok)return res;const body=await req.clone().json().catch(()=>({}));const data=await res.clone().json();if(data&&typeof data.text==='string'){data.text=render(data.text,String(body.jenis||''));data.aiBrain='V3.6.1-SAFE';}const h=new Headers(res.headers);h.set('Content-Type','application/json');return new Response(JSON.stringify(data),{status:res.status,headers:h})}catch{return res}}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();