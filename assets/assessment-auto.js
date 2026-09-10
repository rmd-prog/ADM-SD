/* SIAP GURU — assessment automatic sync layer V2
   Keeps assessment data events lightweight.
   Rekap/Bobot renderers own their DOM; never click tabs on save because that resets scroll.
   Does not touch D1 or src/index.js.
*/
(function(){
'use strict';
if(window.__ADM_ASSESS_AUTO__)return;
window.__ADM_ASSESS_AUTO__=true;
})();
