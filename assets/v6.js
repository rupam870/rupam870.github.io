/* v6 — loading screen: the meadow paints itself in, I land on the hill, a plane flies Gurgaon → San Francisco */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var home=!location.hash||location.hash==='#/'||location.hash==='#';
  var seen=false;try{seen=sessionStorage.getItem('rw-pre')==='1';}catch(e){}
  if(RM||!home||seen||/[?&]nopre/.test(location.search))return;
  try{sessionStorage.setItem('rw-pre','1');}catch(e){}

  var el=document.createElement('div');el.className='pre';el.setAttribute('aria-hidden','true');
  el.innerHTML='<canvas class="pre-paint"></canvas><canvas class="pre-flow"></canvas>'+
   '<svg class="pre-route" viewBox="0 0 1000 300" preserveAspectRatio="none"><path d="M90 250 C 330 40, 690 30, 910 170"/></svg>'+
   '<span class="pre-pin a">Gurgaon<i>now</i></span><span class="pre-pin b">San Francisco<i>next</i></span>'+
   '<span class="pre-plane"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" transform="rotate(90 12 12)"/></svg></span>'+
   '<figure class="pre-me"><span class="tape"></span><img src="/img/pc-me.webp" alt=""><figcaption>me, on my way</figcaption></figure>'+
   '<div class="pre-copy"><p class="pre-k">painting the meadow <b>0%</b></p><p class="pre-h"><span>Building</span> <span>a</span> <em>big</em> <span>life.</span></p></div>'+
   '<button class="pre-skip" type="button">skip</button>';
  document.documentElement.classList.add('pre-on');
  document.body.appendChild(el);

  var cv=el.querySelector('.pre-paint'),cx=cv.getContext('2d'),fl=el.querySelector('.pre-flow'),fx=fl.getContext('2d');
  var mask=document.createElement('canvas'),mx=mask.getContext('2d');
  var W,H,D=Math.min(2,devicePixelRatio||1);
  function size(){W=innerWidth;H=innerHeight;[cv,fl,mask].forEach(function(c){c.width=W*D;c.height=H*D;});[cx,fx,mx].forEach(function(c){c.setTransform(D,0,0,D,0,0);});}
  size();
  var img=new Image();img.src='/img/pc-grass.webp';
  var me=new Image();me.src='/img/pc-me.webp';

  /* brush strokes: bottom of the meadow first, then up into the sky */
  var R=function(a,b){return a+Math.random()*(b-a);};
  var strokes=[],N=W<700?16:24;
  for(var i=0;i<N;i++){var t=i/(N-1),y=H*(1.02-t*1.08)+R(-20,20),dir=i%2?1:-1,pts=[];
    for(var k=0;k<=8;k++){var u=k/8;pts.push([dir>0?-80+u*(W+160):W+80-u*(W+160),y+Math.sin(u*Math.PI*R(1,2.2))*R(14,38)]);}
    strokes.push({pts:pts,w:R(.9,1.4)*Math.max(70,H/N*2.1),t0:i*42,dur:R(260,380)});}
  var PAINT=strokes[strokes.length-1].t0+380;

  function cover(c,im){var ir=im.width/im.height,r=W/H,sw=im.width,sh=im.height,sx=0,sy=0;if(ir>r){sw=im.height*r;sx=(im.width-sw)*.55;}else{sh=im.width/r;sy=(im.height-sh)*.8;}c.drawImage(im,sx,sy,sw,sh,0,0,W,H);}
  function drawMask(now){mx.lineCap='round';mx.lineJoin='round';
    strokes.forEach(function(s){var p=Math.min(1,Math.max(0,(now-s.t0)/s.dur));if(p<=0||s.done)return;var n=Math.max(1,Math.floor(p*8));
      mx.strokeStyle='rgba(0,0,0,.95)';mx.lineWidth=s.w;mx.beginPath();mx.moveTo(s.pts[0][0],s.pts[0][1]);for(var k=1;k<=n;k++)mx.lineTo(s.pts[k][0],s.pts[k][1]);mx.stroke();
      /* bristles */
      mx.lineWidth=2;mx.strokeStyle='rgba(0,0,0,.5)';for(var b=0;b<5;b++){var off=R(-.55,.55)*s.w;mx.beginPath();mx.moveTo(s.pts[0][0],s.pts[0][1]+off);for(var k=1;k<=n;k++)mx.lineTo(s.pts[k][0],s.pts[k][1]+off+R(-2,2));mx.stroke();}
      if(p>=1)s.done=true;});}

  /* flowers */
  var PAL=[['#FFF8EE','#F2B33D'],['#F6C1B0','#E8833A'],['#A9B2EE','#F4D35E'],['#FFFFFF','#E8A33C'],['#F3D35A','#C9772B'],['#E98B8B','#F7D36B'],['#7DB7E8','#FFF4D6']];
  var flowers=[];
  function bloomRow(t0){var n=W<700?12:22;for(var i=0;i<n;i++){var c=PAL[(Math.random()*PAL.length)|0],x=W*(.03+i/(n-1)*.94)+R(-20,20),y=H*R(.84,.97),s=R(9,17);
    flowers.push({x:x,y:y,s:s,h:s*R(2.4,4),pc:c[0],cc:c[1],t0:t0+i*30,rot:R(0,6.28),lean:R(-.2,.2)});}}
  var eb=function(t){t=Math.min(1,t);var c=1.6;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);};
  function drawFlowers(now){fx.clearRect(0,0,W,H);flowers.forEach(function(f){var a=(now-f.t0)/700;if(a<=0)return;var g=eb(a),hx=f.x+f.lean*f.h,hy=f.y-f.h*Math.min(1,a*1.5);
    fx.strokeStyle='rgba(86,110,40,.9)';fx.lineWidth=Math.max(1.4,f.s*.13);fx.lineCap='round';fx.beginPath();fx.moveTo(f.x,f.y);fx.quadraticCurveTo(f.x,f.y-f.h*.5,hx,hy);fx.stroke();
    var r=f.s*g;fx.save();fx.translate(hx,hy);fx.rotate(f.rot);for(var i=0;i<5;i++){fx.save();fx.rotate(i/5*6.283);fx.fillStyle=f.pc;fx.beginPath();fx.ellipse(r*.62,0,r*.62,r*.36,0,0,6.28);fx.fill();fx.restore();}
    fx.fillStyle=f.cc;fx.beginPath();fx.arc(0,0,r*.3,0,6.28);fx.fill();fx.restore();});}

  var k=el.querySelector('.pre-k b'),start=0,phase=0,doneAt=0,closed=false;
  function close(){if(closed)return;closed=true;el.classList.add('out');document.documentElement.classList.remove('pre-on');setTimeout(function(){el.remove();},700);}
  el.querySelector('.pre-skip').addEventListener('click',close);el.addEventListener('click',function(e){if(phase>=1)close();});
  addEventListener('keydown',function(e){if(e.key==='Escape')close();},{once:true});

  function frame(now){if(closed)return;if(!start)start=now;var t=now-start;
    if(img.complete&&img.naturalWidth){drawMask(t);cx.clearRect(0,0,W,H);cx.globalCompositeOperation='source-over';cx.drawImage(mask,0,0,W,H);cx.globalCompositeOperation='source-in';cover(cx,img);cx.globalCompositeOperation='source-over';}
    var pct=Math.min(100,Math.round(t/PAINT*100));k.textContent=pct+'%';
    if(t>PAINT*.55&&phase<1){phase=1;el.classList.add('me');}
    if(t>PAINT&&phase<2){phase=2;el.classList.add('fly');bloomRow(now);k.parentNode.innerHTML='Gurgaon <span class="arr">→</span> San Francisco';}
    if(phase>=2)drawFlowers(now);
    if(phase===2&&t>PAINT+1150){phase=3;doneAt=now;}
    if(phase===3&&now-doneAt>650){close();return;}
    requestAnimationFrame(frame);}
  /* never hold anyone longer than 3.6s, even on a slow network */
  setTimeout(close,3600);
  var go=function(){requestAnimationFrame(frame);};
  if(img.complete)go();else{img.onload=go;img.onerror=close;setTimeout(function(){if(!start)go();},400);}
})();
