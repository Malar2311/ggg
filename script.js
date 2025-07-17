const art = document.getElementById('art');
const artText = document.getElementById('artText');
const cssOutput = document.getElementById('cssOutput');
const copyBtn = document.getElementById('copyBtn');
const exportCssBtn = document.getElementById('exportCssBtn');
const exportImgBtn = document.getElementById('exportImgBtn');
const addShadowBtn = document.getElementById('addShadowBtn');
const shadowLayersDiv = document.getElementById('shadowLayers');
const animationSelect = document.getElementById('animationSelect');
const darkModeToggle = document.getElementById('darkModeToggle');
const overlayTextInput = document.getElementById('overlayText');
const saveBtn = document.getElementById('saveDesignBtn');
const loadBtn = document.getElementById('loadDesignBtn');

const controls = {
  shape: document.getElementById('shape'),
  width: document.getElementById('width'),
  height: document.getElementById('height'),
  color: document.getElementById('color'),
  useGradient: document.getElementById('useGradient'),
  gradientColor1: document.getElementById('gradientColor1'),
  gradientColor2: document.getElementById('gradientColor2'),
  rotate: document.getElementById('rotate'),
  scale: document.getElementById('scale'),
  skewX: document.getElementById('skewX'),
  skewY: document.getElementById('skewY')
};

const gradientControls = document.querySelector('.gradient-controls');
let shadowLayers = []; // store shadow layers

// Toggle gradient controls
controls.useGradient.addEventListener('change', () => {
  gradientControls.style.display = controls.useGradient.checked ? 'flex' : 'none';
  updateArt();
});

// Add shadow layer
addShadowBtn.addEventListener('click', () => {
  shadowLayers.push({ color: '#333333', x: 0, y: 0, blur: 10, spread: 0 });
  renderShadowLayers();
  updateArt();
});

// Render shadow layers UI
function renderShadowLayers() {
  shadowLayersDiv.innerHTML = '';
  shadowLayers.forEach((layer, index) => {
    const div = document.createElement('div');
    div.className = 'shadow-layer';
    div.innerHTML = `
      <label>Color</label>
      <input type="color" value="${layer.color}" onchange="updateShadowLayer(${index}, 'color', this.value)">
      <label>X</label>
      <input type="range" min="-50" max="50" value="${layer.x}" onchange="updateShadowLayer(${index}, 'x', this.value)">
      <label>Y</label>
      <input type="range" min="-50" max="50" value="${layer.y}" onchange="updateShadowLayer(${index}, 'y', this.value)">
      <label>Blur</label>
      <input type="range" min="0" max="50" value="${layer.blur}" onchange="updateShadowLayer(${index}, 'blur', this.value)">
      <label>Spread</label>
      <input type="range" min="-20" max="20" value="${layer.spread}" onchange="updateShadowLayer(${index}, 'spread', this.value)">
      <button class="btn small" onclick="removeShadowLayer(${index})">❌ Remove</button>
    `;
    shadowLayersDiv.appendChild(div);
  });
}

// Update shadow layer
window.updateShadowLayer = (index, prop, value) => {
  shadowLayers[index][prop] = value;
  updateArt();
};

// Remove shadow layer
window.removeShadowLayer = (index) => {
  shadowLayers.splice(index, 1);
  renderShadowLayers();
  updateArt();
};

// Build and apply CSS
function updateArt() {
  const width = controls.width.value + 'px';
  const height = controls.height.value + 'px';
  const bg = controls.useGradient.checked
    ? `linear-gradient(45deg, ${controls.gradientColor1.value}, ${controls.gradientColor2.value})`
    : controls.color.value;
  const transform = `rotate(${controls.rotate.value}deg) scale(${controls.scale.value}) skew(${controls.skewX.value}deg, ${controls.skewY.value}deg)`;
  const boxShadow = shadowLayers.map(l =>
    `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`
  ).join(', ');

  let borderRadius = '0';
  let clipPath = 'none';
  switch (controls.shape.value) {
    case 'circle':
      borderRadius = '50%';
      break;
    case 'ellipse':
      borderRadius = '50% / 30%';
      break;
    case 'triangle':
      clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
      break;
    case 'star':
      clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      break;
  }

  // Apply to art
  art.style.width = width;
  art.style.height = height;
  art.style.background = bg;
  art.style.transform = transform;
  art.style.boxShadow = boxShadow;
  art.style.borderRadius = borderRadius;
  art.style.clipPath = clipPath;

  // Animation
  const anim = animationSelect.value;
  art.style.animation = anim !== 'none' ? `${anim} 2s infinite` : 'none';

  // Text overlay
  artText.textContent = overlayTextInput.value;

  // Build CSS text
  const cssText = `
#art {
  width: ${width};
  height: ${height};
  background: ${bg};
  transform: ${transform};
  box-shadow: ${boxShadow};
  ${borderRadius !== '0' ? 'border-radius: ' + borderRadius + ';' : ''}
  ${clipPath !== 'none' ? 'clip-path: ' + clipPath + ';' : ''}
  ${anim !== 'none' ? 'animation: ' + anim + ' 2s infinite;' : ''}
}`;
  cssOutput.textContent = cssText.trim();
}

// Copy CSS
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(cssOutput.textContent)
    .then(() => alert('✅ CSS copied!'));
});

// Export CSS
exportCssBtn.addEventListener('click', () => {
  const blob = new Blob([cssOutput.textContent], { type: 'text/css' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'design.css';
  link.click();
});

// Export image
exportImgBtn.addEventListener('click', () => {
  html2canvas(art).then(canvas => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'preview.png';
    link.click();
  });
});

// Dark mode
darkModeToggle.addEventListener('change', e => {
  document.body.classList.toggle('dark', e.target.checked);
});

// Animation select
animationSelect.addEventListener('change', updateArt);

// Text overlay
overlayTextInput.addEventListener('input', updateArt);

// Save design
saveBtn.addEventListener('click', () => {
  const design = {
    controls: {},
    shadowLayers,
    text: overlayTextInput.value,
    animation: animationSelect.value,
    darkMode: darkModeToggle.checked
  };
  Object.keys(controls).forEach(key => {
    design.controls[key] = controls[key].type === 'checkbox' ? controls[key].checked : controls[key].value;
  });
  localStorage.setItem('savedDesign', JSON.stringify(design));
  alert('✅ Design saved!');
});

// Load design
loadBtn.addEventListener('click', () => {
  const saved = localStorage.getItem('savedDesign');
  if (saved) {
    const design = JSON.parse(saved);
    Object.keys(design.controls).forEach(key => {
      if (controls[key].type === 'checkbox') {
        controls[key].checked = design.controls[key];
      } else {
        controls[key].value = design.controls[key];
      }
    });
    shadowLayers = design.shadowLayers;
    renderShadowLayers();
    overlayTextInput.value = design.text;
    animationSelect.value = design.animation;
    darkModeToggle.checked = design.darkMode;
    document.body.classList.toggle('dark', design.darkMode);
    gradientControls.style.display = controls.useGradient.checked ? 'flex' : 'none';
    updateArt();
    alert('✅ Design loaded!');
  } else {
    alert('⚠️ No saved design found.');
  }
});

// Listen to other controls
Object.values(controls).forEach(input =>
  input.addEventListener('input', updateArt)
);

// Initial render
updateArt();
