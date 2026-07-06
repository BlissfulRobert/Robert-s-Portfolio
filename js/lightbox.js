// Lightbox — with prev/next navigation
var lightboxImages = [];
var lightboxIndex  = 0;

document.addEventListener('DOMContentLoaded', function () {

  // Close on clicking the backdrop
  document.getElementById('lightbox').addEventListener('click', function (e) {
    if (e.target === this) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (!document.getElementById('lightbox').classList.contains('active')) return;
    if (e.key === 'ArrowLeft')  lightboxNav(-1);
    if (e.key === 'ArrowRight') lightboxNav(1);
    if (e.key === 'Escape')     closeLightbox();
  });
});

/**
 * Called by carousel.js: openLightbox(src, alt, card)
 * card = the .project-showcase element (optional — used to build the nav list)
 */
function openLightbox(src, alt, card) {
  // Build the image list from the card's thumbnails if available
  if (card) {
    var thumbs = Array.from(card.querySelectorAll('.steam-thumb'));
    if (thumbs.length > 0) {
      lightboxImages = thumbs.map(function (t) {
        return { src: t.getAttribute('data-src'), alt: t.getAttribute('data-label') };
      });
      // Find which index matches the currently shown image
      lightboxIndex = lightboxImages.findIndex(function (img) { return img.src === src; });
      if (lightboxIndex === -1) lightboxIndex = 0;
    } else {
      lightboxImages = [{ src: src, alt: alt }];
      lightboxIndex  = 0;
    }
  } else {
    lightboxImages = [{ src: src, alt: alt }];
    lightboxIndex  = 0;
  }

  _showLightbox();
}

function _showLightbox() {
  var lightbox   = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var caption     = document.getElementById('lightbox-caption');

  lightboxImg.src      = lightboxImages[lightboxIndex].src;
  caption.textContent  = lightboxImages[lightboxIndex].alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  updateNavButtons();
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function lightboxNav(dir) {
  var next = lightboxIndex + dir;
  if (next < 0 || next >= lightboxImages.length) return;
  lightboxIndex = next;

  var lightboxImg = document.getElementById('lightbox-img');
  var caption     = document.getElementById('lightbox-caption');

  lightboxImg.style.opacity   = '0';
  lightboxImg.style.transform = 'scale(0.96)';
  setTimeout(function () {
    lightboxImg.src     = lightboxImages[lightboxIndex].src;
    caption.textContent = lightboxImages[lightboxIndex].alt;
    lightboxImg.style.opacity   = '1';
    lightboxImg.style.transform = 'scale(1)';
    updateNavButtons();
  }, 180);
}

function updateNavButtons() {
  var prev = document.getElementById('lightbox-prev');
  var next = document.getElementById('lightbox-next');
  var only = lightboxImages.length <= 1;

  prev.style.display = only ? 'none' : 'flex';
  next.style.display = only ? 'none' : 'flex';

  prev.style.opacity       = lightboxIndex === 0 ? '0.3' : '1';
  prev.style.pointerEvents = lightboxIndex === 0 ? 'none' : 'auto';

  next.style.opacity       = lightboxIndex === lightboxImages.length - 1 ? '0.3' : '1';
  next.style.pointerEvents = lightboxIndex === lightboxImages.length - 1 ? 'none' : 'auto';
}
