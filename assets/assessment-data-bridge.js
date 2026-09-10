/* SIAP GURU — Assessment student data bridge */
(function(){
'use strict';
if(window.__ADM_ASSESS_DATA_BRIDGE__)return;
window.__ADM_ASSESS_DATA_BRIDGE__=true;
const API='https://adm-sd.adm-sd.workers.dev/api';
const token=()=>{
  for(const k of ['siToken','token','authToken','accessToken','jwt','auth_token']){
    try{const v=localStorage.getItem(k);if(v)return String(v).replace(/^Bearer\s+/i,'')}catch{}
  }
  try{const x=JSON.parse(localStorage.getItem('siLogin')||'null');return String(x?.token||x?.accessToken||x?.user?.token||'').replace(/^Bearer\s+/i,'')}catch{return ''}
};
const normalize=(x,i)=>{if(!x||typeof x!=='object')return null;const name=String(x.name??x.nama??x.nama_siswa??x.namaSiswa??x.student_name??'').trim();if(!name)return null;return {id:String(x.id??x.nisn??x.nis??x.nis_siswa??i),name,rombel:String(x.rombel??x.kelas??x.rombel_siswa??'').trim(),raw:x};};
async function load(){
 const t=token();if(!t)return false;
 try{
  const r=await fetch(API+'/siswa',{headers:{Authorization:'Bearer '+t}});if(!r.ok)return false;
  const j=await r.json();const arr=Array.isArray(j)?j:(Array.isArray(j.data)?j.data:(Array.isArray(j.students)?j.students:(Array.isArray(j.siswa)?j.siswa:(Array.isArray(j.results)?j.results:[]))));
  const list=arr.map(normalize).filter(Boolean);if(!list.length)return false;
  window.db=window.db&&typeof window.db==='object'?window.db:{};window.db.students=list;window.students=list;window.__ADM_ASSESS_STUDENTS_READY__=true;
  document.dispatchEvent(new CustomEvent('adm:students-ready',{detail:{count:list.length}}));return true;
 }catch(e){console.warn('Assessment data bridge:',e);return false}
}
window.ADM_ASSESS_LOAD_STUDENTS=load;
let tries=0;
function retry(){if(window.__ADM_ASSESS_STUDENTS_READY__)return;if(tries++>=20)return;load().finally(()=>setTimeout(retry,1200));}
retry();
})();