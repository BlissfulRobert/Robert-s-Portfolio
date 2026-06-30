function toggleModelFullscreen(btn) {
  var wrapper = btn.closest('.model-viewer-wrapper');
  var icon = btn.querySelector('i');

  if (wrapper.classList.contains('model-fullscreen')) {
    wrapper.classList.remove('model-fullscreen');
    icon.className = 'fas fa-expand';
    document.body.style.overflow = '';
  } else {
    wrapper.classList.add('model-fullscreen');
    icon.className = 'fas fa-compress';
    document.body.style.overflow = 'hidden';
  }
}
