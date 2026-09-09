/* ADM-SD AI Brain V3 wrapper over the current multi-rombel worker. */
import multiWorker from './multi-rombel.js';

const VISUAL_TYPES = new Set(['fraction','shape','numberline','bar','clock','geometry']);

function esc(v='') {
  return String(v).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
}
function attrs(src='') {
  const out={};
  for (const m of String(src).matchAll(/([a-zA-Z]+)\s*=\s*\"([^\"]*)\"/g)) out[m[1]]=m[2];
  return out;
}
function svg(inner,label='Gambar stimulus') {
  return `<div class="ai-visual" style="margin:10px 0;text-align:center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 210" width="100%" role="img" aria-label="${esc(label)}" style="max-width:520px;height:auto;border:1px solid #d9dee8;border-radius:12px;background:#fff">${inner}</svg></div>`;
}
function visual(type,a) {
  const label=a.label||'Gambar stimulus';
  if(type==='fraction'){
    const n=Math.max(0,Math.min(20,Number(a.n||a.a||3))),d=Math.max(1,Math.min(20,Number(a.d||a.b||4))),x=150,y=55,w=220,h=100,p=w/d;
    let s=`<text x="260" y="30" text-anchor="middle" font-size="18" font-weight="700">${esc(label)}</text>`;
    for(let i=0;i<d;i++)s+=`<rect x="${x+i*p}" y="${y}" width="${p-1}" height="${h}" fill="${i<n?'#dbeafe':'#fff'}" stroke="#334155"/>`;
    return svg(s+`<text x="260" y="185" text-anchor="middle" font-size="20">${n}/${d}</text>`,label);
  }
  if(type==='shape'){
    const sh=String(a.shape||'triangle').toLowerCase();let p='';
    if(sh==='circle')p='<circle cx="260" cy="110" r="70" fill="#dbeafe" stroke="#1e3a8a" stroke-width="3"/>';
    else if(sh==='rectangle')p='<rect x="150" y="55" width="220" height="110" fill="#dbeafe" stroke="#1e3a8a" stroke-width="3"/>';
    else if(sh==='square')p='<rect x="190" y="40" width="140" height="140" fill="#dbeafe" stroke="#1e3a8a" stroke-width="3"/>';
    else p='<polygon points="260,35 155,175 365,175" fill="#dbeafe" stroke="#1e3a8a" stroke-width="3"/>';
    return svg(`<text x="260" y="25" text-anchor="middle" font-size="18" font-weight="700">${esc(label)}</text>${p}`,label);
  }
  if(type==='numberline'){
    const min=Number(a.min||0),max=Number(a.max||10),point=Number(a.point||0),lo=Math.min(min,max),hi=Math.max(min,max),span=Math.max(1,hi-lo);
    let s=`<text x="260" y="30" text-anchor="middle" font-size="18" font-weight="700">${esc(label)}</text><line x1="50" y1="110" x2="470" y2="110" stroke="#334155" stroke-width="3"/>`;
    for(let i=0;i<=span;i++){const v=lo+i,x=50+420*i/span;s+=`<line x1="${x}" y1="100" x2="${x}" y2="120" stroke="#334155"/><text x="${x}" y="145" text-anchor="middle" font-size="13">${v}</text>`;}
    const px=50+420*((point-lo)/span);return svg(s+`<circle cx="${px}" cy="110" r="9" fill="#2563eb"/><text x="${px}" y="88" text-anchor="middle" font-size="14" font-weight="700">?</text>`,label);
  }
  if(type==='bar'){
    const labels=String(a.labels||'A|B|C').split('|').slice(0,6),vals=String(a.values||'3|5|2').split('|').map(Number).slice(0,6),max=Math.max(1,...vals);let s=`<text x="260" y="25" text-anchor="middle" font-size="18" font-weight="700">${esc(label)}</text>`;
    labels.forEach((lb,i)=>{const x=55+i*75,h=120*(Math.max(0,vals[i]||0)/max),y=165-h;s+=`<rect x="${x}" y="${y}" width="48" height="${h}" fill="#bfdbfe" stroke="#1e3a8a"/><text x="${x+24}" y="185" text-anchor="middle" font-size="13">${esc(lb)}</text>`;});return svg(s,label);
  }
  if(type==='clock'){
    const hour=Number(a.hour||3)%12,minute=Math.max(0,Math.min(59,Number(a.minute||0))),cx=260,cy=110,r=70,ha=(hour+minute/60)*Math.PI/6-Math.PI/2,ma=minute*Math.PI/30-Math.PI/2,hx=cx+35*Math.cos(ha),hy=cy+35*Math.sin(ha),mx=cx+52*Math.cos(ma),my=cy+52*Math.sin(ma);
    return svg(`<text x="260" y="25" text-anchor="middle" font-size="18" font-weight="700">${esc(label)}</text><circle cx="260" cy="110" r="70" fill="#fff" stroke="#1e3a8a" stroke-width="3"/><line x1="260" y1="110" x2="${hx}" y2="${hy}" stroke="#0f172a" stroke-width="6"/><line x1="260" y1="110" x2="${mx}" y2="${my}" stroke="#2563eb" stroke-width="4"/><circle cx="260" cy="110" r="5" fill="#0f172a"/>`,label);
  }
  if(type==='geometry')return svg(`<text x="260" y="25" text-anchor="middle" font-size="18" font-weight="700">${esc(label)}</text><polygon points="120,165 260,45 400,165" fill="#dbeafe" stroke="#1e3a8a" stroke-width="3"/><text x="260" y="190" text-anchor="middle" font-size="14">Segitiga</text>`,label);
  return '';
}
function renderVisuals(text){
  return String(text).replace(/\[\[GAMBAR\s+([^\]]+)\]\]/gi,(m,raw)=>{const a=attrs(raw),t=String(a.type||'').toLowerCase();return VISUAL_TYPES.has(t)?visual(t,a):'';});
}
function cleanLeak(text,jenis){
  let t=String(text||'');
  if(!['soal_sumatif','soal_formatif'].includes(jenis))t=t.replace(/^\s*(sumatif|formatif)\s+mata pelajaran\s*[:\-]?.*$/gim,'');
  if(['materi','ringkasan','bahan_ajar'].includes(jenis)){
    t=t.replace(/^#{1,6}\s*(RPM|LKPD|MODUL AJAR|PROTA|PROSEM|ATP|TP|CP|KISI[- ]?KISI|RUBRIK|KUNCI JAWABAN|PEDOMAN PENSKORAN|DAFTAR BAB TER/?VERIFIKASI|PETUNJUK BELAJAR|KEGIATAN \d+).*$/gim,'');
    t=t.replace(/^\s*(Daftar BAB Terverifikasi|SUMBER BUKU TERKUNCI|Judul buku|Sumber|Tahun\/Edisi)\s*[:\-]?.*$/gim,'');
    t=t.replace(/\n{3,}/g,'\n\n');
  }
  return t.trim();
}
function brainBody(body){
  const jenis=String(body.jenis||'').toLowerCase().trim();
  const isSoal=jenis==='soal_sumatif'||jenis==='soal_formatif';
  const guard=`\n\n[AI BRAIN V3 — OUTPUT CONTRACT]\nTARGET: ${jenis}\nHANYA keluarkan dokumen target ini. DILARANG membawa dokumen/format lain, daftar BAB, metadata buku, identitas sumber, template contoh, atau lampiran lain yang tidak diminta. Frasa “Sumatif Mata Pelajaran/Fase/Kelas” hanya boleh digunakan untuk paket soal sumatif. Jangan mengubah Bab/Sub Bab/Kelas/Fase/Mapel yang dipilih guru. Periksa hasil sebelum menjawab dan hapus semua bagian yang bukan target.${isSoal?'\nUntuk paket soal, gunakan stimulus visual pada beberapa soal yang memang cocok. Buat 2–5 visual untuk 10–20 soal, proporsional bila jumlah berbeda. Gunakan token terkontrol [[GAMBAR type="fraction" n="3" d="4" label="Gambar pecahan"]] atau type="shape", "numberline", "bar", "clock", "geometry". Visual harus menjadi bagian soal, bukan hiasan. Jangan gunakan URL gambar eksternal.':''}`;
  return {...body,context:guard+'\nKONTEKS GURU:\n'+String(body.context||''),aiBrainVersion:'3.0',outputLock:true};
}

export default {
  async fetch(request,env,ctx){
    if(request.method==='OPTIONS')return new Response(null,{headers:{'Access-Control-Allow-Origin':'*'}});
    const url=new URL(request.url);
    if(url.pathname!=='/api/ai/generate'||request.method!=='POST')return multiWorker.fetch(request,env,ctx);
    let body={};try{body=await request.clone().json()}catch{return multiWorker.fetch(request,env,ctx)}
    const req=new Request(request,{body:JSON.stringify(brainBody(body))});
    const res=await multiWorker.fetch(req,env,ctx);
    let data={};try{data=await res.clone().json()}catch{return res}
    if(data.ok&&typeof data.text==='string'){
      const jenis=String(body.jenis||'').toLowerCase().trim();
      data.text=renderVisuals(cleanLeak(data.text,jenis));
      data.aiBrain='V3';
      data.visualSupport=jenis==='soal_sumatif'||jenis==='soal_formatif';
    }
    return new Response(JSON.stringify(data),{status:res.status,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}});
  }
};
