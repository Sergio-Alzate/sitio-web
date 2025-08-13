
registerApp('imageviewer', function(){
  const data = window.__imageViewerData || {images:[], index:0};
  const wrap = document.createElement('div');
  wrap.style.height='100%'; wrap.style.display='flex'; wrap.style.flexDirection='column';

  const controls = document.createElement('div'); controls.className='toolbar stickybar';
  const bPrev = document.createElement('button'); bPrev.textContent='◀ Prev';
  const bNext = document.createElement('button'); bNext.textContent='Next ▶';
  const bZoom = document.createElement('button'); bZoom.textContent='Fit/Actual';
  const cap = document.createElement('div'); cap.style.flex='1';
  controls.append(bPrev,bNext,bZoom,cap);

  const viewer = document.createElement('div');
  viewer.style.flex='1';
  viewer.style.display='flex';
  viewer.style.alignItems='center';
  viewer.style.justifyContent='center';
  viewer.style.background='#000';

  // MEDIA NODES
  const img = document.createElement('img');
  img.style.maxWidth='100%'; img.style.maxHeight='100%'; img.style.objectFit='contain';

  const video = document.createElement('video'); /* VIDEO SUPPORT */
  video.style.maxWidth='100%'; video.style.maxHeight='100%'; video.style.objectFit='contain';
  video.controls = true; video.playsInline = true;

  const frame = document.createElement('iframe'); /* YT/Vimeo/HTML SUPPORT */
  frame.style.border='0'; frame.style.width='100%'; frame.style.height='100%'; frame.allow = 'autoplay; encrypted-media; picture-in-picture';

  viewer.appendChild(img);
  wrap.append(controls, viewer);

  let idx = data.index || 0, mode='fit';

  function isVideoFile(u){
    if(!u) return false;
    try{ const x = new URL(u); }catch(e){ return /\.(mp4|webm|ogg)$/i.test(u); }
    return /\.(mp4|webm|ogg)$/i.test(u);
  }
  function spotifyEmbed(u){ try{ const url = new URL(u); if(/open\.spotify\.com/i.test(url.host)) return u; }catch(e){} return null; }
  function ytEmbed(u){
    try{
      const url = new URL(u);
      if(/(youtube\.com|youtu\.be)/i.test(url.host)){
        let id='';
        if(url.host.includes('youtu.be')) id = url.pathname.slice(1);
        else id = url.searchParams.get('v') || '';
        if(id) return 'https://www.youtube.com/embed/'+id+'?rel=0';
      }
    }catch(e){}
    return null;
  }
  function vimeoEmbed(u){
    try{
      const url = new URL(u);
      if(/vimeo\.com$/i.test(url.host) || /player\.vimeo\.com$/i.test(url.host)){
        const parts = url.pathname.split('/').filter(Boolean);
        const id = parts.pop();
        if(id && /^\d+$/.test(id)) return 'https://player.vimeo.com/video/'+id;
      }
    }catch(e){}
    return null;
  }

  function apply(){
    const fit = (mode === 'fit');
    img.style.objectFit = fit ? 'contain' : 'none';
    video.style.objectFit = fit ? 'contain' : 'none';
  }

  function setMedia(it){
    // Reset
    img.remove(); video.remove(); frame.remove();
    const url = it.url || it.src || it.href || '';
    const title = it.title || it.name || '';
    cap.textContent = ((idx+1)+'/'+data.images.length+' — '+title);

    // choose renderer
    
    const sp = spotifyEmbed(url);
    const yt = ytEmbed(url);
    const vm = vimeoEmbed(url);
    const isHTML = /^data:text\/html/i.test(url) || /\.html(?:$|\?)/i.test(url);

    if(sp){
      frame.src = sp;
      frame.style.width='100%'; frame.style.height='100%'; frame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'; frame.allowFullscreen = true;
      viewer.appendChild(frame); bZoom.disabled = true; return;
    }
    if(yt || vm){
      frame.src = yt || vm;
      frame.style.width='100%'; frame.style.height='100%';
      viewer.appendChild(frame); bZoom.disabled = true; return;
    }
    if(isHTML){
      frame.src = url;
      frame.style.width='100%'; frame.style.height='100%';
      viewer.appendChild(frame); bZoom.disabled = true; return;
    }

    if(isVideoFile(url)){
      video.src = url;
      viewer.appendChild(video);
      bZoom.disabled = false;
      return;
    }
    // default image
    img.src = url;
    viewer.appendChild(img);
    bZoom.disabled = false;
    apply();
  }

  function show(){
    if(!data.images.length){ cap.textContent=''; return; }
    const it = data.images[ ((idx % data.images.length)+data.images.length) % data.images.length ];
    setMedia(it);
  }

  bPrev.onclick = ()=>{ idx=(idx+data.images.length-1)%data.images.length; show(); };
  bNext.onclick = ()=>{ idx=(idx+1)%data.images.length; show(); };
  bZoom.onclick = ()=>{ mode=(mode==='fit'?'actual':'fit'); apply(); };

  const w = createWindow({title:'Image & Video Viewer', content:wrap, appId:'imageviewer', width:900, height:640});
  /* KEYBOARD ARROWS */
  setTimeout(()=>{ try{ w && w.focus && w.focus(); }catch(e){}; viewer.tabIndex=0; viewer.focus(); }, 100);
  viewer.addEventListener('keydown', (e)=>{ if(e.key==='ArrowLeft'){ e.preventDefault(); bPrev.click(); } else if(e.key==='ArrowRight'){ e.preventDefault(); bNext.click(); } });
  show();
  return w;
});
