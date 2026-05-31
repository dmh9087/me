/* ===== 星空欢迎页 ===== */
(function() {
  // 同一次会话只显示一次
  if (sessionStorage.getItem('starGateEntered')) return;

  const gate = document.getElementById('starGate');
  const canvas = document.getElementById('starCanvas');
  const btnEnter = document.getElementById('btnEnter');
  if (!gate || !canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let shootingStars = [];
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();

  // 防抖 resize（避免窗口拖动时频繁重绘）
  let starResizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(starResizeTimer);
    starResizeTimer = setTimeout(() => {
      resize();
      initStars();
    }, 200);
  });

  function initStars() {
    stars = [];
    // 移动端进一步降低星星密度
    const isMobile = canvas.width < 768;
    const densityDivisor = isMobile ? 1600 : 800;
    const count = Math.floor((canvas.width * canvas.height) / densityDivisor);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        hue: 200 + Math.random() * 60, // 蓝白到暖黄
      });
    }
  }

  function spawnShootingStar() {
    shootingStars.push({
      x: Math.random() * canvas.width * 0.8,
      y: Math.random() * canvas.height * 0.4,
      vx: 4 + Math.random() * 6,
      vy: 2 + Math.random() * 3,
      life: 1,
      decay: 0.008 + Math.random() * 0.015,
      len: 60 + Math.random() * 100,
    });
  }

  function animate() {
    // 页面不可见时跳过绘制（但保持循环以便恢复）
    if (document.hidden) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制星星
    stars.forEach(s => {
      s.twinkleOffset += s.twinkleSpeed;
      const alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(s.twinkleOffset));
      const hue = s.hue;
      const sat = 30 + Math.random() * 20;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, ${sat}%, 80%, ${alpha})`;
      ctx.fill();

      // 亮星加光晕
      if (s.r > 1.5 && alpha > 0.75) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 40%, 90%, ${alpha * 0.1})`;
        ctx.fill();
      }
    });

    // 绘制流星
    shootingStars = shootingStars.filter(s => s.life > 0);
    shootingStars.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;

      const endX = s.x - s.vx * s.len * 0.02;
      const endY = s.y - s.vy * s.len * 0.02;

      const grad = ctx.createLinearGradient(s.x, s.y, endX, endY);
      grad.addColorStop(0, `rgba(255,255,255,${s.life})`);
      grad.addColorStop(1, `rgba(255,255,255,0)`);

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // 随机生成流星
    if (Math.random() < 0.008) {
      spawnShootingStar();
    }

    animationId = requestAnimationFrame(animate);
  }

  function enterSite() {
    cancelAnimationFrame(animationId);
    gate.classList.add('fade-out');
    sessionStorage.setItem('starGateEntered', '1');
    // 动画结束后移除 DOM
    gate.addEventListener('transitionend', () => {
      gate.remove();
    }, { once: true });
  }

  // 按钮点击
  if (btnEnter) {
    btnEnter.addEventListener('click', enterSite);
  }

  // 按 Enter 键进入
  document.addEventListener('keydown', function onEnter(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.removeEventListener('keydown', onEnter);
      enterSite();
    }
  });

  initStars();
  animationId = requestAnimationFrame(animate);
})();

/* ===== 打字机效果 ===== */
class Typewriter {
  constructor(element, texts, options = {}) {
    this.el = element;
    this.texts = Array.isArray(texts) ? texts : [texts];
    this.speed = options.speed || 80;
    this.pause = options.pause || 2000;
    this.deleteSpeed = options.deleteSpeed || 40;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.cursor = document.createElement('span');
    this.cursor.className = 'cursor';
    this.el.appendChild(this.cursor);
  }

  type() {
    const currentText = this.texts[this.textIndex];

    if (this.isDeleting) {
      this.el.childNodes[0].textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.el.childNodes[0].textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    if (!this.isDeleting && this.charIndex === currentText.length) {
      setTimeout(() => { this.isDeleting = true; this.tick(); }, this.pause);
      return;
    }

    if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      setTimeout(() => this.tick(), 400);
      return;
    }

    const delay = this.isDeleting ? this.deleteSpeed : this.speed;
    setTimeout(() => this.tick(), delay);
  }

  tick() {
    this.type();
  }

  start() {
    // 插入文本节点
    this.el.insertBefore(document.createTextNode(''), this.cursor);
    this.tick();
  }
}


/* ===== 鼠标粒子系统 ===== */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = -100;
  let mouseY = -100;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();

  // 防抖 resize
  let particleResizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(particleResizeTimer);
    particleResizeTimer = setTimeout(resize, 200);
  });

  // 检测是否为触摸设备（降低粒子密度）
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const particleRate = isTouchDevice ? 1 : 2;

  // 节流：移动端 touchmove 频率极高，限制粒子生成速率
  let lastParticleTime = 0;
  const PARTICLE_THROTTLE = isTouchDevice ? 50 : 16; // 触摸设备 20fps，桌面 60fps

  function spawnParticles(cx, cy, rate) {
    const now = performance.now();
    if (now - lastParticleTime < PARTICLE_THROTTLE) return;
    lastParticleTime = now;

    for (let i = 0; i < rate; i++) {
      particles.push({
        x: cx + (Math.random() - 0.5) * 20,
        y: cy + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        decay: 0.015 + Math.random() * 0.03,
        size: 1.5 + Math.random() * 3,
      });
    }
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    spawnParticles(mouseX, mouseY, particleRate);
  });

  // 触摸设备手指跟随（节流）
  let lastTouchTime = 0;
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
      // 触摸事件更激进地节流（30fps 足够流畅）
      const now = performance.now();
      if (now - lastTouchTime < 33) return;
      lastTouchTime = now;
      spawnParticles(mouseX, mouseY, particleRate);
    }
  }, { passive: true });

  function animate() {
    // 页面不可见时跳过绘制
    if (document.hidden) {
      requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(p => p.life > 0);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(194, 164, 74, ${p.life * 0.8})`;
      ctx.fill();

      // 光晕
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(194, 164, 74, ${p.life * 0.2})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}


/* ===== 导航滚动与高亮 ===== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section[id]');
  const navToggle = document.getElementById('navToggle');
  const navInner = document.querySelector('.nav-inner');

  // 点击导航链接平滑滚动
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      // 移动端关闭菜单
      if (navInner) navInner.classList.remove('open');
    });
  });

  // 汉堡菜单切换
  if (navToggle && navInner) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navInner.classList.toggle('open');
    });
  }

  // 移动端点击页面其他地方关闭菜单
  document.addEventListener('click', (e) => {
    if (navInner && navInner.classList.contains('open')) {
      if (!navInner.contains(e.target) && e.target !== navToggle) {
        navInner.classList.remove('open');
      }
    }
  });

  // 移动端左滑关闭菜单
  if (navInner) {
    let touchStartX = 0;
    navInner.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    navInner.addEventListener('touchmove', (e) => {
      if (!navInner.classList.contains('open')) return;
      const deltaX = e.touches[0].clientX - touchStartX;
      // 左滑超过 60px 关闭菜单
      if (deltaX < -60) {
        navInner.classList.remove('open');
      }
    }, { passive: true });
  }

  // 滚动时高亮当前板块
  function highlightNav() {
    let current = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= 120) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
}


/* ===== 通用工具函数 ===== */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ===== 留言墙 ===== */
function initMessageWall() {
  const form = document.getElementById('msgForm');
  const wall = document.getElementById('stickyWall');
  const STORAGE_KEY = 'handdrawn_messages';

  function loadMessages() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveMessages(msgs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  }

  function renderMessages() {
    const messages = loadMessages();
    if (!wall) return;

    wall.innerHTML = '';
    messages.forEach((msg, index) => {
      const note = document.createElement('div');
      note.className = 'sticky-note';
      note.style.transform = `rotate(${(Math.random() - 0.5) * 6}deg)`;

      const time = new Date(msg.timestamp).toLocaleDateString('zh-CN');

      note.innerHTML = `
        <div class="note-author">${escapeHtml(msg.name)}</div>
        <div class="note-body">${escapeHtml(msg.content)}</div>
        <div class="note-time">${time}</div>
        <button class="note-delete" data-index="${index}" title="撕掉">✕</button>
      `;

      wall.appendChild(note);
    });

    // 绑定删除事件
    wall.querySelectorAll('.note-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        const msgs = loadMessages();
        msgs.splice(idx, 1);
        saveMessages(msgs);
        renderMessages();
      });
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('msgName');
      const contentInput = document.getElementById('msgContent');

      const name = nameInput.value.trim();
      const content = contentInput.value.trim();

      if (!name || !content) return;

      const messages = loadMessages();
      messages.push({
        name,
        content,
        timestamp: Date.now(),
      });
      saveMessages(messages);

      nameInput.value = '';
      contentInput.value = '';
      renderMessages();
    });
  }

  // 初始渲染
  renderMessages();
}

/* ===== 音乐角 ===== */
function initMusicCorner() {
  const form = document.getElementById('musicForm');
  const playlistEl = document.getElementById('playlist');
  const audio = document.getElementById('audioPlayer');
  const neteaseEl = document.getElementById('neteasePlayer');
  const display = document.getElementById('radioDisplay');
  const STORAGE_KEY = 'handdrawn_playlist';

  // 解析网易云链接，提取歌曲 ID
  function parseNeteaseUrl(url) {
    // 匹配各种网易云链接格式
    const neteaseRegex = /music\.163\.com/;
    if (!neteaseRegex.test(url)) return null;

    // 优先从 query 参数提取 id: ?id=123456
    const queryMatch = url.match(/[?&]id=(\d+)/);
    if (queryMatch) return queryMatch[1];

    // 从路径中提取: /song/123456/ 或 /song?id=123456
    const pathMatch = url.match(/\/song\/(\d+)/);
    if (pathMatch) return pathMatch[1];

    // 尝试匹配任何纯数字 ID
    const idMatch = url.match(/(\d{6,12})/);
    if (idMatch) return idMatch[1];

    return null;
  }

  function loadPlaylist() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function savePlaylist(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  // 停止当前播放（同时停止 iframe 和 audio）
  function stopCurrent() {
    audio.pause();
    audio.src = '';
    if (neteaseEl) {
      neteaseEl.innerHTML = '';
      neteaseEl.style.display = 'none';
    }
    audio.style.display = '';
  }

  // 播放指定曲目
  function playTrack(track) {
    stopCurrent();

    if (track.type === 'netease' && track.neteaseId && neteaseEl) {
      // 网易云外链播放器
      const iframe = document.createElement('iframe');
      iframe.src = `https://music.163.com/outchain/player?type=2&id=${track.neteaseId}&auto=1&height=66`;
      iframe.frameBorder = '0';
      neteaseEl.innerHTML = '';
      neteaseEl.appendChild(iframe);
      neteaseEl.style.display = 'block';
      audio.style.display = 'none';
      if (display) {
        display.querySelector('.radio-text').textContent = `🔴 ${track.title}`;
      }
    } else {
      // 直接音频链接
      audio.src = track.url;
      audio.play().catch(() => {});
      if (display) {
        display.querySelector('.radio-text').textContent = `🎵 ${track.title}`;
      }
    }
  }

  function renderPlaylist() {
    const list = loadPlaylist();
    if (!playlistEl) return;

    playlistEl.innerHTML = '';
    list.forEach((track, index) => {
      const isNetease = track.type === 'netease';
      const badge = isNetease ? '<span class="pl-netease-badge">网易云</span>' : '';

      const li = document.createElement('li');
      li.innerHTML = `
        <span class="pl-title">${escapeHtml(track.title)}${badge}</span>
        <button class="pl-delete" data-index="${index}">✕</button>
      `;

      // 点击歌曲名播放
      li.querySelector('.pl-title').addEventListener('click', () => {
        playTrack(track);
      });

      // 删除
      li.querySelector('.pl-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        const list = loadPlaylist();
        list.splice(index, 1);
        savePlaylist(list);
        renderPlaylist();
      });

      playlistEl.appendChild(li);
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('musicTitle');
      const urlInput = document.getElementById('musicUrl');

      const title = titleInput.value.trim();
      const url = urlInput.value.trim();

      if (!title || !url) return;

      const neteaseId = parseNeteaseUrl(url);
      const track = {
        title,
        url,
        type: neteaseId ? 'netease' : 'direct',
      };
      if (neteaseId) {
        track.neteaseId = neteaseId;
      }

      const list = loadPlaylist();
      list.push(track);
      savePlaylist(list);

      titleInput.value = '';
      urlInput.value = '';
      renderPlaylist();
    });
  }

  // audio 播放状态更新显示
  if (audio && display) {
    audio.addEventListener('play', () => {
      const list = loadPlaylist();
      const current = list.find(t => t.url === audio.src);
      if (current) {
        display.querySelector('.radio-text').textContent = `🎵 ${current.title}`;
      }
    });

    audio.addEventListener('pause', () => {
      // 仅当没有网易云在播放时显示暂停
      if (!neteaseEl || neteaseEl.style.display === 'none') {
        display.querySelector('.radio-text').textContent = '📻 已暂停';
      }
    });
  }

  renderPlaylist();
}


/* ===== 电路板背景生成 ===== */
function initCircuitBoard() {
  const container = document.getElementById('circuitBg');
  if (!container) return;

  const fragment = document.createDocumentFragment();
  const w = window.innerWidth;
  const h = window.innerHeight;
  const isMobile = w < 768;

  // 移动端降低密度
  const hStep = isMobile ? 180 : 100;
  const vStep = isMobile ? 160 : 80;
  const ledCount = isMobile ? 12 : 30;

  // 生成横线
  for (let y = 80; y < h; y += hStep + Math.random() * 60) {
    const line = document.createElement('div');
    line.className = 'circuit-line horizontal';
    line.style.cssText = `
      top: ${y}px;
      left: ${Math.random() * 60}px;
      width: ${w - Math.random() * 120}px;
    `;
    fragment.appendChild(line);

    // 节点（移动端减半）
    if (!isMobile || Math.random() > 0.4) {
      const dot = document.createElement('div');
      dot.className = 'circuit-dot';
      dot.style.cssText = `top: ${y - 3}px; left: ${Math.random() * w}px;`;
      fragment.appendChild(dot);
    }
  }

  // 生成竖线
  for (let x = 60; x < w; x += vStep + Math.random() * 80) {
    const line = document.createElement('div');
    line.className = 'circuit-line vertical';
    line.style.cssText = `
      left: ${x}px;
      top: ${Math.random() * 40}px;
      height: ${h - Math.random() * 80}px;
    `;
    fragment.appendChild(line);
  }

  // 生成 LED 点
  const ledColors = ['red', 'green', 'yellow'];
  for (let i = 0; i < ledCount; i++) {
    const led = document.createElement('div');
    const color = ledColors[Math.floor(Math.random() * 3)];
    led.className = `circuit-led ${color}`;
    led.style.cssText = `
      top: ${80 + Math.random() * (h - 160)}px;
      left: ${60 + Math.random() * (w - 120)}px;
      animation-delay: ${Math.random() * 3}s;
    `;
    fragment.appendChild(led);
  }

  container.appendChild(fragment);

  // 窗口 resize 时重建
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      container.innerHTML = '';
      initCircuitBoard();
    }, 300);
  });
}


/* ===== 技术栈标签云 ===== */
function initTagCloud() {
  const container = document.getElementById('tagCloud');
  if (!container) return;

  const skills = [
    'C/C++', 'Python', 'Verilog', '嵌入式系统', 'STM32',
    'PCB Design', 'Altium Designer', 'Multisim', '数字电路',
    '模拟电路', '信号处理', 'MATLAB', 'HTML/CSS', 'JavaScript',
    'Git', 'Linux', 'RTOS', 'FPGA', '通信原理',
  ];

  const colors = ['#2c3e50', '#5a8f7b', '#c2a44a', '#8b5e3c', '#5a6c7d'];

  skills.forEach(skill => {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = skill;
    tag.style.transform = `rotate(${(Math.random() - 0.5) * 4}deg)`;
    tag.style.color = colors[Math.floor(Math.random() * colors.length)];
    tag.style.borderColor = tag.style.color;
    container.appendChild(tag);
  });
}

/* ===== 项目卡片动态渲染 ===== */
function initProjects() {
  const container = document.getElementById('projectGrid');
  if (!container) return;

  const projects = [
    {
      title: '智能温控系统',
      desc: '基于 STM32 的 PID 温控器，带 OLED 显示和蓝牙远程监控。',
      link: '#',
      rot: '-1.5deg',
    },
    {
      title: '数字示波器',
      desc: '用 FPGA + ADC 实现的便携示波器，支持 FFT 频谱分析。',
      link: '#',
      rot: '0.8deg',
    },
    {
      title: '智能小狗机器人',
      desc: '基于 STM32 的智能小狗，带触摸功能和语音识别功能。',
      link: '#',
      rot: '-0.5deg',
    },
    {
      title: '个人博客站',
      desc: '手绘风格的前端作品，电路板主题，纯 HTML/CSS/JS 实现。',
      link: '#',
      rot: '1.2deg',
    },
  ];

  projects.forEach(proj => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.setProperty('--rot', proj.rot);
    card.innerHTML = `
      <h3>${escapeHtml(proj.title)}</h3>
      <p>${escapeHtml(proj.desc)}</p>
      <a href="${escapeHtml(proj.link)}" class="proj-link">了解更多 →</a>
    `;
    container.appendChild(card);
  });
}

/* ===== 文章区 ===== */
function initArticles() {
  const btnNew = document.getElementById('btnNewArticle');
  const editor = document.getElementById('articleEditor');
  const form = document.getElementById('articleForm');
  const titleInput = document.getElementById('articleTitle');
  const contentInput = document.getElementById('articleContent');
  const editIndex = document.getElementById('editIndex');
  const cancelBtn = document.getElementById('btnCancelArticle');
  const listEl = document.getElementById('articleList');
  const STORAGE_KEY = 'handdrawn_articles';

  function loadArticles() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveArticles(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function showEditor(show) {
    editor.style.display = show ? 'block' : 'none';
    btnNew.style.display = show ? 'none' : 'inline-block';
  }

  function resetForm() {
    titleInput.value = '';
    contentInput.value = '';
    editIndex.value = '-1';
  }

  function renderArticles() {
    const articles = loadArticles();
    if (!listEl) return;

    listEl.innerHTML = '';
    if (articles.length === 0) {
      listEl.innerHTML = '<p style="text-align:center;color:var(--ink-light);padding:2rem;">📄 还没有文章，点击上方按钮写一篇吧</p>';
      return;
    }

    articles.forEach((article, index) => {
      const card = document.createElement('div');
      card.className = 'article-card';
      card.style.setProperty('--arot', `${(Math.random() - 0.5) * 2}deg`);

      const time = new Date(article.timestamp).toLocaleString('zh-CN', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });

      card.innerHTML = `
        <h3>${escapeHtml(article.title)}</h3>
        <div class="article-meta">📅 ${time}</div>
        <div class="article-body">${escapeHtml(article.content)}</div>
        <div class="article-actions">
          <button class="btn-article-action btn-edit" data-index="${index}">✏️ 编辑</button>
          <button class="btn-article-action btn-delete" data-index="${index}">🗑 删除</button>
        </div>
      `;

      // 编辑按钮
      card.querySelector('.btn-edit').addEventListener('click', () => {
        const articles = loadArticles();
        const article = articles[index];
        titleInput.value = article.title;
        contentInput.value = article.content;
        editIndex.value = index;
        showEditor(true);
        titleInput.focus();
      });

      // 删除按钮
      card.querySelector('.btn-delete').addEventListener('click', () => {
        if (!confirm('确定要删除这篇文章吗？')) return;
        const articles = loadArticles();
        articles.splice(index, 1);
        saveArticles(articles);
        renderArticles();
      });

      listEl.appendChild(card);
    });
  }

  // 新建文章按钮
  if (btnNew) {
    btnNew.addEventListener('click', () => {
      resetForm();
      showEditor(true);
      titleInput.focus();
    });
  }

  // 取消按钮
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      resetForm();
      showEditor(false);
    });
  }

  // 表单提交
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = titleInput.value.trim();
      const content = contentInput.value.trim();
      if (!title || !content) return;

      const articles = loadArticles();
      const idx = parseInt(editIndex.value, 10);

      if (idx >= 0 && idx < articles.length) {
        // 编辑模式 — 保留原时间戳
        articles[idx].title = title;
        articles[idx].content = content;
        articles[idx].editedAt = Date.now();
      } else {
        // 新建模式
        articles.push({
          title,
          content,
          timestamp: Date.now(),
        });
      }

      saveArticles(articles);
      resetForm();
      showEditor(false);
      renderArticles();
    });
  }

  renderArticles();
}

/* ===== 进制转换器 ===== */
function initConverter() {
  const input = document.getElementById('convInput');
  const baseBtns = document.querySelectorAll('.base-btn');
  const nixieValue = document.getElementById('nixieValue');
  const nixieLabel = document.getElementById('nixieLabel');
  const hint = document.getElementById('convHint');
  const resEls = {
    2:  document.getElementById('resBin'),
    8:  document.getElementById('resOct'),
    10: document.getElementById('resDec'),
    16: document.getElementById('resHex'),
  };
  const cards = document.querySelectorAll('.result-card');

  let currentBase = 10;

  const baseNames = { 2: 'BIN', 8: 'OCT', 10: 'DEC', 16: 'HEX' };

  // 验证输入对应当前进制是否合法
  function isValidForBase(val, base) {
    const regexMap = {
      2:  /^[01]+$/,
      8:  /^[0-7]+$/,
      10: /^[0-9]+$/,
      16: /^[0-9a-fA-F]+$/,
    };
    return regexMap[base].test(val);
  }

  function convert() {
    const raw = input.value.trim();

    // 清空结果
    if (!raw) {
      Object.values(resEls).forEach(el => { if (el) el.textContent = '—'; });
      nixieValue.textContent = '0';
      nixieLabel.textContent = baseNames[currentBase];
      hint.textContent = '👆 先选择输入进制，再输入数字，结果实时显示';
      hint.style.color = '';
      cards.forEach(c => c.classList.remove('highlight'));
      return;
    }

    // 验证
    if (!isValidForBase(raw, currentBase)) {
      nixieValue.textContent = 'ERROR';
      nixieValue.style.color = '#ff6666';
      nixieValue.style.textShadow = '0 0 8px rgba(255,100,100,0.6)';
      hint.textContent = `⚠️ 输入不合法 — 不是有效的 ${baseNames[currentBase]} 数字`;
      hint.style.color = '#c44';
      Object.values(resEls).forEach(el => { if (el) el.textContent = '—'; });
      cards.forEach(c => c.classList.remove('highlight'));
      return;
    }

    // 解析 & 转换
    const decimal = parseInt(raw, currentBase);

    if (isNaN(decimal)) {
      nixieValue.textContent = 'ERROR';
      nixieValue.style.color = '#ff6666';
      return;
    }

    // 更新显示屏
    nixieValue.style.color = '#7cfc7c';
    nixieValue.style.textShadow = '0 0 8px rgba(124,252,124,0.6), 0 0 20px rgba(124,252,124,0.2)';
    nixieValue.textContent = decimal.toString(10);
    nixieLabel.textContent = baseNames[currentBase];

    // 更新四个结果
    const results = {
      2:  decimal.toString(2),
      8:  decimal.toString(8),
      10: decimal.toString(10),
      16: decimal.toString(16).toUpperCase(),
    };

    Object.entries(results).forEach(([base, val]) => {
      const el = resEls[base];
      if (el) el.textContent = val;
    });

    // 高亮当前进制的结果卡片
    cards.forEach(c => {
      const cardBase = parseInt(c.dataset.base, 10);
      if (cardBase === currentBase) {
        c.classList.add('highlight');
      } else {
        c.classList.remove('highlight');
      }
    });

    hint.textContent = `✅ ${baseNames[currentBase]} → BIN / OCT / DEC / HEX`;
    hint.style.color = '';
  }

  // 进制选择
  if (baseBtns.length) {
    baseBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        baseBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentBase = parseInt(btn.dataset.base, 10);
        convert();
      });
    });
  }

  // 实时输入
  if (input) {
    input.addEventListener('input', convert);
  }
}

/* ===== 统一初始化入口 ===== */
document.addEventListener('DOMContentLoaded', () => {
  // 打字机
  const twEl = document.getElementById('typewriter');
  if (twEl) {
    const tw = new Typewriter(twEl, [
      '电子信息工程 / 热爱硬件与代码',
      '在电路与程序之间寻找创造的乐趣',
      '欢迎来到我的世界 ✨'
    ], { speed: 70, pause: 2500 });
    tw.start();
  }

  // 粒子系统
  initParticles();

  // 导航
  initNavigation();

  // 留言墙
  initMessageWall();

  // 音乐角
  initMusicCorner();

  // 非关键初始化延迟到空闲时执行（减少首帧阻塞）
  const runDeferred = window.requestIdleCallback || setTimeout;
  runDeferred(() => {
    initCircuitBoard();
  });

  // 标签云
  initTagCloud();

  // 进制转换器
  initConverter();

  // 文章区
  initArticles();

  // 项目卡片
  initProjects();
});

