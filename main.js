/* ══════════════════════════════════════════════
   夢已如來 — 網站腳本
   ══════════════════════════════════════════════ */

// ── 版權年份 ─────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── 反彈文字對齊 h1 ──────────────────────────
function syncMarqueeWidth() {
  const title   = document.querySelector('.hero-title');
  const marquee = document.querySelector('.marquee');
  const track   = document.querySelector('.marquee-track');
  if (!title || !marquee || !track) return;

  // 1. 先暫時解除寬度限制，量到文字的自然寬度
  marquee.style.width = '';
  const titleW = title.getBoundingClientRect().width;
  const trackW = track.getBoundingClientRect().width;

  // 2. 把容器鎖到 h1 寬度，超出的被 overflow:hidden 截掉
  marquee.style.width = titleW + 'px';

  // 3. 文字從左邊滑到右邊剛好貼齊「來」字的距離
  const delta = Math.max(0, titleW - trackW);
  track.style.setProperty('--marquee-delta', `${delta}px`);
  // 算好之後才開始播
  track.style.animationPlayState = 'running';
}
document.fonts.ready.then(() => requestAnimationFrame(syncMarqueeWidth));
window.addEventListener('resize', syncMarqueeWidth);

// ── Navigation 捲動效果 ──────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── 漢堡選單 ────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// 點選任一選單連結後收合
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── 打字機效果（循環） ───────────────────────
function typewriter(el, text, speed = 70) {
  el.textContent = '';
  let i = 0;
  const type = () => {
    el.textContent += text[i++];
    if (i < text.length) {
      setTimeout(type, speed);
    } else {
      // 停頓後清空再重打
      setTimeout(() => typewriter(el, text, speed), 2200);
    }
  };
  setTimeout(type, 600);
}
const eyebrow = document.getElementById('eyebrow');
if (eyebrow) typewriter(eyebrow, "Dream Don't Come or Go");

// ── 浮動符號（hero 背景） ────────────────────
(function createParticles() {
  const hero    = document.querySelector('.hero');
  const symbols = ['◈', '✦', '◎', '·', '◇', '○', '∴', '※', '〇', '⊕', '✧', '⊙'];
  const colors  = [
    'var(--accent)',   // 紫
    'var(--accent2)',  // 青
    'var(--fg)',       // 白
    '#ff8fa3',         // 粉
    '#ffd580',         // 金
  ];
  for (let i = 0; i < 22; i++) {
    const el   = document.createElement('span');
    const size = 6 + Math.random() * 12; // 6–18px
    el.className   = 'particle';
    el.textContent = symbols[i % symbols.length];
    el.style.cssText = [
      `left:${Math.random() * 94}%`,
      `top:${6 + Math.random() * 84}%`,
      `font-size:${size.toFixed(0)}px`,
      `opacity:${(0.05 + Math.random() * 0.18).toFixed(2)}`,
      `color:${colors[Math.floor(Math.random() * colors.length)]}`,
      `animation-duration:${(4 + Math.random() * 7).toFixed(1)}s`,
      `animation-delay:${(Math.random() * 6).toFixed(1)}s`,
    ].join(';');
    hero.appendChild(el);
  }
})();

// ── Reveal 捲動動畫 ──────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // grid 子項目錯開進場
      e.target.querySelectorAll('.gallery-item, .contact-card').forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.08}s`;
        child.classList.add('visible');
      });
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── 音樂播放器 ───────────────────────────────
const audio        = document.getElementById('audio-el');
const playerCard   = document.getElementById('player-card');
const btnPlay      = document.getElementById('btn-play');
const iconPlay     = document.getElementById('icon-play');
const iconPause    = document.getElementById('icon-pause');
const progressBar  = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-fill');
const progressThumb= document.getElementById('progress-thumb');
const timeCurrent  = document.getElementById('time-current');
const timeTotal    = document.getElementById('time-total');

function formatTime(sec) {
  if (isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function setProgress(pct) {
  progressFill.style.width  = pct + '%';
  progressThumb.style.left  = pct + '%';
}

// 顯示總時長
audio.addEventListener('loadedmetadata', () => {
  timeTotal.textContent = formatTime(audio.duration);
});

// 更新進度條
audio.addEventListener('timeupdate', () => {
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  setProgress(pct);
  timeCurrent.textContent = formatTime(audio.currentTime);
});

// 播放結束
audio.addEventListener('ended', () => {
  iconPlay.style.display  = '';
  iconPause.style.display = 'none';
  playerCard.classList.remove('playing');
  setProgress(0);
  timeCurrent.textContent = '0:00';
});

// 播放 / 暫停按鈕
btnPlay?.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    iconPlay.style.display  = 'none';
    iconPause.style.display = '';
    playerCard.classList.add('playing');
  } else {
    audio.pause();
    iconPlay.style.display  = '';
    iconPause.style.display = 'none';
    playerCard.classList.remove('playing');
  }
});

// 點擊進度條跳轉
progressBar?.addEventListener('click', e => {
  if (!audio.duration) return;
  const rect = progressBar.getBoundingClientRect();
  audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
});

// 拖曳進度條
let isDragging = false;
progressBar?.addEventListener('mousedown', () => { isDragging = true; });
document.addEventListener('mousemove', e => {
  if (!isDragging || !audio.duration) return;
  const rect = progressBar.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  audio.currentTime = pct * audio.duration;
});
document.addEventListener('mouseup', () => { isDragging = false; });

// ── Lightbox ─────────────────────────────────
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <img id="lb-img" alt="放大圖片" />
  <button class="lightbox-close" aria-label="關閉">✕</button>
`;
document.body.appendChild(lightbox);

const lbImg   = lightbox.querySelector('#lb-img');
const lbClose = lightbox.querySelector('.lightbox-close');

document.querySelectorAll('.gallery-item img').forEach(img => {
  img.addEventListener('click', () => {
    lbImg.src = img.src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});
