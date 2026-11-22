/* v2: postcard on the About page (tilt, stitched edge, garden), nav avatar */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var HOVER=matchMedia('(hover:hover)').matches;
  var clamp=function(v,a,b){a=a||0;b=b===undefined?1:b;return Math.max(a,Math.min(b,v));};
  var R=function(a,b){return a+Math.random()*(b-a);};

  /* face next to the name in the nav */
  function navAvatar(){
    var n=document.querySelector('.top .name'); if(!n||n.querySelector('.nav-av')) return;
    var im=document.createElement('img'); im.className='nav-av'; im.src='/img/pc-av.webp'; im.alt=''; im.width=28; im.height=28;
    n.insertBefore(im,n.firstChild);
  }

  function rnd(seed){return function(){seed=(seed*16807)%2147483647;return seed/2147483647;};}
  function deckle(w,h,amp,step,seed){var r=rnd(seed),pts=[];
    var edge=function(x0,y0,x1,y1,nx,ny){var L=Math.hypot(x1-x0,y1-y0),n=Math.max(2,Math.round(L/step));for(var i=0;i<n;i++){var t=i/n,o=(Math.sin(i*1.7)*.5+.5)*amp*.6+r()*amp*.7;pts.push([x0+(x1-x0)*t+nx*o,y0+(y1-y0)*t+ny*o]);}};
    edge(0,0,w,0,0,1);edge(w,0,w,h,-1,0);edge(w,h,0,h,0,-1);edge(0,h,0,0,1,0);
    return 'polygon('+pts.map(function(p){return p[0].toFixed(1)+'px '+p[1].toFixed(1)+'px';}).join(',')+')';}
  function rectPts(x,y,w,h,step){var p=[];var add=function(x0,y0,x1,y1){var n=Math.max(1,Math.round(Math.hypot(x1-x0,y1-y0)/step));for(var i=0;i<n;i++){var t=i/n;p.push([x0+(x1-x0)*t,y0+(y1-y0)*t]);}};add(x,y,x+w,y);add(x+w,y,x+w,y+h);add(x+w,y+h,x,y+h);add(x,y+h,x,y);return p;}
  function pathOf(pts){return 'M'+pts.map(function(p){return p[0].toFixed(1)+' '+p[1].toFixed(1);}).join(' L')+' Z';}

  var live=null;
  function initPostcard(){
    var sec=document.querySelector('.pcd'); if(!sec||sec.dataset.on) return; sec.dataset.on='1';
    if(live) live.stop();
    var q=function(s){return sec.querySelector(s);};
    var card=q('[data-pccard]'),lift=q('[data-pclift]'),bg=q('[data-pcbg]'),cv=q('[data-pcgarden]'),sv=q('[data-pcthreads]'),ph=q('[data-pcphoto]');
    var stopped=false;

    /* visitor's own day on the postmark and the To line */
    var d=new Date(),h=d.getHours(),part=h<5?'night':h<12?'morning':h<17?'afternoon':h<21?'evening':'night';
    q('[data-pcto]').textContent='this '+d.toLocaleDateString('en-US',{weekday:'long'})+' '+part;
    q('[data-pcdate]').textContent=d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'2-digit'}).toUpperCase();

    /* cut edge + running stitch */
    function build(){
      var w=card.offsetWidth,hh=card.offsetHeight; if(!w) return;
      card.style.setProperty('--deckle',deckle(w,hh,4.2,7,7));
      sv.setAttribute('viewBox','0 0 '+w+' '+hh); sv.setAttribute('width',w); sv.setAttribute('height',hh);
      var r=rnd(11),out='';
      var wob=rectPts(13,13,w-26,hh-26,22).map(function(p){return [p[0]+(r()-.5)*1.2,p[1]+(r()-.5)*1.2];});
      var seam=function(dd,col,dash){return '<path class="sh" d="'+dd+'" stroke-dasharray="'+dash+'"/><path class="st" d="'+dd+'" stroke="'+col+'" stroke-dasharray="'+dash+'"/><path class="hl" d="'+dd+'" stroke-dasharray="'+dash+'"/>';};
      out+=seam(pathOf(wob),'var(--thread)','8 6');
      var px=ph.offsetLeft,py=ph.offsetTop,pw=ph.offsetWidth,phh=ph.offsetHeight;
      [[px,py],[px+pw,py],[px+pw,py+phh]].forEach(function(c){var s=7;out+='<g transform="translate('+c[0]+' '+c[1]+')">'+seam('M'+(-s)+' '+(-s)+' L'+s+' '+s,'var(--thread2)','40 0')+seam('M'+s+' '+(-s)+' L'+(-s)+' '+s,'var(--thread2)','40 0')+'</g>';});
      sv.innerHTML=out;
    }
    var ro=new ResizeObserver(build); ro.observe(card);

    /* tilt: the side you press dips */
    function tilt(x,y){
      card.style.setProperty('--ry',((x-.5)*-22).toFixed(2)+'deg');card.style.setProperty('--rx',((y-.5)*16).toFixed(2)+'deg');card.style.setProperty('--tz','14px');
      card.style.setProperty('--gx',(100-x*100).toFixed(1)+'%');card.style.setProperty('--gy',(100-y*100).toFixed(1)+'%');card.style.setProperty('--go',1);
      card.style.setProperty('--sa',x<.5?'90deg':'270deg');
      lift.style.setProperty('--shx',((x-.5)*-30).toFixed(1)+'px');lift.style.setProperty('--shy',(30+(y-.5)*-16).toFixed(1)+'px');
    }
    function rest(){card.classList.remove('live');['--ry','--rx'].forEach(function(k){card.style.setProperty(k,'0deg');});card.style.setProperty('--tz','0px');card.style.setProperty('--go',0);lift.style.setProperty('--shx','0px');lift.style.setProperty('--shy','26px');}
    if(HOVER&&!RM){
      lift.addEventListener('pointerenter',function(){card.classList.add('live');});
      lift.addEventListener('pointermove',function(e){var r=card.getBoundingClientRect();tilt(clamp((e.clientX-r.left)/r.width),clamp((e.clientY-r.top)/r.height));});
      lift.addEventListener('pointerleave',rest);
      sec.addEventListener('pointermove',function(e){var x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;bg.style.translate=(-x*16).toFixed(1)+'px '+(-y*9).toFixed(1)+'px';});
    }

    /* garden: flowers bloom where you move */
    var cx=cv.getContext('2d'),W=0,H=0,flowers=[],petals=[];
    var PAL=[['#FFF8EE','#F2B33D'],['#F6C1B0','#E8833A'],['#A9B2EE','#F4D35E'],['#FFFFFF','#E8A33C'],['#F3D35A','#C9772B'],['#E98B8B','#F7D36B'],['#7DB7E8','#FFF4D6']];
    function size(){var D=Math.min(2,devicePixelRatio||1);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*D;cv.height=H*D;cx.setTransform(D,0,0,D,0,0);}
    size(); var onR=function(){size();}; addEventListener('resize',onR);
    var hz=function(){return H*.55;};
    function addFlower(x,y){var c=PAL[(Math.random()*PAL.length)|0],dp=clamp((y-hz())/(H-hz())),s=(6+dp*16)*R(.8,1.2);
      flowers.push({x:x,y:y,s:s,h:s*R(2.2,4.2),pc:c[0],cc:c[1],n:Math.random()<.5?5:6,rot:R(0,6.28),ph:R(0,6.28),t0:performance.now(),die:0,lean:R(-.25,.25)});
      if(flowers.length>260){for(var i=0;i<flowers.length;i++){if(!flowers[i].die){flowers[i].die=performance.now();break;}}}}
    function addPetal(x,y){var c=PAL[(Math.random()*PAL.length)|0];petals.push({x:x,y:y,vx:R(.3,1.2),vy:R(-.4,.2),r:R(3,6),rot:R(0,6.28),vr:R(-.05,.05),c:c[0],t0:performance.now()});if(petals.length>140)petals.shift();}
    var lx=-999,ly=-999;
    if(!RM) sec.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,dd=Math.hypot(x-lx,y-ly);if(dd<22)return;lx=x;ly=y;
      if(e.target.closest&&e.target.closest('[data-pccard]'))return;
      if(y>hz()+6){addFlower(x+R(-22,22),y+R(-8,14));if(dd>60)addFlower(x+R(-22,22),y+R(-8,14));}else{addPetal(x+R(-10,10),y+R(-10,10));addPetal(x+R(-10,10),y+R(-10,10));}});
    var eb=function(t){t=Math.min(1,t);var c=1.6;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);};
    function drawFlower(f,now){var age=(now-f.t0)/900,g=eb(age);if(g<=0)return;var a=1;if(f.die){a=1-(now-f.die)/900;if(a<=0){f.dead=1;return;}}
      var sw=Math.sin(now/1400+f.ph)*f.s*.18,hx=f.x+f.lean*f.h+sw,hy=f.y-f.h*Math.min(1,age*1.4);
      cx.globalAlpha=a;cx.strokeStyle='rgba(86,110,40,.9)';cx.lineWidth=Math.max(1.2,f.s*.13);cx.lineCap='round';cx.beginPath();cx.moveTo(f.x,f.y);cx.quadraticCurveTo(f.x+f.lean*f.h*.3,f.y-f.h*.5,hx,hy);cx.stroke();
      var r=f.s*g;if(r<.5){cx.globalAlpha=1;return;}
      cx.save();cx.translate(hx,hy);cx.rotate(f.rot+sw*.02);
      for(var i=0;i<f.n;i++){cx.save();cx.rotate(i/f.n*6.283);cx.fillStyle=f.pc;cx.globalAlpha=a*.95;cx.beginPath();cx.ellipse(r*.62,0,r*.62,r*.36,0,0,6.28);cx.fill();cx.restore();}
      cx.globalAlpha=a;cx.fillStyle=f.cc;cx.beginPath();cx.arc(0,0,r*.3,0,6.28);cx.fill();cx.restore();cx.globalAlpha=1;}
    function drawPetal(p,now){var age=(now-p.t0)/1000;if(age>6){p.dead=1;return;}p.x+=p.vx+Math.sin(now/600+p.rot)*.4;p.y+=p.vy+.25;p.rot+=p.vr;
      cx.globalAlpha=Math.max(0,1-age/6)*.9;cx.fillStyle=p.c;cx.save();cx.translate(p.x,p.y);cx.rotate(p.rot);cx.beginPath();cx.ellipse(0,0,p.r,p.r*.55,0,0,6.28);cx.fill();cx.restore();cx.globalAlpha=1;}
    function loop(now){ if(stopped) return; if(!sec.isConnected){live.stop();return;}
      cx.clearRect(0,0,W,H);flowers.sort(function(a,b){return a.y-b.y;});flowers.forEach(function(f){drawFlower(f,now);});petals.forEach(function(p){drawPetal(p,now);});
      flowers=flowers.filter(function(f){return !f.dead;});petals=petals.filter(function(p){return !p.dead;});requestAnimationFrame(loop);}
    requestAnimationFrame(loop);

    live={stop:function(){stopped=true;ro.disconnect();removeEventListener('resize',onR);live=null;}};

    /* arrive: drop the card in, then a row of flowers along the bottom */
    if(!RM){ sec.classList.add('in');
      setTimeout(function(){var n=22;for(var i=0;i<n;i++)(function(i){setTimeout(function(){var t=i/(n-1),x=W*(.04+t*.92),y=H*(.86+Math.sin(t*5.5)*.05)+R(-8,8);addFlower(x,y);},i*45);})(i);},700); }
    q('[data-pccue]').addEventListener('click',function(e){e.preventDefault();var s=document.getElementById('story');if(s)s.scrollIntoView({behavior:RM?'auto':'smooth'});});
  }

  function tick(){navAvatar();initPostcard();}
  var app=document.getElementById('app');
  if(app) new MutationObserver(tick).observe(app,{childList:true});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',tick); else tick();
})();
