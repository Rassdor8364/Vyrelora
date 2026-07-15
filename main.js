/* ============================================================
   VYRELORA — shared behaviour (GSAP + ScrollTrigger loaded per page)
   ============================================================ */

/* ---------- nav ---------- */
(function () {
  var nav = document.querySelector('nav.site');
  if (!nav) return;
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
})();

/* ---------- scroll reveals + blob parallax ---------- */
function initReveals() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll('.reveal').forEach(function (el) {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
  document.querySelectorAll('.blob').forEach(function (b) {
    gsap.to(b, {
      yPercent: 18, ease: 'none',
      scrollTrigger: { trigger: b.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
    });
  });
}

/* ---------- hero title (word-by-word) ---------- */
function initHeroTitle() {
  var h = document.getElementById('hero-title');
  if (!h || typeof gsap === 'undefined') return;
  var text = h.textContent.trim();
  h.textContent = '';
  text.split(' ').forEach(function (w, i) {
    var span = document.createElement('span');
    span.className = 'word';
    span.textContent = w + ' ';
    if (h.dataset.accentFrom && i >= +h.dataset.accentFrom) {
      span.style.fontStyle = 'italic';
      span.style.color = 'var(--gold)';
    }
    h.appendChild(span);
  });
  gsap.fromTo('#hero-title .word',
    { y: 70, opacity: 0, rotateX: -40 },
    { y: 0, opacity: 1, rotateX: 0, duration: 1.1, stagger: 0.07, ease: 'power4.out', delay: .2 });
}

/* ---------- golden particles (home hero) ---------- */
function initParticles() {
  var canvas = document.getElementById('particles');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var particles = [];
  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  function build() {
    resize();
    particles = [];
    for (var i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.4 + .6,
        vx: (Math.random() - .5) * .25,
        vy: -Math.random() * .35 - .08,
        a: Math.random() * .5 + .15,
        tw: Math.random() * Math.PI * 2
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function (p) {
      p.x += p.vx; p.y += p.vy; p.tw += .02;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      var alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(195,161,99,' + alpha + ')';
      ctx.shadowColor = 'rgba(195,161,99,.8)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  build();
  draw();
}

/* ---------- FAQ accordion ---------- */
function toggleFaq(btn) {
  var q = btn.parentElement;
  var a = q.querySelector('.a');
  var open = q.classList.toggle('open');
  a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
}

/* ---------- forms (front-end only for now) ---------- */
function fakeSubmit(e, msgId) {
  e.preventDefault();
  var msg = document.getElementById(msgId);
  if (msg) {
    msg.style.display = 'block';
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(msg, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .6 });
    }
  }
  e.target.querySelectorAll('input, textarea').forEach(function (i) { i.value = ''; });
  return false;
}

/* ---------- boot ---------- */
window.addEventListener('DOMContentLoaded', function () {
  initParticles();
  initHeroTitle();
  initReveals();
});
