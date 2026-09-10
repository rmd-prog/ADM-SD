/* SIAP GURU — assessment UI bridge fix */
(function(){
'use strict';
if(window.__ADM_ASSESS_UI_FIX__)return;
window.__ADM_ASSESS_UI_FIX__=true;
function refresh(){
  const nav=document.getElementById('navPenilaianPro');
  const page=document.getElementById('penilaianPro');
  if(nav&&page&&page.classList.contains('active')) nav.click();
}
function wire(){
  const b=document.getElementById('sgLoad');
  if(b&&!b.__wired){b.__wired=true;b.addEventListener('click',refresh)}
}
document.addEventListener('adm:students-ready',refresh);
setInterval(wire,1000);
setTimeout(wire,300);
})();