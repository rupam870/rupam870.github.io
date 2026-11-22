/* trail cursor */
(function(){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root=document.createElement('span'); root.className='tc'; root.setAttribute('aria-hidden','true');
  var N=6, ops=[.85,.7,.55,.4,.28,.16], h='<span class="tc-verb"><span class="tc-verb__in"><span class="tc-verb__w"></span></span></span><span class="tc-trail">';
  for(var i=0;i<N;i++) h+='<span class="tc-trail__dot" style="opacity:'+ops[i]+'"></span>';
  h+='</span><span class="tc-ball"><span class="tc-ball__in"><span class="tc-ball__dot"></span></span></span>';
  root.innerHTML=h;
  function mount(){ document.body.appendChild(root); document.documentElement.classList.add('tc-on'); }
  if(document.body) mount(); else document.addEventListener('DOMContentLoaded',mount);
  var ball=root.querySelector('.tc-ball'), verb=root.querySelector('.tc-verb'), word=root.querySelector('.tc-verb__w'), dots=[].slice.call(root.querySelectorAll('.tc-trail__dot'));
  var mx=-100,my=-100,pts=[];for(i=0;i<N;i++)pts.push({x:-100,y:-100});
  var vx=-100,vy=-100,raf=0,last=0;
  function tick(t){
    ball.style.transform='translate('+mx+'px,'+my+'px)';
    vx+=(mx-vx)*.35; vy+=(my-vy)*.35; verb.style.transform='translate('+vx+'px,'+vy+'px)';
    var px=mx,py=my;
    for(var i=0;i<N;i++){var p=pts[i],k=RM?1:.42; p.x+=(px-p.x)*k; p.y+=(py-p.y)*k; dots[i].style.transform='translate('+p.x+'px,'+p.y+'px) scale('+(1-i*.1)+')'; px=p.x; py=p.y;}
    var still=Math.abs(pts[N-1].x-mx)<.3&&Math.abs(pts[N-1].y-my)<.3&&Math.abs(vx-mx)<.3;
    raf=still?0:requestAnimationFrame(tick);
  }
  function go(){ if(!raf) raf=requestAnimationFrame(tick); }
  function verbFor(t){
    if(!t||!t.closest) return '';
    var e=t.closest('[data-cursor]'); if(e) return e.dataset.cursor;
    if(t.closest('input,textarea,select,[contenteditable="true"]')) return '';
    if(t.closest('.pk')) return 'peek';
    if(t.closest('[data-zoom],.pc,.zoom')) return t.closest('.comp-tile a.case, .comp-tile')&&t.closest('.comp-tile').querySelector('a.case')?'read':'zoom';
    e=t.closest('[data-label]'); if(e){var l=(e.dataset.label||'').replace(/[↗→]/g,'').trim().toLowerCase(); if(/case study/.test(l)) return 'read'; return l.split(' ')[0]||'open';}
    e=t.closest('a[href]'); if(e) return (e.target==='_blank'||/^https?:/.test(e.getAttribute('href'))&&e.host!==location.host)?'visit':'open';
    if(t.closest('button,[role="button"],summary,label')) return 'click';
    return '';
  }
  var cur='';
  document.addEventListener('mousemove',function(e){
    mx=e.clientX; my=e.clientY; root.classList.add('on');
    var v=verbFor(e.target); if(v!==cur){cur=v; if(v) word.textContent=v; root.classList.toggle('verb',!!v);}
    go();
  },{passive:true});
  document.addEventListener('mousedown',function(){root.classList.add('down')});
  document.addEventListener('mouseup',function(){root.classList.remove('down')});
  document.documentElement.addEventListener('mouseleave',function(){root.classList.remove('on')});
  addEventListener('blur',function(){root.classList.remove('on')});
})();
