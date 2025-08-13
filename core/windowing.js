
(function(){
  let z=10, id=0;
  const taskbar = document.getElementById('task-buttons');
  function createWindow({title, content, appId, width=500, height=400}){
    const tpl = document.getElementById('window-template');
    const w = tpl.content.firstElementChild.cloneNode(true);
    const titleEl = w.querySelector('.title'); titleEl.textContent = title||'Window';
    const cont = w.querySelector('.content');
    if(typeof content==='string') cont.innerHTML = content; else cont.appendChild(content);
    w.style.width = width+'px'; w.style.height = height+'px';
    w.style.left = (40 + (id%6)*20)+'px'; w.style.top = (40 + (id%6)*20)+'px'; id++;
    w.style.zIndex = ++z;
    document.body.appendChild(w);
    // Task button
    const btn = document.createElement('button'); btn.textContent = title||appId||'Window';
    taskbar.appendChild(btn);
    function focus(){ w.style.zIndex = ++z; }
    w.addEventListener('mousedown', focus);
    btn.addEventListener('click', ()=>{ if(w.classList.contains('minimized')){ w.classList.remove('minimized'); w.setAttribute('aria-hidden','false'); } focus(); });
    // Drag
    const tb = w.querySelector('.titlebar');
    let dragging=false, offX=0, offY=0;
    tb.addEventListener('mousedown',(e)=>{ if(e.target.closest('.buttons')) return; dragging=true; const r=w.getBoundingClientRect(); offX=e.clientX-r.left; offY=e.clientY-r.top; });
    window.addEventListener('mousemove',(e)=>{ if(!dragging) return; w.style.left=(e.clientX-offX)+'px'; w.style.top=(e.clientY-offY)+'px'; });
    window.addEventListener('mouseup',()=> dragging=false);
    // Buttons
    const [bMin,bMax,bClose] = [w.querySelector('.min'), w.querySelector('.max'), w.querySelector('.close')];
    let norm=null;
    bMin.addEventListener('click', ()=> { const m = w.classList.toggle('minimized'); w.setAttribute('aria-hidden', m?'true':'false'); });
    bMax.addEventListener('click', ()=>{
      if(!norm){ norm={left:w.style.left, top:w.style.top, width:w.style.width, height:w.style.height}; w.style.left='0'; w.style.top='0'; w.style.width='100%'; w.style.height='calc(100% - 32px)'; w.classList.add('maximized'); }
      else { w.style.left=norm.left; w.style.top=norm.top; w.style.width=norm.width; w.style.height=norm.height; w.classList.remove('maximized'); norm=null; }
    });
    bClose.addEventListener('click', ()=>{ w.remove(); btn.remove(); });

    // === Resize logic ===
    (function addResize(w){
      const minW = 280, minH = 180;
      const handles = w.querySelectorAll('.resize-handle');
      let startX, startY, startW, startH, startL, startT, dir, moving=false;

      function onDown(e){
        if(w.classList.contains('maximized')) return;
        const target = e.currentTarget;
        dir = target.dataset.dir;
        const r = w.getBoundingClientRect();
        startX = e.clientX; startY = e.clientY;
        startW = r.width; startH = r.height; startL = r.left; startT = r.top;
        moving = true;
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        e.preventDefault();
      }
      function clamp(val, min, max){ return Math.max(min, Math.min(max, val)); }
      function onMove(e){
        if(!moving) return;
        let dx = e.clientX - startX;
        let dy = e.clientY - startY;
        let newW = startW, newH = startH, newL = startL, newT = startT;

        const vw = document.documentElement.clientWidth;
        const vh = document.documentElement.clientHeight - 32; // taskbar

        if(dir.includes('e')){ newW = clamp(startW + dx, minW, vw - startL); }
        if(dir.includes('s')){ newH = clamp(startH + dy, minH, vh - startT); }
        if(dir.includes('w')){
          newW = clamp(startW - dx, minW, startW + startL);
          newL = startL + (startW - newW);
        }
        if(dir.includes('n')){
          newH = clamp(startH - dy, minH, startH + startT);
          newT = startT + (startH - newH);
        }

        Object.assign(w.style, {
          width: newW + 'px',
          height: newH + 'px',
          left: newL + 'px',
          top: newT + 'px'
        });
      }
      function onUp(){
        moving = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
      handles.forEach(h => h.addEventListener('mousedown', onDown));
    })(w);
    
    return w;
  }
  window.createWindow = createWindow;

  // Clock
  function tick(){ const d=new Date(); const m=String(d.getMinutes()).padStart(2,'0'); const h=String(d.getHours()).padStart(2,'0'); document.getElementById('clock').textContent=h+':'+m; }
  setInterval(tick, 30000); tick();
})();
