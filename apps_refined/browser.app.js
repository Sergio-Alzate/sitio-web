registerApp('browser', function(){
  // Layout
  const wrap = document.createElement('div');
  wrap.style.height='100%'; wrap.style.display='flex'; wrap.style.flexDirection='column';

  const tb = document.createElement('div'); tb.className='toolbar';
  const bBack = document.createElement('button'); bBack.textContent='◀';
  const bFwd  = document.createElement('button'); bFwd.textContent='▶';
  const bReload = document.createElement('button'); bReload.textContent='Reload';
  const bHome = document.createElement('button'); bHome.textContent='Home';
  const input = document.createElement('input'); input.type='url'; input.placeholder='https://'; input.style.flex='1';
  const bGo   = document.createElement('button'); bGo.textContent='Go';
  tb.append(bBack,bFwd,bReload,bHome,input,bGo);

  const frame = document.createElement('iframe');
  frame.style.border='0'; frame.style.flex='1';
  frame.referrerPolicy='no-referrer';

  wrap.append(tb, frame);

  const home='https://www.sergioalzate.com';
  const hist=[]; let idx=-1;

  function norm(u){ if(!/^https?:/i.test(u)) return 'https://'+u; return u; }
  function setTitleFromURL(w, u){
    try{
      const h = new URL(u).host;
      w.querySelector('.title').textContent = h ? ('Browser — '+h) : 'Browser';
    }catch(e){
      try{ w.querySelector('.title').textContent = 'Browser'; }catch(_){}
    }
  }
  function load(u, w){
    u = norm(u);
    input.value = u;
    setTitleFromURL(w, u);
    try{ frame.src = u; }catch(e){}
  }
  function go(u, w){
    u = norm(u);
    hist.splice(idx+1);
    hist.push(u);
    idx = hist.length - 1;
    load(u, w);
  }

  // Handle X-Frame-Options / CSP by falling back silently
  frame.addEventListener('load', ()=>{
    setTimeout(()=>{
      try{
        // Accessing cross-origin title may throw if blocked or different origin with restrictions
        const _ = frame.contentDocument.title;
      }catch(e){
        // Fallback to simplified reader proxy
        try{
          const u = new URL(input.value);
          frame.src = 'https:///http://' + u.host + u.pathname + u.search;
        }catch(_e){
          // Last resort: open in new tab
          try{ window.open(input.value, '_blank'); }catch(__){}
        }
      }
    }, 200);
  });

  const w = createWindow({title:'Browser', content:wrap, appId:'browser', width:900, height:640});

  // Controls
  bGo.onclick = ()=> go(input.value, w);
  input.addEventListener('keydown', e=>{ if(e.key==='Enter') go(input.value, w); });
  bBack.onclick = ()=>{ if(idx>0){ idx--; load(hist[idx], w); } };
  bFwd.onclick  = ()=>{ if(idx < hist.length-1){ idx++; load(hist[idx], w); } };
  bReload.onclick = ()=> load(hist[idx] || home, w);
  bHome.onclick = ()=> go(home, w);

  // Start
  go(home, w);
  return w;
});