/* ══════════════════════════════════════════════
   夢已如來 — 網站腳本
   ══════════════════════════════════════════════ */

// ── 版權年份 ─────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Loader ───────────────────────────────────
const loader     = document.getElementById('loader');
const loaderFill = document.getElementById('loader-fill');
let minTimeDone  = false;
let calcDone     = false;
let langDone     = false;

function dismissLoader() {
  if (!minTimeDone || !calcDone || !langDone) return;
  if (!document.getElementById('loader')) return; // 已移除
  loaderFill.style.width = '100%';
  setTimeout(() => {
    loader.classList.add('fading');
    setTimeout(() => {
      loader.classList.add('done');
      setTimeout(() => { loader.remove(); window.scrollTo(0, 0); }, 1100);
    }, 450);
  }, 500);
}

// ── 多語言翻譯 ───────────────────────────────
const translations = {
  zh: {
    'nav-music':'音樂','nav-about':'介紹','nav-gallery':'Gallery','nav-contact':'聯絡',
    'btn-listen':'▶ 立即收聽','btn-contact':'聯絡我們',
    'marquee':'最新單曲《春夏秋冬》上線',
    'sec-music':'MUSIC','h-music':'最新單曲','btn-dl':'↓ 下載 MP3',
    'sec-about':'ABOUT','h-about':'關於我們',
    'sec-gallery':'GALLERY','h-gallery':'影像',
    'sec-contact':'CONTACT','h-contact':'聯絡 / 演出邀約',
    'c-email':'Email','c-ig':'Instagram','c-yt':'YouTube',
    'eyebrow':"Dream Don't Come or Go",
  },
  en: {
    'nav-music':'Music','nav-about':'About','nav-gallery':'Gallery','nav-contact':'Contact',
    'btn-listen':'▶ Listen Now','btn-contact':'Contact Us',
    'marquee':'New Single《Spring Summer Autumn Winter》Out Now',
    'sec-music':'MUSIC','h-music':'Latest Single','btn-dl':'↓ Download MP3',
    'sec-about':'ABOUT','h-about':'About',
    'sec-gallery':'GALLERY','h-gallery':'Gallery',
    'sec-contact':'CONTACT','h-contact':'Contact / Booking',
    'c-email':'Email','c-ig':'Instagram','c-yt':'YouTube',
    'eyebrow':"Dream Don't Come or Go",
  },
  ja: {
    'nav-music':'音楽','nav-about':'紹介','nav-gallery':'ギャラリー','nav-contact':'連絡',
    'btn-listen':'▶ 今すぐ聴く','btn-contact':'お問い合わせ',
    'marquee':'最新シングル《春夏秋冬》配信中',
    'sec-music':'MUSIC','h-music':'最新シングル','btn-dl':'↓ MP3ダウンロード',
    'sec-about':'ABOUT','h-about':'バンドについて',
    'sec-gallery':'GALLERY','h-gallery':'ギャラリー',
    'sec-contact':'CONTACT','h-contact':'連絡 / ライブ依頼',
    'c-email':'メール','c-ig':'Instagram','c-yt':'YouTube',
    'eyebrow':"Dream Don't Come or Go",
  },
};

function applyLang(lang) {
  const t = translations[lang] || translations.zh;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = t[el.dataset.i18n];
    if (v !== undefined) el.textContent = v;
  });
  document.documentElement.lang = {zh:'zh-Hant',en:'en',ja:'ja'}[lang] || 'zh-Hant';
  localStorage.setItem('lang', lang);
  requestAnimationFrame(syncMarqueeWidth); // 文字換了就立刻重新對齊
}

// ── 語言選擇器初始化 ─────────────────────────
(function initLangPicker() {
  const pickBtns = document.querySelectorAll('.ldr-pick-btn');

  // 偵測瀏覽器語言或讀取已儲存選擇
  const saved = localStorage.getItem('lang');
  let detected = 'zh';
  if (!saved) {
    const nav = (navigator.language || '').toLowerCase();
    if (nav.startsWith('ja')) detected = 'ja';
    else if (nav.startsWith('en')) detected = 'en';
    else detected = 'zh';
  }
  const initLang = saved || detected;

  // 標記預設選取的按鈕
  pickBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === initLang));

  // 預套用語言（畫面先顯示正確語言，但仍等使用者點擊確認）
  applyLang(initLang);

  // 按鈕點擊
  pickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pickBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyLang(btn.dataset.lang);
      langDone = true;
      dismissLoader();
    });
  });

  // 防呆：8 秒內沒點就自動用預設語言繼續
  setTimeout(() => {
    if (!langDone) { langDone = true; dismissLoader(); }
  }, 8000);
})();

// 銀河星點
(function createLoaderStars() {
  const el = document.getElementById('loader');
  if (!el) return;
  // 星色：藍白、冷白、紫白、暖白
  const colors = ['255,255,255','200,215,255','210,195,255','255,248,220'];
  // ASCII 符號星
  const ascii = ['✦','✧','⋆','✸','⊹','✩','☆','∘','·'];

  for (let i = 0; i < 115; i++) {
    const isAscii = i >= 85; // 前 85 顆點狀，後 30 顆 ASCII
    const s = document.createElement(isAscii ? 'span' : 'div');
    const c = colors[Math.floor(Math.random() * colors.length)];
    // 70% 沿對角線銀河帶分布，30% 隨機散佈
    let left, top;
    if (Math.random() < .7) {
      const t = Math.random();
      left = 15 + t * 65 + (Math.random() - .5) * 18;
      top  = 10 + t * 78 + (Math.random() - .5) * 18;
    } else {
      left = Math.random() * 100;
      top  = Math.random() * 100;
    }
    s.className = 'ldr-star';
    if (isAscii) {
      const size = 5 + Math.random() * 7; // 5–12px
      s.textContent = ascii[Math.floor(Math.random() * ascii.length)];
      s.style.cssText = [
        `left:${left.toFixed(1)}%`,
        `top:${top.toFixed(1)}%`,
        `font-size:${size.toFixed(0)}px`,
        `color:rgb(${c})`,
        `background:transparent`,
        `line-height:1`,
        `animation-delay:${(Math.random() * 6).toFixed(2)}s`,
        `animation-duration:${(2 + Math.random() * 4).toFixed(2)}s`,
      ].join(';');
    } else {
      const big = Math.random() < .12;
      s.style.cssText = [
        `left:${left.toFixed(1)}%`,
        `top:${top.toFixed(1)}%`,
        `width:${big ? 2 : 1}px`,
        `height:${big ? 2 : 1}px`,
        `background:rgb(${c})`,
        `animation-delay:${(Math.random() * 5).toFixed(2)}s`,
        `animation-duration:${(1.5 + Math.random() * 3.5).toFixed(2)}s`,
        big ? `box-shadow:0 0 3px 1px rgba(${c},.5)` : '',
      ].join(';');
    }
    el.appendChild(s);
  }
})();

// 流星雨（避開中央文字區）
(function createMeteors() {
  const el = document.getElementById('loader');
  if (!el) return;
  let running = true;

  // 顏色：白、紫白、藍白、淡金
  const heads = ['255,255,255','220,210,255','195,215,255','255,248,200'];

  function spawn() {
    if (!running || !el.parentNode) return;

    const m       = document.createElement('div');
    m.className   = 'ldr-meteor';

    // 流星角度：往右下方落（30–55 度）
    const angle   = 30 + Math.random() * 25;
    const length  = 35 + Math.random() * 65;  // 尾巴長度 px
    const speed   = 380 + Math.random() * 520; // 持續時間 ms
    const c       = heads[Math.floor(Math.random() * heads.length)];

    // 起始點：左側邊緣 (0–28%) 或右側邊緣 (72–100%)
    const fromLeft = Math.random() < 0.5;
    const startX   = fromLeft
      ? Math.random() * 28
      : 72 + Math.random() * 28;
    const startY   = Math.random() * 45; // 上半部

    m.style.cssText = [
      `left:${startX}%`,
      `top:${startY}%`,
      `width:${length}px`,
      `transform:rotate(${angle}deg)`,
      `background:linear-gradient(to left,transparent 0%,rgba(${c},.2) 35%,rgba(${c},.95) 85%,rgb(${c}) 100%)`,
    ].join(';');

    el.appendChild(m);

    // 沿角度方向飛行，飛完就消失
    const rad  = angle * Math.PI / 180;
    const dist = 90 + Math.random() * 110;
    m.animate(
      [
        { transform: `rotate(${angle}deg) translateX(0)`,        opacity: 0 },
        { transform: `rotate(${angle}deg) translateX(${dist*.15}px)`, opacity: 1,   offset: 0.12 },
        { transform: `rotate(${angle}deg) translateX(${dist*.8}px)`,  opacity: 0.7, offset: 0.75 },
        { transform: `rotate(${angle}deg) translateX(${dist}px)`, opacity: 0 },
      ],
      { duration: speed, easing: 'ease-in' }
    ).onfinish = () => m.remove();

    setTimeout(spawn, 140 + Math.random() * 320);
  }

  spawn();

  // loader 移除後停止
  new MutationObserver((_, obs) => {
    if (!document.getElementById('loader')) { running = false; obs.disconnect(); }
  }).observe(document.body, { childList: true });
})();

// 最短顯示時間（讓動畫來得及看清楚）
setTimeout(() => { minTimeDone = true; dismissLoader(); }, 1800);

// ── 反彈文字對齊 h1 ──────────────────────────
function syncMarqueeWidth() {
  const title   = document.querySelector('.hero-title');
  const marquee = document.querySelector('.marquee');
  const track   = document.querySelector('.marquee-track');
  if (!title || !marquee || !track) return;

  marquee.style.width = '';
  const titleW = title.getBoundingClientRect().width;
  const trackW = track.getBoundingClientRect().width;
  marquee.style.width = titleW + 'px';

  const delta = titleW - trackW; // 負值 = 文字比標題寬，往左 ping-pong
  track.getAnimations().forEach(a => a.cancel());
  if (delta !== 0) {
    track.animate(
      [{ transform: 'translateX(0)' }, { transform: `translateX(${delta}px)` }],
      { duration: 2500, easing: 'ease-in-out', iterations: Infinity, direction: 'alternate' }
    );
  }

  // JS 計算完成，通知 loader
  calcDone = true;
  dismissLoader();
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

// ── 打字機效果（循環，可中途取消） ──────────
let _twGen = 0;
function typewriter(el, text, speed = 70) {
  const gen = ++_twGen;
  el.textContent = '';
  let i = 0;
  const type = () => {
    if (_twGen !== gen) return; // 被新呼叫取消
    el.textContent += text[i++];
    if (i < text.length) {
      setTimeout(type, speed);
    } else {
      setTimeout(() => { if (_twGen === gen) typewriter(el, text, speed); }, 2200);
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
