
(function(){
  const root = {
    type:'dir', name:'root', children:[
      {type:'dir', name:'Trash', children:[]},
      {type:'dir', name:'My PC', children:[
        {type:'dir', name:'Photos', children:[]},
        {type:'dir', name:'Important', children:[
          {type:'file', name:'ABOUT ME.txt', data:"People who know me call me Search.\nIf you're searching for something, we already have something in common.\nCheck out my portfolio and discover the ideas I've come up with over these 11 years as a creative.\n"},
          {type:'file', name:'AWARDS AND RECOGNITIONS.txt', data:"AWARDS AND RECOGNITIONS\n— Cannes Lions (shortlists / wins across categories)\n— Effie Awards (Effectiveness accolades)\n— Local market recognitions across LatAm\n"}
        ]},
        {type:'dir', name:'Old Work', children:[]}
      ]},
      {type:'dir', name:'Folder 01', children:[]},
      {type:'dir', name:'Folder 02', children:[]},
      {type:'dir', name:'Folder 03', children:[]},
      {type:'dir', name:'Folder 04', children:[]},
      {type:'dir', name:'Folder 05', children:[]},
      {type:'dir', name:'Folder 06', children:[]},
      {type:'dir', name:'Folder 07', children:[]},
      {type:'dir', name:'Folder 08', children:[]},
      {type:'dir', name:'Folder 09', children:[]},
      {type:'dir', name:'Folder 10', children:[]}
    ]
  };
  const trashStack=[];
  function getNode(path){ let n=root; for(const p of path){ n=(n.children||[]).find(x=>x.name===p); if(!n) return null; } return n; }
  function list(path){ const n=getNode(path); return n&&n.children?n.children:[]; }
  function mkdir(path,name){ const n=getNode(path); if(n&&n.children) n.children.push({type:'dir',name,children:[]}); }
  function createFile(path,name,data){ const n=getNode(path); if(n&&n.children) n.children.push({type:'file',name,data}); }
  function move(fromPath,name,toPath){ const s=getNode(fromPath), d=getNode(toPath); if(!s||!d) return; const i=(s.children||[]).findIndex(x=>x.name===name); if(i<0) return; const node=s.children.splice(i,1)[0]; (d.children=d.children||[]).push(node); }
  function del(path,name){ const s=getNode(path), t=getNode(['Trash']); if(!s||!t) return; const i=(s.children||[]).findIndex(x=>x.name===name); if(i<0) return; const node=s.children.splice(i,1)[0]; (t.children=t.children||[]).push(node); trashStack.push(node); }
  function restoreLast(){ if(!trashStack.length) return; const node=trashStack.pop(); const my=getNode(['My PC']); (my.children=my.children||[]).push(node); const t=getNode(['Trash']); const idx=t.children.indexOf(node); if(idx>=0) t.children.splice(idx,1); }

  function populateFromRegistry(){
    for(let i=1;i<=10;i++){
      const name='Folder '+String(i).padStart(2,'0');
      const data = (window.__FOLDERS||{})[name];
      const folder = getNode([name]); if(!folder) continue;
      folder.children.length=0;
      if(data){
        (data.images||[]).forEach(im=> folder.children.push({type:'file', name:im.name, url:im.url, title:im.title}));
        if(data.video) folder.children.push({type:'video', name:data.video.name, url:data.video.url, title:data.video.title});
        if(Array.isArray(data.embeds)){ data.embeds.forEach(v=> folder.children.push({type:(/\.music$/i.test(v.name)?'music':'embed'), name:v.name, url:v.url, title:v.title})); }
        if(Array.isArray(data.videos)){ data.videos.forEach(v=> folder.children.push({type:'video', name:v.name, url:v.url, title:v.title})); }
      }
    }
    document.dispatchEvent(new CustomEvent('win95:contentLoaded'));
  }
  populateFromRegistry();

  window.fsList=list; window.fsMkdir=mkdir; window.fsCreateFile=createFile; window.fsDelete=del;
  window.fsMove=move; window.fsRestoreLast=restoreLast; window.fsGetNode=getNode;
  window.fsReloadContent=async()=>{ populateFromRegistry(); return {}; };
})();
