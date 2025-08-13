
window.addEventListener('DOMContentLoaded', ()=>{
  const w=openApp('notepad_pro');
  if(w && w.loadFromHTML){
    const html = "<p><strong>Sergio Alzate// Creative Director</strong></p>"+
      "<p>People who know me call me Search. If you're searching for something, we already have something in common. Check out my portfolio and discover the ideas I've come up with over these 11 years as a creative.</p>";
    w.loadFromHTML('Welcome', html);
  }

  // Auto-open Paint with startup image
  const paintWin = openApp('paint');
  if(paintWin && typeof paintWin.loadImageFrom === 'function'){
    // Defer to ensure canvas finished initial layout/resize
    requestAnimationFrame(()=>{
      setTimeout(()=>paintWin.loadImageFrom('assets/startup-image.png'), 300);
      // Retry once more in case a resize cleared it
      setTimeout(()=>paintWin.loadImageFrom('assets/startup-image.png'), 1200);
    });
  }
});
