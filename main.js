import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.getElementById('c');

function isWebGLAvailable() {
  try {
    const testCanvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

if (!isWebGLAvailable()) {
  const loadingEl = document.getElementById('loading');
  if (loadingEl) {
    loadingEl.innerHTML = 'Your browser can\'t display this 3D scene. <a href="pages/main.html" style="color:#8fd3ff;">Continue to the site &rarr;</a>';
    loadingEl.classList.remove('hidden');
  }
  throw new Error('WebGL is not available in this browser.');
}

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
// Set background color to light light blue
scene.background = new THREE.Color(0x87CEEB); // Light sky blue

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 10);

// Expose for claude-scene-inspector (window.__sceneDebug via snippets/three-scene-walker.js)
window.scene = scene;
window.camera = camera;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;
controls.enablePan = false;
controls.autoRotate = false; // Scene will not rotate automatically

const light = new THREE.SpotLight(0xffffff, 1.5);
light.position.set(5, 10, 5);
light.castShadow = true;
scene.add(light);

const lightSphereGeo = new THREE.SphereGeometry(0.9, 32, 32);
const lightSphereMat = new THREE.MeshStandardMaterial({
  emissive: 0xffffaa,
  emissiveIntensity: 1,
  color: 0xffffff,
  metalness: 0.3,
  roughness: 0.2,
});
const lightSphere = new THREE.Mesh(lightSphereGeo, lightSphereMat);
lightSphere.position.copy(light.position);
scene.add(lightSphere);

// === Particle Effect ===
const particleCount = 150;
const particleGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const baseY = new Float32Array(particleCount);
const phases = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
  // Spread particles in a sphere around the card
  const radius = 3.5 + Math.random() * 2.5;
  const theta = Math.random() * 2 * Math.PI;
  const phi = Math.random() * Math.PI;
  positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
  positions[i * 3 + 1] = radius * Math.cos(phi); // Y
  positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  baseY[i] = positions[i * 3 + 1];
  phases[i] = Math.random() * Math.PI * 2;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particleMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.09,
  transparent: true,
  opacity: 0.7,
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);


// === Shadow Setup ===
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// === Card ===
const loader = new THREE.TextureLoader();
const loadingEl = document.getElementById('loading');
const hintEl = document.getElementById('hint');

let texturesLoaded = 0;
const onTextureLoaded = () => {
  texturesLoaded++;
  if (texturesLoaded === 2 && loadingEl) {
    loadingEl.classList.add('hidden');
    setTimeout(() => loadingEl.remove(), 400);
  }
};
const onTextureError = () => {
  if (loadingEl) loadingEl.textContent = "Couldn't load — try refreshing.";
};

const materials = [
  new THREE.MeshStandardMaterial({ color: 0x222 }), // right
  new THREE.MeshStandardMaterial({ color: 0x222 }), // left
  new THREE.MeshStandardMaterial({ color: 0x222 }), // top
  new THREE.MeshStandardMaterial({ color: 0x222 }), // bottom
  new THREE.MeshBasicMaterial({ map: loader.load('./assets/assets/card-front.png', onTextureLoaded, undefined, onTextureError) }), // front
  new THREE.MeshBasicMaterial({ map: loader.load('./assets/assets/card-back.png', onTextureLoaded, undefined, onTextureError) }),  // back
];

const geometry = new THREE.BoxGeometry(3.5, 2, 0.05); // like a real card
const card = new THREE.Mesh(geometry, materials);
card.castShadow = true;
scene.add(card);


// === Ground ===
const groundGeometry = new THREE.PlaneGeometry(200, 200);
const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.9 });
groundMaterial.color.set(0x222); // Set ground color to dark gray
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate to horizontal
ground.position.y = -1; // Position below the card
ground.receiveShadow = true;
scene.add(ground);


// Flip on click
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

canvas.addEventListener('click', (event) => {
  // Calculate mouse position in normalized device coordinates (-1 to +1),
  // relative to the canvas's own bounding rect (not the window) so this
  // still works if the canvas is offset, letterboxed, or the window
  // doesn't exactly match innerWidth/innerHeight (e.g. some embedded/debug browsers).
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  // Update the raycaster with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the raycaster
  const intersects = raycaster.intersectObjects([card]);

  if (intersects.length > 0) {
    // If the card is clicked, flip it and navigate
    card.rotation.y += Math.PI;
    if (hintEl) hintEl.classList.add('hidden');
    window.location.href = 'pages/main.html';
  }
});

// The hint only appears once we reach this point, so its visibility doubles
// as a "click now works" signal — useful when testing in a fresh browser
// profile/window where it's not obvious whether the module has finished loading.
if (hintEl) hintEl.classList.remove('hidden');

// === Resize ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Removed light rotation variables; light will remain fixed

// For particle animation
const particleFloatSpeed = 0.7; // speed of floating
const particleFloatHeight = 0.25; // amplitude

function animate() {
  controls.update();

  // Keep the light and sphere stationary
  lightSphere.position.copy(light.position);

  // Rotate the contact card slowly
  card.rotation.y += 0.003;

  // Animate particles (gentle floating)
  const positions = particleGeometry.getAttribute('position');
  const time = performance.now() * 0.001;
  for (let i = 0; i < particleCount; i++) {
    positions.array[i * 3 + 1] = baseY[i] + Math.sin(time * particleFloatSpeed + phases[i]) * particleFloatHeight;
  }
  positions.needsUpdate = true;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
} 
animate();
