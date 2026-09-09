/* ADM-SD — role-specific navigation */
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
      if(!admin && (isTeacher||isSystem||isSibi)){
        if(el.classList.contains('menu-group')) el.style.display='none';
        else el.style.display='none';
      }
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
  function boot(){
    applyRoleMenu();
    loadMultiRombel();
    const obs=new MutationObserver(()=>applyRoleMenu());
    if(document.body) obs.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','data-page']});
    window.__ADM_APPLY_ROLE_MENU=applyRoleMenu;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
