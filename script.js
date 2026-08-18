const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.target.classList.toggle('in-view', entry.isIntersecting));
}, { threshold: 0.2 });

document.querySelectorAll('.work-block, .intro-layout, .avatar-stage').forEach((el) => observer.observe(el));

// Use the first decodable frame from each source as its pre-playback cover.
document.querySelectorAll('video').forEach((video) => {
  video.addEventListener('loadedmetadata', () => {
    const coverFrame = Math.min(0.12, Math.max(0, (video.duration || 0) - 0.01));
    if (coverFrame > 0) video.currentTime = coverFrame;
  }, { once: true });
});

const avatarStage = document.querySelector('.avatar-stage');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (avatarStage && !reduceMotion) {
  let frame;
  avatarStage.addEventListener('pointermove', (event) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const bounds = avatarStage.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      avatarStage.style.setProperty('--avatar-x', `${x * 12}px`);
      avatarStage.style.setProperty('--avatar-y', `${y * 8}px`);
      avatarStage.style.setProperty('--avatar-rx', `${-y * 3.5}deg`);
      avatarStage.style.setProperty('--avatar-ry', `${x * 5.5}deg`);
    });
  });
  avatarStage.addEventListener('pointerleave', () => {
    ['avatar-x', 'avatar-y', 'avatar-rx', 'avatar-ry'].forEach((property) => avatarStage.style.removeProperty(`--${property}`));
  });
}
