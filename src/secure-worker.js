import app from './ai-v3-worker.js';

const encoder = new TextEncoder();
const TOKEN_TTL = 12 * 60 * 60;

function b64urlBytes(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
function fromB64url(s) {
  const x = String(s || '').replace(/-/g, '+').replace(/_/g, '/');
  const padded = x + '='.repeat((4 - x.length % 4) % 4);
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function b64urlText(text) { return b64urlBytes(encoder.encode(text)); }
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-ADM-Token',
    'Access-Control-Max-Age': '86400'
  };
}
function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: {
    'Content-Type': 'application/json',
    ...corsHeaders()
  }});
}

async function keyFor(env) {
  let secret = String(env.ADM_TOKEN_SECRET || '').trim();
  if (secret.length < 32) {
    const r = await env.DB.prepare('SELECT id,username,password,role FROM users ORDER BY id').all();
    const roster = (r.results || []).map(x => `${x.id}|${x.username}|${x.password}|${x.role}`).join('||');
    if (!roster) throw new Error('No users available for token key derivation');
    const digest = await crypto.subtle.digest('SHA-256', encoder.encode('ADM-SD|SESSION-V1|' + roster));
    return crypto.subtle.importKey('raw', digest, {name:'HMAC', hash:'SHA-256'}, false, ['sign','verify']);
  }
  return crypto.subtle.importKey('raw', encoder.encode(secret), {name:'HMAC', hash:'SHA-256'}, false, ['sign','verify']);
}
async function signToken(user, env) {
  const now = Math.floor(Date.now()/1000);
  const payload = {...user, iat: now, exp: now + TOKEN_TTL, v: 1};
  const body = b64urlText(JSON.stringify(payload));
  const sig = await crypto.subtle.sign('HMAC', await keyFor(env), encoder.encode(body));
  return body + '.' + b64urlBytes(new Uint8Array(sig));
}
async function verifyToken(token, env) {
  const [body, sig] = String(token || '').split('.');
  if (!body || !sig) return null;
  let payload;
  try { payload = JSON.parse(new TextDecoder().decode(fromB64url(body))); } catch { return null; }
  const now = Math.floor(Date.now()/1000);
  if (!payload || payload.v !== 1 || !Number.isFinite(payload.exp) || payload.exp < now) return null;
  try {
    const ok = await crypto.subtle.verify('HMAC', await keyFor(env), fromB64url(sig), encoder.encode(body));
    return ok ? payload : null;
  } catch { return null; }
}

async function legacyToken(user, env) {
  const secret = String(env.JWT_SECRET || '').trim();
  if (!secret) throw new Error('JWT_SECRET is not configured');
  const now = Math.floor(Date.now() / 1000);
  const isGuruMapel = String(user.role || '').trim().toLowerCase() === 'guru_mapel';
  const assignedRombel = isGuruMapel ? 'ALL' : (user.rombel || user.kelas || '');
  const safe = {
    id:user.id, username:user.username, nama:user.nama || user.name || '', role:user.role,
    kelas:assignedRombel, rombel:assignedRombel, mapel:user.mapel || '',
    activeRombel:isGuruMapel ? 'ALL' : (user.activeRombel || assignedRombel),
    iat:now, exp:now + 8 * 60 * 60
  };
  const b64 = (value) => b64urlBytes(encoder.encode(JSON.stringify(value)));
  const h = b64({alg:'HS256',typ:'JWT'});
  const p = b64(safe);
  const data = h + '.' + p;
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), {name:'HMAC',hash:'SHA-256'}, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return data + '.' + b64urlBytes(new Uint8Array(sig));
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') return new Response(null, {status:204, headers:corsHeaders()});
    const url = new URL(request.url);

    if (url.pathname === '/api/login' && request.method === 'POST') {
      const upstream = await app.fetch(request, env, ctx);
      if (!upstream.ok) return upstream;
      try {
        const data = await upstream.clone().json();
        if (!data?.ok || !data?.user) return upstream;
        const token = await signToken(data.user, env);
        return json({...data, token, access_token: token}, upstream.status);
      } catch { return upstream; }
    }

    const raw = (request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '').trim())
      || request.headers.get('X-ADM-Token')?.trim()
      || '';
    if (!raw) return json({ok:false, message:'Belum login.'}, 401);
    const user = await verifyToken(raw, env);
    if (!user) return json({ok:false, message:'Sesi login tidak valid atau sudah kedaluwarsa. Silakan login kembali.'}, 401);

    const headers = new Headers(request.headers);
    headers.set('Authorization', 'Bearer ' + await legacyToken(user, env));
    return app.fetch(new Request(request, {headers}), env, ctx);
  }
};
