registerApp('doom', function(){
  const wrap = document.createElement('div');
  wrap.style.height = '100%';
  wrap.style.display = 'flex';
  wrap.style.flexDirection = 'column';

  const frame = document.createElement('iframe');
  frame.src = 'https://raz0red.github.io/webprboom/'; // WebPrBoom hosted version
  frame.style.border = '0';
  frame.style.flex = '1';
  frame.allowFullscreen = true;

  wrap.appendChild(frame);

  const w = createWindow({
    title: 'DOOM',
    content: wrap,
    appId: 'doom',
    width: 960,
    height: 720
  });

  return w;
});