/* SIAP GURU — single-source Absensi bridge
   Penilaian & Rekap reads the same Cloudflare /absensi data as menu Absensi.
   The Penilaian tab is intentionally read-only: input remains in menu Absensi.
*/
(function(){
'use strict';
if(window.__ADM_ASSESS_ABS_BRIDGE__)return;window.__ADM_ASSESS_ABS_BRIDGE__=true;
const API='https://adm-sd.adm-sd.workers.dev/api';
const q=(s,r=document)=>r.querySelector(s), esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const rombelAliases={1A:'IA',1B:'IB',2A:'IIA',2B:'IIB',3A:'IIIA',3B:'IIIB',4A:'IVA',4B:'IVB'};
function login(){try{return JSON.parse(localStorage.getItem('siLogin')||'null')||{}}catch{return {}}}
function token(){const x=login();return String(localStorage.getItem('siAuthToken')||localStorage.getItem('siToken')||x.token||x.access_token||x.user?.token||x.user?.access_token||'').trim()}
function rombel(){const x=login(),r=String(x?.user?.activeRombel||x?.user?.rombel||x?.rombel||x?.user?.kelas||x?.kelas||'').trim().toUpperCase();return rombelAliases[r]||r}
async function api(path){const t=token();if(!t)throw Error('Sesi login tidak ditemukan. Silakan login ulang.');const h={Authorization:'Bearer '+t,'X-ADM-Token':t};const r=await fetch(API+'/absensi'+path,{headers:h});const j=await r.json().catch(()=>({}));if(!r.ok||j.ok===false)throw Error(j.message||'Gagal membaca rekap absensi.');return j}
function month(){const d=new Date();return d.toISOString().slice(0,7)}
async function render(){const host=q('#sgAssessmentBody'),p=q('#penilaianPro');if(!host||!p||!p.classList.contains('active'))return;const r=rombel(),m=month();host.innerHTML='<div class="sg-note">📋 Absensi di sini adalah <b>rekap otomatis dari menu Absensi</b>. Untuk mengubah kehadiran, gunakan menu 📋 Absensi agar hanya ada satu sumber data.</div><div class="sg-grid"><label>Rombel<input id="sgAbsRombel" value="'+esc(r)+'" readonly></label><label>Bulan<input id="sgAbsMonth" type="month" value="'+m+'"></label><div></div><div class="sg-actions" style="align-self:end;margin:0"><button class="btn secondary" id="sgAbsRefresh">↻ Perbarui Rekap</button></div></div><div id="sgAbsBridgeMsg" class="sg-note">Memuat rekap absensi...</div><div class="tablewrap"><table class="table" style="min-width:760px"><thead><tr><th>No</th><th>Nama</th><th>Hadir</th><th>Sakit</th><th>Izin</th><th>Alpa</th><th>Total</th><th>% Hadir</th></tr></thead><tbody id="sgAbsBridgeBody"></tbody></table></div>';
q('#sgAbsRefresh').onclick=load;q('#sgAbsMonth').onchange=load;await load();
async function load(){const body=q('#sgAbsBridgeBody'),msg=q('#sgAbsBridgeMsg');if(!body)return;body.innerHTML='<tr><td colspan="8">Memuat...</td></tr>';try{const rr=q('#sgAbsRombel').value,mm=q('#sgAbsMonth').value,j=await api('?rombel='+encodeURIComponent(rr)+'&bulan='+encodeURIComponent(mm));const data=j.data||[];body.innerHTML=data.map((x,i)=>{const h=+x.H||0,s=+x.S||0,iz=+x.I||0,a=+x.A||0,total=+x.total||h+s+iz+a,pct=total?Math.round(h/total*100):0;return '<tr><td>'+(i+1)+'</td><td><b>'+esc(x.nama_siswa||x.nama||'')+'</b></td><td>'+h+'</td><td>'+s+'</td><td>'+iz+'</td><td>'+a+'</td><td>'+total+'</td><td><b>'+pct+'%</b></td></tr>'}).join('')||'<tr><td colspan="8">Belum ada data absensi pada bulan ini.</td></tr>';msg.textContent='✓ Rekap terhubung langsung ke data menu Absensi.';msg.className='sg-note'}catch(e){body.innerHTML='<tr><td colspan="8">'+esc(e.message)+'</td></tr>';msg.textContent='Gagal memuat rekap absensi.';msg.className='sg-note'}}
}
function wire(){const p=q('#penilaianPro');if(!p)return false;const b=p.querySelector('.sg-tab[data-at="abs"]');if(!b||b.dataset.absBridge)return false;b.dataset.absBridge='1';b.addEventListener('click',()=>setTimeout(render,30));return true}
let tries=0;const timer=setInterval(()=>{wire();if(++tries>80)clearInterval(timer)},500);
window.addEventListener('adm:students-ready',wire);
})();
