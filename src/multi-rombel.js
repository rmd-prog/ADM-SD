/* ADM-SD — multi-rombel + AI Brain compatibility wrapper. */
import baseWorker from './index.js';

const TARGET = '199304252024212021';
const ROMBELS = ['IIA','IIB'];
const jsonHeaders = {'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization'};

function encodeToken(obj){return btoa(JSON.stringify(obj))}
function responseJson(data,status=200){return new Response(JSON.stringify(data),{status,headers:jsonHeaders})}
function makeSafeUser(row){
  const mapel=String(row.mapel||'').trim();
  return {
    id:row.id, username:row.username, nama:row.nama, name:row.nama,
    role:row.role, kelas:'IIA', rombel:'IIA', mapel,
    rombels:ROMBELS.slice(), activeRombel:'IIA'
  };
}

async function annisaLogin(request,env){
  let body={};
  try{body=await request.clone().json()}catch{}
  const username=String(body.username||'').trim();
  const password=String(body.password??'');
  if(username!==TARGET)return null;
  const rows=await env.DB.prepare(
    'SELECT id,username,password,nama,role,kelas,rombel,mapel FROM users WHERE username=? ORDER BY id'
  ).bind(username).all();
  const list=rows.results||[];
  const row=list.find(x=>String(x.password??'')===password)
    ||list.find(x=>String(x.password??'').trim()===password.trim());
  if(!row)return responseJson({ok:false,message:'Username atau password salah.'},401);
  const user=makeSafeUser(row);
  const token=encodeToken(user);
  return responseJson({ok:true,token,access_token:token,user},200);
}

/*
 * AI BRAIN V2
 * Mengunci generator berdasarkan JENIS dokumen yang dipilih.
 * Tujuan: ketika guru meminta MATERI, AI tidak menyisipkan RPM/LKPD/soal/
 * metadata verifikasi buku atau dokumen administrasi lain ke dalam materi.
 */
function aiBrainInstruction(body){
  const jenis=String(body?.jenis||'').toLowerCase().trim();
  const names={
    materi:'MATERI PEMBELAJARAN',
    bahan_ajar:'BAHAN AJAR',
    lkpd:'LKPD',
    rpm:'RPM',
    modul_ajar:'MODUL AJAR',
    prota:'PROTA',
    prosem:'PROSEM',
    cp:'CP',
    tp:'TP',
    atp:'ATP',
    asesmen:'ASESMEN',
    soal:'SOAL/ASESMEN'
  };
  const target=names[jenis]||String(body?.jenis||'DOKUMEN YANG DIPILIH').toUpperCase();
  return `\n\n===== ADM-SD AI BRAIN V2 — OUTPUT LOCK =====\nTARGET OUTPUT: ${target}\n\nATURAN ABSOLUT:\n1. HANYA hasilkan TARGET OUTPUT yang dipilih guru. Jangan membuat dokumen lain.\n2. Jangan menyisipkan RPM, Modul Ajar, LKPD, Prota, Prosem, CP, TP, ATP, soal, kunci jawaban, rubrik, atau format administrasi lain kecuali memang TARGET OUTPUT membutuhkannya.\n3. Untuk MATERI PEMBELAJARAN: keluaran harus berupa materi pembelajaran saja: judul materi, penjelasan konsep, contoh yang relevan, aktivitas/latihan yang merupakan bagian langsung dari materi, dan rangkuman bila sesuai. Jangan membuat bagian 'Daftar BAB Terverifikasi', metadata buku, identitas sumber, petunjuk guru, perangkat administrasi, atau dokumen turunan.\n4. Jangan mengarang atau menambahkan BAB/SUBBAB di luar pilihan guru. Pertahankan istilah Bab/Sub Bab yang diberikan.\n5. Konteks buku/sumber hanya dipakai untuk menjaga kesesuaian isi; jangan ditampilkan sebagai dokumen atau lampiran tersendiri kecuali guru secara eksplisit meminta sumber.\n6. Ikuti kelas/fase, mapel, Bab, Sub Bab, tujuan, jumlah soal, bentuk soal, asesmen, dan ukuran kertas yang diberikan aplikasi. Jangan mengganti pilihan guru.\n7. Jika informasi tidak cukup, gunakan hanya informasi yang tersedia dan nyatakan keterbatasan secara singkat; jangan mengisi kekosongan dengan dokumen lain.\n8. Jangan membuat daftar isi, lampiran, file tambahan, atau 'dokumen terkait' yang tidak diminta.\n9. Sebelum mengirim jawaban, lakukan pemeriksaan internal: apakah setiap bagian benar-benar termasuk TARGET OUTPUT? Jika tidak, hapus bagian tersebut.\n===== END AI BRAIN V2 =====\n`;
}

async function strictAiRequest(request){
  let body;
  try{body=await request.clone().json()}catch{return request;}
  const instruction=aiBrainInstruction(body);
  const originalContext=String(body.context||'');
  body.context=instruction+'\nKONTEKS GURU/APLIKASI:\n'+originalContext;
  body.aiBrainVersion='2.0';
  body.outputLock=true;
  return new Request(request,{body:JSON.stringify(body)});
}

export default {
  async fetch(request,env,ctx){
    if(request.method==='OPTIONS')return new Response(null,{headers:jsonHeaders});
    const url=new URL(request.url);

    if(url.pathname==='/api/login'&&request.method==='POST'){
      try{
        const clone=request.clone();
        const body=await clone.json();
        if(String(body.username||'').trim()===TARGET){
          const result=await annisaLogin(request,env);
          if(result)return result;
        }
      }catch{}
    }

    if(url.pathname==='/api/ai/generate'&&request.method==='POST'){
      const strictRequest=await strictAiRequest(request);
      return baseWorker.fetch(strictRequest,env,ctx);
    }

    return baseWorker.fetch(request,env,ctx);
  }
};
