/* SIAP GURU — BRAND CLEANUP */
(function(){
  'use strict';
  if(window.__SIAP_GURU_BRAND_CLEANUP__) return;
  window.__SIAP_GURU_BRAND_CLEANUP__=true;

  const ROCKETS=/🚀/g;
  const LEGACY_BRAND=/GURU\s*\+\s*SD|SIAP GURU\s*V(?:9|10|11)/gi;

  function clean(root){
    if(!root) return;

    root.querySelectorAll?.('img[src*="logo-sekolah.png"],img[alt*="Logo sekolah" i]').forEach(img=>{
      const wrap=img.closest('.logo');
      if(wrap&&wrap.children.length===1) wrap.remove();
      else img.remove();
    });

    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[]; let n;
    while((n=walker.nextNode())) nodes.push(n);
    nodes.forEach(node=>{
      let text=node.nodeValue||'';
      text=text.replace(ROCKETS,'').replace(LEGACY_BRAND,'SIAP GURU');
      if(text!==node.nodeValue) node.nodeValue=text;
      ROCKETS.lastIndex=0;
      LEGACY_BRAND.lastIndex=0;
    });

    // Login branding is intentionally kept as a clean canvas for the new design.
    root.querySelectorAll?.('.login-brand-logo').forEach(el=>el.remove());
    root.querySelectorAll?.('.login-brand-title').forEach(el=>{
      el.textContent='SIAP GURU';
    });
    root.querySelectorAll?.('.login-brand-ver').forEach(el=>{
      el.textContent='TA 2026/2027';
    });
  }

  function boot(){
    clean(document.body);
    new MutationObserver(mutations=>{
      mutations.forEach(m=>{
        if(m.type==='childList') m.addedNodes.forEach(node=>{
          if(node.nodeType===1) clean(node);
          else if(node.nodeType===3) clean(node.parentNode);
        });
        else if(m.type==='characterData') clean(m.target.parentNode);
      });
    }).observe(document.body,{subtree:true,childList:true,characterData:true});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();