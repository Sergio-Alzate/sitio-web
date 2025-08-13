
(function(){
  const DN = window.DISPLAY_NAMES || {};
  function mapName(n){ return DN[n] || n; }

  function applyDesktop(){
    document.querySelectorAll('#desktop .icon .label').forEach(el=>{
      const name = (el.textContent||'').trim();
      if(DN[name]) el.textContent = DN[name];
    });
  }

  function applyExplorer(){
    document.querySelectorAll('.window[data-app="explorer"]').forEach(win=>{
      const titleEl = win.querySelector('.title');
      if(titleEl){
        const t = (titleEl.textContent||'').trim();
        if(DN[t]) titleEl.textContent = DN[t];
      }
      const pathEl = win.querySelector('.labelpath');
      if(pathEl){
        const parts = (pathEl.textContent||'').split('/').map(s=> s.trim()).filter(Boolean).map(mapName);
        pathEl.textContent = '/'+parts.join('/');
      }
    });
  }

  function applyAll(){ applyDesktop(); applyExplorer(); }

  // Observe UI mutations to re-apply labels without touching internal IDs/paths
  const obs = new MutationObserver(()=>{ applyAll(); });
  window.addEventListener('DOMContentLoaded', applyAll);
  document.addEventListener('win95:contentLoaded', applyAll);
  document.addEventListener('win95:fsChanged', applyAll);
  obs.observe(document.documentElement, {subtree:true, childList:true, characterData:true});
})();
