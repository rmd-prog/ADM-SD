/* ADM-SD AI BRAIN V3
   Guardrail wrapper around the existing AI generator.
   - locks one request to one document type
   - strips document leakage/foreign sections
   - adds controlled visual-question support without external image files
*/

const VISUAL_TYPES = new Set(['fraction','shape','numberline','bar','clock','geometry']);

function esc(v='') {
  return String(v).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
}
function attrs(src='') {
  const out={};
  for (const m of String(src).matchAll(/([a-zA-Z]+)\s*=\s*\"([^\"]*)\"/g)) out[m[1]]=m[2];
  return out;
}
function svgWrap(inner, label='Gambar stimulus') {
  return `<div class="ai-visual" style="margin:10px 0;text-align:center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 210" width="100%" role="img" aria-label="${esc(label)}" style="max-width:520px;height:auto;border:1px solid #d9dee8;border-radius:12px;background:#fff">${inner}</svg></div>`;
}
function makeVisual(type, a) {
  const label=a.label || 'Gambar stimulus';
  if (type==='fraction') {
    const n=Math.max(0,Math.min(20,Number(a.n||a.a||3))), d=Math.max(1,Math.min(20,Number(a.d||a.b||4)));
    const x=150,y=55,w=220,h=100, part=w/d;
    let s=`<text x="260" y="30" text-anchor="middle" font-size="18" font-weight="700">${esc(label)}</text>`;
    for(let i=0;i<d;i++) s+=`<rect x="${x+i*part}" y="${y}" width="${part-1}" height="${h}" fill="${i<n?'#dbeafe':'#fff'}" stroke="#334155"/>`;
    s+=`<text x="260" y="185" text-anchor="middle" font-size="20">${n}/${d}</text>`; return svgWrap(s,label);
  }
  if(type==='shape') {
    const shape=(a.shape||'triangle').toLowerCase(); let p='';
    if(shape==='circle') p='<circle cx="260" cy="110" r="70" fill="#dbeafe" stroke="#1e3a8a" stroke-width="3"/>';
    else if(shape==='rectangle') p='<rect x="150" y="55" width="220" height="110" fill="#dbeafe" stroke="#1e3a8a" stroke-width="3"/>';
    else if(shape==='square') p='<rect x="190" y="40" width="140" height="140" fill="#dbeafe" stroke="#1e3a8a" stroke-width="3"/>';
    else p='<polygon points="260,35 155,175 365,175" fill="#dbeafe" stroke="#1e3a8a" stroke-width="3"/>';
    return svgWrap(`<text x="260" y="25" text-anchor="middle" font-size="18" font-weight="700">${esc(label)}</text>${p}`,label);
  }
  if(type==='numberline') {
    const min=Number(a.min||0), max=Number(a.max||10), point=Number(a.point||0); const lo=Math.min(min,max), hi=Math.max(min,max);
    let s=`<text x="260" y="30" text-anchor="middle" font-size="18" font-weight="700">${esc(label)}</text><line x1="50" y1="110" x2="470" y2="110" stroke="#334155" stroke-width="3"/>`;
    const span=hi-lo||1;
    for(let i=0;i<=span;i++){const v=lo+i,x=50+(420*i/span);s+=`<line x1="${x}" y1="100" x2="${x}" y2="120" stroke="#334155"/><text x="${x}" y="145" text-anchor="middle" font-size="13">${v}</text>`;}
    const px=50+(420*((point-lo)/span)); s+=`<circle cx="${px}" cy="110" r="9" fill="#2563eb"/><text x="${px}" y="88" text-anchor="middle" font-size="14" font-weight="700">?</text>`; return svgWrap(s,label);
  }
  if(type==='bar') {
    const labels=String(a.labels||'A|B|C').split('|').slice(0,6), vals=String(a.values||'3|5|2').split('|').map(Number).slice(0,6); const max=Math.max(1,...vals);
    let s=`<text x="260" y="25" text-anchor="middle" font-size="18" font-weight="700">${esc(label)}</text>`;
    labels.forEach((lb,i)=>{const x=55+i*75,h=120*(Math.max(0,vals[i]||0)/max),y=165-h;s+=`<rect x="${x}" y="${y}" width="48" height="${h}" fill="#bfdbfe" stroke="#1e3a8a"/><text x="${x+24}" y="185" text-anchor="middle" font-size="13">${esc(lb)}</text>`;}); return svgWrap(s,label);
  }
  if(type==='clock') {
    const hour=(Number(a.hour||3)%12), minute=Math.max(0,Math.min(59,Number(a.minute||0))), cx=260,cy=110,r=70;
    const ha=(hour+minute/60)*Math.PI/6-Math.PI/2, ma=minute*Math.PI/30-Math.PI/2;
    const hx=cx+35*Math.cos(ha),hy=cy+35*Math.sin(ha),mx=cx+52*Math.cos(ma),my=cy+52*Math.sin(ma);
    return svgWrap(`<text x="260" y="25" text-anchor="middle" font-size="18" font-weight="700">${esc(label)}</text><circle cx="260" cy="110" r="70" fill="#fff" stroke="#1e3a8a" stroke-width="3"/><line x1="260" y1="110" x2="${hx}" y2="${hy}" stroke="#0f172a" stroke-width="6"/><line x1="260" y1="110" x2="${mx}" y2="${my}" stroke="#2563eb" stroke-width="4"/><circle cx="260" cy="110" r="5" fill="#0f172a"/>`,label);
  }
  if(type==='geometry') {
    return svgWrap(`<text x="260" y="25" text-anchor="middle" font-size="18" font-weight="700">${esc(label)}</text><polygon points="120,165 260,45 400,165" fill="#dbeafe" stroke="#1e3a8a" stroke-width="3"/><text x="260" y="185" text-anchor="middle" font-size="14">Segitiga</text>`,label);
  }
  return '';
}
function renderVisuals(text) {
  return String(text).replace(/\[\[GAMBAR\s+([^\]]+)\]\]/gi,(m,raw)=>{
    const a=attrs(raw), type=String(a.type||'').toLowerCase();
    return VISUAL_TYPES.has(type) ? makeVisual(type,a) : '';
  });
}

function stripForeignSections(text, jenis) {
  let t=String(text||'');
  if(jenis==='materi' || jenis==='ringkasan' || jenis==='bahan_ajar') {
    const forbidden=/^#{1,6}\s*(RPM|LKPD|MODUL AJAR|PROTA|PROSEM|ATP|TP|CP|KISI[- ]?KISI|RUBRIK|KUNCI JAWABAN|PEDOMAN PENSKORAN|DAFTAR BAB|PETUNJUK BELAJAR|KEGIATAN \d+).*$/gim;
    t=t.replace(forbidden,'').replace(/\n{3,}/g,'\n\n');
    t=t.replace(/^\s*(sumatif|formatif)\s+mata pelajaran.*$/gim,'');
  }
  if(!['soal_sumatif','soal_formatif'].includes(jenis)) {
    t=t.replace(/^\s*(sumatif|formatif)\s+mata pelajaran\s*[:\-]?.*$/gim,'');
  }
  return t.trim();
}

function brainPrompt(body, jenis) {
  const visualSoal=jenis==='soal_sumatif'||jenis==='soal_formatif';
  return {
    ...body,
    context: `${String(body.context||'').trim()}\n\nAI BRAIN V3 — KUNCI DOKUMEN:\n1. HASIL AKHIR HARUS HANYA JENIS: ${jenis}. Jangan membuat dokumen lain, lampiran, template lain, daftar BAB, petunjuk buku, identitas buku, atau bagian dari jenis lain kecuali memang bagian wajib jenis ini.\n2. Jangan membawa teks dari contoh/template yang tidak diminta. Frasa seperti “Sumatif Mata Pelajaran/Fase/Kelas” hanya boleh muncul jika jenis yang diminta memang soal_sumatif.\n3. Gunakan hanya kelas, fase, mapel, bab, subbab, tujuan, jumlah, bentuk soal, dan instruksi yang dikirim guru.\n4. Jangan menambahkan metadata buku atau daftar BAB terverifikasi ke output kecuali guru secara eksplisit meminta metadata tersebut.${visualSoal?'\n5. Untuk soal: buat beberapa soal dengan stimulus visual bila materi cocok. Gunakan tepat 2–5 visual untuk paket 10–20 soal (proporsional untuk jumlah lain). Visual harus relevan, bukan hiasan. Tandai visual dengan token persis seperti [[GAMBAR type="fraction" n="3" d="4" label="Gambar pecahan"]], atau type shape/numberline/bar/clock/geometry. Jangan gunakan URL gambar eksternal.':'\n5. Jangan membuat token GAMBAR karena jenis ini bukan paket soal.'}`,
    __aiBrainV3:true
  };
}

export async function handleAIBrain(request, env, baseWorker) {
  let body={}; try{body=await request.clone().json();}catch{return baseWorker.fetch(request,env);}
  const jenis=String(body.jenis||'').toLowerCase().trim();
  const upgraded=brainPrompt(body,jenis);
  const req=new Request(request,{body:JSON.stringify(upgraded)});
  const res=await baseWorker.fetch(req,env);
  if(!res || !String(res.headers.get('content-type')||'').includes('application/json')) return res;
  let data={}; try{data=await res.clone().json();}catch{return res;}
  if(data && data.ok && typeof data.text==='string') {
    data.text=renderVisuals(stripForeignSections(data.text,jenis));
    data.aiBrain='V3';
    data.visualSupport=jenis==='soal_sumatif'||jenis==='soal_formatif';
  }
  return new Response(JSON.stringify(data),{status:res.status,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}});
}
