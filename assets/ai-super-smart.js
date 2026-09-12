/* SIAP GURU — AI SUPER SMART V2
 * Adapter only. The old private 1-6 catalog is removed.
 * Canonical source is the inline BOOK_CATALOG + GURU_SD_MASTER.
 * This layer only keeps AI SUPER controls synchronized and chooses DPL defaults.
 * Local-only. No D1, Worker or AI calls.
 */
(function(){'use strict';
if(window.__AI_SUPER_SMART_V2__)return;window.__AI_SUPER_SMART_V2__=1;
const $=id=>document.getElementById(id);const G={IA:1,IB:1,IIA:2,IIB:2,IIIA:3,IIIB:3,IVA:4,IVB:4,V:5,VI:6};
const DPL=['Keimanan dan ketakwaan kepada Tuhan Yang Maha Esa','Kewargaan','Penalaran kritis','Kreativitas','Kolaborasi','Kemandirian','Kesehatan','Komunikasi'];
function master(){return window.GURU_SD_MASTER?.get?.()||null}
function books(){try{return typeof BOOK_CATALOG!=='undefined'?BOOK_CATALOG:null}catch(e){return null}}
function chapters(r,m){const b=books()?.[m]?.[G[r]||1];return Array.isArray(b?.chapters)?b.chapters:[]}
function defaultDpl(m){if(m==='PJOK')return ['Kesehatan','Kemandirian','Kolaborasi','Komunikasi'];if(/^Seni /.test(m))return ['Kreativitas','Kolaborasi','Komunikasi','Kemandirian'];if(m==='Matematika')return ['Penalaran kritis','Kreativitas','Kemandirian','Komunikasi'];if(m==='Pendidikan Pancasila')return ['Kewargaan','Kolaborasi','Komunikasi','Kemandirian'];if(m==='Pendidikan Agama dan Budi Pekerti')return ['Keimanan dan ketakwaan kepada Tuhan Yang Maha Esa','Kemandirian','Kesehatan','Komunikasi'];return ['Penalaran kritis','Kreativitas','Kolaborasi','Komunikasi']}
function sync(){const x=master();if(!x?.babId)return;const r=$('aiSuperRombel'),m=$('aiSuperMapel'),mat=$('aiSuperMaterial'),jp=$('aiSuperJP');if(r)r.value=x.rombel;if(m)m.value=x.mapel;if(jp)jp.value=String(x.jp||2);if(mat){const list=chapters(x.rombel,x.mapel);mat.innerHTML='<option value="">Pilih BAB/Materi...</option>'+list.map(v=>`<option>${v}</option>`).join('');if(list.includes(x.material))mat.value=x.material}const boxes=[...document.querySelectorAll('#aiSuperDpl input[type=checkbox]')];if(boxes.length){const d=Array.isArray(x.dpl)&&x.dpl.length?x.dpl:defaultDpl(x.mapel);boxes.forEach(e=>e.checked=d.includes(e.value))}}
function bind(){const r=$('aiSuperRombel'),m=$('aiSuperMapel'),mat=$('aiSuperMaterial');if(!r||!m||!mat)return false;if(r.dataset.masterSmartBound)return true;r.dataset.masterSmartBound='1';r.addEventListener('change',()=>setTimeout(()=>window.GURU_SD_MASTER?.sync?.(),0));m.addEventListener('change',()=>setTimeout(()=>window.GURU_SD_MASTER?.sync?.(),0));mat.addEventListener('change',()=>setTimeout(()=>window.GURU_SD_MASTER?.sync?.(),0));sync();return true}
function boot(){if(bind())return;setTimeout(boot,250)}
window.addEventListener('guruSdMasterChanged',sync);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();