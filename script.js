const starData = [
  { label: 'Explore the Green Heart of TU delft campus', x: 24, y: 37, url: 'explore.html' },
  { label: 'Discover What’s Growing', x: 61, y: 18, url: 'discover.html' },
  { label: 'Technology in Action', x: 18, y: 74, url: 'technology.html' },
  { label: 'What’s On at the Hortus?', x: 86, y: 43, url: 'whats-on.html' },
  { label: 'Meet, Connect & Grow', x: 57, y: 79, url: 'meet-connect-grow.html' }
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
  const cloudNodes = [];
  const nodeAspect = window.innerHeight / window.innerWidth;
  const backgroundParticles = Array.from({ length: 125 }, (_, index) => {
    const x = randomAt(index + 4) * 112 - 6;
    const y = randomAt(index + 89) * 110 - 5;
    const radius = index % 17 === 0 ? .34 : .08 + randomAt(index + 219) * .16;
    const opacity = .12 + randomAt(index + 301) * .34;
    const blur = index % 11 === 0 ? ' foreground-particle' : '';
    return `<circle class="background-particle${blur}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${radius.toFixed(2)}" opacity="${opacity.toFixed(2)}" style="--delay:-${(index % 13) * .7}s" />`;
  }).join('');
  const localNodes = starData.flatMap((star, cluster) => Array.from({ length: 7 }, (_, index) => {
    const angle = randomAt(cluster * 31 + index + 14) * Math.PI * 2;
    const radius = 4 + randomAt(cluster * 47 + index + 77) * 8;
    const node = {
      x: star.x + Math.cos(angle) * radius,
      y: star.y + Math.sin(angle) * radius * .62,
      cluster,
      index
    };
    cloudNodes.push(node);
    return node;
  }));
  const branches = starData.map((star, cluster) => {
    const related = localNodes.filter((node) => node.cluster === cluster);
    return related.slice(0, 2).map((node, index) => {
      return `<path class="network-line local-branch" data-clusters="${cluster}" d="M ${star.x} ${star.y} L ${node.x.toFixed(2)} ${node.y.toFixed(2)}" />`;
    }).join('');
  }).join('');
  const localLinks = starData.map((_, cluster) => {
    const related = localNodes.filter((node) => node.cluster === cluster);
    return related.slice(0, -1).map((node, index) => {
      const next = related[index + 1];
      return `<path class="network-line local-link" data-clusters="${cluster}" d="M ${node.x.toFixed(2)} ${node.y.toFixed(2)} L ${next.x.toFixed(2)} ${next.y.toFixed(2)}" />`;
    }).join('');
  }).join('');
  const crossLinks = Array.from({ length: 28 }, (_, index) => {
    const first = cloudNodes[(index * 7 + 3) % cloudNodes.length];
    let second = cloudNodes[(index * 13 + 11) % cloudNodes.length];
    if (first.cluster === second.cluster) second = cloudNodes[(index * 13 + 19) % cloudNodes.length];
    return `<path class="network-line cross-link" data-clusters="${first.cluster} ${second.cluster}" d="M ${first.x.toFixed(2)} ${first.y.toFixed(2)} L ${second.x.toFixed(2)} ${second.y.toFixed(2)}" />`;
  }).join('');
  const heartRays = localNodes.map((node, index) => {
    const className = index % 9 === 0 ? 'heart-ray bright-ray' : 'heart-ray';
    return `<path class="network-line ${className}" data-clusters="${node.cluster}" d="M 50 50 L ${node.x.toFixed(2)} ${node.y.toFixed(2)}" />`;
  }).join('');
  const radialNodes = Array.from({ length: 58 }, (_, index) => {
    let x = 4 + randomAt(index + 711) * 92;
    let y = 4 + randomAt(index + 809) * 92;
    if (Math.hypot(x - 50, y - 50) < 19) {
      x = (x + 27) % 94 + 3;
      y = (y + 18) % 94 + 3;
    }
    return { x, y };
  });
  const radialRays = radialNodes.map((node, index) => {
    const className = index % 12 === 0 ? 'radial-ray bright-ray' : 'radial-ray';
    return `<path class="network-line ${className}" d="M 50 50 L ${node.x.toFixed(2)} ${node.y.toFixed(2)}" />`;
  }).join('');
  const outerFragments = Array.from({ length: 34 }, (_, index) => {
    const first = radialNodes[(index * 5 + 1) % radialNodes.length];
    const second = radialNodes[(index * 11 + 13) % radialNodes.length];
    return `<path class="network-line outer-fragment" d="M ${first.x.toFixed(2)} ${first.y.toFixed(2)} L ${second.x.toFixed(2)} ${second.y.toFixed(2)}" />`;
  }).join('');
  const foregroundLinks = starData.map((_, cluster) => {
    const related = localNodes.filter((node) => node.cluster === cluster);
    const first = related[2];
    const second = related[5];
    return `<path class="network-line foreground-link" data-clusters="${cluster}" d="M ${first.x.toFixed(2)} ${first.y.toFixed(2)} L ${second.x.toFixed(2)} ${second.y.toFixed(2)}" />`;
  }).join('');
  const nodes = localNodes.map((node, index) => {
    const radius = .18 * (index % 8 === 0 ? 1.5 : 1);
    return `<ellipse class="micro-node ${index % 8 === 0 ? 'brighter-node' : ''}" data-clusters="${node.cluster}" cx="${node.x.toFixed(2)}" cy="${node.y.toFixed(2)}" rx="${(radius * nodeAspect).toFixed(3)}" ry="${radius.toFixed(3)}" />`;
  }).join('');
  const radialMarks = radialNodes.map((node, index) => {
    const radius = .14 * (index % 12 === 0 ? 1.5 : 1);
    return `<ellipse class="radial-node ${index % 12 === 0 ? 'brighter-node' : ''}" cx="${node.x.toFixed(2)}" cy="${node.y.toFixed(2)}" rx="${(radius * nodeAspect).toFixed(3)}" ry="${radius.toFixed(3)}" />`;
  }).join('');
  atmosphericNetwork.innerHTML = `<defs><filter id="networkBlur"><feGaussianBlur stdDeviation=".7" /></filter><filter id="networkGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation=".28" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g class="network-background" filter="url(#networkBlur)">${backgroundParticles}</g><g class="network-midground">${radialRays}${heartRays}${outerFragments}${crossLinks}${localLinks}${branches}${radialMarks}${nodes}</g><g class="network-foreground" filter="url(#networkGlow)">${foregroundLinks}</g>`;
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
