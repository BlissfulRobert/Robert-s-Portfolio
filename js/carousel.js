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
      cards[idx].classList.remove('active', 'slide-left');
      cards[idx].style.display = 'none';

      idx = (n + total) % total;
      var card = cards[idx];
      card.style.display = 'block';
      card.classList.remove('active', 'slide-left');
      void card.offsetWidth;
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

  // ── Steam thumbnail → main image swap ────────────────────────────────────
  document.querySelectorAll('.project-showcase').forEach(function (card) {
    var mainImg     = card.querySelector('.steam-main-img img');
    var mainCaption = card.querySelector('.steam-main-caption');
    var thumbs      = Array.from(card.querySelectorAll('.steam-thumb'));

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var src   = thumb.getAttribute('data-src');
        var label = thumb.getAttribute('data-label');

        // Swap main image
        mainImg.src = src;
        mainImg.alt = label;
        mainCaption.textContent = label;

        // Update active thumb highlight
        thumbs.forEach(function (t) { t.classList.remove('active-thumb'); });
        thumb.classList.add('active-thumb');
      });
    });

    // Lightbox on main image click — pass the card so nav can use its thumb list
    if (mainImg) {
      mainImg.addEventListener('click', function () {
        if (typeof openLightbox === 'function') openLightbox(mainImg.src, mainImg.alt, card);
      });
    }
  });
})();


// ── Shooting star canvas (one faint star every ~8–14s, site-wide) ────────────
(function () {
  var canvas = document.getElementById('fallingStars');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ctx = canvas.getContext('2d');
  var star = null;
  var raf = null;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function spawn() {
    var dir = Math.random() < 0.5 ? 1 : -1;
    var angle = (Math.random() * 15 + 20) * Math.PI / 180; // shallow diagonal
    var speed = Math.random() * 3 + 6;
    star = {
      x:    dir === 1 ? Math.random() * canvas.width * 0.5 : canvas.width * (0.5 + Math.random() * 0.5),
      y:    Math.random() * canvas.height * 0.35,
      vx:   Math.cos(angle) * speed * dir,
      vy:   Math.sin(angle) * speed,
      len:  Math.random() * 40 + 70,
      life: 0,
      max:  Math.random() * 20 + 55 // frames (~1s)
    };
    raf = requestAnimationFrame(tick);
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var s = star;
    s.life++;
    s.x += s.vx;
    s.y += s.vy;

    // fade in, then out
    var t = s.life / s.max;
    var alpha = Math.sin(Math.PI * Math.min(t, 1)) * 0.7;
    var norm = Math.hypot(s.vx, s.vy);
    var tx = s.x - (s.vx / norm) * s.len;
    var ty = s.y - (s.vy / norm) * s.len;

    var grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
    grad.addColorStop(0, 'rgba(255,246,224,0)');
    grad.addColorStop(1, 'rgba(255,246,224,' + alpha + ')');
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(s.x, s.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.stroke();

    if (s.life < s.max) {
      raf = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      star = null;
      schedule();
    }
  }

  function schedule() {
    setTimeout(function () {
      if (document.hidden) { schedule(); return; }
      spawn();
    }, Math.random() * 6000 + 8000);
  }

  schedule();
})();
