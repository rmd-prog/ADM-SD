/* ADM-SD — multi-rombel compatibility wrapper. Original API remains in src/index.js. */
import baseWorker from './index.js';

const TARGET = '199304252024212021';
const ROMBELS = ['IIA','IIB'];
const jsonHeaders = {'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization'};

function encodeToken(obj){return btoa(JSON.stringify(obj))}
function responseJson(data,status=200){return new Response(JSON.stringify(data),{status,headers:jsonHeaders})}
function makeSafeUser(row){
  const mapel=String(row.mapel||'').trim();
  return {
    id:row.id,
    username:row.username,
    nama:row.nama,
    name:row.nama,
    role:row.role,
    kelas:'IIA',
    rombel:'IIA',
    mapel,
    rombels:ROMBELS.slice(),
    activeRombel:'IIA'
  };
}

async function annisaLogin(request,env){
  let body={};
  try{body=await request.clone().json()}catch{}
  const username=String(body.username||'').trim();
  const password=String(body.password??'');
  if(username!==TARGET)return null;

  // Cari semua baris dengan username yang sama, lalu cocokkan password.
  // Ini sengaja mengatasi data lama yang pernah memiliki username Annisa ganda.
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

    return baseWorker.fetch(request,env,ctx);
  }
};
