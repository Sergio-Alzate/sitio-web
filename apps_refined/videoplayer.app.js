
registerApp('videoplayer', function(){
  const wrap=document.createElement('div'); wrap.style.height='100%'; wrap.style.display='flex'; wrap.style.flexDirection='column';
  const info=document.createElement('div'); info.className='toolbar'; info.textContent='Vimeo Player';
  const frame=document.createElement('iframe'); frame.allow='autoplay; fullscreen; picture-in-picture'; frame.style.border='0'; frame.style.width='100%'; frame.style.height='100%';
  const url=window.__videoUrl||'https://player.vimeo.com/video/1078828956'; frame.src=url;
  wrap.append(info, frame);
  return createWindow({title:'Video', content:wrap, appId:'videoplayer', width:800, height:480});
});
