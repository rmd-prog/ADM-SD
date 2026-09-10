/* GURU+ SD — JP allocator SUPER v1
 * Local-only. Does not touch D1, Worker, students, or assessment bridge.
 * Allocates BAB JP across TP and actual meeting slots.
 */
(function(){'use strict';if(window.__PJP_SUPER_V1__)return;window.__PJP_SUPER_V1__=1;
const KEY='guru_sd_jp_allocation_super_v1';
function q(id){return document.getElementById(id)}
function esc(s){return String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function get(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
function binding(){return window.GURU_SD_BINDING&&window.GURU_SD_BINDING.getStored?window.GURU_SD_BINDING.getStored():null}
function tpWeights(n){if(n===1)return [1];if(n===2)return [0.5,0.5];if(n===3)return [0.34,0.33,0.33];return Array.from({length:n},(_,i)=>i===0?.25:i===n-1?.25:.5/(n-2))}
function allocate(){const x=binding();if(!x||!x.jp||!Array.isArray(x.tp)||!x.tp.length)return null;const total=Math.max(1,Number(x.jp));const ws=tpWeights(x.tp.length);let used=0;const tp=x.tp.map((text,i)=>{let jp=i===x.tp.length-1?total-used:Math.max(1,Math.round(total*ws[i]));if(i===x.tp.length-1)jp=Math.max(1,total-used);used+=jp;return{no:i+1,text,jp}});const data={rombel:x.rombel,mapel:x.mapel,bab:x.material,babNo:x.babNo,semester:x.semester,totalJP:total,tp,updatedAt:new Date().toISOString()};localStorage.setItem(KEY,JSON.stringify(data));return data}
function render(){const host=q('pkatV2')||q('perangkatSuperPanel');if(!host)return;let box=q('pkJpBox');if(!box){box=document.createElement('div');box.id='pkJpBox';box.style='margin-top:12px;padding:13px;border-radius:14px;background:#f8fafc;border:1px solid #dbe4f0';host.appendChild(box)}const d=allocate();if(!d){box.innerHTML='<b>⏱️ Pembagian JP</b><div style="margin-top:6px;color:#64748b;font-size:13px">Pilih Kelas → Mapel → BAB terlebih dahulu.</div>';return}box.innerHTML='<b>⏱️ Pembagian JP Otomatis</b><div style="margin:5px 0 9px;font-size:12px;color:#64748b">BAB '+esc(d.babNo)+' • '+esc(d.bab)+' • total '+d.totalJP+' JP</div>'+d.tp.map(t=>'<div style="padding:9px 10px;margin:5px 0;background:#fff;border:1px solid #e2e8f0;border-radius:10px"><b>TP '+t.no+'</b> — '+esc(t.jp)+' JP<br><span style="font-size:13px;color:#475569">'+esc(t.text)+'</span></div>').join('')+'<div style="margin-top:8px;padding:9px 10px;border-radius:10px;background:#eef6ff;color:#1e40af;font-size:12px">Total TP = '+d.tp.reduce((a,b)=>a+b.jp,0)+' JP. Alokasi ini menjadi dasar PROTA, PROMES, RPM, LKPD dan asesmen.</div>'}
function boot(){document.addEventListener('change',e=>{if(['pkR','pkM','pkB'].includes(e.target.id))setTimeout(render,30)},true);setInterval(()=>{if(q('pkB'))render()},1800);render()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();