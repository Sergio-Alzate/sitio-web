
registerApp('photoexplorer', function(){
  /* VIDEO SUPPORT IN PHOTO EXPLORER */
  const data = window.__photoExplorerData || {images:[], index:0, pathText:'/'};
  const wrap = document.createElement('div'); wrap.className='photoexplorer';
  const header = document.createElement('div'); header.className='toolbar stickybar'; header.textContent = data.pathText || '/';
  const body = document.createElement('div'); body.className='pe-body';
  const list = document.createElement('div'); list.className='pe-list'; list.setAttribute('role','listbox');
  const viewer = document.createElement('div'); viewer.className='pe-viewer';
  const img = document.createElement('img'); img.alt=''; viewer.appendChild(img);
  const controls = document.createElement('div'); controls.className='controls';
  const btnPrev = Object.assign(document.createElement('button'),{textContent:'◀ Prev'});
  const btnNext = Object.assign(document.createElement('button'),{textContent:'Next ▶'});
  const btnZoom = Object.assign(document.createElement('button'),{textContent:'Fit/Actual'});
  const cap = document.createElement('div'); cap.style.flex='1';
  controls.append(btnPrev, btnNext, btnZoom, cap);
  body.append(list, viewer); wrap.append(header, body, controls);
  let index=Math.max(0, Math.min(data.index||0, (data.images||[]).length-1)); let mode='fit';
  function apply(){ img.style.objectFit=(mode==='fit'?'contain':'none'); img.style.width=img.style.height=''; }
  function show(){ if(!data.images.length){ cap.textContent='No images'; img.removeAttribute('src'); return; } const it=data.images[index]; img.src=it.src; apply(); cap.textContent=(index+1)+' / '+data.images.length; list.querySelectorAll('.pe-item').forEach((it,i)=>{ it.classList.toggle('active', i===index); it.setAttribute('aria-selected', i===index?'true':'false'); }); }
  function go(d){ if(!data.images.length) return; index=(index+data.images.length+d)%data.images.length; show(); }
  btnPrev.onclick=()=>go(-1); btnNext.onclick=()=>go(1); btnZoom.onclick=()=>{ mode=(mode==='fit'?'actual':'fit'); apply(); };
  // Keyboard shortcuts
  setTimeout(()=>{ try{ w.focus(); }catch(e){} }, 50);
  // build thumb grid (no text)
  (data.images||[]).forEach((it,i)=>{ const row=document.createElement('button'); row.className='pe-item onlythumbs'; row.setAttribute('role','option'); row.title=it.title||''; const t=document.createElement('img'); t.src=it.src; t.alt=''; row.append(t); row.onclick=()=>{ index=i; show(); }; list.append(row); });
  /* TITLE PATCH: show folder name */
  const w=createWindow({title:(data.pathText?.split('/').filter(Boolean).slice(-1)[0]||'Photo Explorer'), content:wrap, appId:'photoexplorer', width:900, height:640});
  w.tabIndex=0; w.addEventListener('keydown', e=>{ if(e.key==='ArrowLeft'){ e.preventDefault(); go(-1);} else if(e.key==='ArrowRight'){ e.preventDefault(); go(1);} });
  /* ARROWS PATCH: support ArrowUp/ArrowDown for the single-column list */
  w.tabIndex = 0;
  w.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowUp'){ e.preventDefault(); go(-1); }
    else if(e.key === 'ArrowDown'){ e.preventDefault(); go(1); }
  });
  show(); return w;
});
