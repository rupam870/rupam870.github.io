/* v5: hover a word in the hero, a taped photo of it floats up next to your cursor */
(function(){
  /* swap ATLABS_TEAM for a real team photo when there is one */
  var ATLABS_TEAM=null;
  function S(k){return (window.IMG&&IMG[k])?IMG[k].src:(typeof IMG!=='undefined'&&IMG[k]?IMG[k].src:'');}
  function sets(){return {
    me:[{src:S('abPortrait'),cap:'the unpainted version'}],
    atlabs:ATLABS_TEAM?[{src:ATLABS_TEAM,cap:'the Atlabs team'}]:[{src:'/img/vt_teaser.webp',cap:'Atlabs, where I design now',wide:1},{src:'/img/ed_story.webp',cap:'the editor',wide:1}],
    startups:[{src:S('abExplorin'),cap:'Explorin'},{src:S('abClearfeed'),cap:'ClearFeed'},{src:S('abXalts'),cap:'Xalts'},{src:S('abEsummit'),cap:'E-Summit ’24'}],
    award:[{src:S('abDesignathon'),cap:'Adobe Designathon ’24',tall:1}],
    iitr:[{src:'/img/pl-ph-roorkee.webp',cap:'IIT Roorkee, 2020–25'}]
  };}
  window.__peekSets=function(){return sets();};
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches, FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
  /* warm the cache so photos appear instantly */
  var pre={};function warm(k){if(pre[k])return;pre[k]=1;var a=sets()[k]||[];a.forEach(function(it){var im=new Image();im.decoding='async';im.src=it.src;});}function warmAll(){var a=sets();for(var k in a)warm(k);}if(document.readyState==='complete')setTimeout(warmAll,1500);else addEventListener('load',function(){setTimeout(warmAll,1500);});document.addEventListener('pointerover',function(e){var t=e.target.closest&&e.target.closest('.pk[data-peek]');if(t)warm(t.dataset.peek);},{passive:true});document.addEventListener('focusin',function(e){var t=e.target.closest&&e.target.closest('.pk[data-peek]');if(t)warm(t.dataset.peek);});
  var peek=document.createElement('div');peek.className='peek';peek.setAttribute('aria-hidden','true');document.body.appendChild(peek);
  var x=0,y=0,tx=0,ty=0,on=false,cur=null,raf=0;
  function build(key){
    var list=sets()[key]||[];peek.innerHTML='';peek.dataset.n=list.length;
    list.forEach(function(it,i){var c=document.createElement('figure');c.className='pk-card'+(it.wide?' wide':'')+(it.tall?' tall':'');
      var n=list.length,rot=n>1?(i-(n-1)/2)*9:-4,dx=n>1?(i-(n-1)/2)*58:0,dy=n>1?Math.abs(i-(n-1)/2)*10:0;
      c.style.setProperty('--r',rot+'deg');c.style.setProperty('--dx',dx+'px');c.style.setProperty('--dy',dy+'px');c.style.setProperty('--d',(i*45)+'ms');
      c.innerHTML='<span class="pk-tape"></span><img src="'+it.src+'" alt=""><figcaption>'+it.cap+'</figcaption>';peek.appendChild(c);});
  }
  function loop(){x+=(tx-x)*(RM?1:.18);y+=(ty-y)*(RM?1:.18);peek.style.transform='translate('+x+'px,'+y+'px)';if(on||Math.abs(tx-x)>.5)raf=requestAnimationFrame(loop);else raf=0;}
  function place(cx,cy){var w=peek.offsetWidth||240,h=peek.offsetHeight||260;var nx=cx+28,ny=cy-h-18;if(nx+w>innerWidth-12)nx=cx-w-28;if(ny<12)ny=cy+28;tx=nx;ty=ny;}
  function show(el,cx,cy){var key=el.dataset.peek;if(cur!==key){build(key);cur=key;}place(cx,cy);if(!on){x=tx;y=ty+14;}on=true;peek.classList.add('on');document.querySelectorAll('.pk.act').forEach(function(a){a.classList.remove('act');});el.classList.add('act');if(!raf)raf=requestAnimationFrame(loop);}
  function hide(){on=false;peek.classList.remove('on');cur=null;document.querySelectorAll('.pk.act').forEach(function(a){a.classList.remove('act');});}
  document.addEventListener('pointerover',function(e){var el=e.target.closest&&e.target.closest('.pk');if(el&&FINE)show(el,e.clientX,e.clientY);});
  document.addEventListener('pointermove',function(e){if(!on||!FINE)return;var el=e.target.closest&&e.target.closest('.pk');if(el)place(e.clientX,e.clientY);else hide();});
  document.addEventListener('focusin',function(e){var el=e.target.closest&&e.target.closest('.pk');if(el){var r=el.getBoundingClientRect();show(el,r.left+r.width/2,r.top);}});
  document.addEventListener('focusout',function(e){if(e.target.closest&&e.target.closest('.pk'))hide();});
  /* touch: tap a word to see it, tap anywhere else to close */
  document.addEventListener('click',function(e){var el=e.target.closest&&e.target.closest('.pk');if(el&&window.__openPeek){e.preventDefault();hide();window.__openPeek(el.dataset.peek);}});
  document.addEventListener('keydown',function(e){var el=e.target.closest&&e.target.closest('.pk');if(el&&(e.key==='Enter'||e.key===' ')&&window.__openPeek){e.preventDefault();hide();window.__openPeek(el.dataset.peek);}});
  addEventListener('scroll',function(){if(on&&!FINE)hide();},{passive:true});
  addEventListener('rw:route',hide);addEventListener('hashchange',hide);
})();
