/* SIAP GURU — SAFE LOADING COMPATIBILITY
 * Loading/notification UI is disabled temporarily to restore a stable normal app.
 * Public API is preserved so existing code does not throw errors.
 */
(function(){
  'use strict';
  if(window.__ADM_LOADING_SYSTEM_DISABLED__) return;
  window.__ADM_LOADING_SYSTEM_DISABLED__=true;
  function noop(){}
  function mount(){}
  function feedback(){ return null; }
  window.ADMLoading={
    show:noop, hide:noop, mount:mount, process:noop, setProgress:noop,
    success:noop, error:noop, warning:noop, info:noop, feedback:feedback,
    soundOn:noop, soundOff:noop
  };
  window.ADMUI=window.ADMLoading;
})();
