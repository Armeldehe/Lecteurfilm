// Lecteur vidéo : code robuste et sans duplications
document.addEventListener('DOMContentLoaded', () => {
  const movieCards = document.querySelectorAll('.movie-card');
  const playerOverlay = document.getElementById('playerOverlay');
  const videoPlayer = document.getElementById('videoPlayer');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const closeBtn = document.getElementById('closeBtn');
  const progressBar = document.getElementById('progressBar');
  const playerMessage = document.getElementById('playerMessage');

  if (!videoPlayer || !playerOverlay) {
    console.warn('Éléments du lecteur introuvables dans le DOM.');
    return;
  }

  let isPlaying = false;

  function showOverlay() { playerOverlay.classList.remove('hidden'); }
  function hideOverlay() { playerOverlay.classList.add('hidden'); }
  function setMessage(text, show = true) {
    if (!playerMessage) return;
    playerMessage.textContent = text;
    playerMessage.classList.toggle('hidden', !show);
  }

  movieCards.forEach(card => {
    const btn = card.querySelector('.play-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const videoSrc = card.getAttribute('data-video');
      if (!videoSrc) { setMessage('Vidéo introuvable.'); return; }
      setMessage('', false);
      videoPlayer.pause();
      videoPlayer.src = videoSrc;
      videoPlayer.load();
      showOverlay();
      const playPromise = videoPlayer.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isPlaying = true; if (playPauseBtn) playPauseBtn.textContent = '⏸';
        }).catch(err => {
          console.warn('Lecture automatique bloquée:', err);
          isPlaying = false; if (playPauseBtn) playPauseBtn.textContent = '▶';
          setMessage('Cliquer sur ▶ pour démarrer la lecture.');
        });
      }
    });
  });

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (videoPlayer.paused || videoPlayer.ended) { videoPlayer.play().catch(() => {}); playPauseBtn.textContent = '⏸'; isPlaying = true; }
      else { videoPlayer.pause(); playPauseBtn.textContent = '▶'; isPlaying = false; }
    });
  }

  videoPlayer.addEventListener('timeupdate', () => {
    if (!videoPlayer.duration || isNaN(videoPlayer.duration)) { if (progressBar) progressBar.value = 0; return; }
    const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
    if (progressBar) progressBar.value = progress || 0;
  });

  if (progressBar) {
    progressBar.addEventListener('input', () => {
      if (!videoPlayer.duration || isNaN(videoPlayer.duration)) return;
      videoPlayer.currentTime = (progressBar.value / 100) * videoPlayer.duration;
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      videoPlayer.pause(); hideOverlay(); videoPlayer.removeAttribute('src'); videoPlayer.load(); isPlaying = false; setMessage('', false);
    });
  }

  videoPlayer.addEventListener('error', (e) => { console.error('Erreur de lecture vidéo:', e); setMessage('Impossible de lire la vidéo. Vérifiez le chemin ou le format.'); });
  videoPlayer.addEventListener('ended', () => { if (playPauseBtn) playPauseBtn.textContent = '▶'; isPlaying = false; });
});
const movieCards = document.querySelectorAll(".movie-card");
const playerOverlay = document.getElementById("playerOverlay");
const videoPlayer = document.getElementById("videoPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const closeBtn = document.getElementById("closeBtn");
const progressBar = document.getElementById("progressBar");

let isPlaying = false;

// 🎬 Ouvrir le lecteur quand on clique sur une carte
movieCards.forEach(card => {
  card.querySelector(".play-btn").addEventListener("click", () => {
    const videoSrc = card.getAttribute("data-video");
    videoPlayer.src = videoSrc;
    playerOverlay.classList.remove("hidden");
    videoPlayer.play();
    isPlaying = true;
    playPauseBtn.textContent = "⏸️";
  });
});

// ▶️ / ⏸️ Lecture / Pause
playPauseBtn.addEventListener("click", () => {
  if (isPlaying) {
    videoPlayer.pause();
    playPauseBtn.textContent = "▶️";
  } else {
    videoPlayer.play();
    playPauseBtn.textContent = "⏸️";
  }
  isPlaying = !isPlaying;
});

// 📊 Barre de progression
videoPlayer.addEventListener("timeupdate", () => {
  const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
  progressBar.value = progress || 0;
});

// ⏩ Navigation manuelle
progressBar.addEventListener("input", () => {
  videoPlayer.currentTime = (progressBar.value / 100) * videoPlayer.duration;
});

// ❌ Fermer le lecteur
closeBtn.addEventListener("click", () => {
  videoPlayer.pause();
  playerOverlay.classList.add("hidden");
  videoPlayer.src = "";
  isPlaying = false;
});
