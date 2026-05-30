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
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // 在鼠标周围生成粒子
    for (let i = 0; i < 2; i++) {
      particles.push({
        x: mouseX + (Math.random() - 0.5) * 20,
        y: mouseY + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        decay: 0.015 + Math.random() * 0.03,
        size: 1.5 + Math.random() * 3,
      });
    }
  });

  function animate() {
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
    navToggle.addEventListener('click', () => {
      navInner.classList.toggle('open');
    });
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

  // 生成横线
  for (let y = 80; y < h; y += 100 + Math.random() * 60) {
    const line = document.createElement('div');
    line.className = 'circuit-line horizontal';
    line.style.cssText = `
      top: ${y}px;
      left: ${Math.random() * 60}px;
      width: ${w - Math.random() * 120}px;
    `;
    fragment.appendChild(line);

    // 节点
    const dot = document.createElement('div');
    dot.className = 'circuit-dot';
    dot.style.cssText = `top: ${y - 3}px; left: ${Math.random() * w}px;`;
    fragment.appendChild(dot);
  }

  // 生成竖线
  for (let x = 60; x < w; x += 80 + Math.random() * 80) {
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
  for (let i = 0; i < 30; i++) {
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

/* ===== 统一初始化入口 ===== */
document.addEventListener('DOMContentLoaded', () => {
  // 打字机
  const twEl = document.getElementById('typewriter');
  if (twEl) {
    const tw = new Typewriter(twEl, [
      '电子信息工程 / 热爱硬件与代码',
      '在电路与程序之间寻找创造的乐趣',
      '欢迎来到我的小天地 ✨'
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

  // 电路板背景
  initCircuitBoard();

  // 标签云
  initTagCloud();

  // 文章区
  initArticles();

  // 项目卡片
  initProjects();
});

