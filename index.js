// ─── Ultra Premium Music Player - Saptsur ──────────────────────
// HOLLYWOOD DT SANSKA Branding

// ─── Song Data ──────────────────────────────────────────────────
const songs = [
  { 
    title: 'Gomu Maherla Jate Ho Nakhva', 
    artist: 'Prashant Nakti & Sneha Mahadik', 
    emoji: '🎸',
    color: ['#e74c3c', '#c0392b'],
    genre: '🇮🇳 Marathi Folk',
    duration: '3:54',
    mood: 'energetic'
  },
  { 
    title: 'Lofi Rain', 
    artist: 'chill beats', 
    emoji: '🎵',
    color: ['#1ed760', '#1db954'],
    genre: '🎧 Lofi',
    duration: '3:21',
    mood: 'chill'
  },
  { 
    title: 'Night Drive', 
    artist: 'synth wave', 
    emoji: '🎶',
    color: ['#4a90e2', '#357abd'],
    genre: '🌙 Synthwave',
    duration: '4:12',
    mood: 'dreamy'
  },
  { 
    title: 'Golden Hour', 
    artist: 'jazz & soul', 
    emoji: '🎷',
    color: ['#f39c12', '#e67e22'],
    genre: '🌅 Jazz',
    duration: '3:45',
    mood: 'smooth'
  },
  { 
    title: 'Mountain Air', 
    artist: 'folk acoustic', 
    emoji: '🎹',
    color: ['#9b59b6', '#8e44ad'],
    genre: '🏔️ Folk',
    duration: '4:08',
    mood: 'peaceful'
  },
  { 
    title: 'Urban Echo', 
    artist: 'electronic', 
    emoji: '🎧',
    color: ['#1abc9c', '#16a085'],
    genre: '🏙️ Electronic',
    duration: '3:33',
    mood: 'energetic'
  },
  { 
    title: 'Sunset Vibes', 
    artist: 'tropical house', 
    emoji: '🌅',
    color: ['#e67e22', '#d35400'],
    genre: '🌴 Tropical',
    duration: '4:01',
    mood: 'vibrant'
  },
  { 
    title: 'Midnight Jazz', 
    artist: 'smooth jazz', 
    emoji: '🎺',
    color: ['#2ecc71', '#27ae60'],
    genre: '🌙 Jazz',
    duration: '3:58',
    mood: 'smooth'
  }
];

// ─── DOM Elements ──────────────────────────────────────────────
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');
const progressFill = document.getElementById('progress-fill');
const progressHandle = document.getElementById('progress-handle');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const volumeSlider = document.getElementById('volume-slider');

// NPB Elements
const npbTitle = document.getElementById('npb-title');
const npbArtist = document.getElementById('npb-artist');
const npbPlay = document.getElementById('npb-play');
const npbCurrent = document.getElementById('npb-current');
const npbDuration = document.getElementById('npb-duration');
const npbFill = document.getElementById('npb-fill');
const npbTrack = document.getElementById('npb-track');
const npbVolume = document.getElementById('npb-volume');

// ─── State ──────────────────────────────────────────────────────
let currentIndex = 0;
let isPlaying = false;
let isShuffled = false;
let isRepeating = false;
let progress = 45;
let progressInterval = null;
let isDragging = false;
let volumeBeforeMute = 0.8;
let isMuted = false;
let isLiked = false;

// ─── Format Time ──────────────────────────────────────────────
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ─── Load Song ──────────────────────────────────────────────────
function loadSong(index) {
  const song = songs[index];
  if (!song) return;
  
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  npbTitle.textContent = song.title;
  npbArtist.textContent = song.artist;
  
  totalDurationEl.textContent = song.duration;
  npbDuration.textContent = song.duration;
  
  document.querySelectorAll('.playlist li').forEach((li, i) => {
    li.classList.toggle('active-song', i === index);
    const indicator = li.querySelector('.pl-indicator');
    indicator.textContent = i === index ? '▶' : '';
  });
  
  const cover = document.querySelector('.album-cover');
  const colorPair = song.color || ['#1ed760', '#1db954'];
  cover.style.background = `linear-gradient(135deg, ${colorPair[0]}, ${colorPair[1]})`;
  cover.style.transform = 'scale(0.95)';
  setTimeout(() => {
    cover.style.transform = 'scale(1)';
  }, 300);
  
  document.querySelector('.cover-emoji').textContent = song.emoji || '🎵';
  document.querySelector('.npb-cover').style.background = 
    `linear-gradient(135deg, ${colorPair[0]}, ${colorPair[1]})`;
  
  progress = 0;
  updateProgressDisplay();
}

// ─── Update Progress ────────────────────────────────────────────
function updateProgressDisplay() {
  const percent = progress;
  progressFill.style.width = `${percent}%`;
  progressHandle.style.left = `${percent}%`;
  npbFill.style.width = `${percent}%`;
  
  const totalSecs = 234;
  const currentSecs = Math.floor((progress / 100) * totalSecs);
  currentTimeEl.textContent = formatTime(currentSecs);
  npbCurrent.textContent = formatTime(currentSecs);
}

// ─── Play / Pause ──────────────────────────────────────────────
function togglePlay() {
  isPlaying = !isPlaying;
  
  if (isPlaying) {
    playBtn.textContent = '⏸';
    npbPlay.textContent = '⏸';
    playBtn.classList.add('playing');
    npbPlay.classList.add('playing');
    document.querySelector('.cover-pulse').style.animationPlayState = 'running';
    document.querySelector('.npb-cover-pulse').style.animationPlayState = 'running';
    
    if (!progressInterval) {
      progressInterval = setInterval(() => {
        if (isPlaying && progress < 100) {
          progress += 0.5;
          updateProgressDisplay();
        } else if (progress >= 100) {
          clearInterval(progressInterval);
          progressInterval = null;
          setTimeout(() => {
            if (isRepeating) {
              progress = 0;
              updateProgressDisplay();
            } else {
              nextSong();
            }
          }, 500);
        }
      }, 50);
    }
  } else {
    playBtn.textContent = '▶';
    npbPlay.textContent = '▶';
    playBtn.classList.remove('playing');
    npbPlay.classList.remove('playing');
    document.querySelector('.cover-pulse').style.animationPlayState = 'paused';
    document.querySelector('.npb-cover-pulse').style.animationPlayState = 'paused';
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }
}

// ─── Next / Previous ────────────────────────────────────────────
function nextSong() {
  if (isShuffled) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * songs.length);
    } while (randomIndex === currentIndex && songs.length > 1);
    currentIndex = randomIndex;
  } else {
    currentIndex = (currentIndex + 1) % songs.length;
  }
  
  progress = 0;
  loadSong(currentIndex);
  updateProgressDisplay();
  
  if (isPlaying) {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
    progressInterval = setInterval(() => {
      if (isPlaying && progress < 100) {
        progress += 0.5;
        updateProgressDisplay();
      } else if (progress >= 100) {
        clearInterval(progressInterval);
        progressInterval = null;
        setTimeout(() => {
          if (isRepeating) {
            progress = 0;
            updateProgressDisplay();
          } else {
            nextSong();
          }
        }, 500);
      }
    }, 50);
  }
}

function prevSong() {
  if (progress > 5) {
    progress = 0;
    updateProgressDisplay();
    return;
  }
  
  if (isShuffled) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * songs.length);
    } while (randomIndex === currentIndex && songs.length > 1);
    currentIndex = randomIndex;
  } else {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  }
  
  progress = 0;
  loadSong(currentIndex);
  updateProgressDisplay();
}

// ─── Volume ─────────────────────────────────────────────────────
function setVolume(val) {
  const volume = parseFloat(val);
  const volIcon = document.querySelector('.vol-icon');
  const npbVolIcon = document.querySelector('.npb-vol-icon');
  
  if (volume === 0) {
    volIcon.textContent = '🔇';
    npbVolIcon.textContent = '🔇';
    isMuted = true;
  } else if (volume < 0.5) {
    volIcon.textContent = '🔉';
    npbVolIcon.textContent = '🔉';
    isMuted = false;
  } else {
    volIcon.textContent = '🔊';
    npbVolIcon.textContent = '🔊';
    isMuted = false;
  }
}

function toggleMute() {
  if (isMuted) {
    setVolume(volumeBeforeMute);
    volumeSlider.value = volumeBeforeMute;
    npbVolume.value = volumeBeforeMute;
  } else {
    volumeBeforeMute = parseFloat(volumeSlider.value);
    setVolume(0);
    volumeSlider.value = 0;
    npbVolume.value = 0;
  }
}

// ─── Like Animation ─────────────────────────────────────────────
function toggleLike(button) {
  isLiked = !isLiked;
  button.style.transform = 'scale(1.5)';
  button.style.color = isLiked ? '#1ed760' : '#b3b3b3';
  setTimeout(() => {
    button.style.transform = 'scale(1)';
  }, 300);
}

// ─── Fullscreen ─────────────────────────────────────────────────
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// ─── Keyboard Shortcuts ─────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  
  switch(e.key) {
    case ' ':
    case 'Space':
      e.preventDefault();
      togglePlay();
      break;
    case 'ArrowRight':
      nextSong();
      break;
    case 'ArrowLeft':
      prevSong();
      break;
    case 'ArrowUp':
      e.preventDefault();
      const newVolUp = Math.min(1, parseFloat(volumeSlider.value) + 0.1);
      volumeSlider.value = newVolUp;
      npbVolume.value = newVolUp;
      setVolume(newVolUp);
      break;
    case 'ArrowDown':
      e.preventDefault();
      const newVolDown = Math.max(0, parseFloat(volumeSlider.value) - 0.1);
      volumeSlider.value = newVolDown;
      npbVolume.value = newVolDown;
      setVolume(newVolDown);
      break;
    case 'm':
    case 'M':
      toggleMute();
      break;
    case 'f':
    case 'F':
      toggleFullscreen();
      break;
    case 'l':
    case 'L':
      toggleLike(document.querySelector('.npb-like'));
      break;
  }
});

// ─── Init ────────────────────────────────────────────────────────
function init() {
  console.log('%c🎸 HOLLYWOOD DT SANSKA', 'font-size: 20px; color: #1ed760; font-weight: bold;');
  console.log('%c🌟 Saptsur Ultra Premium Music Player', 'font-size: 16px; color: #f1c40f;');
  console.log('🎯 Press Space to play, Arrow keys to navigate');
  console.log('🔊 Press M to mute, F for fullscreen, L to like');
  
  loadSong(0);
  updateProgressDisplay();
  setVolume(volumeSlider.value);
  npbVolume.value = volumeSlider.value;
  
  // ─── Event Listeners ──────────────────────────────────────────
  
  playBtn.addEventListener('click', togglePlay);
  npbPlay.addEventListener('click', togglePlay);
  
  nextBtn.addEventListener('click', nextSong);
  prevBtn.addEventListener('click', prevSong);
  npbNext.addEventListener('click', nextSong);
  npbPrev.addEventListener('click', prevSong);
  
  volumeSlider.addEventListener('input', (e) => {
    setVolume(e.target.value);
    npbVolume.value = e.target.value;
  });
  npbVolume.addEventListener('input', (e) => {
    setVolume(e.target.value);
    volumeSlider.value = e.target.value;
  });
  
  document.querySelector('.vol-icon').addEventListener('click', toggleMute);
  document.querySelector('.npb-vol-icon').addEventListener('click', toggleMute);
  
  document.querySelector('.npb-like').addEventListener('click', function() {
    toggleLike(this);
  });
  
  document.querySelectorAll('.playlist li').forEach((li, index) => {
    li.addEventListener('click', () => {
      if (currentIndex === index) {
        togglePlay();
      } else {
        currentIndex = index;
        progress = 0;
        loadSong(currentIndex);
        updateProgressDisplay();
        if (!isPlaying) togglePlay();
      }
    });
  });
  
  shuffleBtn.addEventListener('click', () => {
    isShuffled = !isShuffled;
    shuffleBtn.style.color = isShuffled ? '#1ed760' : '#b3b3b3';
    npbShuffle.style.color = isShuffled ? '#1ed760' : '#b3b3b3';
    shuffleBtn.style.transform = isShuffled ? 'scale(1.2) rotate(180deg)' : 'scale(1) rotate(0)';
    setTimeout(() => shuffleBtn.style.transform = 'scale(1) rotate(0)', 300);
  });
  
  repeatBtn.addEventListener('click', () => {
    isRepeating = !isRepeating;
    repeatBtn.style.color = isRepeating ? '#1ed760' : '#b3b3b3';
    npbRepeat.style.color = isRepeating ? '#1ed760' : '#b3b3b3';
    repeatBtn.style.transform = isRepeating ? 'scale(1.3)' : 'scale(1)';
    setTimeout(() => repeatBtn.style.transform = 'scale(1)', 300);
  });
  
  const progressTrack = document.getElementById('progress-track');
  progressTrack.addEventListener('click', (e) => {
    const rect = progressTrack.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    progress = Math.min(100, Math.max(0, x * 100));
    updateProgressDisplay();
  });
  npbTrack.addEventListener('click', (e) => {
    const rect = npbTrack.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    progress = Math.min(100, Math.max(0, x * 100));
    updateProgressDisplay();
  });
  
  progressHandle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', onDragEnd);
  });
  progressHandle.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDragging = true;
    document.addEventListener('touchmove', onTouchDrag);
    document.addEventListener('touchend', onDragEnd);
  });
  
  function onDrag(e) {
    if (isDragging) {
      const rect = progressTrack.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      progress = Math.min(100, Math.max(0, x * 100));
      updateProgressDisplay();
    }
  }
  
  function onTouchDrag(e) {
    if (isDragging) {
      const touch = e.touches[0];
      const rect = progressTrack.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width;
      progress = Math.min(100, Math.max(0, x * 100));
      updateProgressDisplay();
    }
  }
  
  function onDragEnd() {
    isDragging = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', onDragEnd);
    document.removeEventListener('touchmove', onTouchDrag);
    document.removeEventListener('touchend', onDragEnd);
  }
}

// ─── Start App ──────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}