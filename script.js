const starData = [
  { label: 'Explore the Green Heart of TU delft campus', x: 57, y: 79, url: 'explore.html' },
  { label: 'Discover What’s Growing', x: 24, y: 37, url: 'discover.html' },
  { label: 'Technology in Action', x: 18, y: 74, url: 'technology.html' },
  { label: 'What’s On at the Hortus?', x: 86, y: 43, url: 'whats-on.html' },
  { label: 'Meet, Connect & Grow', x: 61, y: 18, url: 'meet-connect-grow.html' }
];
const starsLayer = document.querySelector('#starsLayer');
const atmosphericNetwork = document.querySelector('#atmosphericNetwork');
const backgroundImage = document.querySelector('#backgroundImage');
const centerImage = document.querySelector('#centerImage');
const randomAt = (seed) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};




function drawAtmosphericNetwork() {
  const RADIAL_COUNT = 30;
  const FRAGMENT_COUNT = 12;
  const CROSS_COUNT = 12;
  const HEART_RAY_EVERY = 2;

  // Grootte van de eindpunt-stippen (hoger = beter zichtbaar)
  const MICRO_DOT = .42;   // was .18
  const RADIAL_DOT = .36;  // was .14
  const CENTER_DOT = .7;

  const clamp = (v) => Math.min(97, Math.max(3, v));
  const cloudNodes = [];
  const nodeAspect = window.innerHeight / window.innerWidth;
  const line = (cls, clusters, a, b) =>
    `<path class="network-line ${cls}" ${clusters !== null ? `data-clusters="${clusters}" ` : ''}d="M ${a.x.toFixed(2)} ${a.y.toFixed(2)} L ${b.x.toFixed(2)} ${b.y.toFixed(2)}" />`;
  const dot = (cls, node, radius, clusters) =>
    `<ellipse class="${cls}" ${clusters !== undefined ? `data-clusters="${clusters}" ` : ''}cx="${node.x.toFixed(2)}" cy="${node.y.toFixed(2)}" rx="${(radius * nodeAspect).toFixed(3)}" ry="${radius.toFixed(3)}" />`;

  const center = { x: 50, y: 50 };

  const backgroundParticles = Array.from({ length: 125 }, (_, index) => {
    const x = randomAt(index + 4) * 112 - 6;
    const y = randomAt(index + 89) * 110 - 5;
    const radius = index % 17 === 0 ? .34 : .08 + randomAt(index + 219) * .16;
    const opacity = .12 + randomAt(index + 301) * .34;
    const blur = index % 11 === 0 ? ' foreground-particle' : '';
    return `<circle class="background-particle${blur}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${radius.toFixed(2)}" opacity="${opacity.toFixed(2)}" style="--delay:-${(index % 13) * .7}s" />`;
  }).join('');

  // Lokale nodes rond elke ster, altijd binnen beeld
  const localNodes = starData.flatMap((star, cluster) => Array.from({ length: 7 }, (_, index) => {
    const angle = randomAt(cluster * 31 + index + 14) * Math.PI * 2;
    const radius = 4 + randomAt(cluster * 47 + index + 77) * 8;
    const node = {
      x: clamp(star.x + Math.cos(angle) * radius),
      y: clamp(star.y + Math.sin(angle) * radius * .62),
      cluster,
      index
    };
    cloudNodes.push(node);
    return node;
  }));

  const byCluster = starData.map((_, cluster) => localNodes.filter((n) => n.cluster === cluster));

  // Ster -> eerste 2 nodes
  const branches = starData.map((star, cluster) =>
    byCluster[cluster].slice(0, 2).map((node) => line('local-branch', cluster, star, node)).join('')
  ).join('');

  // Ketting door alle 7 nodes van een cluster (alle nodes zitten dus vast aan de ster)
  const localLinks = byCluster.map((related, cluster) =>
    related.slice(0, -1).map((node, i) => line('local-link', cluster, node, related[i + 1])).join('')
  ).join('');

  // Verbindingen tussen clusters (nooit een punt met zichzelf)
  const crossLinks = Array.from({ length: CROSS_COUNT }, (_, index) => {
    const first = cloudNodes[(index * 7 + 3) % cloudNodes.length];
    let second = cloudNodes[(index * 13 + 11) % cloudNodes.length];
    if (first.cluster === second.cluster) second = cloudNodes[(index * 13 + 19) % cloudNodes.length];
    if (first === second) return '';
    return line('cross-link', `${first.cluster} ${second.cluster}`, first, second);
  }).join('');

  // Midden -> lokale nodes
  const heartRays = localNodes.map((node, index) => {
    if (index % HEART_RAY_EVERY !== 0) return '';
    return line(index % 9 === 0 ? 'heart-ray bright-ray' : 'heart-ray', node.cluster, center, node);
  }).join('');

  const radialNodes = Array.from({ length: RADIAL_COUNT }, (_, index) => {
    let x = 4 + randomAt(index + 711) * 92;
    let y = 4 + randomAt(index + 809) * 92;
    if (Math.hypot(x - 50, y - 50) < 19) {
      x = (x + 27) % 94 + 3;
      y = (y + 18) % 94 + 3;
    }
    return { x, y };
  });

  const radialRays = radialNodes.map((node, index) =>
    line(index % 12 === 0 ? 'radial-ray bright-ray' : 'radial-ray', null, center, node)
  ).join('');

  const outerFragments = Array.from({ length: FRAGMENT_COUNT }, (_, index) => {
    const first = radialNodes[(index * 5 + 1) % radialNodes.length];
    const second = radialNodes[(index * 11 + 13) % radialNodes.length];
    if (first === second) return '';
    return line('outer-fragment', null, first, second);
  }).join('');

  const foregroundLinks = byCluster.map((related, cluster) =>
    line('foreground-link', cluster, related[2], related[5])
  ).join('');

  // Zichtbare stip op elk eindpunt
  const nodes = localNodes.map((node, index) =>
    dot(`micro-node ${index % 8 === 0 ? 'brighter-node' : ''}`, node, MICRO_DOT * (index % 8 === 0 ? 1.5 : 1), node.cluster)
  ).join('');

  const radialMarks = radialNodes.map((node, index) =>
    dot(`radial-node ${index % 12 === 0 ? 'brighter-node' : ''}`, node, RADIAL_DOT * (index % 12 === 0 ? 1.5 : 1))
  ).join('');

  const centerMark = dot('radial-node brighter-node center-node', center, CENTER_DOT);

  atmosphericNetwork.innerHTML = `<defs><filter id="networkBlur"><feGaussianBlur stdDeviation=".7" /></filter><filter id="networkGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation=".28" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g class="network-background" filter="url(#networkBlur)">${backgroundParticles}</g><g class="network-midground">${radialRays}${heartRays}${outerFragments}${crossLinks}${localLinks}${branches}${radialMarks}${nodes}${centerMark}</g><g class="network-foreground" filter="url(#networkGlow)">${foregroundLinks}</g>`;
}

function setLocalNetwork(cluster, active) {
  atmosphericNetwork.querySelectorAll(`[data-clusters~="${cluster}"]`).forEach((element) => element.classList.toggle('is-local-active', active));
}






function setImages() {
  const backgroundFallback = document.querySelector('.background-fallback');
  const centerFallback = document.querySelector('.center-fallback');
  backgroundImage.src = window.IMAGES.background;
  centerImage.src = window.IMAGES.center;
  backgroundImage.onload = () => { backgroundFallback.style.display = 'none'; };
  centerImage.onload = () => { centerFallback.style.display = 'none'; centerImage.classList.add('is-visible'); };
}
drawAtmosphericNetwork();
window.addEventListener('resize', drawAtmosphericNetwork);
starData.forEach((star) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'star has-info';
  button.style.left = `${star.x}%`;
  button.style.top = `${star.y}%`;
  button.setAttribute('aria-label', `Open ${star.label}`);
  button.innerHTML = `<span class="star-label">${star.label}</span>`;
  button.addEventListener('click', () => { window.location.href = star.url; });
  button.addEventListener('pointerenter', () => { button.classList.add('is-network-active'); setLocalNetwork(starData.indexOf(star), true); });
  button.addEventListener('pointerleave', () => { button.classList.remove('is-network-active'); setLocalNetwork(starData.indexOf(star), false); });
  button.addEventListener('focus', () => { button.classList.add('is-network-active'); setLocalNetwork(starData.indexOf(star), true); });
  button.addEventListener('blur', () => { button.classList.remove('is-network-active'); setLocalNetwork(starData.indexOf(star), false); });
  starsLayer.append(button);
});
setImages();
