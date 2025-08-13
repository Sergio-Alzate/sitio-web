
registerApp('explorer', function(){
  const wrap=document.createElement('div'); const tb=document.createElement('div'); tb.className='toolbar';
  const bUp=btn('Up'), bNew=btn('New Folder'), bDel=btn('Delete'), bRestore=btn('Restore last'), bProps=btn('Properties'), bReload=btn('Reload content');
  tb.append(bUp,bNew,bDel,bRestore,bProps,bReload);
  const pathLabel=document.createElement('div'); pathLabel.className='labelpath';
  const grid=document.createElement('div'); grid.className='grid'; grid.tabIndex=0; wrap.append(tb, pathLabel, grid);

  let path=window.__initialExplorerPath||['My PC']; delete window.__initialExplorerPath; let selection=null;
  const w=createWindow({title:'My PC', content:wrap, appId:'explorer', width:720, height:520});

  function btn(t){ const b=document.createElement('button'); b.textContent=t; return b; }
  function setPath(p){ path=p; pathLabel.textContent='/' + p.map(function(x){return (window.DISPLAY_NAMES&&window.DISPLAY_NAMES[x])||x;}).join('/'); updateToolbar(); try{ w.querySelector('.title').textContent = ((window.DISPLAY_NAMES&&window.DISPLAY_NAMES[p[p.length-1]])||p[p.length-1]||'My PC'); }catch(e){} }
  function ls(){ return (window.fsList? fsList(path):[])||[]; }
  function isImageName(s){ if(!s) return false; try{ const u=new URL(s, location.href); s=u.pathname; }catch(e){} return /\.(png|jpe?g|gif|webp|avif|bmp|svg)$/i.test(s); }
  function updateToolbar(){ const inFolder = path.length>1; bRestore.style.display=bProps.style.display=bReload.style.display = inFolder?'none':'inline-block'; }

  function render(){
    selection=null; grid.innerHTML=''; updateToolbar();
    ls().forEach(n=>{
      const t=document.createElement('div'); t.className='tile'; t.tabIndex=0;
      const i=document.createElement('img');
      i.alt=n.name;
      if(n.type==='dir') i.src = 'assets/folder02.png';
      else if(n.type==='video') i.src = 'assets/video.png';
      else if(n.type==='music') i.src = 'assets/icons/music.png';
      else if(n.url) i.src = n.url; else i.src='assets/folder02.png';
      const s=document.createElement('div'); s.className='name'; s.textContent=(window.DISPLAY_NAMES&&window.DISPLAY_NAMES[n.name])||n.name;
      t.append(i,s); grid.append(t);
      function sel(){ grid.querySelectorAll('.tile').forEach(x=>x.classList.remove('selected')); t.classList.add('selected'); selection=n; }
      t.addEventListener('click', ()=>{ sel(); openNode(n,false); });
      t.addEventListener('dblclick', ()=> openNode(n,true));
      t.addEventListener('keydown', e=>{ if(e.key==='Enter') openNode(n,true); });
      // DnD
      t.draggable=true; t.addEventListener('dragstart', e=>{ const payload={path:path.slice(), name:n.name, kind:n.type==='dir'?'dir':(n.type==='video'?'video':(n.name&&n.name.toLowerCase().endsWith('.txt')?'txt':(n.url?'image':'file'))), url:n.url||null, title:n.title||null, data:n.data||null}; e.dataTransfer.setData('application/x-win95-item', JSON.stringify(payload)); e.dataTransfer.setData('text/plain', n.name); });
      t.addEventListener('dragover', e=>{ if(n.type==='dir'){ e.preventDefault(); t.classList.add('selected'); } });
      t.addEventListener('dragleave', ()=> t.classList.remove('selected'));
      t.addEventListener('drop', e=>{ e.preventDefault(); t.classList.remove('selected'); const name=e.dataTransfer.getData('text/plain'); if(n.type==='dir' && name && name!==n.name){ fsMove(path, name, [...path, n.name]); render(); } });
    });
  }

  
function openNode(n, preferViewer){
    if(n.type==='dir'){ setPath([...path, n.name]); render(); return; }
    const isTxt = n.name && n.name.toLowerCase().endsWith('.txt');
    if(isTxt){ const np=openApp('notepad_pro'); if(np&&np.loadFromString) np.loadFromString(n.name, n.data||''); return; }

    // Unified media viewer: images + videos + YT/Vimeo
    function isVideoUrl(u){
      if(!u) return false; try{ const _=new URL(u); }catch(e){}
      return /\.(mp4|webm|ogg)$/i.test(u) || /(youtube\.com|youtu\.be|vimeo\.com)/i.test(u);
    }
    function isImageUrl(u,name){
      return isImageName(u) || isImageName(name||'');
    }

    if(n.url){
      const siblings = ls().filter(x=>x.url && (isImageUrl(x.url,x.name) || isVideoUrl(x.url) || /^data:text\/html/i.test(x.url) || /\.html(?:$|\?)/i.test(x.url) || x.type==='embed' || x.type==='music'))
        .map(x=>({ url:x.url, title:x.title||x.name }));
      const index = Math.max(0, siblings.findIndex(x=>x.url===n.url));

      // Launch mixed media viewer
      window.__imageViewerData = { images: siblings, index };
      const wv = openApp('imageviewer');
      try{ wv && wv.focus && wv.focus(); }catch(e){}
      return;
    }
  }


  // Toolbar actions
  bUp.onclick=()=>{ if(path.length>1){ setPath(path.slice(0,-1)); render(); } };
  bNew.onclick=()=>{ const name=prompt('Folder name','New Folder'); if(!name) return; fsMkdir(path, name); render(); };
  bDel.onclick=()=>{ if(!selection){ alert('Select an item first'); return; } fsDelete(path, selection.name); render(); };
  bRestore.onclick=()=>{ fsRestoreLast(); render(); };
  bProps.onclick=()=>{ if(!selection){ alert('Select an item first'); return; } alert('Name: '+selection.name+'\nType: '+selection.type+'\nPath: /'+path.join('/')+'/'+selection.name); };
  bReload.onclick=async()=>{ if(window.fsReloadContent){ await fsReloadContent(); render(); } };

  // Background drop to copy
  grid.addEventListener('dragover', e=>{ if(e.dataTransfer && e.dataTransfer.types.includes('application/x-win95-item')) e.preventDefault(); });
  grid.addEventListener('drop', e=>{ const dt=e.dataTransfer; if(!(dt && dt.types.includes('application/x-win95-item'))) return; e.preventDefault(); const data=JSON.parse(dt.getData('application/x-win95-item')); const here=fsGetNode(path); if(!here||!here.children) return;
    function exists(nm){ return here.children.some(x=>x.name===nm); } function uniq(nm){ if(!exists(nm)) return nm; const m=nm.match(/^(.*?)(\.[^.]*)$/); let stem=m?m[1]:nm, ext=m?m[2]:''; let i=1; while(exists(stem+' (copy'+(i>1?' '+i:'')+')'+ext)) i++; return stem+' (copy'+(i>1?' '+i:'')+')'+ext; }
    if(data.kind==='dir'){ fsMkdir(path, uniq(data.name)); }
    else if(data.kind==='txt'){ fsCreateFile(path, uniq(data.name.endsWith('.txt')?data.name:(data.name+'.txt')), data.data||''); }
    else if(data.kind==='image'){ here.children.push({type:'file', name:uniq(data.name||'Image.png'), url:data.url, title:data.title||data.name||'Image'}); }
    else if(data.kind==='video'){ here.children.push({type:'video', name:uniq(data.name||'Video.url'), url:data.url, title:data.title||data.name||'Video'}); }
    document.dispatchEvent(new CustomEvent('win95:fsChanged')); render(); });

  document.addEventListener('win95:fsChanged', ()=> render());
  document.addEventListener('win95:contentLoaded', ()=> render());

  setPath(path); render();
  return w;
});
