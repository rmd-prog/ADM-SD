/* SIAP GURU — BRAND CLEANUP
 * Remove all rocket icons and school-logo visuals from the UI.
 * This is intentionally isolated so branding can be redesigned later.
 */
(function(){
  'use strict';
  if(window.__SIAP_GURU_BRAND_CLEANUP__) return;
  window.__SIAP_GURU_BRAND_CLEANUP__ = true;

  const ROCKETS = /🚀/g;

  function clean(root){
    if(!root) return;

    // Remove every school-logo image regardless of where legacy UI injects it.
    root.querySelectorAll?.('img[src*="logo-sekolah.png"], img[alt*="Logo sekolah" i]').forEach(img=>{
      const wrap = img.closest('.logo');
      if(wrap && wrap.children.length === 1) wrap.remove();
      else img.remove();
    });

    // Remove rocket glyphs from text nodes without disturbing surrounding markup.
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes=[];
    let n;
    while((n=walker.nextNode())) nodes.push(n);
    nodes.forEach(node=>{
      if(ROCKETS.test(node.nodeValue)){
        node.nodeValue = node.nodeValue.replace(ROCKETS,'');
      }
      ROCKETS.lastIndex=0;
    });
  }

  function boot(){
    clean(document.body);
    const observer=new MutationObserver(mutations=>{
      for(const m of mutations){
        if(m.type==='childList') m.addedNodes.forEach(node=>{
          if(node.nodeType===1) clean(node);
          else if(node.nodeType===3 && ROCKETS.test(node.nodeValue)){
            node.nodeValue=node.nodeValue.replace(ROCKETS,'');
            ROCKETS.lastIndex=0;
          }
        });
        else if(m.type==='characterData' && ROCKETS.test(m.target.nodeValue)){
          m.target.nodeValue=m.target.nodeValue.replace(ROCKETS,'');
          ROCKETS.lastIndex=0;
        }
      }
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
