/* ADM-SD — multi-rombel + AI Brain compatibility wrapper. */
import baseWorker from './index.js';

const TARGET = '199304252024212021';
const ROMBELS = ['IIA','IIB'];
const jsonHeaders = {'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization'};

function encodeToken(obj){return btoa(JSON.stringify(obj))}
function responseJson(data,status=200){return new Response(JSON.stringify(data),{status,headers:jsonHeaders})}
function cleanRombel(value){const raw=String(value??'').trim().toUpperCase().replace(/\s+/g,'');const map={'2A':'IIA','2B':'IIB','KELAS2A':'IIA','KELAS2B':'IIB','KELASIIA':'IIA','KELASIIB':'IIB'};return map[raw]||raw}
function makeSafeUser(row,active='IIA'){
  const r=ROMBELS.includes(cleanRombel(active))?cleanRombel(active):'IIA';
  const mapel=String(row.mapel||'').trim();
  return {id:row.id,username:row.username,nama:row.nama,name:row.nama,role:row.role,kelas:r,rombel:r,mapel,rombels:ROMBELS.slice(),activeRombel:r};
}
function readToken(request){const raw=request.headers.get('Authorization')?.replace(/^Bearer\s+/i,'').trim();if(!raw)return null;try{return JSON.parse(atob(raw))}catch{return null}}
async function loadTargetUser(env){const row=await env.DB.prepare('SELECT id,username,password,nama,role,kelas,rombel,mapel FROM users WHERE username=? ORDER BY id LIMIT 1').bind(TARGET).first();return row||null}

async function annisaLogin(request,env){
  let body={};try{body=await request.clone().json()}catch{}
  const username=String(body.username||'').trim();const password=String(body.password??'');
  if(username!==TARGET)return null;
  const rows=await env.DB.prepare('SELECT id,username,password,nama,role,kelas,rombel,mapel FROM users WHERE username=? ORDER BY id').bind(username).all();
  const list=rows.results||[];const row=list.find(x=>String(x.password??'')===password)||list.find(x=>String(x.password??'').trim()===password.trim());
  if(!row)return responseJson({ok:false,message:'Username atau password salah.'},401);
  const user=makeSafeUser(row,'IIA');const token=encodeToken(user);
  return responseJson({ok:true,token,access_token:token,user},200);
}

async function hardenAnnisaRequest(request,env){
  const tokenUser=readToken(request);if(String(tokenUser?.username||'').trim()!==TARGET)return request;
  const dbUser=await loadTargetUser(env);if(!dbUser)return request;
  const url=new URL(request.url);let active='';
  const q=cleanRombel(url.searchParams.get('rombel')||url.searchParams.get('kelas')||'');if(ROMBELS.includes(q))active=q;
  if(!active && request.method!=='GET'&&request.method!=='HEAD'){
    try{const b=await request.clone().json();const br=cleanRombel(b?.rombel||b?.kelas||'');if(ROMBELS.includes(br))active=br;}catch{}
  }
  active=active||cleanRombel(tokenUser.activeRombel||tokenUser.rombel||tokenUser.kelas)||'IIA';
  if(!ROMBELS.includes(active))active='IIA';
  const safe=makeSafeUser(dbUser,active);const headers=new Headers(request.headers);headers.set('Authorization','Bearer '+encodeToken(safe));
  return new Request(request,{headers});
}

/* AI BRAIN V2 */
function aiBrainInstruction(body){
  const jenis=String(body?.jenis||'').toLowerCase().trim();const names={materi:'MATERI PEMBELAJARAN',bahan_ajar:'BAHAN AJAR',lkpd:'LKPD',rpm:'RPM',modul_ajar:'MODUL AJAR',prota:'PROTA',prosem:'PROSEM',cp:'CP',tp:'TP',atp:'ATP',asesmen:'ASESMEN',soal:'SOAL/ASESMEN'};const target=names[jenis]||String(body?.jenis||'DOKUMEN YANG DIPILIH').toUpperCase();
  return `\n\n===== ADM-SD AI BRAIN V2 — OUTPUT LOCK =====\nTARGET OUTPUT: ${target}\n\nATURAN ABSOLUT:\n1. HANYA hasilkan TARGET OUTPUT yang dipilih guru. Jangan membuat dokumen lain.\n2. Jangan menyisipkan RPM, Modul Ajar, LKPD, Prota, Prosem, CP, TP, ATP, soal, kunci jawaban, rubrik, atau format administrasi lain kecuali memang TARGET OUTPUT membutuhkannya.\n3. Untuk MATERI PEMBELAJARAN: keluaran harus berupa materi pembelajaran saja: judul materi, penjelasan konsep, contoh yang relevan, aktivitas/latihan yang merupakan bagian langsung dari materi, dan rangkuman bila sesuai. Jangan membuat bagian 'Daftar BAB Terverifikasi', metadata buku, identitas sumber, petunjuk guru, perangkat administrasi, atau dokumen turunan.\n4. Jangan mengarang atau menambahkan BAB/SUBBAB di luar pilihan guru. Pertahankan istilah Bab/Sub Bab yang diberikan.\n5. Konteks buku/sumber hanya dipakai untuk menjaga kesesuaian isi; jangan ditampilkan sebagai dokumen atau lampiran tersendiri kecuali guru secara eksplisit meminta sumber.\n6. Ikuti kelas/fase, mapel, Bab, Sub Bab, tujuan, jumlah soal, bentuk soal, asesmen, dan ukuran kertas yang diberikan aplikasi. Jangan mengganti pilihan guru.\n7. Jika informasi tidak cukup, gunakan hanya informasi yang tersedia dan nyatakan keterbatasan secara singkat; jangan mengisi kekosongan dengan dokumen lain.\n8. Jangan membuat daftar isi, lampiran, file tambahan, atau 'dokumen terkait' yang tidak diminta.\n9. Sebelum mengirim jawaban, lakukan pemeriksaan internal: apakah setiap bagian benar-benar termasuk TARGET OUTPUT? Jika tidak, hapus bagian tersebut.\n===== END AI BRAIN V2 =====\n`;
}
async function strictAiRequest(request){let body;try{body=await request.clone().json()}catch{return request;}body.context=aiBrainInstruction(body)+'\nKONTEKS GURU/APLIKASI:\n'+String(body.context||'');body.aiBrainVersion='2.0';body.outputLock=true;return new Request(request,{body:JSON.stringify(body)});}

export default {async fetch(request,env,ctx){
  if(request.method==='OPTIONS')return new Response(null,{headers:jsonHeaders});
  const url=new URL(request.url);
  if(url.pathname==='/api/login'&&request.method==='POST'){try{const body=await request.clone().json();if(String(body.username||'').trim()===TARGET){const result=await annisaLogin(request,env);if(result)return result;}}catch{}}
  const hardened=await hardenAnnisaRequest(request,env);
  if(url.pathname==='/api/ai/generate'&&request.method==='POST'){
    let body={};try{body=await hardened.clone().json()}catch{}
    const jenis=String(body?.jenis||'').toLowerCase().trim();
    const assessment=['soal_sumatif','soal_formatif','kisi_kisi','rubrik','kunci_jawaban','pedoman_skor'].includes(jenis);
    const aiRequest=assessment?hardened:await strictAiRequest(hardened);
    return baseWorker.fetch(aiRequest,env,ctx);
  }
  return baseWorker.fetch(hardened,env,ctx);
}};
