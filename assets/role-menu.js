/* ADM-SD — role-specific navigation + AI visual renderer */
(function(){
  'use strict';
  const getUser=()=>{
    try{
      const x=JSON.parse(localStorage.getItem('siLogin')||'null');
      return x?.user||x||null;
    }catch{return null}
  };
  const isAdmin=()=>String(getUser()?.role||'').toLowerCase()==='admin';
  const norm=s=>String(s||'').trim().toLowerCase().replace(/\s+/g,' ');

  function applyRoleMenu(){
    const admin=isAdmin();
    document.querySelectorAll('.navbtn,.navgroup,.menu-group').forEach(el=>{
      const text=norm(el.textContent);
      const page=norm(el.getAttribute('data-page'));
      const isTeacher=page==='teachers' || text.includes('data guru');
      const isSystem=page==='system' || page==='settings' || text==='sistem' || text.includes('menu sistem');
      const isSibi=page==='reference' || text.includes('referensi sibi') || text.includes('sibi');
      if(!admin && (isTeacher||isSystem||isSibi)) el.style.display='none';
      if(admin && (isTeacher||isSystem||isSibi)) el.style.display='';
    });
    document.querySelectorAll('.menu-group').forEach(group=>{
      if(admin){group.style.display='';return;}
      const visible=[...group.querySelectorAll('.navbtn')].some(x=>getComputedStyle(x).display!=='none');
      const title=norm(group.querySelector('.navgroup')?.textContent);
      if(title.includes('sistem') || title.includes('referensi sibi')) group.style.display='none';
      else if(group.querySelector('.submenu') && !visible) group.style.display='none';
    });
    const current=document.querySelector('.page.active');
    if(!admin && current && norm(current.id)==='teachers'){
      const dash=document.querySelector('[data-page="dashboard"]');
      if(dash) dash.click();
    }
  }

  function loadMultiRombel(){
    if(window.__ADM_MULTI_ROMBEL_LOADED)return;
    window.__ADM_MULTI_ROMBEL_LOADED=true;
    const s=document.createElement('script');s.src='assets/multi-rombel.js?v=1';s.async=false;document.head.appendChild(s);
  }

  /* AI visual hardening:
     - Never show raw <svg>, <div class="ai-visual"> or ASCII diagrams to teachers.
     - Only allow the controlled visual markup produced by ADM-SD.
     - Convert common escaped HTML and common light-source ASCII into real visual cards.
     - Keep normal AI prose safely escaped. */
  function installAIBrainRenderer(){
    if(window.__ADM_AI_RENDERER_V34)return;
    const install=()=>{
      if(typeof window.cleanAIMarkdown!=='function')return false;
      const original=window.cleanAIMarkdown;
      if(original.__admV34)return true;
      const decode=s=>String(s||'')
        .replace(/\\/g,'')
        .replace(/&lt;/gi,'<').replace(/&gt;/gi,'>')
        .replace(/&quot;/gi,'\"').replace(/&#39;/gi,"'").replace(/&amp;/gi,'&');
      const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');
      const visualFromToken=(type,attrs)=>{
        const a={}; String(attrs||'').replace(/([a-zA-Z]+)\s*=\s*[\"']([^\"']*)[\"']/g,(_,k,v)=>a[k]=v);
        const label=esc(a.label||'Stimulus visual');
        const wrap=inner=>'<div class="ai-visual" style="margin:12px 0;text-align:center;padding:8px 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 250" width="100%" role="img" aria-label="'+label+'" style="max-width:620px;height:auto;border:1px solid #d9dee8;border-radius:14px;background:#fff">'+inner+'</svg></div>';
        if(type==='light'){
          return wrap('<defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fef3c7"/><stop offset="1" stop-color="#fde68a"/></linearGradient></defs><rect x="18" y="18" width="584" height="214" rx="18" fill="url(#lg)"/><circle cx="95" cy="92" r="42" fill="#f59e0b" stroke="#b45309" stroke-width="3"/><g stroke="#b45309" stroke-width="5">'+[0,45,90,135,180,225,270,315].map(d=>{const r=d*Math.PI/180,x1=95+55*Math.cos(r),y1=92+55*Math.sin(r),x2=95+68*Math.cos(r),y2=92+68*Math.sin(r);return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"/>';}).join('')+'</g><text x="95" y="155" text-anchor="middle" font-size="16" font-weight="700">Sumber cahaya</text><rect x="250" y="68" width="125" height="72" rx="10" fill="#94a3b8" stroke="#334155" stroke-width="3"/><text x="312" y="110" text-anchor="middle" font-size="18" font-weight="700" fill="#fff">Benda</text><path d="M145 92 H245" stroke="#f59e0b" stroke-width="8" marker-end="url(#arr)"/><path d="M380 104 H515" stroke="#334155" stroke-width="8" marker-end="url(#arr)"/><defs><marker id="arr" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 Z" fill="#334155"/></marker></defs><rect x="515" y="52" width="18" height="120" rx="4" fill="#475569"/><path d="M515 92 H430 V160 H515" fill="#94a3b8" opacity=".6"/><text x="523" y="194" text-anchor="middle" font-size="14" font-weight="700">Layar</text><text x="310" y="218" text-anchor="middle" font-size="15">Cahaya merambat dari sumber → benda → bayangan pada layar</text>');
        }
        if(type==='bar'){
          const labels=String(a.labels||'A|B|C|D').split('|').slice(0,6), vals=String(a.values||'3|5|2|4').split('|').map(Number).slice(0,6), max=Math.max(1,...vals);
          let s='<text x="310" y="28" text-anchor="middle" font-size="19" font-weight="700">'+label+'</text><line x1="55" y1="205" x2="580" y2="205" stroke="#334155" stroke-width="2"/>';
          labels.forEach((lb,i)=>{const v=Math.max(0,vals[i]||0),h=135*v/max,x=65+i*82,y=205-h;s+='<rect x="'+x+'" y="'+y+'" width="54" height="'+h+'" rx="7" fill="#93c5fd" stroke="#1e3a8a" stroke-width="2"/><text x="'+(x+27)+'" y="'+(y-7)+'" text-anchor="middle" font-size="13" font-weight="700">'+v+'</text><text x="'+(x+27)+'" y="225" text-anchor="middle" font-size="13">'+esc(lb)+'</text>';});
          return wrap(s);
        }
        return '';
      };
      const cleanVisuals=raw=>{
        let s=decode(raw);
        s=s.replace(/\[\[GAMBAR\s+([^\]]+)\]\]/gi,(m,all)=>{const mt=String(all).match(/(?:^|\s)type\s*=\s*[\"']?([a-zA-Z_-]+)/i);const type=(mt?mt[1]:'').toLowerCase();return visualFromToken(type,all);});
        s=s.replace(/<div\s+class=[\"']ai-visual[\"'][\s\S]*?<\/div>/gi,m=>m);
        /* Convert the common ASCII light-source diagram into a real illustrated SVG. */
        if(/Sumber cahaya/i.test(s)&&/Bayangan/i.test(s)&&/Benda/i.test(s)&&/[\\/|*]/.test(s)){
          s=s.replace(/Sumber cahaya[\s\S]{0,1400}(?=\n\s*\n|$)/i,visualFromToken('light','label="Sumber cahaya, benda, dan bayangan"'));
        }
        return s;
      };
      const patched=function(text){
        const v=cleanVisuals(text);
        const visualParts=[]; const marker='___ADM_VISUAL_'+Math.random().toString(36).slice(2)+'___';
        const protectedText=v.replace(/<div\s+class=[\"']ai-visual[\"'][\s\S]*?<\/div>/gi,m=>{const i=visualParts.push(m)-1;return '\n'+marker+i+'\n';});
        let html=original(protectedText);
        visualParts.forEach((m,i)=>{html=html.replace(marker+i,m)});
        return html;
      };
      patched.__admV34=true;
      window.cleanAIMarkdown=patched;
      window.__ADM_AI_RENDERER_V34=true;
      return true;
    };
    if(install())return;
    let tries=0;const timer=setInterval(()=>{if(install()||++tries>80)clearInterval(timer)},100);
  }

  function boot(){
    applyRoleMenu();
    loadMultiRombel();
    installAIBrainRenderer();
    const obs=new MutationObserver(()=>applyRoleMenu());
    if(document.body) obs.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','data-page']});
    window.__ADM_APPLY_ROLE_MENU=applyRoleMenu;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
