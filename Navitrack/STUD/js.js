
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function animCursor() {
  rx += (mx - rx) * 0.18;
  ry += (my - ry) * 0.18;
  if (dot)  dot.style.transform  = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  if (ring) ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
  requestAnimationFrame(animCursor);
})();


/* ============================================================
   CANVAS BACKGROUND — network nodes
============================================================ */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, nodes, particles;
  const NODE_COUNT = window.innerWidth < 768 ? 30 : 60;
  const PARTICLE_COUNT = window.innerWidth < 768 ? 20 : 50;
  const MAX_DIST = 180;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeNodes() {
    nodes = Array.from({length: NODE_COUNT}, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.3
    }));
  }

  function makeParticles() {
    particles = Array.from({length: PARTICLE_COUNT}, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      life: Math.random(),
      r: Math.random() * 1.5 + 0.5
    }));
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i+1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < MAX_DIST) {
          const alpha = (1 - d/MAX_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(59,130,246,${n.alpha})`;
      ctx.fill();
      // glow ring
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + 4, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(34,211,238,${n.alpha * 0.25})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw particles
    particles.forEach(p => {
      p.life -= 0.003;
      if (p.life <= 0) {
        p.x = Math.random() * W; p.y = Math.random() * H;
        p.life = Math.random() * 0.7 + 0.3;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(34,211,238,${p.life * 0.3})`;
      ctx.fill();
    });

    // Animate positions
    [...nodes, ...particles].forEach(obj => {
      obj.x += obj.vx; obj.y += obj.vy;
      if (obj.x < -20) obj.x = W + 20;
      if (obj.x > W+20) obj.x = -20;
      if (obj.y < -20) obj.y = H + 20;
      if (obj.y > H+20) obj.y = -20;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); makeNodes(); makeParticles(); });
  resize(); makeNodes(); makeParticles(); draw();
})();


/* ============================================================
   NAVBAR SCROLL
============================================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, {passive: true});


/* ============================================================
   MOBILE MENU
============================================================ */
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobileNav');
const mobileClose= document.getElementById('mobileClose');

hamburger.addEventListener('click', () => {
  mobileNav.classList.add('open');
  mobileNav.removeAttribute('hidden');
});
mobileClose.addEventListener('click', () => {
  mobileNav.classList.remove('open');
});
mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileNav.classList.remove('open'));
});


/* ============================================================
   LIVE CLOCK
============================================================ */
function padZ(n) { return String(n).padStart(2,'0'); }

function updateClock() {
  const now = new Date();
  const h = padZ(now.getHours());
  const m = padZ(now.getMinutes());
  const s = padZ(now.getSeconds());
  const clockEl = document.getElementById('dash-clock');
  if (clockEl) clockEl.textContent = `${h}:${m}:${s}`;

  const dateEl = document.getElementById('dash-date');
  if (dateEl) {
    const opts = { weekday:'long', month:'long', day:'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', opts);
  }

  // Countdown to next class (simulated: next on the hour)
  const nextHour = new Date(now);
  nextHour.setMinutes(0,0,0);
  nextHour.setHours(nextHour.getHours() + 1);
  // Use a fixed "next class" time relative to current
  const nextClass = new Date(now);
  nextClass.setMinutes(now.getMinutes() < 30 ? 30 : 60, 0, 0);
  if (now.getMinutes() >= 30) nextClass.setHours(nextClass.getHours() + 1);
  
  const diff = nextClass - now;
  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const cdEl = document.getElementById('countdown-text');
  if (cdEl) cdEl.textContent = `Next class in ${padZ(mins)}:${padZ(secs)}`;
}
setInterval(updateClock, 1000);
updateClock();


/* ============================================================
   SCROLL REVEAL
============================================================ */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

reveals.forEach(el => revealObserver.observe(el));


/* ============================================================
   ANIMATED COUNTERS
============================================================ */
function animateCounter(el, target, duration, suffix) {
  const start = performance.now();
  const isLarge = target >= 1000;
  const update = (ts) => {
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    if (isLarge) {
      el.textContent = (value >= 1000 ? (value/1000).toFixed(1) + 'K' : value) + (suffix||'');
    } else {
      el.textContent = value + (suffix||'');
    }
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statNumbers = document.querySelectorAll('.stat-number[data-target]');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, 2000, suffix);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNumbers.forEach(el => statObserver.observe(el));


/* ============================================================
   OCCUPANCY BAR ANIMATION
============================================================ */
const occBar = document.getElementById('occ-bar');
const occBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && occBar) {
      setTimeout(() => { occBar.style.width = '68%'; }, 400);
      occBarObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
if (occBar) occBarObserver.observe(occBar);


/* ============================================================
   PARALLAX on hero orbs (mouse move)
============================================================ */
document.addEventListener('mousemove', e => {
  const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
  const ny = (e.clientY / window.innerHeight - 0.5) * 2;
  document.querySelectorAll('.hero-orb').forEach((orb, i) => {
    const depth = (i + 1) * 12;
    orb.style.transform = `translate(${nx * depth}px, ${ny * depth}px)`;
  });
});


/* ============================================================
   ROOMS FREE COUNTER (random fluctuation for feel)
============================================================ */
const roomsFreeEl = document.getElementById('rooms-free');
if (roomsFreeEl) {
  setInterval(() => {
    const v = 12 + Math.floor(Math.random() * 6);
    roomsFreeEl.textContent = v;
  }, 4000);
}
