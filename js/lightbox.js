// Wire up gallery images for lightbox on click
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.gallery-item img, .project-card-media img').forEach(function(img) {
    img.style.cursor = 'zoom-in';
    img.onclick = function() {
      openLightbox(this.src, this.alt);
    };
  });

  // Close on clicking outside image
  document.getElementById('lightbox').onclick = function(e) {
    if (e.target === this) {
      closeLightbox();
    }
  };
});

function openLightbox(src, alt) {
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCaption = document.getElementById('lightbox-caption');

  lightboxImg.src = src;
  lightboxCaption.textContent = alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  var lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}
