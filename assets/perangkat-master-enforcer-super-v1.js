/* GURU+ SD — MASTER ENFORCER + CHAIN GUARD
 * Canonical source: GURU_SD_MASTER.
 * Legacy state is a derived mirror only.
 * Blocks stale BAB/unit generators from overriding the active master state.
 * No D1/Worker access.
 */
(function(){'use strict';
if(window.__GURU_SD_MASTER_ENFORCER_V2__)return;window.__GURU_SD_MASTER_ENFORCER_V2__=1;
const LEGACY='guru_sd_perangkat_super_v1';
const read=()=>{try{return JSON.parse(localStorage.getItem('guru_sd_pembelajaran_master_v1')||'null')}catch(e){return null}};
function master(){try{return window.GURU_SD_MASTER?.get?.()||read()}catch(e){return read()}}
function mirror(x){
  if(!x||!x.rombel||!x.mapel||!x.babId)return;
  try{localStorage.setItem(LEGACY,JSON.stringify({
    source:'GURU_SD_MASTER',rombel:x.rombel,mapel:x.mapel,babId:x.babId,babNo:x.babNo,
    material:x.material,jp:Number(x.jp)||0,tp:x.tp||[],tpCount:(x.tp||[]).length,
    semester:x.semester,dpl:x.dpl||[],modelPembelajaran:x.modelPembelajaran||'Problem Based Learning',
    fase:x.fase||'',tahunPelajaran:x.tahunPelajaran||'2026/2027',updatedAt:x.updatedAt||new Date().toISOString()
  }))}catch(e){}
}
function syncDom(x){
  if(!x)return;
  const r=document.getElementById('pkR'),m=document.getElementById('pkM'),b=document.getElementById('pkB');
  if(r&&x.rombel&&r.value!==x.rombel)r.value=x.rombel;
  if(m&&x.mapel&&m.value!==x.mapel)m.value=x.mapel;
  if(b&&x.material){
    const opts=[...b.options];
    let i=opts.findIndex(o=>String(o.textContent||'').toLowerCase().includes(String(x.material).toLowerCase()));
    if(i<0&&x.babNo) i=opts.findIndex(o=>{const t=String(o.textContent||'');return new RegExp('BAB\\s*'+Number(x.babNo)+'\\b','i').test(t)});
    if(i>=0)b.selectedIndex=i;
  }
}
function guardCatalog(x){
  if(!x)return;
  /* These wrappers make every legacy/inline lookup resolve to the master BAB. */
  if(typeof window.babList==='function')window.babList=function(){return [x.material];};
  if(typeof window.unitTitles==='function')window.unitTitles=function(){return [x.material];};
}
function patchDocPayload(){
  if(typeof window.docPayload!=='function')return;
  const original=window.docPayload;
  if(original.__MASTER_GUARDED__)return;
  function guarded(type){
    const x=master();
    syncDom(x);guardCatalog(x);
    const out=original.apply(this,arguments)||{};
    if(x){out.rombel=x.rombel;out.mapel=x.mapel;out.material=x.material;out.babId=x.babId;out.babNo=x.babNo;out.semester=x.semester;out.jp=x.jp;out.fase=x.fase;out.dpl=x.dpl;out.modelPembelajaran=x.modelPembelajaran;out.tahunPelajaran=x.tahunPelajaran;out.tp=x.tp;}
    return out;
  }
  guarded.__MASTER_GUARDED__=true;window.docPayload=guarded;
}
function patchGenerateDoc(){
  if(typeof window.generateDoc!=='function')return;
  const original=window.generateDoc;
  if(original.__MASTER_GUARDED__)return;
  async function guarded(type){
    const x=master();
    if(!x||!x.rombel||!x.mapel||!x.babId){throw new Error('MASTER_STATE_NOT_READY');}
    syncDom(x);guardCatalog(x);
    const rpm=document.getElementById('rpmBab');
    if(rpm){rpm.innerHTML='<option value="0">BAB '+Number(x.babNo||1)+' — '+String(x.material||'').replace(/[&<>"']/g,'')+'</option>';rpm.value='0';}
    window.dispatchEvent(new CustomEvent('guruSdMasterBeforeGenerate',{detail:x}));
    return original.apply(this,arguments);
  }
  guarded.__MASTER_GUARDED__=true;window.generateDoc=guarded;
}
function audit(){
  const x=master();if(!x||!x.babId)return;
  mirror(x);syncDom(x);guardCatalog(x);
  patchDocPayload();patchGenerateDoc();
  window.__GURU_SD_CHAIN_AUDIT__={source:'GURU_SD_MASTER',babId:x.babId,material:x.material,rombel:x.rombel,mapel:x.mapel,semester:x.semester,jp:x.jp,dpl:x.dpl,modelPembelajaran:x.modelPembelajaran,checkedAt:new Date().toISOString()};
}
function boot(){
  audit();
  window.addEventListener('guruSdMasterChanged',e=>{mirror(e.detail);audit()});
  ['pkR','pkM','pkB','pkI','rpmBab'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('change',()=>setTimeout(audit,0))});
  setInterval(audit,1200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded,boot');else boot();
})();
