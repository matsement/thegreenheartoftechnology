const starData = [
  { id: 'opening', label: 'Opening', x: 20, y: 34, title: 'Opening', summary: 'The Green Heart turns biodiversity into a living technology platform for the city.', cards: [{ label: 'Theme', value: 'Biodiversity + code' }, { label: 'Vision', value: '2050 campus' }, { label: 'Signal', value: 'Planetary care' }], list: ['Living systems as the interface between research and everyday life', 'Sensors, data and ecological intelligence woven into one public story', 'A campus where every tree, seed and climate signal matters'] },
  { id: 'exhibitions', label: 'Exhibitions', x: 78, y: 20, title: 'Upcoming exhibitions', summary: 'Immersive exhibitions connect TU Delft faculties and dream teams to the living Hortus.', cards: [{ label: 'Format', value: 'Timed entry' }, { label: 'Flow', value: '7 exhibits' }, { label: 'Access', value: 'Reservations' }], list: ['Immersive rooms for climate, robotics, material futures and human wellbeing', 'Faculty labs and dream teams shaped around one shared public narrative', 'Tickets and timed access keep the experience intimate and dynamic'] },
  { id: 'partners', label: 'Partners', x: 18, y: 74, title: 'Partners', summary: 'Industry, students, the Hortus, and public institutions form the network behind the vision.', cards: [{ label: 'Public', value: 'City + schools' }, { label: 'Academic', value: 'TU Delft' }, { label: 'Network', value: 'Global care' }], list: ['Dream teams, startups and local organisations co-design new urban experiments', 'Academic, municipal and international partners create shared follow-through', 'Funding and sponsorship sustain civic prototypes beyond a single event'] },
  { id: 'history', label: 'History', x: 70, y: 68, title: 'History', summary: 'From 2026 to 2050, the Hortus evolves from a botanical collection into a climate commons.', cards: [{ label: '2026', value: 'Urban seed' }, { label: '2038', value: 'Living lab' }, { label: '2050', value: 'City signal' }], list: ['A timeline of pilot projects, public learning and ecological restoration', 'Every phase upgrades civic infrastructure with new knowledge and tools', 'The Hortus becomes a place where culture, science and biodiversity meet'] },
  { id: 'outside-hortus', label: 'Beyond the Hortus', x: 54, y: 83, title: 'Beyond the Hortus', summary: 'The future spreads through city pilots, schools, neighbourhood labs and international collaborations.', cards: [{ label: 'Local', value: 'School labs' }, { label: 'City', value: 'Pop-up demos' }, { label: 'Global', value: 'Shared prototypes' }], list: ['Neighbourhood experiments bring the Hortus into public life and education', 'Portable systems turn local communities into living testbeds for greener futures', 'International collaboration scales ideas without losing local identity'] }
];

const world = document.getElementById('world');
const starsLayer = document.getElementById('starsLayer');
const featurePanel = document.getElementById('featurePanel');
const hint = document.getElementById('hint');
const backButton = document.getElementById('backButton');
const infoToggle = document.getElementById('infoToggle');
const infoPanel = document.getElementById('infoPanel');
const closeInfoButton = document.querySelector('.icon-close');
const backgroundImage = document.getElementById('backgroundImage');
const centerImage = document.getElementById('centerImage');
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const uiState = { activeStar: null, isPanelOpen: false, infoOpen: false, camera: { x: 0, y: 0, scale: 1 }, target: { x: 0, y: 0, scale: 1 } };

function afterLoad(img, src, fallback, isBackground) {
  if (!src) {
    fallback.style.display = 'block';
    img.style.display = 'none';
    if (!isBackground) img.classList.remove('is-visible');
    return;
  }
  img.src = src;
  img.onload = () => {
    fallback.style.display = 'none';
    img.style.display = 'block';
    if (!isBackground) img.classList.add('is-visible');
  };
  img.onerror = () => {
    img.style.display = 'none';
    fallback.style.display = 'block';
    if (!isBackground) img.classList.remove('is-visible');
  };
}

function setImageFallback() {
  const backgroundFallback = document.querySelector('.background-fallback');
  const centerFallback = document.querySelector('.center-fallback');
  if (!window.IMAGES) {
    backgroundFallback.style.display = 'block';
    centerFallback.style.display = 'block';
    backgroundImage.style.display = 'none';
    centerImage.style.display = 'none';
    return;
  }
  afterLoad(backgroundImage, window.IMAGES.background, backgroundFallback, true);
  afterLoad(centerImage, window.IMAGES.center, centerFallback, false);
}

function renderFeaturePanel(star) {
  featurePanel.innerHTML = `
    <div class="feature-panel-header">
      <div>
        <div class="eyebrow">${star.label}</div>
        <h2>${star.title}</h2>
      </div>
    </div>
    <p>${star.summary}</p>
    <div class="panel-grid">
      ${star.cards.map((card) => `<div class="mini-card"><span>${card.label}</span><strong>${card.value}</strong></div>`).join('')}
    </div>
    <ul class="feature-list">${star.list.map((item) => `<li>${item}</li>`).join('')}</ul>
  `;
}

function createStars() {
  starData.forEach((star) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'star';
    button.dataset.starId = star.id;
    button.style.left = `${star.x}%`;
    button.style.top = `${star.y}%`;
    button.setAttribute('aria-label', `Open ${star.title}`);
    button.innerHTML = `<span class="star-label">${star.label}</span>`;
    button.addEventListener('click', () => openStar(star.id));
    starsLayer.appendChild(button);
  });
}

function setCamera() {
  world.style.transform = `translate3d(${uiState.camera.x}px, ${uiState.camera.y}px, 0) scale(${uiState.camera.scale})`;
}

function openStar(starId) {
  const star = starData.find((entry) => entry.id === starId);
  if (!star) return;
  uiState.activeStar = star;
  uiState.target.x = (window.innerWidth / 2) - (star.x / 100) * window.innerWidth;
  uiState.target.y = (window.innerHeight / 2) - (star.y / 100) * window.innerHeight;
  uiState.target.scale = 1.6;
  document.querySelectorAll('.star').forEach((button) => {
    const active = button.dataset.starId === star.id;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  renderFeaturePanel(star);
  featurePanel.hidden = false;
  featurePanel.classList.add('open');
  uiState.isPanelOpen = true;
  backButton.classList.add('visible');
  hint.classList.add('hidden');
  hint.classList.remove('visible');
}

function closeStar() {
  uiState.activeStar = null;
  uiState.target.x = 0;
  uiState.target.y = 0;
  uiState.target.scale = 1;
  featurePanel.classList.remove('open');
  uiState.isPanelOpen = false;
  backButton.classList.remove('visible');
  document.querySelectorAll('.star').forEach((button) => {
    button.classList.remove('active');
    button.setAttribute('aria-pressed', 'false');
  });
  setTimeout(() => { featurePanel.hidden = true; }, 250);
  hint.classList.remove('hidden');
  hint.classList.add('visible');
}

function renderBackgroundInfo() {
  const open = infoPanel.classList.contains('open');
  infoPanel.setAttribute('aria-hidden', String(!open));
  infoToggle.setAttribute('aria-expanded', String(open));
}

function toggleInfoPanel(forceState) {
  const shouldOpen = typeof forceState === 'boolean' ? forceState : !infoPanel.classList.contains('open');
  infoPanel.classList.toggle('open', shouldOpen);
  uiState.infoOpen = shouldOpen;
  renderBackgroundInfo();
}

function animateCamera() {
  uiState.camera.x += (uiState.target.x - uiState.camera.x) * 0.08;
  uiState.camera.y += (uiState.target.y - uiState.camera.y) * 0.08;
  uiState.camera.scale += (uiState.target.scale - uiState.camera.scale) * 0.08;
  setCamera();
  requestAnimationFrame(animateCamera);
}

function addParallax() {
  if (prefersReducedMotion) return;
  window.addEventListener('pointermove', (event) => {
    const offsetX = ((event.clientX / window.innerWidth) - 0.5) * 32 * 1.8;
    const offsetY = ((event.clientY / window.innerHeight) - 0.5) * 32 * 1.2;
    if (!uiState.isPanelOpen) world.style.transform = `translate3d(${uiState.camera.x + offsetX}px, ${uiState.camera.y + offsetY}px, 0) scale(${uiState.camera.scale})`;
  });
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (event) => {
      if (event.gamma !== null && event.beta !== null) {
        const x = event.gamma / 30;
        const y = event.beta / 40;
        if (!uiState.isPanelOpen) world.style.transform = `translate3d(${uiState.camera.x + x * 12}px, ${uiState.camera.y + y * 12}px, 0) scale(${uiState.camera.scale})`;
      }
    });
  }
}

function buildNetwork() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const nodes = [];
  const count = Math.min(120, Math.max(82, Math.round((width * height) / 18)));
  const random = createSeededRandom(42);

  for (let i = 0; i < count; i += 1) {
    nodes.push({ x: (random() - 0.5) * width * 2.2 + width / 2, y: (random() - 0.5) * height * 2.2 + height / 2, r: 1.2 + random() * 3.2, alpha: 0.22 + random() * 0.75, driftX: (random() - 0.5) * 0.28, driftY: (random() - 0.5) * 0.28, pulse: random() * Math.PI * 2, major: false });
  }
  starData.forEach((star) => nodes.push({ x: (star.x / 100) * width, y: (star.y / 100) * height, r: 4.8, alpha: 0.9, driftX: 0, driftY: 0, pulse: 0, major: true }));

  const connections = [];
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const distance = Math.hypot(dx, dy);
      if (distance < 140 && distance > 0) connections.push({ a: i, b: j, distance });
    }
  }

  function drawNetwork() {
    const time = performance.now() * 0.001;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    const lineGradient = ctx.createLinearGradient(0, 0, width, height);
    lineGradient.addColorStop(0, 'rgba(136, 224, 255, 0.14)');
    lineGradient.addColorStop(0.5, 'rgba(152, 255, 223, 0.22)');
    lineGradient.addColorStop(1, 'rgba(108, 163, 255, 0.12)');

    connections.forEach(({ a, b, distance }) => {
      const nodeA = nodes[a];
      const nodeB = nodes[b];
      const driftA = Math.sin(time * 0.5 + nodeA.pulse) * 8;
      const driftB = Math.sin(time * 0.5 + nodeB.pulse) * 8;
      const x1 = nodeA.x + driftA * nodeA.driftX;
      const y1 = nodeA.y + driftA * nodeA.driftY;
      const x2 = nodeB.x + driftB * nodeB.driftX;
      const y2 = nodeB.y + driftB * nodeB.driftY;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = lineGradient;
      ctx.lineWidth = Math.max(0.6, 1.4 - distance / 140);
      ctx.stroke();

      const pulseOffset = (time * 0.7 + (nodeA.x + nodeB.y) / 140) % 1;
      if (pulseOffset > 0.4 && pulseOffset < 0.7) {
        const px = x1 + (x2 - x1) * pulseOffset;
        const py = y1 + (y2 - y1) * pulseOffset;
        const glow = ctx.createRadialGradient(px, py, 0, px, py, 18);
        glow.addColorStop(0, 'rgba(128, 255, 214, 0.85)');
        glow.addColorStop(1, 'rgba(128, 255, 214, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(px - 18, py - 18, 36, 36);
      }
    });

    nodes.forEach((node) => {
      const x = node.x + Math.sin(time * (0.35 + node.r * 0.12) + node.pulse) * (node.major ? 0 : 8);
      const y = node.y + Math.cos(time * (0.45 + node.r * 0.1) + node.pulse) * (node.major ? 0 : 8);
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, node.major ? 14 : 8);
      gradient.addColorStop(0, node.major ? 'rgba(163,255,231,1)' : 'rgba(176,211,255,0.9)');
      gradient.addColorStop(0.35, node.major ? 'rgba(80,214,219,0.8)' : 'rgba(120,180,255,0.72)');
      gradient.addColorStop(1, 'rgba(80,110,170,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, node.major ? 8 : node.r * 1.8, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function tick() {
    drawNetwork();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function createSeededRandom(seed) {
  let value = seed >>> 0;
  return function next() {
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t) ^ (t >>> 14);
    return ((t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}

function onResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (!uiState.isPanelOpen) {
    uiState.target.x = 0;
    uiState.target.y = 0;
    uiState.target.scale = 1;
  }
}

function bindEvents() {
  backButton.addEventListener('click', closeStar);
  infoToggle.addEventListener('click', () => toggleInfoPanel());
  closeInfoButton.addEventListener('click', () => toggleInfoPanel(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (infoPanel.classList.contains('open')) toggleInfoPanel(false);
      else if (uiState.isPanelOpen) closeStar();
    }
    if (event.key === 'Tab') {
      const buttons = [...document.querySelectorAll('.star')];
      if (!buttons.length) return;
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (document.activeElement === last && !event.shiftKey) first.focus();
      if (document.activeElement === first && event.shiftKey) last.focus();
    }
  });
  window.addEventListener('resize', onResize);
  document.addEventListener('click', (event) => {
    if (!infoPanel.contains(event.target) && !infoToggle.contains(event.target) && infoPanel.classList.contains('open')) toggleInfoPanel(false);
  });
}

function init() {
  setImageFallback();
  createStars();
  bindEvents();
  onResize();
  buildNetwork();
  animateCamera();
  addParallax();
  hint.classList.add('visible');
}

init();
