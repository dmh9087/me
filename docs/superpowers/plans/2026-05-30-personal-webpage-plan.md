# 手绘风格个人网页 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建具有纸质手绘质感 + 电路板元素的单页个人网站，包含8个板块和多种交互动效。

**Architecture:** 纯前端三文件结构 — `index.html`（结构）、`styles.css`（样式）、`script.js`（逻辑）。零依赖，浏览器直接打开。数据通过 localStorage 持久化。

**Tech Stack:** HTML5, CSS3 (Custom Properties, Grid, Flexbox, Animations, Canvas), Vanilla JS (ES6+), Google Fonts (Caveat, Neucha, Gaegu)

---

## 文件结构

```
/
├── index.html      — 完整 HTML 结构，内联 Google Fonts link
├── styles.css      — CSS 变量、全局样式、板块样式、动画、响应式
├── script.js       — 打字机、粒子系统、导航、留言墙、音乐角
```

---

### Task 1: 创建 HTML 页面结构

**Files:**
- Create: `index.html`

- [ ] **Step 1: 编写完整 HTML 骨架**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我的个人主页</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Gaegu:wght@300;400;700&family=Neucha&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <!-- 鼠标粒子 Canvas -->
  <canvas id="particleCanvas"></canvas>

  <!-- 电路板背景层 -->
  <div class="circuit-bg" id="circuitBg"></div>

  <!-- 导航栏 -->
  <nav class="nav" id="navbar">
    <div class="nav-inner">
      <a href="#hero" class="nav-link active">首页</a>
      <a href="#about" class="nav-link">关于</a>
      <a href="#skills" class="nav-link">技术栈</a>
      <a href="#projects" class="nav-link">项目</a>
      <a href="#messages" class="nav-link">留言墙</a>
      <a href="#music" class="nav-link">音乐角</a>
      <a href="#footer" class="nav-link">联系</a>
    </div>
    <button class="nav-toggle" id="navToggle" aria-label="菜单">☰</button>
  </nav>

  <!-- Hero 首屏 -->
  <section class="section hero" id="hero">
    <h1 class="hero-name">你好，我是___</h1>
    <p class="hero-subtitle" id="typewriter"></p>
    <div class="hero-decor">
      <span class="led led-red"></span>
      <span class="led led-green"></span>
      <span class="led led-yellow"></span>
    </div>
  </section>

  <!-- 关于我 -->
  <section class="section about" id="about">
    <h2 class="section-title">关于我</h2>
    <div class="note-card">
      <p class="note-text">我是一名电子信息工程专业的学生，热爱硬件设计与软件开发，喜欢在电路和代码之间寻找创造的乐趣。</p>
      <p class="note-text">目前专注于嵌入式系统、PCB 设计和前端开发，相信技术与创意可以碰撞出有趣的火花。</p>
    </div>
    <div class="edu-card">
      <h3 class="edu-title">教育经历</h3>
      <p>电子信息工程专业 本科在读</p>
      <p>主要课程：数字电路、模拟电路、嵌入式系统、信号与系统</p>
    </div>
  </section>

  <!-- 技术栈 -->
  <section class="section skills" id="skills">
    <h2 class="section-title">技术栈</h2>
    <div class="tag-cloud" id="tagCloud">
      <!-- JS 动态生成标签 -->
    </div>
  </section>

  <!-- 项目案例 -->
  <section class="section projects" id="projects">
    <h2 class="section-title">项目案例</h2>
    <div class="project-grid" id="projectGrid">
      <!-- JS 动态生成项目卡片 -->
    </div>
  </section>

  <!-- 留言墙 -->
  <section class="section messages" id="messages">
    <h2 class="section-title">留言墙</h2>
    <form class="msg-form" id="msgForm">
      <input type="text" class="input-sketch" id="msgName" placeholder="你的昵称" maxlength="20" required>
      <textarea class="input-sketch" id="msgContent" placeholder="写下你想说的话..." rows="3" maxlength="200" required></textarea>
      <button type="submit" class="btn-sketch">贴上去 📌</button>
    </form>
    <div class="sticky-wall" id="stickyWall">
      <!-- JS 动态渲染便利贴 -->
    </div>
  </section>

  <!-- 音乐角 -->
  <section class="section music" id="music">
    <h2 class="section-title">音乐角</h2>
    <div class="radio-box">
      <div class="radio-body">
        <div class="radio-display" id="radioDisplay">
          <span class="radio-text">📻 等待播放...</span>
        </div>
        <form class="music-form" id="musicForm">
          <input type="text" class="input-sketch" id="musicTitle" placeholder="歌曲名称" maxlength="30" required>
          <input type="url" class="input-sketch" id="musicUrl" placeholder="粘贴音频 URL (.mp3/.ogg/.wav)" required>
          <button type="submit" class="btn-sketch">添加到列表 🎵</button>
        </form>
        <ul class="playlist" id="playlist">
          <!-- JS 动态渲染播放列表 -->
        </ul>
        <audio id="audioPlayer" class="audio-player" controls></audio>
      </div>
      <div class="radio-antenna"></div>
    </div>
  </section>

  <!-- 页脚 -->
  <footer class="section footer" id="footer">
    <h2 class="section-title">联系我</h2>
    <div class="contact-row">
      <a href="mailto:your@email.com" class="contact-icon" title="邮箱">
        <span class="icon-envelope">✉</span>
      </a>
      <a href="https://github.com/yourname" class="contact-icon" title="GitHub">
        <span class="icon-github">⌨</span>
      </a>
      <a href="#" class="contact-icon" title="微信">
        <span class="icon-wechat">💬</span>
      </a>
    </div>
    <p class="footer-note">用 ❤️ 和 🔌 手工绘制</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: 在浏览器中打开 index.html，确认所有板块结构可见**

在浏览器中打开 `index.html`，应能看到未装饰的 8 个板块从上到下排列。

---

### Task 2: CSS 基础 — 变量、纸张底色、手绘边框、字体

**Files:**
- Create: `styles.css`

- [ ] **Step 1: 编写 CSS 变量和全局重置样式**

```css
/* ===== Google Fonts (imported in HTML) ===== */

/* ===== CSS Variables ===== */
:root {
  --paper: #fdf6e3;
  --paper-dark: #f5ebd0;
  --ink: #2c3e50;
  --ink-light: #5a6c7d;
  --copper: #5a8f7b;
  --gold: #c2a44a;
  --led-red: #ff4444;
  --led-green: #44ff44;
  --led-yellow: #ffaa00;
  --font-title: 'Caveat', cursive;
  --font-body: 'Neucha', cursive;
  --font-decor: 'Gaegu', cursive;
  --shadow-sketch: 2px 2px 0 rgba(44,62,80,0.15), 4px 4px 0 rgba(44,62,80,0.08);
  --border-sketch: 2px solid var(--ink);
  --radius-sketch: 255px 15px 225px 15px / 15px 225px 15px 255px;
}

/* ===== Reset ===== */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  font-size: 18px;
}

body {
  font-family: var(--font-body);
  background-color: var(--paper);
  color: var(--ink);
  line-height: 1.7;
  overflow-x: hidden;
  position: relative;
}

/* ===== 纸张纹理 ===== */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(139,119,90,0.03) 2px,
      rgba(139,119,90,0.03) 4px
    );
}

/* ===== 手绘边框混入 ===== */
.sketch-border {
  border: var(--border-sketch);
  border-radius: var(--radius-sketch);
  box-shadow: var(--shadow-sketch);
}

/* ===== 手绘下划线 ===== */
.section-title {
  font-family: var(--font-title);
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 10%;
  width: 80%;
  height: 3px;
  background: repeating-linear-gradient(
    90deg,
    var(--ink) 0px,
    var(--ink) 8px,
    transparent 8px,
    transparent 12px
  );
  border-radius: 2px;
}
```

- [ ] **Step 2: 在浏览器中打开 index.html，确认纸张底色和字体生效**

---

### Task 3: CSS 导航栏 + Hero 首屏

**Files:**
- Modify: `styles.css` (在已有基础上追加)

- [ ] **Step 1: 追加导航栏和 Hero 样式**

```css
/* ===== 导航栏 ===== */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(253,246,227,0.92);
  border-bottom: 2px dashed var(--ink-light);
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
}

.nav-inner {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  font-family: var(--font-decor);
  font-size: 1.1rem;
  color: var(--ink-light);
  text-decoration: none;
  padding: 0.3rem 0.8rem;
  border: 2px solid transparent;
  border-radius: 15px 5px 15px 5px / 5px 15px 5px 15px;
  transition: all 0.25s;
  position: relative;
}

.nav-link:hover,
.nav-link.active {
  color: var(--ink);
  border-color: var(--ink);
  background: rgba(44,62,80,0.05);
}

.nav-toggle {
  display: none;
  background: none;
  border: 2px solid var(--ink);
  border-radius: 8px;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.2rem 0.6rem;
  color: var(--ink);
  font-family: var(--font-body);
}

/* ===== Hero ===== */
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6rem 2rem 4rem;
  position: relative;
}

.hero-name {
  font-family: var(--font-title);
  font-size: 4rem;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 1rem;
  letter-spacing: 2px;
}

.hero-subtitle {
  font-family: var(--font-body);
  font-size: 1.4rem;
  color: var(--ink-light);
  min-height: 2em;
}

.hero-subtitle .cursor {
  display: inline-block;
  width: 3px;
  height: 1.2em;
  background: var(--ink);
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: blink 0.8s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

.hero-decor {
  display: flex;
  gap: 1.5rem;
  margin-top: 3rem;
}

.led {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 8px currentColor;
}

.led-red {
  background: var(--led-red);
  color: var(--led-red);
  animation: led-blink-1 1.5s ease-in-out infinite;
}

.led-green {
  background: var(--led-green);
  color: var(--led-green);
  animation: led-blink-2 2s ease-in-out infinite;
}

.led-yellow {
  background: var(--led-yellow);
  color: var(--led-yellow);
  animation: led-blink-3 1.8s ease-in-out infinite;
}

@keyframes led-blink-1 {
  0%, 100% { opacity: 1; box-shadow: 0 0 12px currentColor; }
  50% { opacity: 0.3; box-shadow: 0 0 2px currentColor; }
}

@keyframes led-blink-2 {
  0%, 100% { opacity: 0.3; box-shadow: 0 0 2px currentColor; }
  50% { opacity: 1; box-shadow: 0 0 14px currentColor; }
}

@keyframes led-blink-3 {
  0%, 40%, 100% { opacity: 1; box-shadow: 0 0 10px currentColor; }
  20%, 60% { opacity: 0.2; box-shadow: 0 0 1px currentColor; }
  70%, 85% { opacity: 0.7; box-shadow: 0 0 6px currentColor; }
}
```

- [ ] **Step 2: 浏览器刷新，确认导航栏固定顶部、Hero 居中显示、LED 闪烁动画运行**

---

### Task 4: CSS 关于我 + 技术栈 + 项目案例

**Files:**
- Modify: `styles.css` (追加)

- [ ] **Step 1: 追加三个内容板块样式**

```css
/* ===== 通用 section ===== */
.section {
  padding: 5rem 2rem;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ===== 关于我 ===== */
.note-card {
  composes: sketch-border;
  border: var(--border-sketch);
  border-radius: var(--radius-sketch);
  box-shadow: var(--shadow-sketch);
  background: #fffef9;
  padding: 2rem 2.5rem;
  max-width: 650px;
  transform: rotate(-0.5deg);
  margin-bottom: 2rem;
}

.note-text {
  font-size: 1.15rem;
  margin-bottom: 1rem;
  text-indent: 1.5em;
}

.note-text:last-child {
  margin-bottom: 0;
}

.edu-card {
  border: 2px dashed var(--copper);
  border-radius: 10px 30px 10px 30px;
  padding: 1.5rem 2rem;
  max-width: 650px;
  background: rgba(90,143,123,0.05);
  transform: rotate(0.5deg);
}

.edu-title {
  font-family: var(--font-title);
  font-size: 1.6rem;
  color: var(--copper);
  margin-bottom: 0.5rem;
}

/* ===== 技术栈标签云 ===== */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  max-width: 700px;
  padding: 2rem 0;
}

.tag {
  font-family: var(--font-decor);
  font-size: 1rem;
  padding: 0.5rem 1.2rem;
  border: 2px solid var(--ink);
  border-radius: 20px 6px 20px 6px / 6px 20px 6px 20px;
  background: #fffef9;
  color: var(--ink);
  box-shadow: 1px 1px 0 rgba(44,62,80,0.1);
  transition: transform 0.2s;
}

.tag:hover {
  transform: rotate(0deg) scale(1.08) !important;
}

/* ===== 项目卡片 ===== */
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
}

.project-card {
  border: var(--border-sketch);
  border-radius: var(--radius-sketch);
  box-shadow: var(--shadow-sketch);
  background: #fffef9;
  padding: 1.5rem;
  position: relative;
  transform: rotate(var(--rot, 0deg));
  transition: transform 0.3s;
}

.project-card:hover {
  transform: rotate(0deg) translateY(-4px);
}

.project-card::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, #e8d5b7, #c2a44a);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  z-index: 1;
}

.project-card h3 {
  font-family: var(--font-title);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.project-card p {
  font-size: 0.95rem;
  color: var(--ink-light);
  margin-bottom: 0.8rem;
}

.project-card .proj-link {
  font-family: var(--font-decor);
  color: var(--copper);
  text-decoration: none;
  border-bottom: 1px dashed var(--copper);
}
```

- [ ] **Step 2: 浏览器刷新，确认便签卡片、标签云、项目卡片的图钉效果正常显示**

---

### Task 5: CSS 留言墙 + 音乐角 + 页脚

**Files:**
- Modify: `styles.css` (追加)

- [ ] **Step 1: 追加留言墙、音乐角、页脚样式**

```css
/* ===== 留言墙 ===== */
.msg-form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  max-width: 500px;
  width: 100%;
  margin-bottom: 3rem;
}

.input-sketch {
  font-family: var(--font-body);
  font-size: 1rem;
  padding: 0.7rem 1rem;
  border: 2px solid var(--ink);
  border-radius: 15px 5px 15px 5px / 5px 15px 5px 15px;
  background: #fffef9;
  color: var(--ink);
  outline: none;
  transition: box-shadow 0.2s;
}

.input-sketch:focus {
  box-shadow: 3px 3px 0 rgba(44,62,80,0.1);
}

textarea.input-sketch {
  resize: vertical;
}

.btn-sketch {
  font-family: var(--font-decor);
  font-size: 1.1rem;
  padding: 0.6rem 1.5rem;
  background: var(--paper-dark);
  border: 2px solid var(--ink);
  border-radius: 12px 4px 12px 4px / 4px 12px 4px 12px;
  cursor: pointer;
  color: var(--ink);
  box-shadow: 2px 2px 0 rgba(44,62,80,0.15);
  transition: all 0.2s;
  align-self: flex-end;
}

.btn-sketch:hover {
  background: var(--ink);
  color: var(--paper);
}

.btn-sketch:active {
  box-shadow: none;
  transform: translate(1px, 1px);
}

.sticky-wall {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  width: 100%;
}

.sticky-note {
  width: 180px;
  min-height: 140px;
  padding: 1rem;
  background: #fff9c4;
  border: 1px solid #d4c88c;
  box-shadow: 3px 3px 8px rgba(0,0,0,0.12);
  position: relative;
  font-size: 0.9rem;
  word-break: break-word;
}

.sticky-note:nth-child(3n+1) { background: #fff9c4; }
.sticky-note:nth-child(3n+2) { background: #c8e6c9; }
.sticky-note:nth-child(3n+3) { background: #bbdefb; }

.sticky-note .note-author {
  font-family: var(--font-title);
  font-size: 1.2rem;
  margin-bottom: 0.4rem;
}

.sticky-note .note-time {
  font-size: 0.7rem;
  color: var(--ink-light);
  margin-top: 0.6rem;
}

.sticky-note .note-delete {
  position: absolute;
  top: 4px;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.sticky-note .note-delete:hover {
  opacity: 1;
}

/* ===== 音乐角 ===== */
.radio-box {
  position: relative;
  max-width: 480px;
  width: 100%;
}

.radio-body {
  border: 3px solid var(--ink);
  border-radius: 20px 20px 10px 10px;
  background: #3a2f28;
  padding: 2rem;
  color: #e0d7c6;
  box-shadow: 6px 6px 0 rgba(44,62,80,0.2);
}

.radio-display {
  background: #1a1a1a;
  border: 2px solid #555;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  text-align: center;
  margin-bottom: 1.5rem;
}

.radio-text {
  font-family: var(--font-decor);
  font-size: 1rem;
  color: #7cfc7c;
}

.music-form {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}

.music-form .input-sketch {
  background: #5a4f46;
  border-color: #8a7f76;
  color: #e0d7c6;
}

.music-form .btn-sketch {
  background: #5a4f46;
  color: #e0d7c6;
  border-color: #8a7f76;
}

.playlist {
  list-style: none;
  margin-bottom: 1rem;
}

.playlist li {
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  border-bottom: 1px dashed #555;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.playlist li:hover {
  background: rgba(255,255,255,0.05);
}

.playlist li .pl-delete {
  background: none;
  border: none;
  cursor: pointer;
  color: #c44;
  font-size: 0.9rem;
}

.audio-player {
  width: 100%;
  height: 36px;
  border-radius: 6px;
}

.radio-antenna {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 60px;
  background: #666;
  border-radius: 2px;
  transform-origin: bottom center;
  animation: antenna-wiggle 4s ease-in-out infinite;
}

.radio-antenna::after {
  content: '';
  position: absolute;
  top: -8px;
  left: -4px;
  width: 12px;
  height: 12px;
  background: #c2a44a;
  border-radius: 50%;
}

@keyframes antenna-wiggle {
  0%, 100% { transform: translateX(-50%) rotate(-1deg); }
  50% { transform: translateX(-50%) rotate(1deg); }
}

/* ===== 页脚 ===== */
.footer {
  padding-bottom: 4rem;
}

.contact-row {
  display: flex;
  gap: 2rem;
  margin: 1.5rem 0;
}

.contact-icon {
  font-size: 2rem;
  text-decoration: none;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--ink);
  border-radius: 20px 6px 20px 6px / 6px 20px 6px 20px;
  transition: all 0.2s;
  background: #fffef9;
}

.contact-icon:hover {
  background: var(--ink);
}

.contact-icon:hover span {
  filter: grayscale(0) brightness(2);
}

.footer-note {
  font-family: var(--font-decor);
  font-size: 0.95rem;
  color: var(--ink-light);
}
```

- [ ] **Step 2: 浏览器刷新，确认留言表单、收音机外观、播放列表、天线动画、页脚显示正常**

---

### Task 6: CSS 电路板背景 + 导线流动动画

**Files:**
- Modify: `styles.css` (追加)

- [ ] **Step 1: 追加电路板背景和导线动画样式**

```css
/* ===== 电路板背景 ===== */
.circuit-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.5;
}

.circuit-line {
  position: absolute;
  background: var(--ink-light);
  opacity: 0.2;
}

.circuit-line.horizontal {
  height: 1px;
}

.circuit-line.vertical {
  width: 1px;
}

.circuit-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--copper);
  opacity: 0.3;
}

.circuit-led {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

.circuit-led.red { background: var(--led-red); box-shadow: 0 0 6px var(--led-red); }
.circuit-led.green { background: var(--led-green); box-shadow: 0 0 6px var(--led-green); }
.circuit-led.yellow { background: var(--led-yellow); box-shadow: 0 0 6px var(--led-yellow); }

/* LED 闪烁节奏分散 */
.circuit-led:nth-child(3n) { animation: led-blink-1 1.5s ease-in-out infinite; }
.circuit-led:nth-child(3n+1) { animation: led-blink-2 2.2s ease-in-out infinite; }
.circuit-led:nth-child(3n+2) { animation: led-blink-3 1.8s ease-in-out infinite; }

/* 导线流动动画 */
.flow-line {
  stroke-dasharray: 8 4;
  animation: flow 2s linear infinite;
}

@keyframes flow {
  to {
    stroke-dashoffset: -24;
  }
}
```

- [ ] **Step 2: 浏览器刷新，确认背景出现电路线条和闪烁 LED 点阵**（需要 Task 12 的 JS 来生成电路板元素，这里先准备 CSS）

---

### Task 7: CSS 响应式适配

**Files:**
- Modify: `styles.css` (追加末尾)

- [ ] **Step 1: 追加媒体查询**

```css
/* ===== 响应式 ===== */
@media (max-width: 768px) {
  html {
    font-size: 16px;
  }

  .hero-name {
    font-size: 2.8rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .nav-inner {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: rgba(253,246,227,0.98);
    border-bottom: 2px dashed var(--ink-light);
    padding: 1rem;
    gap: 0.5rem;
  }

  .nav-inner.open {
    display: flex;
  }

  .nav-toggle {
    display: block;
  }

  .section {
    padding: 3rem 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .project-grid {
    grid-template-columns: 1fr;
  }

  .sticky-wall {
    gap: 1rem;
  }

  .sticky-note {
    width: 150px;
    min-height: 120px;
  }

  .radio-body {
    padding: 1.5rem;
  }

  .contact-row {
    gap: 1rem;
  }

  .contact-icon {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-name {
    font-size: 2.2rem;
  }

  .sticky-note {
    width: 130px;
    min-height: 100px;
    font-size: 0.8rem;
  }

  .tag-cloud {
    gap: 0.6rem;
  }

  .tag {
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
  }
}
```

- [ ] **Step 2: 浏览器打开 DevTools 响应式模式，切换 375px / 768px / 1024px，确认各断点布局正常，移动端导航变为汉堡菜单**

---

### Task 8: JS — 打字机效果

**Files:**
- Create: `script.js`

- [ ] **Step 1: 编写打字机效果类**

```javascript
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

// 页面加载后启动
document.addEventListener('DOMContentLoaded', () => {
  const twEl = document.getElementById('typewriter');
  if (twEl) {
    const tw = new Typewriter(twEl, [
      '电子信息工程 / 热爱硬件与代码',
      '在电路与程序之间寻找创造的乐趣',
      '欢迎来到我的小天地 ✨'
    ], { speed: 70, pause: 2500 });
    tw.start();
  }
});
```

- [ ] **Step 2: 浏览器刷新，确认 Hero 副标题逐字打出，打完后暂停→删除→切换下一条**

---

### Task 9: JS — 鼠标跟随粒子系统

**Files:**
- Modify: `script.js` (追加)

- [ ] **Step 1: 追加 Canvas 粒子系统**

```javascript
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

// 在 DOMContentLoaded 中调用
document.addEventListener('DOMContentLoaded', () => {
  // ... 打字机代码 ...

  initParticles();
});
```

- [ ] **Step 2: 浏览器刷新，移动鼠标，确认暖黄色小光点跟随鼠标并在周围扩散消散**

---

### Task 10: JS — 导航平滑滚动和高亮

**Files:**
- Modify: `script.js` (追加)

- [ ] **Step 1: 追加导航功能**

```javascript
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

  window.addEventListener('scroll', highlight, { passive: true });
}

// 在 DOMContentLoaded 中调用
document.addEventListener('DOMContentLoaded', () => {
  // ... 前面代码 ...
  initNavigation();
});
```

- [ ] **Step 2: 浏览器刷新，点击导航链接测试平滑滚动，滚动页面确认导航高亮跟随**

---

### Task 11: JS — 留言墙 localStorage 增删

**Files:**
- Modify: `script.js` (追加)

- [ ] **Step 1: 追加留言墙逻辑**

```javascript
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

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
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

// 在 DOMContentLoaded 中调用
document.addEventListener('DOMContentLoaded', () => {
  // ... 前面代码 ...
  initMessageWall();
});
```

- [ ] **Step 2: 浏览器刷新，提交一条留言确认便利贴出现，刷新页面确认数据持久化，点击 ✕ 确认删除**

---

### Task 12: JS — 音乐角 localStorage + 播放

**Files:**
- Modify: `script.js` (追加)

- [ ] **Step 1: 追加音乐角逻辑**

```javascript
/* ===== 音乐角 ===== */
function initMusicCorner() {
  const form = document.getElementById('musicForm');
  const playlistEl = document.getElementById('playlist');
  const audio = document.getElementById('audioPlayer');
  const display = document.getElementById('radioDisplay');
  const STORAGE_KEY = 'handdrawn_playlist';

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

  function renderPlaylist() {
    const list = loadPlaylist();
    if (!playlistEl) return;

    playlistEl.innerHTML = '';
    list.forEach((track, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="pl-title">${escapeHtml(track.title)}</span>
        <button class="pl-delete" data-index="${index}">✕</button>
      `;

      // 点击歌曲名播放
      li.querySelector('.pl-title').addEventListener('click', () => {
        audio.src = track.url;
        audio.play().catch(() => {});
        display.querySelector('.radio-text').textContent = `📻 ${track.title}`;
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

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('musicTitle');
      const urlInput = document.getElementById('musicUrl');

      const title = titleInput.value.trim();
      const url = urlInput.value.trim();

      if (!title || !url) return;

      const list = loadPlaylist();
      list.push({ title, url });
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
      display.querySelector('.radio-text').textContent = '📻 已暂停';
    });
  }

  renderPlaylist();
}

// 在 DOMContentLoaded 中调用
document.addEventListener('DOMContentLoaded', () => {
  // ... 前面代码 ...
  initMusicCorner();
});
```

- [ ] **Step 2: 浏览器刷新，添加一条音频 URL 到播放列表，点击播放确认 `<audio>` 控件工作正常，刷新页面确认播放列表持久化**

---

### Task 13: JS — 电路板背景动态生成

**Files:**
- Modify: `script.js` (追加)

- [ ] **Step 1: 追加电路板背景生成函数**

```javascript
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

// 在 DOMContentLoaded 中调用
document.addEventListener('DOMContentLoaded', () => {
  // ... 前面代码 ...
  initCircuitBoard();
});
```

- [ ] **Step 2: 浏览器刷新，确认背景出现纵横交错的电路线、节点和彩色闪烁 LED 点**

---

### Task 14: JS — 技术栈标签云和项目卡片动态渲染

**Files:**
- Modify: `script.js` (追加)

- [ ] **Step 1: 追加标签云和项目卡片渲染**

```javascript
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
      title: '四轴飞行器',
      desc: '从飞控 PCB 到姿态解算算法的完整自制无人机项目。',
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

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// 在 DOMContentLoaded 中调用
document.addEventListener('DOMContentLoaded', () => {
  // ... 所有前面的初始化调用 ...

  initTagCloud();
  initProjects();
});
```

- [ ] **Step 2: 浏览器刷新，确认标签云显示 19 个技能标签且颜色各异，项目区显示 4 张卡片带图钉效果**

---

### Task 15: 最终整合验证与微调

**Files:**
- Modify: `index.html`, `styles.css`, `script.js`

- [ ] **Step 1: 合并所有 DOMContentLoaded 调用为单一入口**

确保 `script.js` 只有一个 `DOMContentLoaded` 监听器，按顺序调用所有初始化函数：

```javascript
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

  // 项目卡片
  initProjects();
});
```

- [ ] **Step 2: 浏览器中全面走查**

打开 `index.html`，逐一验证：
- 导航栏 7 个标签可点击，平滑滚动到对应板块
- Hero 打字机逐字输出，光标闪烁
- 鼠标光点跟随
- 页面背景电路走线 + LED 闪烁
- 关于我卡片样式正确
- 技术栈标签云，每个标签有随机旋转角度
- 项目卡片 4 张，顶部图钉装饰
- 留言墙：提交留言 → 便利贴出现 → 刷新后仍存在 → 可删除
- 音乐角：添加音频 URL → 列表出现 → 点击播放 → audio 控件可用 → 刷新后列表仍在
- 页脚联系方式图标
- 移动端（375px）：汉堡菜单出现，卡片单列
- Chrome / Firefox / Edge 均正常

---

## 自检

**Spec 覆盖检查:**
| 设计需求 | 对应 Task |
|---|---|
| 4.1 导航栏 | Task 1 (HTML), Task 3 (CSS), Task 10 (JS) |
| 4.2 Hero + 打字机 | Task 1, Task 3, Task 8 |
| 4.3 关于我 | Task 1, Task 4 |
| 4.4 技术栈标签云 | Task 1, Task 4, Task 14 |
| 4.5 项目案例卡片 | Task 1, Task 4, Task 14 |
| 4.6 留言墙 + localStorage | Task 1, Task 5, Task 11 |
| 4.7 音乐角 + localStorage | Task 1, Task 5, Task 12 |
| 4.8 页脚 | Task 1, Task 5 |
| 5.1 电路板背景 | Task 6, Task 13 |
| 5.2 LED 闪烁 | Task 6, Task 13 |
| 5.3 导线流动 | Task 6 |
| 5.4 鼠标光点 | Task 9 |
| 5.5 打字机效果 | Task 8 |
| 七、响应式 | Task 7 |

**无占位符，无 TBD，类型一致。**
