/* SIAP GURU — assessment UI fix
   Stability patch: never re-open/rerender the whole Penilaian page.
   Student refresh is handled by assessment-data-bridge + assessment-smart.
*/
(function(){
'use strict';
if(window.__ADM_ASSESS_UI_FIX__)return;
window.__ADM_ASSESS_UI_FIX__=true;
})();
