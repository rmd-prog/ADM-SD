/* SIAP GURU — assessment automatic sync layer
   Keeps Input, Rekap and Bobot connected without touching D1 or src/index.js.
*/
(function(){
'use strict';
if(window.__ADM_ASSESS_AUTO__)return;window.__ADM_ASSESS_AUTO__=true;
const KEY='siapGuruAssessmentV1';
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
function activeTab(){const p=document.getElementById('penilaianPro');if(!p||!p.classList.contains('active'))return '';return p.querySelector('.sg-tab.active')?.dataset.at||''}
function rerenderCurrent(){
 const p=document.getElementById('penilaianPro');if(!p||!p.classList.contains('active'))return;
 const tab=activeTab();
 if(tab!=='rekap'&&tab!=='bobot')return;
 const body=document.getElementById('sgAssessmentBody');if(!body)return;
 // The original assessment renderer owns these tabs; trigger the existing tab button only.
 const btn=p.querySelector('.sg-tab[data-at="'+tab+'"]');
 if(btn)btn.click();
}
window.addEventListener('storage',e=>{if(e.key===KEY)setTimeout(rerenderCurrent,30)});
document.addEventListener('adm:assessment-saved',()=>setTimeout(rerenderCurrent,30));
})();
