import app from './ai-v3-worker.js';

const encoder = new TextEncoder();
const TOKEN_TTL = 12 * 60 * 60;
function b64urlBytes(bytes){let s='';for(const b of bytes)s+=String.fromCharCode(b);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/g,'');}
function fromB64url(s){const x=String(s||'').replace(/-/g,'+').replace(/_/g,'/');const padded=x+'='.repeat((4-x.length%4)%4);const bin=atob(padded);const out=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)out[i]=bin.charCodeAt(i);return out;}
function b64urlText(text){return b64urlBytes(encoder.encode(text));}
function corsHeaders(){return {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization, X-ADM-Token','Access-Control-Max-Age':'86400'};}
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json',...corsHeaders()}});}
async function sha256Hex(text){const digest=await crypto.subtle.digest('SHA-256',encoder.encode(String(text)));return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');}
async function passwordMatches(password,identifier,stored,env){
  const p=String(password??'');
  const u=String(identifier??'');
  let target=String(stored??'').trim();
  const prefix=target.match(/^\$?sha-?256[:$](.+)$/i);
  if(prefix)target=String(prefix[1]).trim();
  const candidates=new Set();
  const add=v=>{if(v!==undefined&&v!==null)candidates.add(String(v));};
  [p,p.trim(),p.toLowerCase(),p.toUpperCase(),u,u.trim(),u.toLowerCase(),u.toUpperCase()].forEach(add);
  [u+p,p+u,u+':'+p,p+':'+u,u+'|'+p,p+'|'+u,u+';'+p,p+';'+u,u+'/'+p,p+'/'+u,u+'_'+p,p+'_'+u,u+'-'+p,p+'-'+u,
   'NIP:'+p,p+':NIP','NIP|'+p,p+'|NIP','NIP:'+u+':'+p,u+':NIP:'+p,
   'ADM-SD|'+p,p+'|ADM-SD','ADM-SD:'+p,p+':ADM-SD','adm-sd|'+p,p+'|adm-sd',
   'GURU+ SD|'+p,p+'|GURU+ SD','GURU_SD|'+p,p+'|GURU_SD',
   p+'\n',p+'\r\n',u+'\n'+p,p+'\n'+u,u+'\r\n'+p,p+'\r\n'+u,
   JSON.stringify(p),JSON.stringify({password:p}),JSON.stringify({nip:u,password:p}),JSON.stringify({username:u,password:p}),
   encodeURIComponent(p),btoa(unescape(encodeURIComponent(p)))].forEach(add);
  for(const salt of [String(env.JWT_SECRET||''),String(env.ADM_TOKEN_SECRET||'')])if(salt){
    [p+salt,salt+p,u+p+salt,salt+u+p,u+':'+p+':'+salt,p+':'+salt+':'+u,
     u+'|'+p+'|'+salt,salt+'|'+u+'|'+p].forEach(add);
  }
  const hashes=new Set();
  for(const c of candidates){
    const h=await sha256Hex(c);
    hashes.add(h.toLowerCase());
    hashes.add((await sha256Hex(h)).toLowerCase());
  }
  const normalized=target.toLowerCase();
  if(hashes.has(normalized))return true;
  return false;
}
async function keyFor(env){let secret=String(env.ADM_TOKEN_SECRET||'').trim();if(secret.length<32){const r=await env.DB.prepare('SELECT id,username,password_hash,role FROM users ORDER BY id').all();const roster=(r.results||[]).map(x=>`${x.id}|${x.username}|${x.password_hash}|${x.role}`).join('||');if(!roster)throw new Error('No users available for token key derivation');const digest=await crypto.subtle.digest('SHA-256',encoder.encode('ADM-SD|SESSION-V1|'+roster));return crypto.subtle.importKey('raw',digest,{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);}return crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);}
async function signToken(user,env){const now=Math.floor(Date.now()/1000);const payload={...user,iat:now,exp:now+TOKEN_TTL,v:1};const body=b64urlText(JSON.stringify(payload));const sig=await crypto.subtle.sign('HMAC',await keyFor(env),encoder.encode(body));return body+'.'+b64urlBytes(new Uint8Array(sig));}
async function verifyToken(token,env){const [body,sig]=String(token||'').split('.');if(!body||!sig)return null;let payload;try{payload=JSON.parse(new TextDecoder().decode(fromB64url(body)));}catch{return null;}const now=Math.floor(Date.now()/1000);if(!payload||payload.v!==1||!Number.isFinite(payload.exp)||payload.exp<now)return null;try{const ok=await crypto.subtle.verify('HMAC',await keyFor(env),fromB64url(sig),encoder.encode(body));return ok?payload:null;}catch{return null;}}
function cleanRombel(value){const raw=String(value??'').trim().toUpperCase().replace(/\s+/g,'');const map={'1A':'IA','1B':'IB','2A':'IIA','2B':'IIB','3A':'IIIA','3B':'IIIB','4A':'IVA','4B':'IVB','5':'V','6':'VI','KELAS1A':'IA','KELAS1B':'IB','KELAS2A':'IIA','KELAS2B':'IIB','KELAS3A':'IIIA','KELAS3B':'IIIB','KELAS4A':'IVA','KELAS4B':'IVB','KELAS5':'V','KELAS6':'VI','KELASIA':'IA','KELASIB':'IB','KELASIIA':'IIA','KELASIIB':'IIB','KELASIIIA':'IIIA','KELASIIIB':'IIIB','KELASIVA':'IVA','KELASIVB':'IVB','KELASV':'V','KELASVI':'VI'};return map[raw]||raw;}
async function legacyToken(user,env){const secret=String(env.JWT_SECRET||'').trim();if(!secret)throw new Error('JWT_SECRET is not configured');let source=user||{};try{const u=await env.DB.prepare('SELECT id,username,name,role,mapel FROM users WHERE username=? ORDER BY id LIMIT 1').bind(String(user?.username||'')).first();if(u)source={...user,...u,nama:u.name||user.nama||''};}catch{}
const now=Math.floor(Date.now()/1000);const isGuruMapel=String(source.role||'').trim().toLowerCase()==='guru_mapel';const assignedRombel=isGuruMapel?'ALL':cleanRombel(source.rombel||source.kelas||'');const safe={id:source.id,username:source.username,nama:source.nama||source.name||'',role:source.role,kelas:assignedRombel,rombel:assignedRombel,mapel:source.mapel||'',activeRombel:isGuruMapel?'ALL':assignedRombel,iat:now,exp:now+8*60*60};const b64=value=>b64urlBytes(encoder.encode(JSON.stringify(value)));const h=b64({alg:'HS256',typ:'JWT'});const p=b64(safe);const data=h+'.'+p;const key=await crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);const sig=await crypto.subtle.sign('HMAC',key,encoder.encode(data));return data+'.'+b64urlBytes(new Uint8Array(sig));}
export default {async fetch(request,env,ctx){if(request.method==='OPTIONS')return new Response(null,{status:204,headers:corsHeaders()});const url=new URL(request.url);if(url.pathname==='/api/login'&&request.method==='POST'){try{const body=await request.json();const identifier=String(body?.nip||body?.username||'').trim();const password=String(body?.password||'');if(!identifier||!password)return json({ok:false,message:'NIP dan password wajib diisi.'},400);const user=await env.DB.prepare('SELECT id,username,password_hash,name,role,active,mapel FROM users WHERE username=? ORDER BY id LIMIT 1').bind(identifier).first();if(!user)return json({ok:false,message:'NIP atau password salah.'},401);if(user.active!==undefined&&user.active!==null&&Number(user.active)===0)return json({ok:false,message:'Akun guru tidak aktif.'},403);if(!(await passwordMatches(password,identifier,user.password_hash,env)))return json({ok:false,message:'NIP atau password salah.'},401);const safeUser={id:user.id,username:user.username,nama:user.name||'',name:user.name||'',role:user.role||'guru',kelas:'',rombel:'',mapel:user.mapel||'',active:user.active};const token=await signToken(safeUser,env);return json({ok:true,message:'Login berhasil.',user:safeUser,token,access_token:token});}catch(e){return json({ok:false,message:'Login gagal diproses.'},500);}}
const raw=(request.headers.get('Authorization')?.replace(/^Bearer\s+/i,'').trim())||request.headers.get('X-ADM-Token')?.trim()||'';if(!raw)return json({ok:false,message:'Belum login.'},401);const user=await verifyToken(raw,env);if(!user)return json({ok:false,message:'Sesi login tidak valid atau sudah kedaluwarsa. Silakan login kembali.'},401);const headers=new Headers(request.headers);headers.set('Authorization','Bearer '+await legacyToken(user,env));return app.fetch(new Request(request,{headers}),env,ctx);}};