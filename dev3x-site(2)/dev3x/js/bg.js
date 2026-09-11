// Star-constellation ambient background: stars drift slowly and draw a
// connecting line to their nearest neighbours, like a constellation
// slowly redrawing itself. Used site-wide.
(function(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'stars-canvas';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let w, h, dpr, stars = [];

  function size(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function init(){
    const count = Math.max(40, Math.min(90, Math.floor((w*h)/22000)));
    stars = Array.from({length: count}, () => ({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()-0.5)*0.10, vy: (Math.random()-0.5)*0.10,
      r: Math.random()*1.3 + 0.5,
      tw: Math.random()*Math.PI*2
    }));
  }

  function step(t){
    ctx.clearRect(0,0,w,h);
    for (const s of stars){
      s.x += s.vx; s.y += s.vy;
      if (s.x < -10) s.x = w+10; if (s.x > w+10) s.x = -10;
      if (s.y < -10) s.y = h+10; if (s.y > h+10) s.y = -10;
    }
    const maxDist = 140;
    for (let i=0;i<stars.length;i++){
      for (let j=i+1;j<stars.length;j++){
        const a = stars[i], b = stars[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < maxDist){
          ctx.strokeStyle = `rgba(127,179,255,${(1-dist/maxDist)*0.16})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    for (const s of stars){
      const twinkle = 0.55 + Math.sin(t*0.0012 + s.tw) * 0.35;
      ctx.fillStyle = `rgba(234,242,251,${twinkle})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(step);
  }

  size(); init();
  requestAnimationFrame(step);
  window.addEventListener('resize', () => { size(); init(); });
})();
