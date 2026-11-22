/* v3: flowers bloom along the painted horizon on the home page */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches; if(RM) return;
  var R=function(a,b){return a+Math.random()*(b-a);};
  var PAL=[['#FFF8EE','#F2B33D'],['#F6C1B0','#E8833A'],['#A9B2EE','#F4D35E'],['#FFFFFF','#E8A33C'],['#F3D35A','#C9772B'],['#E98B8B','#F7D36B'],['#7DB7E8','#FFF4D6']];
  var stop=null;
  function init(){
    var intro=document.querySelector('.intro.v2'); if(!intro||intro.dataset.bloom) return; intro.dataset.bloom='1';
    if(stop) stop();
    var cv=document.createElement('canvas'); cv.className='hz-garden'; cv.setAttribute('aria-hidden','true'); intro.appendChild(cv);
    var cx=cv.getContext('2d'),W=0,H=0,fl=[],dead=false;
    function size(){var D=Math.min(2,devicePixelRatio||1);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*D;cv.height=H*D;cx.setTransform(D,0,0,D,0,0);}
    size(); addEventListener('resize',size);
    function add(x,y){var c=PAL[(Math.random()*PAL.length)|0],s=R(7,15)*(.7+y/H*.6);fl.push({x:x,y:y,s:s,h:s*R(2.2,3.8),pc:c[0],cc:c[1],n:Math.random()<.5?5:6,rot:R(0,6.28),ph:R(0,6.28),t0:performance.now(),lean:R(-.25,.25)});if(fl.length>160)fl.shift();}
    var lx=-999;
    intro.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;if(y<H*.35||y>H||Math.abs(x-lx)<20)return;lx=x;add(x+R(-16,16),y+R(-6,10));});
    var eb=function(t){t=Math.min(1,t);var c=1.6;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);};
    function draw(now){ if(dead) return; if(!cv.isConnected){stop();return;}
      cx.clearRect(0,0,W,H); fl.sort(function(a,b){return a.y-b.y;});
      fl.forEach(function(f){var age=(now-f.t0)/900,g=eb(age);if(g<=0)return;var sw=Math.sin(now/1400+f.ph)*f.s*.18,hx=f.x+f.lean*f.h+sw,hy=f.y-f.h*Math.min(1,age*1.4);
        cx.strokeStyle='rgba(86,110,40,.9)';cx.lineWidth=Math.max(1.2,f.s*.13);cx.lineCap='round';cx.beginPath();cx.moveTo(f.x,f.y);cx.quadraticCurveTo(f.x+f.lean*f.h*.3,f.y-f.h*.5,hx,hy);cx.stroke();
        var r=f.s*g;cx.save();cx.translate(hx,hy);cx.rotate(f.rot);for(var i=0;i<f.n;i++){cx.save();cx.rotate(i/f.n*6.283);cx.fillStyle=f.pc;cx.beginPath();cx.ellipse(r*.62,0,r*.62,r*.36,0,0,6.28);cx.fill();cx.restore();}
        cx.fillStyle=f.cc;cx.beginPath();cx.arc(0,0,r*.3,0,6.28);cx.fill();cx.restore();});
      requestAnimationFrame(draw);}
    requestAnimationFrame(draw);
    stop=function(){dead=true;removeEventListener('resize',size);stop=null;};
    setTimeout(function(){for(var i=0;i<14;i++)(function(i){setTimeout(function(){add(W*(.04+i/13*.92)+R(-20,20),H*R(.72,.92));},i*60);})(i);},600);
  }
  var app=document.getElementById('app'); if(app) new MutationObserver(init).observe(app,{childList:true});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
