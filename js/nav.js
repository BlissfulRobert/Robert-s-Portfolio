var navToggle = document.querySelector('.nav-toggle');
var navLinks = document.querySelector('.links');
var navOverlay = document.querySelector('.nav-overlay');

function closeMobileNav() {
  navToggle.classList.remove('active');
  navLinks.classList.remove('active');
  navOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', function() {
  this.classList.toggle('active');
  navLinks.classList.toggle('active');
  navOverlay.classList.toggle('active');
  if (navLinks.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

navOverlay.addEventListener('click', closeMobileNav);

// Smooth scroll for anchor links + close mobile nav
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    closeMobileNav();
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Update active nav link on scroll
var sections = document.querySelectorAll('section[id]');
var allNavLinks = document.querySelectorAll('.links a');

window.addEventListener('scroll', function() {
  var current = '';
  sections.forEach(function(section) {
    var sectionTop = section.offsetTop - 100;
    if (scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  allNavLinks.forEach(function(link) {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// Global Escape key handler (covers lightbox, mobile nav, and fullscreen model)
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeLightbox();
    closeMobileNav();
    var fullscreenModel = document.querySelector('.model-fullscreen');
    if (fullscreenModel) {
      fullscreenModel.classList.remove('model-fullscreen');
      fullscreenModel.querySelector('.fullscreen-btn i').className = 'fas fa-expand';
      document.body.style.overflow = '';
    }
  }
});
