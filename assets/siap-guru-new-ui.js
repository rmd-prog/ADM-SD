/* SIAP GURU — VISUAL ONLY v1
 * Loads visual styling only. Canonical navigation, auth, data, fetch,
 * page switching and existing event handlers remain untouched.
 */
(function(){
  'use strict';
  if(document.getElementById('siapGuruVisualV1')) return;
  var link=document.createElement('link');
  link.id='siapGuruVisualV1';
  link.rel='stylesheet';
  link.href='assets/siap-guru-visual-v1.css?v=1';
  (document.head||document.documentElement).appendChild(link);
  window.__SIAP_GURU_NEW_UI_DISABLED__=false;
  window.__SIAP_GURU_VISUAL_ONLY__='v1';
})();
