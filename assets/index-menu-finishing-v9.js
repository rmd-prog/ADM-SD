/* ADM-SD — INDEX MENU FINISHING V9: Perangkat Pembelajaran polish */
(function(){
'use strict';
if(window.__ADM_INDEX_FINISHING_V9__)return;
window.__ADM_INDEX_FINISHING_V9__=true;
const $=id=>document.getElementById(id);
const norm=v=>String(v??'').toLowerCase().replace(/\s+/g,' ').trim();
const TYPES={
 cp:{icon:'🎯',title:'CP — Capaian Pembelajaran',hint:'Bangun rumusan CP sebagai rancangan kerja guru yang sesuai fase dan mapel.'},
 tp:{icon:'🧭',title:'TP — Tujuan Pembelajaran',hint:'Susun tujuan yang operasional, terukur, dan mudah diturunkan menjadi aktivitas.'},
 atp:{icon:'🛤️',title:'ATP — Alur Tujuan Pembelajaran',hint:'Urutkan tujuan dari prasyarat, pemahaman, aplikasi, komunikasi, sampai refleksi.'},
 prota:{icon:'📅',title:'Prota — Program Tahunan',hint:'Atur unit/materi, semester, alokasi JP, asesmen, dan catatan dalam tabel.'},
 prosem:{icon:'🗓️',title:'Prosem — Program Semester',hint:'Susun pembelajaran per minggu/pertemuan secara realistis dan mudah disesuaikan.'},
 rpm:{icon:'📘',title:'RPM — Rencana Pembelajaran Mendalam',hint:'Rancang memahami–mengaplikasi–merefleksi, diferensiasi, asesmen, dan tindak lanjut.'},
 modul_ajar:{icon:'📚',title:'Modul Ajar',hint:'Buat modul praktis dengan tujuan, langkah, asesmen, diferensiasi, dan refleksi.'}
};
function key(){const s=$('aiType');const t=norm((s?.value||'')+' '+(s?.options?.[s.selectedIndex]?.textContent||''));
 if(/modul.?ajar/.test(t))return'modul_ajar'; if(/capaian pembelajaran|\bcp\b/.test(t))return'cp';if(/tujuan pembelajaran|\btp\b/.test(t))return'tp';if(/alur tujuan|\batp\b/.test(t))return'atp';if(/program tahunan|\bprota\b/.test(t))return'prota';if(/program semester|\bprosem\b/.test(t))return'prosem';if(/rencana pembelajaran|\brpm\b/.test(t))return'rpm';return''}
function css(){if($('adm-v9-style'))return;const s=document.createElement('style');s.id='adm-v9-style';s.textContent=`
#aiGenerate .adm-v9-box{margin:9px 0 12px;padding:12px 14px;border:1px solid #dbe4ef;border-radius:14px;background:#fff}
#aiGenerate .adm-v9-head{display:flex;align-items:center;gap:9px}.adm-v9-icon{font-size:20px}.adm-v9-title{font-size:13px;font-weight:900}.adm-v9-hint{margin-top:5px;color:#64748b;font-size:11px;line-height:1.45}
#aiGenerate .adm-v9-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}.adm-v9-btn{border:1px solid #cbd5e1;background:#f8fafc;border-radius:9px;padding:7px 10px;font-size:11px;font-weight:800;cursor:pointer}.adm-v9-btn:hover{background:#eff6ff;border-color:#93c5fd}
@media(max-width:700px){#aiGenerate .adm-v9-box{padding:11px 12px}.adm-v9-btn{flex:1;min-width:105px}}
`;document.head.appendChild(s)}
function prompt(){return $('aiContext')}
function box(){let b=$('adm-v9-box');const k=key();if(!k){if(b)b.style.display='none';return}if(!b){b=document.createElement('div');b.id='adm-v9-box';b.className='adm-v9-box';const root=$('aiGenerate');if(!root)return;const dc=root.querySelector('.doc-controls');(dc?.parentNode||root).insertBefore(b,dc?.nextSibling||root.firstChild)}b.style.display='block';const x=TYPES[k];b.innerHTML='<div class="adm-v9-head"><span class="adm-v9-icon">'+x.icon+'</span><span class="adm-v9-title">'+x.title+'</span></div><div class="adm-v9-hint">'+x.hint+' Pilih gaya keluaran tanpa mengubah data inti yang sudah diisi.</div><div class="adm-v9-actions"><button type="button" class="adm-v9-btn" data-style="lengkap">📚 Lengkap</button><button type="button" class="adm-v9-btn" data-style="ringkas">⚡ Ringkas</button><button type="button" class="adm-v9-btn" data-style="cetak">🖨️ Siap cetak</button></div>';
b.querySelectorAll('.adm-v9-btn').forEach(btn=>btn.onclick=()=>apply(btn.dataset.style,k));}
function apply(style,k){const c=prompt();if(!c)return;let base=c.value.replace(/\[ADM-PERANGKAT[^\]]*\]\s*/ig,'').trim();const rules={lengkap:'Gunakan struktur lengkap dan substantif; pastikan hubungan tujuan, aktivitas, asesmen, dan tindak lanjut konsisten.',ringkas:'Gunakan struktur ringkas, fokus pada bagian wajib, tanpa uraian berulang.',cetak:'Prioritaskan tabel/format rapi, konsisten, hemat ruang, dan mudah dicetak pada A4/F4.'};c.value=(base||'Buat dokumen sesuai jenis yang dipilih.')+'\n\n[ADM-PERANGKAT '+k.toUpperCase()+' '+style.toUpperCase()+']\n'+rules[style]+' Jangan menampilkan instruksi internal, sumber mentah, atau placeholder kosong.';c.dispatchEvent(new Event('input',{bubbles:true}));try{window.ADMUI?.toast?.('Gaya '+style+' diterapkan','success')}catch{}}
function bind(){const s=$('aiType');if(s&&!s.dataset.v9){s.dataset.v9='1';s.addEventListener('change',box)}}
function boot(){css();bind();box()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();[600,1400,2800,5000].forEach(ms=>setTimeout(boot,ms));
const obs=new MutationObserver(()=>{bind();box()});obs.observe(document.body,{childList:true,subtree:true});
})();
