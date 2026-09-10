/* SIAP GURU — Assessment student data bridge */
(function(){
'use strict';
if(window.__ADM_ASSESS_DATA_BRIDGE__)return;
window.__ADM_ASSESS_DATA_BRIDGE__=true;
const API='https://adm-sd.adm-sd.workers.dev/api';
const readLogin=()=>{try{return JSON.parse(localStorage.getItem('siLogin')||'null')||{}}catch{return {}}};
const user=()=>{const x=readLogin();return x.user||x||{}};
const token=()=>{for(const k of ['siToken','token','authToken','accessToken','jwt','auth_token']){try{const v=localStorage.getItem(k);if(v)return String(v).replace(/^Bearer\s+/i,'')}catch{}}const x=readLogin();return String(x.token||x.accessToken||x.user?.token||'').replace(/^Bearer\s+/i,'')};
const normR=(v)=>{const s=String(v??'').trim().toUpperCase().replace(/\s+/g,'');return ({'1A':'IA','1B':'IB','2A':'IIA','2B':'IIB','3A':'IIIA','3B':'IIIB','4A':'IVA','4B':'IVB','5':'V','6':'VI','KELAS1A':'IA','KELAS1B':'IB','KELAS2A':'IIA','KELAS2B':'IIB','KELAS3A':'IIIA','KELAS3B':'IIIB','KELAS4A':'IVA','KELAS4B':'IVB','KELAS5':'V','KELAS6':'VI','KELASIA':'IA','KELASIB':'IB','KELASIIA':'IIA','KELASIIB':'IIB','KELASIIIA':'IIIA','KELASIIIB':'IIIB','KELASIVA':'IVA','KELASIVB':'IVB','KELASV':'V','KELASVI':'VI'})[s]||s};
const normalize=(x,i)=>{if(!x||typeof x!=='object')return null;const name=String(x.name??x.nama??x.nama_siswa??x.namaSiswa??x.student_name??'').trim();if(!name)return null;return {id:String(x.id??x.nisn??x.nis??x.nis_siswa??i),name,rombel:normR(x.rombel??x.kelas??x.rombel_siswa??''),raw:x};};
async function load(){
 const t=token();if(!t)return false;
 try{
  const u=user(),r=normR(u.activeRombel||u.rombel||u.kelas||'');
  const role=String(u.role||'').toLowerCase();
  const qs=(role==='guru_mapel'&&r==='ALL')?'?rombel=ALL':(r&&r!=='ALL'?('?rombel='+encodeURIComponent(r)):'');
  const res=await fetch(API+'/siswa'+qs,{headers:{Authorization:'Bearer '+t}});if(!res.ok)return false;
  const j=await res.json();const arr=Array.isArray(j)?j:(Array.isArray(j.data)?j.data:(Array.isArray(j.students)?j.students:(Array.isArray(j.siswa)?j.siswa:(Array.isArray(j.results)?j.results:[]))));
  const list=arr.map(normalize).filter(Boolean);if(!list.length)return false;
  window.db=window.db&&typeof window.db==='object'?window.db:{};window.db.students=list;window.students=list;window.__ADM_ASSESS_STUDENTS_READY__=true;
  document.dispatchEvent(new CustomEvent('adm:students-ready',{detail:{count:list.length,rombel:r}}));return true;
 }catch(e){console.warn('Assessment data bridge:',e);return false}
}
window.ADM_ASSESS_LOAD_STUDENTS=load;
let tries=0;function retry(){if(window.__ADM_ASSESS_STUDENTS_READY__)return;if(tries++>=25)return;load().finally(()=>setTimeout(retry,1000))}retry();
})();