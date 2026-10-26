const starData = [
  {
    id: 'opening',
    label: 'Opening',
    x: 20,
    y: 34,
    title: 'Opening',
    summary: 'The Green Heart turns biodiversity into a living technology platform for the city.',
    cards: [{ label: 'Theme', value: 'Biodiversity + technology' }, { label: 'Focus', value: 'Climate adaptation' }, { label: 'Goal', value: 'City commons' }],
    list: ['Living network', 'Public participation', 'Urban futures'],
    info: true,
    url: 'opening.html'
  },
  {
    id: 'exhibitions',
    label: 'Exhibitions',
    x: 78,
    y: 20,
    title: 'Upcoming exhibitions',
    summary: 'Immersive exhibitions connect TU Delft faculties and dream teams to the living Hortus.',
    cards: [{ label: 'Theme', value: 'Exhibitions' }, { label: 'Focus', value: 'Research' }, { label: 'Goal', value: 'Public encounters' }],
    list: ['Faculty showcases', 'Prototype labs', 'Creative partnerships'],
    info: true,
    url: 'exhibitions.html'
  },
  {
    id: 'partners',
    label: 'Partners',
    x: 18,
    y: 74,
    title: 'Partners',
    summary: 'Industry, students, the Hortus, and public institutions form the network behind the vision.',
    cards: [{ label: 'Partner', value: 'TU Delft' }, { label: 'Network', value: 'City + campus' }, { label: 'Model', value: 'Shared future' }],
    list: ['Students', 'Industry', 'Public institutions'],
    info: true,
    url: 'partners.html'
  },
  {
    id: 'history',
    label: 'History',
    x: 70,
    y: 68,
    title: 'History',
    summary: 'From 2026 to 2050, the Hortus evolves from a botanical collection into a climate commons.',
    cards: [{ label: '2026', value: 'Hortus base' }, { label: '2035', value: 'Living systems' }, { label: '2050', value: 'Climate commons' }],
    list: ['Data-rich gardens', 'Adaptive habitats', 'Shared public platform'],
    info: true,
    url: 'history.html'
  },
  {
    id: 'outside-hortus',
    label: 'Beyond the Hortus',
    x: 54,
    y: 83,
    title: 'Beyond the Hortus',
    summary: 'The future spreads through city pilots, schools, neighbourhood labs and international collaboration.',
    cards: [{ label: 'Scale', value: 'City' }, { label: 'Format', value: 'Pilot' }, { label: 'Model', value: 'Networked' }],
    list: ['City pilots', 'Schools', 'Neighbourhood labs'],
    info: true,
    url: 'beyond-hortus.html'
  }
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
const uiState = {
  activeStar: null,
  isPanelOpen: false,
  infoOpen: false,
  camera: { x: 0, y: 0, scale: 1 },
  target: { x: 0, y: 0, scale: 1 }
};

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
    button.className = `star ${star.info ? 'has-info' : ''}`;
    button.dataset.starId = star.id;
    button.style.left = `${star.x}%`;
    button.style.top = `${star.y}%`;
    button.setAttribute('aria-label', `Open ${star.title}`);

    button.innerHTML = `<span class="star-label">${star.label}</span>`;

    button.addEventListener('click', () => {
      uiState.activeStar = star;
      uiState.target.x = (window.innerWidth / 2) - (star.x / 100) * window.innerWidth;
      uiState.target.y = (window.innerHeight / 2) - (star.y / 100) * window.innerHeight;
      uiState.target.scale = 1.6;

      document.querySelectorAll('.star').forEach((buttonNode) => {
        const active = buttonNode.dataset.starId === star.id;
        buttonNode.classList.toggle('active', active);
        buttonNode.setAttribute('aria-pressed', String(active));
      });

      renderFeaturePanel(star);
      featurePanel.hidden = false;
      featurePanel.classList.add('open');
      uiState.isPanelOpen = true;
      backButton.classList.add('visible');
      hint.classList.add('hidden');
      hint.classList.remove('visible');

      if (star.url) {
        setTimeout(() => {
          window.location.href = star.url;
        }, 250);
      }
    });

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

function buildNetwork() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const nodes = [];
  const count = Math.min(120, Math.max(82, Math.round((width * height) / 18)));
  const random = createSeededRandom(42);

  for (let i = 0; i < count; i += 1) {
    nodes.push({
      x: (random() - 0.5) * width * 2.2 + width / 2,
      y: (random() - 0.5) * height * 2.2 + height / 2,
      r: 1.2 + random() * 3.2,
      alpha: 0.22 + random() * 0.75,
      driftX: 0,
      driftY: 0,
      pulse: 0,
      major: false
    });
  }

  starData.forEach((star) => {
    nodes.push({
      x: (star.x / 100) * width,
      y: (star.y / 100) * height,
      r: 5.2,
      alpha: 1,
      driftX: 0,
      driftY: 0,
      pulse: 0,
      major: true
    });
  });

  const connections = [];
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const distance = Math.hypot(dx, dy);

      if (distance < 155 && distance > 0) {
        connections.push({ a: i, b: j, distance });
      }
    }
  }

  function drawNetwork() {
    ctx.clearRect(0, 0, width, height);

    connections.forEach(({ a, b, distance }) => {
      const nodeA = nodes[a];
      const nodeB = nodes[b];
      const x1 = nodeA.x;
      const y1 = nodeA.y;
      const x2 = nodeB.x;
      const y2 = nodeB.y;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'rgba(180, 210, 255, 0.28)';
      ctx.lineWidth = Math.max(0.8, 1.6 - distance / 120);
      ctx.stroke();
    });

    nodes.forEach((node) => {
      const x = node.x;
      const y = node.y;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, node.major ? 16 : 9);
      gradient.addColorStop(0, node.major ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.9)');
      gradient.addColorStop(0.35, node.major ? 'rgba(200,220,255,0.8)' : 'rgba(180,210,255,0.7)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, node.major ? 9 : node.r * 1.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  drawNetwork();
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
  hint.classList.add('visible');
}

init();
