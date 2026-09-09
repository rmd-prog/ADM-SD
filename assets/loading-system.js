/* ADM-SD / GURU+ SD — Global Premium Loading & Feedback UI */
(function(){
'use strict';
if(window.__ADM_LOADING_SYSTEM)return;
window.__ADM_LOADING_SYSTEM=true;

const CSS=`
#admLoadingOverlay{position:fixed;inset:0;z-index:999999;display:none;align-items:center;justify-content:center;background:rgba(7,14,30,.58);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);padding:18px}
#admLoadingOverlay.show{display:flex;animation:admFadeIn .18s ease}
.adm-loading-card{position:relative;width:min(390px,94vw);background:linear-gradient(145deg,rgba(255,255,255,.985),rgba(247,250,255,.985));border-radius:26px;padding:25px 23px 22px;text-align:center;box-shadow:0 28px 90px rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.9);overflow:hidden}
.adm-loading-card:before{content:'';position:absolute;inset:0 0 auto;height:4px;background:var(--adm-accent,#2563eb);opacity:.9}
.adm-brand{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:15px;font:800 11px/1 system-ui,-apple-system,Segoe UI,sans-serif;letter-spacing:.08em;color:#64748b;text-transform:uppercase}
.adm-brand-badge{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;background:var(--adm-accent,#2563eb);color:#fff;box-shadow:0 6px 18px rgba(37,99,235,.25)}
.adm-brand-badge svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.adm-loading-icon{width:64px;height:64px;margin:0 auto 14px;border-radius:20px;display:grid;place-items:center;background:color-mix(in srgb,var(--adm-accent,#2563eb) 10%,white);color:var(--adm-accent,#2563eb);animation:admFloat 1.8s ease-in-out infinite}
.adm-loading-icon svg{width:32px;height:32px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.adm-loading-title{font:800 18px/1.3 system-ui,-apple-system,Segoe UI,sans-serif;color:#172033;margin:0 0 6px}
.adm-loading-text{font:500 13px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;color:#667085;margin:0;min-height:20px}
.adm-loading-progress{height:7px;margin:17px 2px 0;background:#e8edf5;border-radius:99px;overflow:hidden;display:none}
.adm-loading-progress.show{display:block}
.adm-loading-progress-bar{height:100%;width:8%;border-radius:99px;background:linear-gradient(90deg,var(--adm-accent,#2563eb),color-mix(in srgb,var(--adm-accent,#2563eb) 55%,white));transition:width .35s ease}
.adm-loading-percent{margin-top:7px;font:700 11px/1 system-ui,-apple-system,Segoe UI,sans-serif;color:#94a3b8;display:none}
.adm-loading-percent.show{display:block}
.adm-loading-dots:after{content:'...';display:inline-block;width:18px;text-align:left;animation:admDots 1.2s steps(4,end) infinite}
#admFeedbackHost{position:fixed;right:18px;bottom:18px;z-index:1000000;display:flex;flex-direction:column;gap:10px;pointer-events:none}
.adm-feedback{width:min(360px,calc(100vw - 36px));display:flex;gap:12px;align-items:flex-start;padding:14px 15px;border-radius:17px;background:rgba(255,255,255,.97);border:1px solid #e8edf5;box-shadow:0 18px 55px rgba(0,0,0,.18);pointer-events:auto;animation:admToastIn .28s cubic-bezier(.2,.8,.2,1)}
.adm-feedback.out{animation:admToastOut .22s ease forwards}
.adm-feedback-icon{flex:0 0 35px;width:35px;height:35px;border-radius:12px;display:grid;place-items:center;font-size:18px;background:var(--fb-bg,#eff6ff);color:var(--fb,#2563eb)}
.adm-feedback-icon svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.adm-feedback-title{font:800 13px/1.25 system-ui,-apple-system,Segoe UI,sans-serif;color:#172033;margin:1px 0 3px}
.adm-feedback-text{font:500 12px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;color:#667085;margin:0}
.adm-feedback-close{margin-left:auto;border:0;background:transparent;color:#98a2b3;font-size:18px;line-height:1;padding:0;cursor:pointer}
@keyframes admSpin{to{transform:rotate(360deg)}}
@keyframes admFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes admFadeIn{from{opacity:0}to{opacity:1}}
@keyframes admDots{0%{content:''}25%{content:'.'}50%{content:'..'}75%,100%{content:'...'}}
@keyframes admToastIn{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes admToastOut{to{opacity:0;transform:translateY(8px) scale(.97)}}
@media(max-width:480px){.adm-loading-card{border-radius:21px;padding:22px 18px 19px}.adm-loading-icon{width:57px;height:57px;border-radius:17px}.adm-loading-title{font-size:17px}#admFeedbackHost{right:12px;bottom:12px}}
`;
const style=document.createElement('style');style.id='admLoadingStyle';style.textContent=CSS;(document.head||document.documentElement).appendChild(style);

const ICONS={
 default:'<path d="M12 3v18M3 12h18"/>',
 login:'<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/>',
 generate:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/>',
 document:'<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h5M9 13h6M9 17h6"/>',
 save:'<path d="M5 3h12l3 3v15H4V4a1 1 0 0 1 1-1Z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/>',
 sync:'<path d="M20 7a8 8 0 0 0-13.5-2L4 7"/><path d="M4 3v4h4"/><path d="M4 17a8 8 0 0 0 13.5 2L20 17"/><path d="M20 21v-4h-4"/>',
 print:'<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/><path d="M18 12h.01"/>',
 cp:'<path d="M6 3h12v18H6z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
 lkpd:'<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>'
};
const PROCESSES={
 cp:{title:'Menyusun CP',text:'Capaian Pembelajaran sedang disiapkan',icon:'cp',accent:'#2563eb'},
 tp:{title:'Menyusun TP',text:'Tujuan Pembelajaran sedang dirancang',icon:'document',accent:'#7c3aed'},
 atp:{title:'Menyusun ATP',text:'Alur Tujuan Pembelajaran sedang dirangkai',icon:'document',accent:'#0891b2'},
 prota:{title:'Menyusun Prota',text:'Program Tahunan sedang dibuat',icon:'document',accent:'#16a34a'},
 prosem:{title:'Menyusun Prosem',text:'Program Semester sedang disusun',icon:'document',accent:'#0f766e'},
 rpm:{title:'Menyusun RPM',text:'Rencana Pembelajaran sedang dibuat',icon:'generate',accent:'#ea580c'},
 lkpd:{title:'Membuat LKPD',text:'Lembar Kerja Peserta Didik sedang dibuat',icon:'lkpd',accent:'#db2777'},
 sumatif:{title:'Menyiapkan Sumatif',text:'Instrumen penilaian sedang disusun',icon:'document',accent:'#dc2626'},
 formatif:{title:'Menyiapkan Formatif',text:'Instrumen penilaian sedang disusun',icon:'document',accent:'#ca8a04'}
};

let progressTimer=null;
function iconSvg(kind){return '<svg viewBox="0 0 24 24">'+(ICONS[kind]||ICONS.default)+'</svg>'}
function mount(){
 if(document.getElementById('admLoadingOverlay'))return;
 const el=document.createElement('div');el.id='admLoadingOverlay';el.setAttribute('aria-live','polite');el.innerHTML='<div class="adm-loading-card" id="admLoadingCard"><div class="adm-brand"><span class="adm-brand-badge">'+iconSvg('generate')+'</span>GURU+ SD</div><div class="adm-loading-icon" id="admLoadingIcon">'+iconSvg('default')+'</div><p class="adm-loading-title" id="admLoadingTitle">Sedang memproses</p><p class="adm-loading-text" id="admLoadingText">Mohon tunggu<span class="adm-loading-dots"></span></p><div class="adm-loading-progress" id="admLoadingProgress"><div class="adm-loading-progress-bar" id="admLoadingProgressBar"></div></div><div class="adm-loading-percent" id="admLoadingPercent">0%</div></div>';
 (document.body||document.documentElement).appendChild(el);
}
function setProgress(value){
 const n=Math.max(0,Math.min(100,Number(value)||0));
 const p=document.getElementById('admLoadingProgress'),bar=document.getElementById('admLoadingProgressBar'),pct=document.getElementById('admLoadingPercent');
 if(!p||!bar||!pct)return;
 p.classList.add('show');pct.classList.add('show');bar.style.width=n+'%';pct.textContent=Math.round(n)+'%';
}
function show(title,text,options){
 mount();options=options||{};
 const o=document.getElementById('admLoadingOverlay'),card=document.getElementById('admLoadingCard');
 const process=options.process?PROCESSES[String(options.process).toLowerCase()]:null;
 title=title||process?.title||'Sedang memproses';text=text||process?.text||'Mohon tunggu';
 card.style.setProperty('--adm-accent',options.accent||process?.accent||'#2563eb');
 document.getElementById('admLoadingTitle').textContent=title;
 const t=document.getElementById('admLoadingText');t.textContent=text;const span=document.createElement('span');span.className='adm-loading-dots';t.appendChild(span);
 document.getElementById('admLoadingIcon').innerHTML=iconSvg(options.icon||process?.icon||'default');
 if(options.progress!==undefined){setProgress(options.progress)}else{document.getElementById('admLoadingProgress')?.classList.remove('show');document.getElementById('admLoadingPercent')?.classList.remove('show')}
 clearInterval(progressTimer);if(options.autoProgress!==false){let n=Number(options.progress)||8;progressTimer=setInterval(()=>{n=Math.min(92,n+(94-n)*.035);setProgress(n)},420)}
 o.classList.add('show');
 if(options.sound)beep('loading');
}
function hide(){clearInterval(progressTimer);progressTimer=null;const o=document.getElementById('admLoadingOverlay');if(o)o.classList.remove('show')}
function process(name,options){const key=String(name||'').toLowerCase();const p=PROCESSES[key]||PROCESSES.generate;show(p.title,p.text,{...options,process:key})}

function beep(type){try{if(localStorage.getItem('admSound')!=='on')return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const c=new AC(),o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=type==='success'?720:type==='error'?180:480;g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(.035,c.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.12);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.13);setTimeout(()=>c.close().catch(()=>{}),250)}catch{}}
function feedback(type,title,text,duration){
 const host=document.getElementById('admFeedbackHost')||(()=>{const x=document.createElement('div');x.id='admFeedbackHost';document.body.appendChild(x);return x})();
 const cfg={success:['#16a34a','#ecfdf3','✓'],error:['#dc2626','#fef2f2','!'],warning:['#ca8a04','#fffbeb','!'],info:['#2563eb','#eff6ff','i']}[type]||['#2563eb','#eff6ff','i'];
 const el=document.createElement('div');el.className='adm-feedback';el.style.setProperty('--fb',cfg[0]);el.style.setProperty('--fb-bg',cfg[1]);el.innerHTML='<div class="adm-feedback-icon">'+cfg[2]+'</div><div><div class="adm-feedback-title"></div><p class="adm-feedback-text"></p></div><button class="adm-feedback-close" aria-label="Tutup">×</button>';
 el.querySelector('.adm-feedback-title').textContent=title||({success:'Berhasil',error:'Terjadi kesalahan',warning:'Perhatian',info:'Informasi'}[type]||'Informasi');el.querySelector('.adm-feedback-text').textContent=text||'';
 el.querySelector('.adm-feedback-close').onclick=()=>close();host.appendChild(el);beep(type);
 const timer=setTimeout(close,duration||3600);function close(){clearTimeout(timer);if(!el.isConnected)return;el.classList.add('out');setTimeout(()=>el.remove(),220)}
 return el;
}
function success(text,title){return feedback('success',title||'Berhasil',text)}
function error(text,title){return feedback('error',title||'Gagal',text,4800)}
function warning(text,title){return feedback('warning',title||'Perhatian',text,4400)}
function info(text,title){return feedback('info',title||'Informasi',text)}
window.ADMLoading={show,hide,mount,process,setProgress,success,error,warning,info,feedback,soundOn:()=>localStorage.setItem('admSound','on'),soundOff:()=>localStorage.setItem('admSound','off')};
window.ADMUI=window.ADMLoading;

// Preserve the existing automatic API loading behavior, but make it process-aware.
const nativeFetch=window.fetch;
if(typeof nativeFetch==='function'&&!window.__ADM_LOADING_FETCH){
 window.__ADM_LOADING_FETCH=true;
 window.fetch=async function(input,init){
   const url=String(typeof input==='string'?input:(input?.url||''));
   const isAppApi=/\/api\//i.test(url);
   if(!isAppApi)return nativeFetch.call(this,input,init);
   const silent=init&&init.__admSilentLoading;
   if(!silent)show(url.includes('/login')?'Memverifikasi login':'Sedang memproses','Data sedang diproses',{icon:url.includes('/login')?'login':'default'});
   try{return await nativeFetch.call(this,input,init)}finally{if(!silent)hide()}
 };
}

document.addEventListener('click',function(e){
 const b=e.target.closest?.('button,[role="button"],.btn');if(!b||b.disabled)return;
 const text=String(b.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();if(!text)return;
 if(/generate|buat|hasilkan/.test(text))show('Sedang membuat dokumen','Konten sedang disiapkan',{icon:'generate',accent:'#7c3aed'});
 else if(/export|pdf|cetak|print/.test(text))show('Menyiapkan dokumen','File sedang disiapkan',{icon:'print',accent:'#dc2626'});
 else if(/simpan|save/.test(text))show('Menyimpan data','Perubahan sedang disimpan',{icon:'save',accent:'#16a34a'});
 else if(/sinkron|refresh/.test(text))show('Sinkronisasi data','Mengambil data terbaru',{icon:'sync',accent:'#0891b2'});
 else return;
 setTimeout(hide,12000);
},{capture:true});
})();
