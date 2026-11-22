/* v7: click a highlighted word → its photos open big; peeking wordmark in the nav */
(function(){
  /* ---------- photo viewer ---------- */
  var box=document.createElement('div');box.className='pv';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Photo');box.hidden=true;
  box.innerHTML='<button class="pv-x" type="button" aria-label="Close">×</button>'+
    '<button class="pv-nav prev" type="button" aria-label="Previous photo">←</button>'+
    '<figure class="pv-card"><span class="pv-tape"></span><img alt=""><figcaption><b></b><span class="pv-n"></span></figcaption></figure>'+
    '<button class="pv-nav next" type="button" aria-label="Next photo">→</button>';
  document.body.appendChild(box);
  var img=box.querySelector('img'),cap=box.querySelector('figcaption b'),cnt=box.querySelector('.pv-n'),card=box.querySelector('.pv-card'),list=[],i=0,last=null;
  function show(){var it=list[i];card.classList.remove('in');void card.offsetWidth;img.src=it.src;img.alt=it.cap;cap.textContent=it.cap;cnt.textContent=list.length>1?(i+1)+' / '+list.length:'';
    card.style.setProperty('--r',((i%2?1:-1)*(1.5+i%3))+'deg');card.classList.add('in');box.classList.toggle('multi',list.length>1);}
  window.__openPeek=function(key){var all=window.__peekSets?window.__peekSets():{};list=all[key]||[];if(!list.length)return;i=0;last=document.activeElement;box.hidden=false;
    requestAnimationFrame(function(){box.classList.add('on');});document.documentElement.classList.add('pv-lock');show();box.querySelector('.pv-x').focus();};
  function close(){box.classList.remove('on');document.documentElement.classList.remove('pv-lock');setTimeout(function(){box.hidden=true;},250);if(last&&last.focus)last.focus();}
  function step(d){if(list.length<2)return;i=(i+d+list.length)%list.length;show();}
  box.addEventListener('click',function(e){if(e.target===box)close();});
  box.querySelector('.pv-x').addEventListener('click',close);
  box.querySelector('.prev').addEventListener('click',function(){step(-1);});
  box.querySelector('.next').addEventListener('click',function(){step(1);});
  addEventListener('keydown',function(e){if(box.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1);});
  var sx=0;box.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});
  box.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)step(dx<0?1:-1);});

  /* ---------- peeking wordmark in the nav (uses the main font) ---------- */
  function wm(){var n=document.querySelector('.top .name');if(!n||n.querySelector('.wm'))return;
    n.setAttribute('aria-label','Rupam Gumber, home');
    n.innerHTML='<img class="wm wm-stamp" src="/favicon.svg" width="44" height="44" alt="">';n.setAttribute('aria-label','Rupam, home');}
  wm();
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!RM)addEventListener('pointermove',function(e){document.querySelectorAll('.wm .eye').forEach(function(el){var r=el.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),d=Math.hypot(dx,dy)||1,m=r.width*.22,k=Math.min(1,d/160);
    el.firstChild.style.transform='translate('+(dx/d*m*k).toFixed(2)+'px,'+(dy/d*m*k).toFixed(2)+'px)';});},{passive:true});
})();

/* videos: load and play only while visible */
(function(){if(!('IntersectionObserver' in window))return;
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;
    if(e.isIntersecting){if(v.preload==='none')v.preload='auto';if(!RM){var p=v.play();if(p&&p.catch)p.catch(function(){});}}else if(!v.paused)v.pause();});},{rootMargin:'200px 0px'});
  function scan(){document.querySelectorAll('video[data-ap]:not([data-apw])').forEach(function(v){v.setAttribute('data-apw','');io.observe(v);});}
  scan();new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});
})();
