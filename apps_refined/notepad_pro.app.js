
registerApp('notepad_pro', function(){
  const wrap=document.createElement('div'); wrap.style.display='flex'; wrap.style.flexDirection='column'; wrap.style.height='100%';
  const tb=document.createElement('div'); tb.className='toolbar';
  function B(t,fn,tt){ const b=document.createElement('button'); b.textContent=t; if(tt) b.title=tt; b.addEventListener('click', fn); return b; }
  const ed=document.createElement('div'); ed.className='notepad-editor'; ed.contentEditable='true'; ed.style.flex='1'; ed.style.minHeight='300px'; ed.style.overflowY='auto';
  const st=document.createElement('div'); st.className='statusbar'; st.textContent='Ready';
  const bNew=B('New', ()=>{ if(confirm('Clear document?')){ ed.innerHTML=''; update(); } });
  const bSaveTxt=B('Save .txt', ()=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([ed.innerText],{type:'text/plain'})); a.download='note.txt'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); });
  const bSaveHTML=B('Save .html', ()=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob(['<!DOCTYPE html><meta charset=utf-8>'+ed.innerHTML],{type:'text/html'})); a.download='note.html'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); });
  const bB=B('B', ()=>document.execCommand('bold'), 'Bold'); const bI=B('I', ()=>document.execCommand('italic'),'Italic'); const bU=B('U', ()=>document.execCommand('underline'),'Underline');
  tb.append(bNew,bSaveTxt,bSaveHTML,bB,bI,bU); wrap.append(tb,ed,st);
  function update(){ const t=ed.innerText.trim(); st.textContent='Words: '+(t? t.split(/\s+/).length:0)+' | Chars: '+t.length; }
  ed.addEventListener('input', update);
  const w=createWindow({title:'NotePad', content:wrap, appId:'notepad_pro', width:720, height:520});
  w.loadFromString=(name,text)=>{ w.querySelector('.title').textContent=(name?name+' — ':'')+'NotePad'; ed.textContent=text||''; update(); ed.focus(); };
  w.loadFromHTML=(name,html)=>{ w.querySelector('.title').textContent=(name?name+' — ':'')+'NotePad'; ed.innerHTML=html||''; update(); ed.focus(); };
  setTimeout(()=>ed.focus(),50);
  return w;
});
