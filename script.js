const starData = [
  { label: 'Explore the Green Heart of TU delft campus', x: 86, y: 67, url: 'explore.html', depth: .72, thumbnails: ['thumbnail/Explore.png', 'thumbnail/Explore2.png', 'thumbnail/Explore3.png'], badge: 'thumbnail/showpiece.png', badgeLabel: 'Showpiece', previewX: '79%', previewY: '44%' },
  { label: 'Technology in Action', x: 13, y: 35, url: 'technology.html', depth: .55, thumbnails: ['thumbnail/Technology.png', 'thumbnail/Technology2.png'], badge: 'thumbnail/bridge.png', badgeLabel: 'Bridge', previewX: '7%', previewY: '14%' },
  { label: 'What’s On at the Hortus?', x: 24, y: 86, url: 'whats-on.html', depth: 1, thumbnails: ['thumbnail/whatson.png', 'thumbnail/whatson2.png', 'thumbnail/whatson3.png'], badge: 'thumbnail/immersive.png', badgeLabel: 'Immersive', previewX: '18%', previewY: '63%' },
  { label: 'Meet, Connect & Grow', x: 75, y: 21, url: 'meet-connect-grow.html', depth: .28, thumbnail: 'thumbnail/meet.png', badge: 'thumbnail/collab.png', badgeLabel: 'Collaboration', previewX: '70%', previewY: '1.5%' }
];

const starsLayer = document.querySelector('#starsLayer');
const thumbnailLayer = document.querySelector('#thumbnailLayer');
const buttonConnections = document.querySelector('#buttonConnections');
const backgroundImage = document.querySelector('#backgroundImage');
const centerImage = document.querySelector('#centerImage');

function drawButtonConnections() {
  const nodeAspect = window.innerHeight / window.innerWidth;
  const connectionPairs = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]];
  const buttonLines = connectionPairs.map(([fromIndex, toIndex]) => {
    const from = starData[fromIndex];
    const to = starData[toIndex];
    const connectionDepth = (from.depth + to.depth) / 2;
    const lineWidth = (.7 + connectionDepth * 2.7).toFixed(2);
    const lineOpacity = (.3 + connectionDepth * .7).toFixed(2);
    return `<line class="button-connection" style="--connection-width:${lineWidth}; --connection-opacity:${lineOpacity}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" />`;
  }).join('');

  const decorativeNodes = [
    { id: 'top', x: 39.3, y: 18.7, depth: .7 },
    { id: 'left', x: 10.5, y: 66.8, depth: .82 },
    { id: 'right', x: 89.9, y: 36.1, depth: .35 },
    { id: 'bottom', x: 75.8, y: 81.5, depth: .58 }
  ];
  const center = { x: 50, y: 50, depth: .55 };
  const nodesById = Object.fromEntries(decorativeNodes.map((node) => [node.id, node]));
  const decoratedButton = (index) => ({ ...starData[index], id: `button-${index}` });
  const decorativeConnections = [
    { from: nodesById.top, to: decoratedButton(3) },
    { from: nodesById.top, to: center },
    { from: nodesById.left, to: decoratedButton(1) },
    { from: nodesById.left, to: decoratedButton(2) },
    { from: nodesById.right, to: nodesById.bottom, emphasized: true },
    { from: nodesById.right, to: center, emphasized: true },
    { from: nodesById.bottom, to: center }
  ];
  const decorativeLines = decorativeConnections.map(({ from, to, emphasized }) => {
    const depth = (from.depth + to.depth) / 2;
    const lineWidth = (emphasized ? .4 + depth * 2.5 : .45 + depth * 3.3).toFixed(2);
    const lineOpacity = (.18 + depth * .45).toFixed(2);
    const emphasisClass = emphasized ? ' is-emphasized' : '';
    return `<line class="decorative-connection${emphasisClass}" style="--decorative-width:${lineWidth}; --decorative-opacity:${lineOpacity}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" />`;
  }).join('');
  const decorativeMarks = decorativeNodes.map((node) => {
    const radius = .25 + node.depth * .18;
    return `<ellipse class="decorative-node" cx="${node.x}" cy="${node.y}" rx="${(radius * nodeAspect).toFixed(3)}" ry="${radius.toFixed(3)}" />`;
  }).join('');

  buttonConnections.innerHTML = `${buttonLines}${decorativeLines}${decorativeMarks}`;
}

function setImages() {
  const backgroundFallback = document.querySelector('.background-fallback');
  const centerFallback = document.querySelector('.center-fallback');
  backgroundImage.src = window.IMAGES.background;
  centerImage.src = window.IMAGES.center;
  backgroundImage.onload = () => { backgroundFallback.style.display = 'none'; };
  centerImage.onload = () => { centerFallback.style.display = 'none'; centerImage.classList.add('is-visible'); };
}

starData.forEach((star) => {
  const previewImages = star.thumbnails || [star.thumbnail];
  const thumbnail = document.createElement('div');
  thumbnail.className = 'page-thumbnail';
  thumbnail.style.setProperty('--preview-x', star.previewX);
  thumbnail.style.setProperty('--preview-y', star.previewY);
  thumbnail.innerHTML = `<div class="thumbnail-slides"><img class="thumbnail-image thumbnail-image--active" src="${previewImages[0]}" alt="Preview of ${star.label}" /><img class="thumbnail-image thumbnail-image--incoming" alt="" aria-hidden="true" /></div><img class="thumbnail-badge" src="${star.badge}" alt="${star.badgeLabel}" />`;
  thumbnailLayer.append(thumbnail);

  const previewImagesElements = thumbnail.querySelectorAll('.thumbnail-image');
  let activeImage = previewImagesElements[0];
  let incomingImage = previewImagesElements[1];
  let activeSlide = 0;
  let slideshowTimer = null;
  let transitionTimer = null;
  let isHovering = false;
  let isFocused = false;

  function showPreview() {
    thumbnail.classList.add('is-visible');
    if (previewImages.length > 1 && !slideshowTimer) {
      slideshowTimer = window.setInterval(() => {
        activeSlide = (activeSlide + 1) % previewImages.length;
        incomingImage.src = previewImages[activeSlide];
        incomingImage.classList.remove('is-entering');
        void incomingImage.offsetWidth;
        activeImage.classList.add('is-leaving');
        incomingImage.classList.add('is-entering');

        transitionTimer = window.setTimeout(() => {
          activeImage.className = 'thumbnail-image thumbnail-image--incoming';
          activeImage.alt = '';
          activeImage.setAttribute('aria-hidden', 'true');
          incomingImage.className = 'thumbnail-image thumbnail-image--active';
          incomingImage.alt = `Preview of ${star.label}`;
          incomingImage.removeAttribute('aria-hidden');
          [activeImage, incomingImage] = [incomingImage, activeImage];
          transitionTimer = null;
        }, 500);
      }, 1200);
    }
  }

  function hidePreview() {
    thumbnail.classList.remove('is-visible');
    window.clearInterval(slideshowTimer);
    window.clearTimeout(transitionTimer);
    slideshowTimer = null;
    transitionTimer = null;
    activeSlide = 0;
    activeImage = previewImagesElements[0];
    incomingImage = previewImagesElements[1];
    activeImage.className = 'thumbnail-image thumbnail-image--active';
    activeImage.src = previewImages[activeSlide];
    activeImage.alt = `Preview of ${star.label}`;
    activeImage.removeAttribute('aria-hidden');
    incomingImage.className = 'thumbnail-image thumbnail-image--incoming';
    incomingImage.removeAttribute('src');
    incomingImage.alt = '';
    incomingImage.setAttribute('aria-hidden', 'true');
  }

  function syncPreviewVisibility() {
    if (isHovering || isFocused) showPreview();
    else hidePreview();
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'star has-info';
  button.style.left = `${star.x}%`;
  button.style.top = `${star.y}%`;
  button.setAttribute('aria-label', `Open ${star.label}`);
  button.innerHTML = `<span class="star-label">${star.label}</span>`;
  button.addEventListener('click', () => { window.location.href = star.url; });
  button.addEventListener('pointerenter', () => { isHovering = true; syncPreviewVisibility(); });
  button.addEventListener('pointerleave', () => { isHovering = false; syncPreviewVisibility(); });
  button.addEventListener('focus', () => { isFocused = true; syncPreviewVisibility(); });
  button.addEventListener('blur', () => { isFocused = false; syncPreviewVisibility(); });
  starsLayer.append(button);
});

drawButtonConnections();
window.addEventListener('resize', drawButtonConnections);
setImages();
