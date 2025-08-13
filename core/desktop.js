
(function(){
  const desktop = document.getElementById('desktop');
  const icons = [
    {name:'My PC', img:'assets/mycomputer.png', app:'explorer'},
        {name:'DOOM', img:'assets/doom_icon.png', app:'doom'},
    {name:'Browser', img:'assets/folder03.png', app:'browser'},
    {name:'NotePad', img:'assets/folder02.png', app:'notepad_pro'},
    {name:'Paint', img:'assets/folder01.png', app:'paint'},
    {name:'Trash', img:'assets/trash.png', app:'explorer', path:['Trash'], role:'trash'},
    {name:'Folder 01', img:'assets/folder01.png', app:'explorer', path:['Folder 01']},
    {name:'Folder 02', img:'assets/folder02.png', app:'explorer', path:['Folder 02']},
    {name:'Folder 03', img:'assets/folder03.png', app:'explorer', path:['Folder 03']},
    {name:'Folder 04', img:'assets/folder04.png', app:'explorer', path:['Folder 04']},
    {name:'Folder 05', img:'assets/folder05.png', app:'explorer', path:['Folder 05']},
    {name:'Folder 06', img:'assets/folder06.png', app:'explorer', path:['Folder 06']},
    {name:'Folder 07', img:'assets/folder07.png', app:'explorer', path:['Folder 07']},
    {name:'Folder 08', img:'assets/folder08.png', app:'explorer', path:['Folder 08']},
    {name:'Folder 09', img:'assets/folder09.png', app:'explorer', path:['Folder 09']},
    {name:'Folder 10', img:'assets/folder10.png', app:'explorer', path:['Folder 10']}
  ];
  // layout columns left
  const rect = ()=> desktop.getBoundingClientRect();
  const colW=130, rowH=112; let x=16, y=16;
  function next(){ const r=rect(); const pos={left:x, top:y}; y+=rowH; if(y+rowH>r.height-40){ y=16; x+=colW; } return pos; }
  icons.forEach(ic=>{
    const d=document.createElement('div'); d.className='desktop-icon'; d.tabIndex=0;
    const pos=next(); 
    // default placement
    d.style.left=pos.left+'px'; d.style.top=pos.top+'px';
    // PATCH: place trash bottom-right
    if(ic.role==='trash'){
      const r = rect();
      d.style.left = 'auto';
      d.style.top = 'auto';
      d.style.right = '16px';
      d.style.bottom = (32+16)+'px'; // above taskbar
    }
    const img=document.createElement('img'); img.src=ic.img; img.alt=ic.name;
    const label=document.createElement('div'); label.className='label'; label.textContent=(window.DISPLAY_NAMES&&window.DISPLAY_NAMES[ic.name])||ic.name;
    d.append(img,label); desktop.appendChild(d); if(ic.role) d.dataset.role=ic.role;
    let last=0; function open(){ if(ic.path) window.__initialExplorerPath=ic.path; openApp(ic.app); }
    d.addEventListener('click', ()=>{ const n=Date.now(); if(n-last<400) open(); last=n; });
    d.addEventListener('keydown', e=>{ if(e.key==='Enter') open(); });
    // drag session-only
    let drag=false,ox=0,oy=0;
    d.addEventListener('mousedown', e=>{ drag=true; const r=d.getBoundingClientRect(); ox=e.clientX-r.left; oy=e.clientY-r.top; });
    window.addEventListener('mousemove', e=>{ if(!drag) return; const R=desktop.getBoundingClientRect(); let L=Math.max(0,Math.min(R.width-84,e.clientX-R.left-ox)); let T=Math.max(0,Math.min(R.height-86,e.clientY-R.top-oy)); d.style.left=L+'px'; d.style.top=T+'px'; });
    window.addEventListener('mouseup', ()=> drag=false);
  });
  // accept drags for Trash delete
  document.addEventListener('dragover', e=>{ if(e.dataTransfer && e.dataTransfer.types.includes('application/x-win95-item')) e.preventDefault(); });
    document.addEventListener('drop', e=>{
      const dt=e.dataTransfer; if(!(dt && dt.types.includes('application/x-win95-item'))) return;
      e.preventDefault();
      const data=JSON.parse(dt.getData('application/x-win95-item'));
      const trashEl=[...document.querySelectorAll('.desktop-icon')].find(x=>x.dataset.role==='trash');
      const r=trashEl?trashEl.getBoundingClientRect():null;
      if(r && e.clientX>=r.left && e.clientX<=r.right && e.clientY>=r.top && e.clientY<=r.bottom){
        window.fsDelete(data.path, data.name);
        document.dispatchEvent(new CustomEvent('win95:fsChanged'));
      }
    });

    function alignIcons(){
      const items = Array.from(desktop.querySelectorAll('.desktop-icon'));
      const trash = items.find(el => el.querySelector('.label') && el.querySelector('.label').textContent.trim() === 'Trash');
      const others = items.filter(el => el !== trash);
      const r = desktop.getBoundingClientRect();
      const colW=130, rowH=112; let x=16, y=16;
      others.forEach(el=>{ el.style.left=x+'px'; el.style.top=y+'px'; y+=rowH; if(y+rowH>r.height-40){ y=16; x+=colW; } });
      if(trash){ trash.style.left='auto'; trash.style.right='16px'; trash.style.top='auto'; trash.style.bottom='48px'; }
    }

    window.alignIcons=alignIcons;
    setTimeout(alignIcons,50);
  })();
