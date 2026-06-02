(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* intro */
  window.addEventListener('load',function(){
    setTimeout(function(){
      document.body.classList.remove('loading');
      document.body.classList.add('loaded');
    }, reduce?0:650);
  });
  // fallback if load is slow
  setTimeout(function(){
    if(document.body.classList.contains('loading')){
      document.body.classList.remove('loading');document.body.classList.add('loaded');
    }
  },2500);

  /* custom cursor */
  var dot=document.querySelector('.cur-dot'),ring=document.querySelector('.cur-ring');
  var mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  if(!('ontouchstart' in window)){
    addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;
      dot.style.transform='translate('+mx+'px,'+my+'px) translate(-50%,-50%)';});
    (function loop(){rx+=(mx-rx)*.18;ry+=(my-ry)*.18;
      ring.style.transform='translate('+rx+'px,'+ry+'px) translate(-50%,-50%)';requestAnimationFrame(loop);})();
    document.querySelectorAll('a,button,.card,[data-tilt],.chip,.skill-card').forEach(function(el){
      el.addEventListener('mouseenter',function(){ring.classList.add('hov');dot.classList.add('hov');});
      el.addEventListener('mouseleave',function(){ring.classList.remove('hov');dot.classList.remove('hov');});
    });
  }

  /* scroll progress */
  var prog=document.querySelector('.progress');
  addEventListener('scroll',function(){
    var h=document.documentElement.scrollHeight-innerHeight;
    prog.style.width=(scrollY/h*100)+'%';
  },{passive:true});

  /* reveal on scroll */
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.rv').forEach(function(el){io.observe(el);});

  /* parallax on scroll */
  var pels=[].slice.call(document.querySelectorAll('[data-parallax]'));
  function parallax(){
    var vy=scrollY;
    pels.forEach(function(el){
      var sp=parseFloat(el.getAttribute('data-parallax'));
      var rect=el.getBoundingClientRect();
      var off=(rect.top+vy - innerHeight) * sp;
      el.style.transform='translate3d(0,'+(-(vy*sp*0.4))+'px,0)';
    });
  }
  if(!reduce){addEventListener('scroll',parallax,{passive:true});parallax();}

  /* 3D tilt: cards + hero photo */
  function bindTilt(el,max){
    el.addEventListener('mousemove',function(e){
      var r=el.getBoundingClientRect();
      var px=(e.clientX-r.left)/r.width-.5;
      var py=(e.clientY-r.top)/r.height-.5;
      el.style.transform='perspective(900px) rotateY('+(px*max)+'deg) rotateX('+(-py*max)+'deg)';
      el.style.setProperty('--mx',(e.clientX-r.left)+'px');
      el.style.setProperty('--my',(e.clientY-r.top)+'px');
    });
    el.addEventListener('mouseleave',function(){
      el.style.transform='perspective(900px) rotateY(0) rotateX(0)';
    });
  }
  if(!('ontouchstart' in window) && !reduce){
    document.querySelectorAll('[data-tilt]').forEach(function(el){bindTilt(el,7);});
    var hp=document.getElementById('tiltPhoto');
    if(hp){
      var hh=hp.closest('.hero-photo');
      hh.addEventListener('mousemove',function(e){
        var r=hh.getBoundingClientRect();
        var px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
        hp.style.transform='rotateY('+(px*10)+'deg) rotateX('+(-py*10)+'deg)';
      });
      hh.addEventListener('mouseleave',function(){hp.style.transform='rotateY(0) rotateX(0)';});
    }
  }

  /* velocity-reactive marquee */
  var track=document.getElementById('marquee');
  if(track){
    track.innerHTML+=track.innerHTML; // duplicate for seamless loop
    var pos=0,base=0.45,vel=0,last=scrollY;
    addEventListener('scroll',function(){
      vel=(scrollY-last);last=scrollY;
    },{passive:true});
    (function move(){
      var speed=base+Math.min(Math.abs(vel),60)*0.06;
      pos-=speed; vel*=0.9;
      var w=track.scrollWidth/2;
      if(-pos>=w)pos+=w;
      track.style.transform='translateX('+pos+'px)';
      requestAnimationFrame(move);
    })();
  }

  /* nav smooth + active */
  document.querySelectorAll('nav a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var t=document.querySelector(a.getAttribute('href'));
      if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
    });
  });
})();