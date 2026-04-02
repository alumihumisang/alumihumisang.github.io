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
  // loader 完全遮住畫面時先偷偷滾到頂，使用者看不見移動
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  document.documentElement.style.scrollBehavior = '';
  loaderFill.style.width = '100%';
  setTimeout(() => {
    loader.classList.add('fading');
    setTimeout(() => {
      loader.classList.add('done');
      setTimeout(() => {
        loader.remove();
        // 給 iOS 400ms 緩衝，避免 loader 消失後的殘留事件誤觸發換圖
        setTimeout(() => {
          lastScrollY = window.scrollY;
          bgLocked    = false;
        }, 400);
      }, 1100);
    }, 450);
  }, 500);
}

// ── localStorage 安全包裝（iOS Safari 無痕模式 quota=0 會 throw） ──
function safeLSGet(k)    { try { return localStorage.getItem(k); }    catch(e) { return null; } }
function safeLSSet(k, v) { try { localStorage.setItem(k, v); }        catch(e) {} }

// ── 多語言翻譯 ───────────────────────────────
const translations = {
  zh: {
    'nav-music':'音樂','nav-about':'介紹','nav-gallery':'影像','nav-contact':'聯絡',
    'btn-listen':'▶ 立即收聽','btn-contact':'聯絡我們',
    'marquee':'最新單曲《春夏秋冬》上線',
    'player-title':'春夏秋冬',
    'sec-music':'MUSIC','h-music':'最新單曲','btn-dl':'↓ 下載 MP3',
    'sec-about':'ABOUT','h-about':'關於我們',
    'sec-gallery':'GALLERY','h-gallery':'影像',
    'nav-merch':'手作','sec-merch':'MERCH','h-merch':'迷你手作',
    'sec-contact':'CONTACT','h-contact':'聯絡 / 演出邀約',
    'c-email':'Email','c-ig':'Instagram','c-yt':'YouTube',
    'about-body':'你說人生如戲我說夢已如來<br />你說 電是靜止或移動 我說電是兒童<br />夢已經來或沒來了<br />我們還在這邊耍白痴<br />最接近電子的時刻<br />已經夢遺或是我是阿姨<br />樂團一直在這mono synth還在尋找他的衛星',
    'eyebrow':"Dream Don't Come or Go",
  },
  en: {
    'nav-music':'Music','nav-about':'About','nav-gallery':'Gallery','nav-contact':'Contact',
    'btn-listen':'▶ Listen Now','btn-contact':'Contact Us',
    'marquee':'New Single《Seasons》Out Now',
    'player-title':'Seasons',
    'sec-music':'MUSIC','h-music':'Latest Single','btn-dl':'↓ Download MP3',
    'sec-about':'ABOUT','h-about':'About',
    'sec-gallery':'GALLERY','h-gallery':'Gallery',
    'nav-merch':'Merch','sec-merch':'MERCH','h-merch':'Handmade Mini',
    'sec-contact':'CONTACT','h-contact':'Contact / Booking',
    'about-body':'You say life is a play — I say the dream is already here.<br />You ask if electricity stands still or moves — I say electricity is a child.<br />Did the dream come? Has it not come yet?<br />Either way, we\'re still here, fooling around.<br />The moment closest to the electron —<br />is it the afterimage of a dream,<br />or have I simply become someone\'s aunt?<br />The band is still here. The mono synth is still searching for its satellite.',
    'eyebrow':"Dream Don't Come or Go",
  },
  ja: {
    'nav-music':'音楽','nav-about':'紹介','nav-gallery':'ギャラリー','nav-contact':'連絡',
    'btn-listen':'▶ 今すぐ聴く','btn-contact':'お問い合わせ',
    'marquee':'最新シングル《春夏秋冬》配信中',
    'player-title':'春夏秋冬',
    'sec-music':'MUSIC','h-music':'最新シングル','btn-dl':'↓ MP3ダウンロード',
    'sec-about':'ABOUT','h-about':'バンドについて',
    'sec-gallery':'GALLERY','h-gallery':'ギャラリー',
    'nav-merch':'グッズ','sec-merch':'MERCH','h-merch':'ミニ手作り',
    'sec-contact':'CONTACT','h-contact':'連絡 / ライブ依頼',
    'about-body':'君は「人生は芝居だ」と言う<br />僕は「夢はもう来ている」と言う<br /><br />君は「電は止まっているのか、動いているのか」と言う<br />僕は「電は子どもだ」と言う<br /><br />夢は来たのか　まだ来ていないのか<br />それでも僕らはここでふざけている<br /><br />電子にいちばん近づく瞬間<br />それは夢の残像なのか<br />それとも僕はもうおばさんなのか<br /><br />バンドはずっとここにいる<br />mono synth はまだ 自分の衛星を探している',
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
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const v = t[el.dataset.i18nHtml];
    if (v !== undefined) el.innerHTML = v;
  });
  document.documentElement.lang = {zh:'zh-Hant',en:'en',ja:'ja'}[lang] || 'zh-Hant';
  safeLSSet('lang', lang);
  requestAnimationFrame(syncMarqueeWidth); // 文字換了就立刻重新對齊
}

// ── 語言選擇器初始化 ─────────────────────────
(function initLangPicker() {
  const pickBtns = document.querySelectorAll('.ldr-pick-btn');

  // 偵測瀏覽器語言或讀取已儲存選擇
  const saved = safeLSGet('lang');
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

const navEl = document.getElementById('nav');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  // 開啟選單時暫時移除 backdrop-filter，
  // 避免 iOS Safari 把子層 position:fixed 的基準變成 nav 而非 viewport
  const isOpen = navLinks.classList.contains('open');
  navEl.style.backdropFilter       = isOpen ? 'none' : '';
  navEl.style.webkitBackdropFilter = isOpen ? 'none' : '';
});

// 點選任一選單連結後收合
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    navEl.style.backdropFilter       = '';
    navEl.style.webkitBackdropFilter = '';
    // 跳轉時先讓所有區塊可見，避免快速捲動時產生殘影
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    revealLocked = true;
    setTimeout(() => { revealLocked = false; }, 1000);
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

// ── Reveal 捲動動畫（淡入 + 淡出雙向） ──────
let revealLocked = false; // 跳轉時暫停淡出，避免殘影

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      e.target.querySelectorAll('.gallery-item, .contact-card').forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.08}s`;
        child.classList.add('visible');
      });
    } else if (!revealLocked) {
      e.target.classList.remove('visible');
      e.target.querySelectorAll('.gallery-item, .contact-card').forEach(child => {
        child.style.transitionDelay = '0s';
        child.classList.remove('visible');
      });
    }
  });
}, { threshold: 0.1 });

// 延遲一幀，確保 opacity:0 的初始狀態先渲染，才開始監聽
setTimeout(() => {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}, 60);

// ── 捲動方向換底圖（往下→第一張，往上→第二張） ──
const BG_DOWN = "url('assets/img/coverrr.jpg')";
const BG_UP   = "url('assets/img/coverrr.jpg')";

const bgA = document.getElementById('bg-a');
const bgB = document.getElementById('bg-b');
let bgActive  = bgA;
let bgPending = bgB;
let bgCurrent = '';

// 初始化：進入時顯示底圖，不播動畫
bgA.style.backgroundImage = BG_DOWN;
bgCurrent = BG_DOWN;

function changeBg(url) {
  if (url === bgCurrent) return;
  bgCurrent = url;
  bgPending.style.backgroundImage = url;
  bgPending.style.opacity = '1';
  bgActive.style.opacity  = '0';
  [bgActive, bgPending] = [bgPending, bgActive];
}

let lastScrollY = window.scrollY;
let scrollDir   = 'down';
let bgLocked    = true; // loader 消失 + 緩衝期結束前鎖定，防止誤觸

function applyScrollDir(dir) {
  if (dir !== scrollDir) {
    scrollDir = dir;
    changeBg(dir === 'down' ? BG_DOWN : BG_UP);
  }
}

// 電腦版：scroll 事件
window.addEventListener('scroll', () => {
  if (bgLocked) return;
  const y = window.scrollY;
  if      (y > lastScrollY + 6) applyScrollDir('down');
  else if (y < lastScrollY - 6) applyScrollDir('up');
  lastScrollY = y;
}, { passive: true });

// 手機版：touch 事件（iOS Safari scroll 事件不可靠）
let touchStartY = 0;
window.addEventListener('touchstart', e => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });
window.addEventListener('touchend', e => {
  if (bgLocked) return;
  const diff = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(diff) > 30) applyScrollDir(diff > 0 ? 'down' : 'up');
}, { passive: true });

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

// 顯示總時長（durationchange 作為 iOS 的 fallback）
function updateDuration() {
  if (audio.duration && isFinite(audio.duration))
    timeTotal.textContent = formatTime(audio.duration);
}
audio.addEventListener('loadedmetadata', updateDuration);
audio.addEventListener('durationchange', updateDuration);

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
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
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

// 拖曳進度條（滑鼠 + 觸控）
let isDragging = false;

function seekToX(clientX) {
  if (!audio.duration) return;
  const rect = progressBar.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  audio.currentTime = pct * audio.duration;
}

progressBar?.addEventListener('mousedown', e => { e.preventDefault(); isDragging = true; seekToX(e.clientX); });
document.addEventListener('mousemove', e => { if (isDragging) seekToX(e.clientX); });
document.addEventListener('mouseup', () => { isDragging = false; });

// 觸控支援
progressBar?.addEventListener('touchstart', e => {
  isDragging = true;
  seekToX(e.touches[0].clientX);
}, { passive: true });
document.addEventListener('touchmove', e => {
  if (isDragging) seekToX(e.touches[0].clientX);
}, { passive: true });
document.addEventListener('touchend', () => { isDragging = false; });

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
