/* GURU+ SD — AUDIT PERANGKAT SUPER v2
 * Read-only health check. Audits canonical GURU_SD_MASTER + AUTO_CHAIN,
 * not obsolete legacy storage keys. Never touches D1, Worker, login or assessment bridge.
 */
(function(){'use strict';
if(window.__AUDIT_PERANGKAT_SUPER_V2__)return;window.__AUDIT_PERANGKAT_SUPER_V2__=1;
const $=id=>document.getElementById(id);
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}};
const master=()=>window.GURU_SD_MASTER?.get?.()||null;
const chain=()=>window.GURU_SD_AUTO_CHAIN?.get?.()||null;
function selected(){const x=master()||{};return {r:$('pkR')?.value||x.rombel||'',m:$('pkM')?.value||x.mapel||'',b:$('pkB')?.value||x.babNo||''}}
function catalogBab(s){try{const n={IA:1,IB:1,IIA:2,IIB:2,IIIA:3,IIIB:3,IVA:4,IVB:4,V:5,VI:6}[s.r];const a=window.BOOK_CATALOG?.[s.m]?.[n]?.chapters;return Array.isArray(a)?a:[]}catch(e){return []}}
function docOk(c,t,x){const d=c?.docs?.[t];if(!d||!x)return false;const s=String(d);return s.includes(String(x.material))&&(s.includes('BAB '+String(x.babNo))||s.includes(String(x.babId)))}
function check(){
 const x=master(),c=chain(),s=selected(),arr=catalogBab(s),hasSel=!!(s.r&&s.m&&s.b),babNo=Number(s.b||0);
 const grade={IA:1,IB:1,IIA:2,IIB:2,IIIA:3,IIIB:3,IVA:4,IVB:4,V:5,VI:6}[s.r];
 const cpReady=hasSel&&!!(window.ADM_CURRICULUM?.[s.m]?.[grade]||window.BOOK_CATALOG?.[s.m]?.[grade]);
 const babReady=hasSel&&(arr.length?!!arr[babNo-1]:!!x?.material);
 const schedule=read('guru_sd_kurikulum_super_schedule_v2');const rows=Array.isArray(schedule?.rows)?schedule.rows:Array.isArray(schedule?.schedule)?schedule.schedule:[];
 const hasSchedule=rows.some(z=>(z.rombel||z.class||z.kelas)==s.r&&(z.mapel||z.subject)==s.m);
 const tp=Array.isArray(x?.tp)&&x.tp.length>0;
 return [
  ['CP','CP tersedia/adaptif',cpReady],
  ['ATP','ATP terhubung',docOk(c,'ATP',x)],
  ['TP','TP terhubung',tp||docOk(c,'TP',x)],
  ['Materi/BAB','BAB tersedia',babReady],
  ['JP','Pembagian JP',!!(x&&Number(x.jp)>0)],
  ['Jadwal','Jadwal pelajaran tersimpan',hasSchedule],
  ['PROTA','PROTA tersimpan',docOk(c,'PROTA',x)],
  ['PROMES','PROMES tersimpan',docOk(c,'PROMES',x)],
  ['RPM','RPM v2 tersimpan',docOk(c,'RPM',x)],
  ['LKPD','LKPD/Asesmen v2 tersimpan',docOk(c,'LKPD',x)],
  ['Asesmen','Asesmen per BAB tersedia',docOk(c,'ASESMEN',x)]
 ];
}
function render(){
 const z=check(),ok=z.filter(x=>x[2]).length,total=z.length,s=selected(),x=master();
 let html='<section id="auditSuperBox" style="margin:18px 0;padding:18px;border:1px solid #dbe4f0;border-radius:18px;background:#fff"><h2>🩺 Audit Perangkat Pembelajaran SUPER</h2><p><b>'+ok+'/'+total+'</b> komponen terdeteksi. Audit ini hanya membaca status lokal.</p>';
 if(s.r&&s.m&&s.b)html+='<div style="margin:8px 0 12px;padding:10px 12px;border-radius:11px;background:#f8fafc"><b>Konteks:</b> '+s.r+' • '+s.m+' • BAB '+s.b+(x?.material?' — '+x.material:'')+'</div>';
 html+='<div style="display:grid;gap:7px">';z.forEach(x=>{html+='<div style="display:flex;justify-content:space-between;gap:10px;padding:10px 12px;border:1px solid #e2e8f0;border-radius:11px"><span><b>'+x[0]+'</b> — '+x[1]+'</span><strong style="color:'+(x[2]?'#15803d':'#b45309')+'">'+(x[2]?'✓ SIAP':'⚠ BELUM')+'</strong></div>'});html+='</div><p style="margin-top:12px;color:#64748b;font-size:13px">Audit membaca Master canonical dan rantai dokumen aktif. Pilih Kelas → Mapel → BAB lalu klik <b>Terapkan Master & Bangun Semua</b>.</p><button id="auditRefresh" type="button">🔄 Audit Ulang</button></section>';
 const old=$('auditSuperBox');if(old)old.outerHTML=html;else ($('perangkatSuperPanel')||document.querySelector('main')||document.body).appendChild(Object.assign(document.createElement('div'),{innerHTML:html}));
 const b=$('auditRefresh');if(b)b.onclick=render;
}
function mount(){setTimeout(render,700);setInterval(render,1800)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();