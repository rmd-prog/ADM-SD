/* ADM-SD — INDEX MENU FINISHING V2
   Scope: index.html menus only. Additive UX for Penilaian, AI result, PDF/Print.
*/
(function(){
'use strict';
if(window.__ADM_INDEX_FINISHING_V2__)return;
window.__ADM_INDEX_FINISHING_V2__=true;
const toast=(type,title,text)=>{if(window.ADMUI&&typeof window.ADMUI[type]==='function')return window.ADMUI[type](text,title);};
const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
function style(){if(q('#adm-index-finishing-v2-style'))return;const s=document.createElement('style');s.id='adm-index-finishing-v2-style';s.textContent=`
.adm-assess-ready{display:flex;gap:9px;align-items:center;margin:10px 0;padding:11px 13px;border:1px solid #fde68a;background:#fffbeb;border-radius:13px;color:#78350f;font-size:12px}.adm-assess-ready b{color:#92400e}.adm-assess-ready span:first-child{font-size:18px}
.adm-print-tools{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0}.adm-print-tools button{border:1px solid #cbd5e1;background:#fff;border-radius:10px;padding:8px 11px;font-weight:800;font-size:12px;cursor:pointer}.adm-print-tools button.primary{background:#2563eb;color:#fff;border-color:#2563eb}
.ai-paper .ai-universal-visual,.ai-paper svg{max-width:100%;height:auto}.ai-paper img{max-width:100%;height:auto;display:block;margin-left:auto;margin-right:auto}.ai-paper table{width:100%;border-collapse:collapse}.ai-paper th,.ai-paper td{overflow-wrap:anywhere}
@media print{body{background:#fff!important}.top,.side,.toolbar,.adm-print-tools,.adm-ai-finish-bar,.adm-ai-restore,.adm-doc-hint,.adm-dash-ready,#admFeedbackHost,#admLoadingOverlay{display:none!important}.main{padding:0!important}.page:not(.active){display:none!important}.ai-paper{margin:0!important;box-shadow:none!important;border:0!important;max-width:none!important}.ai-paper::before{display:none!important}}
@media(max-width:600px){.adm-assess-ready{align-items:flex-start}.adm-print-tools button{flex:1;min-width:120px}}
`;document.head.appendChild(s)}
function assess(){
 const candidates=qa('.page').filter(p=>/penilaian|asesmen|formatif|sumatif/i.test((p.id||'')+' '+(p.textContent||'').slice(0,500)));
 candidates.forEach(page=>{if(page.dataset.assessFinish==='1')return;page.dataset.assessFinish='1';const hero=q('.doc-hero,.panel',page);if(!hero)return;const box=document.createElement('div');box.className='adm-assess-ready';box.innerHTML='<span>📝</span><div><b>Penilaian siap disusun</b><br><span>Pilih format penilaian, lengkapi indikator/kriteria, lalu tinjau sebelum dicetak.</span></div>';hero.appendChild(box)})
}
function printTools(){
 const roots=qa('.ai-paper,.doc-preview,.doc-editor').filter(x=>x.offsetParent!==null);roots.forEach(root=>{const host=root.closest('.panel')||root.parentElement;if(!host||host.dataset.printFinish==='1')return;host.dataset.printFinish='1';const bar=document.createElement('div');bar.className='adm-print-tools';bar.innerHTML='<button type="button" class="primary">🖨️ Cetak</button><button type="button">📄 Simpan PDF</button>';bar.querySelector('button:first-child').onclick=()=>{window.ADMLoading?.process('document',{autoProgress:false,progress:70});setTimeout(()=>{window.ADMLoading?.hide();window.print()},250)};bar.querySelector('button:nth-child(2)').onclick=()=>{window.ADMLoading?.process('document',{autoProgress:false,progress:70});setTimeout(()=>{window.ADMLoading?.hide();window.print()},250);toast('info','Simpan PDF','Di dialog cetak, pilih “Simpan sebagai PDF”.')};host.insertBefore(bar,root)});
}
function cleanAI(){const root=q('#aiResult');if(!root)return;qa('pre',root).forEach(pre=>{if(pre.closest('.ai-paper'))pre.style.fontFamily='Arial,sans-serif'});qa('table',root).forEach(t=>t.classList.add('ai-output-table'));}
function boot(){style();assess();printTools();cleanAI()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
[700,1600,3000,6000].forEach(ms=>setTimeout(boot,ms));
})();