/* GURU+ SD — GLOBAL INTEGRITY SUPER V7
 * Canonical runtime bootstrap: Master -> Catalog/Curriculum -> Engine -> Auto Chain -> Bridge -> Audit.
 * Legacy storage remains compatibility-only. No D1/Worker/student/login changes.
 * V7 keeps only Dashboard, Penilaian and Data Siswa in the live sidebar.
 */
(function(){'use strict';
if(window.__GURU_SD_GLOBAL_INTEGRITY_V7__)return;window.__GURU_SD_GLOBAL_INTEGRITY_V7__=1;
const KEY='guru_sd_pembelajaran_master_v1';
const LEGACY=['guru_sd_perangkat_super_v1','guru_sd_cp_atp_tp_super_v1','guru_sd_rpm_super_v2','guru_sd_prota_promes_super_v2','guru_sd_lkpd_asesmen_super_v1','guru_sd_lkpd_asesmen_super_v2','guru_sd_jp_allocation_super_v1','guru_plus_sd_ai_super_v1'];
const $=id=>document.getElementById(id);
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}};
function master(){return window.GURU_SD_MASTER?.get?.()||read()}
function legacyValue(key){const x=master();if(!x?.babId)return null;const base={source:'GURU_SD_MASTER',rombel:x.rombel,mapel:x.mapel,babId:x.babId,babNo:x.babNo,material:x.material,jp:Number(x.jp)||0,semester:Number(x.semester)||1,tp:Array.isArray(x.tp)?x.tp:[],dpl:Array.isArray(x.dpl)?x.dpl:[],modelPembelajaran:x.modelPembelajaran||'',fase:x.fase||'',tahunPelajaran:x.tahunPelajaran||'2026/2027'};if(key==='guru_sd_cp_atp_tp_super_v1')return {...base};if(key==='guru_sd_jp_allocation_super_v1')return {...base,bab:base.material,totalJP:base.jp};if(key.indexOf('lkpd_asesmen')>=0)return {source:base.source,selected:base,meetings:[],kind:'BOTH'};return base}
function patchStorage(){if(window.__GURU_SD_GLOBAL_STORAGE_PATCH_V2__)return;const p=Storage.prototype.getItem;Storage.prototype.getItem=function(k){if(LEGACY.includes(k)){const v=legacyValue(k);if(v)return JSON.stringify(v)}return p.call(this,k)};window.__GURU_SD_GLOBAL_STORAGE_PATCH_V2__=1}
function syncAi(x){if(!x)return;[['aiSuperRombel',x.rombel],['aiSuperMapel',x.mapel],['aiSuperJP',x.jp]].forEach(([i,v])=>{const e=$(i);if(e&&v!=null)e.value=String(v)});const mat=$('aiSuperMaterial');if(mat){const i=[...mat.options].findIndex(o=>String(o.textContent||'').trim().toLowerCase()===String(x.material||'').trim().toLowerCase());if(i>=0)mat.selectedIndex=i}const model=$('aiSuperModel');if(model&&x.modelPembelajaran)model.value=x.modelPembelajaran}
function syncLegacyAi(x){if(!x)return;const r=$('aiKelas'),m=$('aiMapel'),b=$('aiBabSelector');if(r)r.value=x.rombel;if(m)m.value=x.mapel;if(b){const i=[...b.options].findIndex(o=>String(o.textContent||'').trim().toLowerCase()===String(x.material||'').trim().toLowerCase());if(i>=0)b.selectedIndex=i}}
function audit(){const x=master();if(!x?.babId)return {ok:false,reason:'MASTER_EMPTY'};syncAi(x);syncLegacyAi(x);return {ok:true,source:'GURU_SD_MASTER',context:x.babId,material:x.material,rombel:x.rombel,mapel:x.mapel,jp:x.jp,tpCount:Array.isArray(x.tp)?x.tp.length:0,dplCount:Array.isArray(x.dpl)?x.dpl.length:0,model:x.modelPembelajaran||''}}
function cleanMainMenu(){
  const side=document.getElementById('sidebar');if(!side)return;
  const norm=s=>String(s||'').replace(/\s+/g,' ').trim().toLowerCase();
  const keepGroup=t=>t.includes('penilaian')||t.includes('data siswa');
  side.querySelectorAll('.menu-group').forEach(g=>{
    const h=g.querySelector('.navgroup');
    if(!h)return;
    if(!keepGroup(norm(h.textContent)))g.remove();
  });
  side.querySelectorAll('.navbtn').forEach(b=>{
    const page=String(b.getAttribute('data-page')||'');
    const t=norm(b.textContent);
    const direct=page==='dashboard'||page==='scores'||page==='students';
    const allowed=direct||t==='dashboard'||t.includes('daftar siswa');
    if(t.includes('import siswa'))b.remove();
    else if(!b.closest('.menu-group')&&!allowed)b.remove();
  });
  const title=side.querySelector('.side-title');if(title)title.textContent='MENU UTAMA';
}
function guardGenerate(){if(window.__GURU_SD_AUTO_GENERATE_GUARD__)return;window.__GURU_SD_AUTO_GENERATE_GUARD__=1;document.addEventListener('click',e=>{const b=e.target?.closest?.('#aiSuperGenerate');if(!b)return;setTimeout(()=>{const x=master();if(x?.babId)window.GURU_SD_AUTO_CHAIN?.run?.()},0)},true)}
const wanted=[['curriculum','curriculum-complete-super-v1.js'],['ui','perangkat-super-ui-v1.js'],['audit','perangkat-audit-super-v1.js']];
function load(src,key){return new Promise(resolve=>{if([...document.scripts].some(s=>String(s.src).includes(src))){resolve();return}const s=document.createElement('script');s.src='assets/'+src+'?v=20260912-super7';s.setAttribute('data-super-'+key,'1');s.async=false;s.onload=resolve;s.onerror=resolve;(document.head||document.body).appendChild(s)})}
async function boot(){
  for(const [key,src] of wanted)await load(src,key);
  try{window.GURU_SD_MASTER?.sync?.()}catch(e){}
  try{window.GURU_SD_AUTO_CHAIN?.build?.()}catch(e){}
  try{window.GURU_SD_AUTO_CHAIN?.render?.()}catch(e){}
  try{window.GURU_SD_DOCUMENT_AUTO_BRIDGE?.refresh?.()}catch(e){}
  audit();
  cleanMainMenu();
  setTimeout(cleanMainMenu,300);
  setTimeout(cleanMainMenu,1200);
  window.dispatchEvent(new CustomEvent('guruSdSuperReady'));
}
patchStorage();guardGenerate();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,100));else setTimeout(boot,100);
window.GURU_SD_GLOBAL_INTEGRITY={audit,master,cleanMainMenu,legacyKeys:LEGACY.slice(),canonical:true};
})();