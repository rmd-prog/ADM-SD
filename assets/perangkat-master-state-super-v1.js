/* GURU+ SD — SINGLE SOURCE OF TRUTH V4
 * One canonical state for BAB -> CP -> ATP -> TP -> JP -> Jadwal -> PROTA -> PROMES -> RPM -> LKPD -> Asesmen.
 * UI selectors only WRITE to Master on explicit change. Generators READ the stored Master only.
 * This prevents stale DOM/legacy state from re-entering the chain between events.
 * Local-only. Never touches D1, Worker, students, login, or assessment bridge.
 */
(function(){'use strict';
if(window.__GURU_SD_MASTER_STATE_V4__)return;window.__GURU_SD_MASTER_STATE_V4__=1;
const KEY='guru_sd_pembelajaran_master_v1',LEGACY='guru_sd_perangkat_super_v1';
const $=id=>document.getElementById(id);
const read=(k,d=null)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(e){return d}};
const G={IA:1,IB:1,IIA:2,IIB:2,IIIA:3,IIIB:3,IVA:4,IVB:4,V:5,VI:6};
const DPL=['Keimanan dan ketakwaan kepada Tuhan Yang Maha Esa','Kewargaan','Penalaran kritis','Kreativitas','Kolaborasi','Kemandirian','Kesehatan','Komunikasi'];
function phase(r){const n=G[r]||1;return n<=2?'A':n<=4?'B':'C'}
function defaultDpl(m){if(m==='PJOK')return ['Kesehatan','Kemandirian','Kolaborasi','Komunikasi'];if(/^Seni /.test(m))return ['Kreativitas','Kolaborasi','Komunikasi','Kemandirian'];if(m==='Matematika')return ['Penalaran kritis','Kreativitas','Kemandirian','Komunikasi'];if(m==='Pendidikan Pancasila')return ['Kewargaan','Kolaborasi','Komunikasi','Kemandirian'];if(m==='Pendidikan Agama dan Budi Pekerti')return ['Keimanan dan ketakwaan kepada Tuhan Yang Maha Esa','Kemandirian','Kesehatan','Komunikasi'];return ['Penalaran kritis','Kreativitas','Kolaborasi','Komunikasi']}
function controls(){return {rombel:$('pkR')?.value||'',mapel:$('pkM')?.value||'',bab:$('pkB')?.value||''};}
function selectedDpl(mapel,old,sameContext){const nodes=[...document.querySelectorAll('[data-dpl],input[name="dpl"],input[name="dpl[]"],select[name="dpl"],select[name="dpl[]"]')];const picked=nodes.filter(x=>x.checked||x.selected).map(x=>String(x.value||x.dataset.dpl||x.textContent||'').trim()).filter(x=>DPL.includes(x));if(picked.length)return [...new Set(picked)].slice(0,8);if(sameContext&&Array.isArray(old?.dpl)&&old.dpl.length)return old.dpl;return defaultDpl(mapel)}
function selectedModel(old,sameContext){const nodes=['modelPembelajaran','model','pkModel','modelPembelajaranSelect'].map($).filter(Boolean);for(const el of nodes){const v=el.value||el.textContent;if(v&&String(v).trim())return String(v).trim()}return sameContext?(old?.modelPembelajaran||'Problem Based Learning'):'Problem Based Learning'}
function parseBab(){const b=$('pkB');const opt=b?.options?.[b.selectedIndex];const text=(opt?.textContent||'').trim();const bm=text.match(/BAB\s*(\d+)\s*[—-]\s*(.+?)(?:\s*\((\d+)\s*JP\))?$/i);const babNo=bm?Number(bm[1]):Number(b?.value)||0;const material=bm?bm[2].trim():text.replace(/^BAB\s*\d+\s*[—-]\s*/i,'').replace(/\s*\(\d+\s*JP\).*$/i,'').trim();const jp=bm&&bm[3]?Number(bm[3]):2;return {babNo,material,jp};}
function fallbackTp(material){return Array.from({length:4},(_,i)=>({no:i+1,text:'Peserta didik mampu '+['memahami konsep penting','mengidentifikasi dan menjelaskan informasi','menerapkan konsep dalam aktivitas atau pemecahan masalah','mengomunikasikan hasil dan melakukan refleksi'][i]+' pada materi '+material+'.',jp:0}));}
function fromDom(){const c=controls();if(!c.rombel||!c.mapel||!c.bab)return null;const p=parseBab();if(!p.material)return null;const old=read(KEY,null);const babId=c.rombel+'|'+c.mapel+'|'+p.babNo;const sameContext=!!old&&old.rombel===c.rombel&&old.mapel===c.mapel&&old.babId===babId;const tp=fallbackTp(p.material);const semester=p.babNo>0?(p.babNo<=3?1:2):(sameContext?Number(old.semester)||1:1);return {source:'GURU_SD_MASTER',rombel:c.rombel,mapel:c.mapel,babId,babNo:p.babNo,material:p.material,semester,jp:p.jp,tp,dpl:selectedDpl(c.mapel,old,sameContext),modelPembelajaran:selectedModel(old,sameContext),fase:phase(c.rombel),tahunPelajaran:'2026/2027',updatedAt:new Date().toISOString()};}
function save(x){if(!x)return null;const clean={...x,source:'GURU_SD_MASTER',tp:Array.isArray(x.tp)?x.tp:[],dpl:Array.isArray(x.dpl)?x.dpl:[],updatedAt:x.updatedAt||new Date().toISOString()};const prev=read(KEY,null);const a=JSON.stringify(prev||{}),b=JSON.stringify(clean);if(a===b)return prev;localStorage.setItem(KEY,JSON.stringify(clean));localStorage.setItem(LEGACY,JSON.stringify(clean));window.dispatchEvent(new CustomEvent('guruSdMasterChanged',{detail:clean}));return clean}
function sync(){const x=fromDom();if(!x)return null;return save(x)}
function get(){const x=read(KEY,null);if(x&&x.source==='GURU_SD_MASTER'&&x.babId)return x;return {source:'GURU_SD_MASTER',rombel:'',mapel:'',babId:'',babNo:0,material:'',semester:1,jp:0,tp:[],dpl:DPL,modelPembelajaran:'Problem Based Learning',fase:'A',tahunPelajaran:'2026/2027'};}
function set(patch){return save({...get(),...patch,updatedAt:new Date().toISOString()});}
window.GURU_SD_MASTER={KEY,get,set,sync,save,phase,dpl:defaultDpl};
function boot(){const r=$('pkR'),m=$('pkM'),b=$('pkB');if(!r||!m||!b){setTimeout(boot,300);return}[r,m,b].forEach(el=>el.addEventListener('change',sync,true));sync();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();