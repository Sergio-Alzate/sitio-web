
(function(){
  const startBtn = document.getElementById('start-btn');
  const menu = document.getElementById('start-menu');
  startBtn.addEventListener('click', ()=>{ const v=menu.hasAttribute('hidden'); menu.toggleAttribute('hidden', !v); startBtn.setAttribute('aria-expanded', String(v)); });
  document.addEventListener('click', (e)=>{ if(!menu.contains(e.target) && e.target!==startBtn) menu.setAttribute('hidden',''); });
  menu.addEventListener('click',(e)=>{
    const b=e.target.closest('button'); if(!b) return;
    const act=b.dataset.action, tgt=b.dataset.target;
    if(act==='app') openApp(tgt);
    else if(act==='link') window.open(tgt,'_blank');
    menu.setAttribute('hidden','');
  });
})();


// Align Icons action
document.getElementById('start-menu').addEventListener('click', (e)=>{
  const b = e.target.closest('button[data-action="align-icons"]');
  if(b){ e.preventDefault(); if(window.alignIcons) window.alignIcons(); document.getElementById('start-menu').hidden = true; }
});
