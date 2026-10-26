const starData = [
  {
    id: "explore-green-heart",
    label: "Explore the Green Heart of TU delft campus",
    title: "Explore the Green Heart of TU delft campus",
    x: 19,
    y: 31,
    url: "explore-the-green-heart-of-tu-delft-campus.html",
    info: true
  },
  {
    id: "discover-growing",
    label: "Discover What’s Growing",
    title: "Discover What’s Growing",
    x: 72,
    y: 22,
    url: "discover-whats-growing.html",
    info: true
  },
  {
    id: "technology-action",
    label: "Technology in Action",
    title: "Technology in Action",
    x: 82,
    y: 62,
    url: "technology-in-action.html",
    info: true
  },
  {
    id: "whats-on",
    label: "What’s On at the Hortus?",
    title: "What’s On at the Hortus?",
    x: 44,
    y: 75,
    url: "whats-on-at-the-hortus.html",
    info: true
  },
  {
    id: "meet-connect",
    label: "Meet, Connect & Grow",
    title: "Meet, Connect & Grow",
    x: 58,
    y: 86,
    url: "meet-connect-grow.html",
    info: true
  }
];

const world = document.getElementById("world");
const starsLayer = document.getElementById("starsLayer");
const hint = document.getElementById("hint");
const infoToggle = document.getElementById("infoToggle");
const infoPanel = document.getElementById("infoPanel");
const closeInfoButton = document.querySelector(".icon-close");
const centerImage = document.getElementById("centerImage");
const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const uiState = {
  activeStar: null,
  isPanelOpen: false,
  infoOpen: false,
  camera: { x: 0, y: 0, scale: 1 },
  target: { x: 0, y: 0, scale: 1 }
};

function afterLoad(img, src, fallback) {
  if (!img || !src) {
    if (fallback) fallback.style.display = "block";
    if (img) img.style.display = "none";
    return;
  }

  img.src = src;
  img.onload = () => {
    if (fallback) fallback.style.display = "none";
    img.style.display = "block";
    img.classList.add("is-visible");
  };
  img.onerror = () => {
    img.style.display = "none";
    if (fallback) fallback.style.display = "block";
    img.classList.remove("is-visible");
  };
}

function setImageFallback() {
  const centerFallback = document.querySelector(".center-fallback");

  if (!window.IMAGES || !window.IMAGES.center) {
    if (centerFallback) centerFallback.style.display = "block";
    if (centerImage) centerImage.style.display = "none";
    return;
  }

  afterLoad(centerImage, window.IMAGES.center, centerFallback);
}

function createStars() {
  starData.forEach((star) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `star ${star.info ? "has-info" : ""}`;
    button.dataset.starId = star.id;
    button.style.left = `${star.x}%`;
    button.style.top = `${star.y}%`;
    button.setAttribute("aria-label", star.title);

    button.innerHTML = `<span class="star-label">${star.label}</span>`;

    button.addEventListener("click", () => {
      if (star.url) {
        window.location.href = star.url;
      }
    });

    starsLayer.appendChild(button);
  });
}

function setCamera() {
  world.style.transform = `translate3d(${uiState.camera.x}px, ${uiState.camera.y}px, 0) scale(${uiState.camera.scale})`;
}

function renderBackgroundInfo() {
  const open = infoPanel.classList.contains("open");
  infoPanel.setAttribute("aria-hidden", String(!open));
  infoToggle.setAttribute("aria-expanded", String(open));
}

function toggleInfoPanel(forceState) {
  const shouldOpen = typeof forceState === "boolean" ? forceState : !infoPanel.classList.contains("open");
  infoPanel.classList.toggle("open", shouldOpen);
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

  window.addEventListener("pointermove", (event) => {
    const offsetX = ((event.clientX / window.innerWidth) - 0.5) * 36;
    const offsetY = ((event.clientY / window.innerHeight) - 0.5) * 26;
    world.style.transform = `translate3d(${uiState.camera.x + offsetX}px, ${uiState.camera.y + offsetY}px, 0) scale(${uiState.camera.scale})`;
  });
}

function buildNetwork() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const nodes = [];
  const count = Math.min(120, Math.max(80, Math.round((width * height) / 20)));
  const random = createSeededRandom(42);

  for (let i = 0; i < count; i += 1) {
    nodes.push({
      x: (random() - 0.5) * width * 2.2 + width / 2,
      y: (random() - 0.5) * height * 2.2 + height / 2,
      r: 1.2 + random() * 3.2,
      alpha: 0.22 + random() * 0.75,
      driftX: (random() - 0.5) * 1.5,
      driftY: (random() - 0.5) * 1.5,
      pulse: random() * 100,
      major: false
    });
  }

  starData.forEach((star) => {
    nodes.push({
      x: (star.x / 100) * width,
      y: (star.y / 100) * height,
      r: 5.6,
      alpha: 1,
      driftX: 0,
      driftY: 0,
      pulse: 0,
      major: true
    });
  });

  const connections = [];
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j < nodes.length; j += 1) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const distance = Math.hypot(dx, dy);

      if (distance < 180 && distance > 0) {
        connections.push({ a: i, b: j, distance });
      }
    }
  }

  function drawNetwork() {
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    const lineGradient = ctx.createLinearGradient(0, 0, width, height);
    lineGradient.addColorStop(0, "rgba(78, 176, 255, 0.3)");
    lineGradient.addColorStop(0.5, "rgba(118, 213, 255, 0.4)");
    lineGradient.addColorStop(1, "rgba(76, 116, 255, 0.28)");

    connections.forEach(({ a, b, distance }) => {
      const nodeA = nodes[a];
      const nodeB = nodes[b];

      ctx.beginPath();
      ctx.moveTo(nodeA.x, nodeA.y);
      ctx.lineTo(nodeB.x, nodeB.y);
      ctx.strokeStyle = lineGradient;
      ctx.lineWidth = Math.max(0.7, 1.7 - distance / 120);
      ctx.stroke();
    });

    nodes.forEach((node) => {
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.major ? 18 : 10);
      gradient.addColorStop(0, node.major ? "rgba(255,255,255,1)" : "rgba(165,220,255,0.9)");
      gradient.addColorStop(0.34, node.major ? "rgba(120,190,255,0.85)" : "rgba(95,160,255,0.72)");
      gradient.addColorStop(1, "rgba(90,130,255,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.major ? 8 : node.r * 1.8, 0, Math.PI * 2);
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
  buildNetwork();
}

function bindEvents() {
  infoToggle.addEventListener("click", () => toggleInfoPanel());

  closeInfoButton.addEventListener("click", () => toggleInfoPanel(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (infoPanel.classList.contains("open")) {
        toggleInfoPanel(false);
      }
    }
  });

  window.addEventListener("resize", onResize);
}

function init() {
  setImageFallback();
  createStars();
  bindEvents();
  onResize();
  animateCamera();
  addParallax();
  hint.classList.add("visible");
}

init();
