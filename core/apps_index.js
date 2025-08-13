
window.Apps = {};
window.registerApp = (name, fn)=>{ window.Apps[name]=fn; };
window.openApp = (name, opts={})=>{
  const fn = window.Apps[name];
  if(!fn){ alert('App not found: '+name); return null; }
  return fn(opts);
};
