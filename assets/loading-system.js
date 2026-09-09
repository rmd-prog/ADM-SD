/* ADM-SD — Global Popup Loading System */
(function(){
'use strict';
if(window.__ADM_LOADING_SYSTEM)return;
window.__ADM_LOADING_SYSTEM=true;

const CSS=`
#admLoadingOverlay{position:fixed;inset:0;z-index:999999;display:none;align-items:center;justify-content:center;background:rgba(8,15,30,.48);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);padding:20px}
#admLoadingOverlay.show{display:flex;animation:admFadeIn .18s ease}
.adm-loading-card{width:min(360px,92vw);background:rgba(255,255,255,.97);border-radius:22px;padding:25px 22px 21px;text-align:center;box-shadow:0 20px 70px rgba(0,0,0,.22);border:1px solid rgba(255,255,255,.8)}
.adm-loading-ring{width:54px;height:54px;margin:0 auto 15px;border:4px solid rgba(37,99,235,.15);border-top-color:#2563eb;border-right-color:#60a5fa;border-radius:50%;animation:admSpin .8s linear infinite}
.adm-loading-title{font:700 17px/1.3 system-ui,-apple-system,Segoe UI,sans-serif;color:#172033;margin:0 0 6px}
.adm-loading-text{font:500 13px/1.45 system-ui,-apple-system,Segoe UI,sans-serif;color:#667085;margin:0}
.adm-loading-dots:after{content:'...';display:inline-block;width:16px;text-align:left;animation:admDots 1.2s steps(4,end) infinite}
@keyframes admSpin{to{transform:rotate(360deg)}}
@keyframes admFadeIn{from{opacity:0}to{opacity:1}}
@keyframes admDots{0%{content:''}25%{content:'.'}50%{content:'..'}75%,100%{content:'...'}}
@media(max-width:480px){.adm-loading-card{border-radius:18px;padding:22px 18px}.adm-loading-ring{width:48px;height:48px}}
`;
const style=document.createElement('style');style.id='admLoadingStyle';style.textContent=CSS;(document.head||document.documentElement).appendChild(style);

function mount(){
 if(document.getElementById('admLoadingOverlay'))return;
 const el=document.createElement('div');el.id='admLoadingOverlay';el.setAttribute('aria-live','polite');el.innerHTML='<div class="adm-loading-card"><div class="adm-loading-ring"></div><p class="adm-loading-title" id="admLoadingTitle">Sedang memproses</p><p class="adm-loading-text" id="admLoadingText">Mohon tunggu<span class="adm-loading-dots"></span></p></div>';
 (document.body||document.documentElement).appendChild(el);
}
function show(title,text){
 mount();
 const o=document.getElementById('admLoadingOverlay');
 document.getElementById('admLoadingTitle').textContent=title||'Sedang memproses';
 document.getElementById('admLoadingText').textContent=text||'Mohon tunggu';
 const span=document.createElement('span');span.className='adm-loading-dots';span.textContent='';document.getElementById('admLoadingText').appendChild(span);
 o.classList.add('show');
}
function hide(){const o=document.getElementById('admLoadingOverlay');if(o)o.classList.remove('show')}
window.ADMLoading={show,hide,mount};

// API requests: automatically display a popup while network work is running.
const nativeFetch=window.fetch;
if(typeof nativeFetch==='function'&&!window.__ADM_LOADING_FETCH){
 window.__ADM_LOADING_FETCH=true;
 window.fetch=async function(input,init){
   const url=String(typeof input==='string'?input:(input?.url||''));
   const isAppApi=/\/api\//i.test(url);
   if(!isAppApi)return nativeFetch.call(this,input,init);
   const silent=init&&init.__admSilentLoading;
   if(!silent)show(url.includes('/login')?'Memverifikasi login':'Sedang memproses','Data sedang diproses');
   try{return await nativeFetch.call(this,input,init)}
   finally{if(!silent)hide()}
 };
}

// Helpful feedback for common action buttons that may not call an API.
document.addEventListener('click',function(e){
 const b=e.target.closest?.('button,[role="button"],.btn');
 if(!b||b.disabled)return;
 const text=String(b.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
 if(!text)return;
 let title='Sedang memproses',msg='Mohon tunggu';
 if(/generate|buat|hasilkan/.test(text)){title='Sedang membuat dokumen';msg='Konten sedang disiapkan'}
 else if(/export|pdf|cetak|print/.test(text)){title='Menyiapkan dokumen';msg='File sedang disiapkan'}
 else if(/simpan|save/.test(text)){title='Menyimpan data';msg='Perubahan sedang disimpan'}
 else if(/sinkron|refresh/.test(text)){title='Sinkronisasi data';msg='Mengambil data terbaru'}
 else return;
 show(title,msg);
 setTimeout(hide,9000);
},{capture:true});
})();
