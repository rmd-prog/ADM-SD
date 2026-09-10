/* GURU+ SD — SINGLE SOURCE OF TRUTH
 * One canonical state for BAB -> TP -> JP -> DPL -> Model.
 * All document generators should consume GURU_SD_MASTER.get().
 * Local-only. Never touches D1, Worker, students, login, or assessment bridge.
 */
(function(){'use strict';
if(window.__GURU_SD_MASTER_STATE_V1__)return;window.__GURU_SD_MASTER_STATE_V1__=1;
const KEY='guru_sd_pembelajaran_master_v1';
const LEGACY='guru_sd_perangkat_super_v1';
const $=id=>document.getElementById(id);
const read=(k,d=null)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(e){return d}};
const esc=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
const G={IA:1,IB:1,IIA:2,IIB:2,IIIA:3,IIIB:3,IVA:4,IVB:4,V:5,VI:6};
const DPL=['Keimanan dan ketakwaan kepada Tuhan Yang Maha Esa','Kewargaan','Penalaran kritis','Kreativitas','Kolaborasi','Kemandirian','Kesehatan','Komunikasi'];
function phase(r){let n=G[r]||1;return n<=2?'A':n<=4?'B':'C'}
function dpl(m){if(m==='PJOK')return ['Kesehatan','Kemandirian','Kolaborasi','Komunikasi'];if(/^Seni /.test(m))return ['Kreativitas','Kolaborasi','Komunikasi','Kemandirian'];if(m==='Matematika')return ['Penalaran kritis','Kreativitas','Kemandirian','Komunikasi'];if(m==='Pendidikan Pancasila')return ['Kewargaan','Kolaborasi','Komunikasi','Kemandirian'];if(m==='Pendidikan Agama dan Budi Pekerti')return ['Keimanan dan ketakwaan kepada Tuhan Yang Maha Esa','Kemandirian','Kesehatan','Komunikasi'];return ['Penalaran kritis','Kreativitas','Kolaborasi','Komunikasi']}
function controls(){return {rombel:$('pkR')?.value||'',mapel:$('pkM')?.value||'',bab:$('pkB')?.value||'',info:$('pkI')};}
function fromDom(){const c=controls();if(!c.rombel||!c.mapel||!c.bab)return null;const opt=$('pkB')?.options?.[$('pkB').selectedIndex];const text=(opt?.textContent||'').trim();const bm=text.match(/BAB\s*(\d+)\s*[—-]\s*(.+?)(?:\s*\((\d+)\s*JP\))?$/i);const babNo=bm?Number(bm[1]):Number(c.bab)||0;const material=bm?bm[2].trim():text.replace(/^BAB\s*\d+\s*[—-]\s*/i,'').replace(/\s*\(\d+\s*JP\).*$/i,'').trim();const jp=bm&&bm[3]?Number(bm[3]):Number(c.info?.textContent?.match(/(\d+)\s*JP/i)?.[1])||2;const semester=Number(c.info?.textContent?.match(/Semester\s*(\d+)/i)?.[1])||(babNo<=3?1:2);const lis=c.info?[...c.info.querySelectorAll('li')].map(x=>x.textContent.trim()).filter(Boolean):[];const old=read(KEY,null);const tp=lis.length?lis.map((x,i)=>({no:i+1,text:x,jp:0})):Array.from({length:4},(_,i)=>({no:i+1,text:'Peserta didik mampu '+['memahami konsep penting','mengidentifikasi dan menjelaskan informasi','menerapkan konsep dalam aktivitas atau pemecahan masalah','mengomunikasikan hasil dan melakukan refleksi'][i]+' pada materi '+material+'.',jp:0}));return {rombel:c.rombel,mapel:c.mapel,babId:c.rombel+'|'+c.mapel+'|'+babNo,babNo,material,semester,jp,tp,dpl:dpl(c.mapel),modelPembelajaran:old?.modelPembelajaran||'Problem Based Learning',fase:phase(c.rombel),tahunPelajaran:'2026/2027',updatedAt:new Date().toISOString()};}
function save(x){if(!x)return null;localStorage.setItem(KEY,JSON.stringify(x));
 // Compatibility mirror only; it is derived from the master and is never authoritative.
 localStorage.setItem(LEGACY,JSON.stringify({rombel:x.rombel,mapel:x.mapel,babNo:x.babNo,babId:x.babId,material:x.material,jp:x.jp,tp:x.tp,tpCount:x.tp.length,semester:x.semester,dpl:x.dpl,modelPembelajaran:x.modelPembelajaran,updatedAt:x.updatedAt}));
 window.dispatchEvent(new CustomEvent('guruSdMasterChanged',{detail:x}));return x;}
function sync(){const x=fromDom();if(!x)return null;const prev=read(KEY,null);if(prev&&prev.babId===x.babId&&prev.material===x.material&&prev.jp===x.jp&&prev.tp?.length===x.tp.length){x.modelPembelajaran=prev.modelPembelajaran||x.modelPembelajaran;}return save(x);}
function get(){let x=read(KEY,null);if(x)return x;return sync()||{rombel:'',mapel:'',babId:'',babNo:0,material:'',semester:1,jp:0,tp:[],dpl:DPL,modelPembelajaran:'Problem Based Learning',fase:'A',tahunPelajaran:'2026/2027'};}
function set(patch){return save({...get(),...patch,updatedAt:new Date().toISOString()});}
window.GURU_SD_MASTER={KEY,get,set,sync,save,phase,dpl,esc};
function boot(){const r=$('pkR'),m=$('pkM'),b=$('pkB');if(!r||!m||!b){setTimeout(boot,300);return}[r,m,b].forEach(el=>el.addEventListener('change',()=>setTimeout(sync,0)));sync();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();