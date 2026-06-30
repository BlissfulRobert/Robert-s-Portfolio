// ── Card navigator with slide animation ──────────────────────────────────────
(function () {
  function initSection(sectionId, prevId, nextId, currentId) {
    var section   = document.getElementById(sectionId);
    var prev      = document.getElementById(prevId);
    var next      = document.getElementById(nextId);
    var currentEl = document.getElementById(currentId);
    if (!section || !prev || !next || !currentEl) return;

    var cards = Array.from(section.querySelectorAll('.project-showcase'));
    var total = cards.length;
    var idx   = 0;

    function show(n, dir) {
      // dir: 1 = going forward (slide from right), -1 = going back (slide from left)
      cards[idx].classList.remove('active', 'slide-left');
      cards[idx].style.display = 'none';

      idx = (n + total) % total;
      var card = cards[idx];
      card.style.display = 'block';
      // Remove then re-add animation class to retrigger
      card.classList.remove('active', 'slide-left');
      void card.offsetWidth; // reflow
      if (dir === -1) {
        card.classList.add('active', 'slide-left');
      } else {
        card.classList.add('active');
      }
      currentEl.textContent = idx + 1;
    }

    prev.addEventListener('click', function () { show(idx - 1, -1); });
    next.addEventListener('click', function () { show(idx + 1,  1); });
  }

  initSection('workSection',  'workPrev',  'workNext',  'workCurrent');
  initSection('otherSection', 'otherPrev', 'otherNext', 'otherCurrent');

  // Lightbox for all gallery images
  document.querySelectorAll('.gallery-item img').forEach(function (img) {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function () {
      if (typeof openLightbox === 'function') openLightbox(img.src, img.alt);
    });
  });
})();


// ── Falling stars canvas (active only while #projects is in view) ─────────────
(function () {
  var canvas  = document.getElementById('fallingStars');
  var section = document.getElementById('projects');
  if (!canvas || !section) return;

  var ctx = canvas.getContext('2d');
  var stars = [];
  var active = false;
  var raf;

  // Size canvas to full viewport, fixed position — z-index 2 sits above aurora (0) and twinkle-stars (1) but below nav (10)
  canvas.style.cssText = [
    'position:fixed',
    'top:0', 'left:0',
    'width:100%', 'height:100%',
    'pointer-events:none',
    'z-index:2',
    'opacity:0',
    'transition:opacity 0.8s ease'
  ].join(';');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Star factory
  function makeStar() {
    var speed = Math.random() * 5 + 3;
    var angle = (Math.random() * 20 + 70) * Math.PI / 180; // steep downward
    return {
      x:     Math.random() * canvas.width,
      y:     Math.random() * -80 - 10,
      len:   Math.random() * 100 + 60,
      vx:    Math.cos(angle) * speed * (Math.random() < 0.5 ? 0.4 : -0.4),
      vy:    Math.sin(angle) * speed,
      alpha: Math.random() * 0.5 + 0.6,  // 0.6–1.0
      width: Math.random() * 1.5 + 1.5   // 1.5–3px
    };
  }

  function drawStar(s) {
    var tx = s.x - s.vx * (s.len / s.vy);
    var ty = s.y - s.len;
    var grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
    grad.addColorStop(0, 'rgba(180,210,255,0)');
    grad.addColorStop(0.7, 'rgba(200,225,255,' + (s.alpha * 0.5) + ')');
    grad.addColorStop(1,   'rgba(255,255,255,' + s.alpha + ')');
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(s.x, s.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = s.width;
    ctx.stroke();
    // bright glowing tip
    var glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 6);
    glow.addColorStop(0,   'rgba(255,255,255,' + s.alpha + ')');
    glow.addColorStop(0.4, 'rgba(180,210,255,' + (s.alpha * 0.6) + ')');
    glow.addColorStop(1,   'rgba(120,170,255,0)');
    ctx.beginPath();
    ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Spawn new stars
    if (stars.length < 25 && Math.random() < 0.4) {
      stars.push(makeStar());
    }
    stars = stars.filter(function (s) {
      s.x += s.vx;
      s.y += s.vy;
      drawStar(s);
      return s.y < canvas.height + 20;
    });
    if (active) raf = requestAnimationFrame(tick);
  }

  function start() {
    if (active) return;
    active = true;
    canvas.style.opacity = '1';
    stars = [];
    tick();
  }

  function stop() {
    if (!active) return;
    active = false;
    canvas.style.opacity = '0';
    cancelAnimationFrame(raf);
    setTimeout(function () { ctx.clearRect(0, 0, canvas.width, canvas.height); }, 900);
  }

  // IntersectionObserver — fire when projects section is ≥30% in view
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { start(); } else { stop(); }
    });
  }, { threshold: 0.15 });

  observer.observe(section);
})();
