/* SIAP GURU — PROTA & PROSEM ROOM BRIDGE
 * Scope: only the existing PERANGKAT PEMBELAJARAN menu room.
 * Does not touch dashboard, login, D1, Worker, students, scores, or global navigation.
 * Existing PROTA/PROSEM page buttons are reused; only their visual menu rooms are separated.
 */
(function(){
  'use strict';
  if(window.__SIAP_GURU_PROTA_PROSEM_ROOMS__) return;
  window.__SIAP_GURU_PROTA_PROSEM_ROOMS__ = true;

  function makeRoom(label, icon, button){
    const group=document.createElement('div');
    group.className='menu-group sg-doc-room';
    const head=document.createElement('button');
    head.type='button';
    head.className='navgroup sg-doc-room-head';
    head.innerHTML='<span>'+icon+' '+label+'</span><span class="v13-chevron">▾</span>';
    const sub=document.createElement('div');
    sub.className='submenu sg-doc-room-submenu';
    sub.appendChild(button);
    group.appendChild(head);
    group.appendChild(sub);
    head.addEventListener('click',function(){
      group.classList.toggle('open');
    });
    return group;
  }

  function addStyle(){
    if(document.getElementById('sgProtaProsemRoomStyle')) return;
    const style=document.createElement('style');
    style.id='sgProtaProsemRoomStyle';
    style.textContent=`
      .sg-doc-room{margin:1px 0 2px 6px;border-left:1px solid rgba(148,163,184,.22)}
      .sg-doc-room-head{font-size:13px;padding:8px 10px;color:#cbd5e1}
      .sg-doc-room-head:hover{color:#fff;background:rgba(255,255,255,.055)}
      .sg-doc-room .sg-doc-room-submenu{padding-left:8px}
      .sg-doc-room .navbtn{font-size:13px;padding:8px 10px}
    `;
    document.head.appendChild(style);
  }

  function install(){
    const groups=Array.from(document.querySelectorAll('#sidebar .menu-group'));
    const learning=groups.find(g=>{
      const h=g.querySelector(':scope > .navgroup');
      return h && /PERANGKAT PEMBELAJARAN/i.test(h.textContent||'');
    });
    if(!learning) return false;

    const submenu=learning.querySelector(':scope > .submenu');
    if(!submenu || submenu.dataset.sgRoomsReady==='1') return true;

    const prota=submenu.querySelector(':scope > .navbtn[data-page="prota"]');
    const prosem=submenu.querySelector(':scope > .navbtn[data-page="prosem"]');
    if(!prota || !prosem) return false;

    addStyle();

    const protaRoom=makeRoom('PROTA — Program Tahunan','📅',prota);
    const prosemRoom=makeRoom('PROSEM — Program Semester','🗓️',prosem);

    submenu.insertBefore(protaRoom,prota.nextSibling);
    submenu.insertBefore(prosemRoom,protaRoom.nextSibling);
    prota.remove();
    prosem.remove();

    submenu.dataset.sgRoomsReady='1';
    return true;
  }

  function boot(){
    if(install()) return;
    [120,400,900,1800].forEach(ms=>setTimeout(install,ms));
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
