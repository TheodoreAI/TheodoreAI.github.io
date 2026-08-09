import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('scene-container');
const loadingEl = document.getElementById('scene-loading');

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8fc7e8);
scene.fog = new THREE.Fog(0xbcdcee, 35, 90);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
camera.position.set(0, 22, 38);

// Expose for claude-scene-inspector (window.__sceneDebug via snippets/three-scene-walker.js)
window.scene = scene;
window.camera = camera;

function resize() {
  const { clientWidth: w, clientHeight: h } = container;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 5;
controls.maxDistance = 45;
controls.maxPolarAngle = Math.PI / 2 - 0.02;
controls.target.set(0, 1.5, 0);

// ============================================================
// Procedural textures — everything below is drawn on a canvas
// at load time, no external image assets.
// ============================================================

function makeCanvas(size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  return { canvas, ctx: canvas.getContext('2d') };
}

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeBarkTexture() {
  const { canvas, ctx } = makeCanvas(128);
  const rand = mulberry32(7);
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 40; i++) {
    const x = rand() * 128;
    const w = 1.5 + rand() * 3;
    const shade = 20 + rand() * 40;
    ctx.strokeStyle = `rgba(${30 + shade}, ${18 + shade * 0.6}, ${8 + shade * 0.3}, ${0.4 + rand() * 0.4})`;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x, -5);
    let cx = x;
    for (let y = 0; y <= 128; y += 16) {
      cx += (rand() - 0.5) * 6;
      ctx.lineTo(cx, y);
    }
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 3);
  return tex;
}

function makeFoliageTexture(baseColor, seed) {
  const { canvas, ctx } = makeCanvas(128);
  const rand = mulberry32(seed);
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 260; i++) {
    const x = rand() * 128;
    const y = rand() * 128;
    const r = 1 + rand() * 2.5;
    const light = rand() > 0.5;
    ctx.fillStyle = light
      ? `rgba(255,255,255,${0.05 + rand() * 0.08})`
      : `rgba(0,0,0,${0.05 + rand() * 0.1})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function makeGrassTexture() {
  const { canvas, ctx } = makeCanvas(256);
  const rand = mulberry32(42);
  ctx.fillStyle = '#4c8a37';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 3000; i++) {
    const x = rand() * 256;
    const y = rand() * 256;
    const shade = rand();
    const g = 110 + shade * 60;
    ctx.fillStyle = `rgba(${60 + shade * 40}, ${g}, ${40 + shade * 30}, ${0.5 + rand() * 0.4})`;
    const len = 2 + rand() * 3;
    ctx.fillRect(x, y, 1, len);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(12, 12);
  tex.anisotropy = 4;
  return tex;
}

function makeCloudTexture() {
  const { canvas, ctx } = makeCanvas(128);
  const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 60);
  gradient.addColorStop(0, 'rgba(255,255,255,0.95)');
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.55)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

function makeSunTexture() {
  const { canvas, ctx } = makeCanvas(128);
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255,247,214,1)');
  gradient.addColorStop(0.3, 'rgba(255,222,120,0.9)');
  gradient.addColorStop(1, 'rgba(255,200,80,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

const barkTexture = makeBarkTexture();
const leafTextureA = makeFoliageTexture('#3f7d32', 3);
const leafTextureB = makeFoliageTexture('#356b2a', 9);
const grassTexture = makeGrassTexture();
const cloudTexture = makeCloudTexture();
const sunTexture = makeSunTexture();

// ============================================================
// Lighting — sun as the key light
// ============================================================
scene.add(new THREE.AmbientLight(0xbcd4e8, 0.55));
const sunLight = new THREE.DirectionalLight(0xfff2cf, 1.6);
sunLight.position.set(18, 22, 10);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
sunLight.shadow.camera.left = -25;
sunLight.shadow.camera.right = 25;
sunLight.shadow.camera.top = 25;
sunLight.shadow.camera.bottom = -25;
sunLight.shadow.camera.far = 60;
scene.add(sunLight);
scene.add(new THREE.HemisphereLight(0xbcdcee, 0x4c6b32, 0.5));

// Visible sun sprite — placed well outside the fog/forest bounds so its
// glow doesn't wash out the tree canopy in the frame.
const sunSpriteMat = new THREE.SpriteMaterial({
  map: sunTexture,
  transparent: true,
  depthWrite: false,
  fog: false,
});
const sunSprite = new THREE.Sprite(sunSpriteMat);
sunSprite.scale.set(6, 6, 1);
sunSprite.position.copy(sunLight.position).normalize().multiplyScalar(70);
scene.add(sunSprite);

// ============================================================
// Ground
// ============================================================
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(80, 80, 1, 1),
  new THREE.MeshStandardMaterial({ map: grassTexture, roughness: 0.95 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// ============================================================
// Trees — trunk (bark texture) + foliage clusters (leaf texture)
// ============================================================
const trunkMat = new THREE.MeshStandardMaterial({ map: barkTexture, roughness: 0.9 });
const foliageMatA = new THREE.MeshStandardMaterial({ map: leafTextureA, roughness: 0.85 });
const foliageMatB = new THREE.MeshStandardMaterial({ map: leafTextureB, roughness: 0.85 });

function makeTree(rand) {
  const group = new THREE.Group();
  const trunkHeight = 2.2 + rand() * 1.4;
  const trunkRadius = 0.18 + rand() * 0.1;

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(trunkRadius * 0.7, trunkRadius, trunkHeight, 8),
    trunkMat
  );
  trunk.position.y = trunkHeight / 2;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  group.add(trunk);

  const foliageMat = rand() > 0.5 ? foliageMatA : foliageMatB;
  const tiers = 2 + Math.floor(rand() * 2);
  for (let i = 0; i < tiers; i++) {
    const tierScale = 1 - i * 0.22;
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry((1.1 + rand() * 0.3) * tierScale, 1.6 * tierScale, 9),
      foliageMat
    );
    cone.position.y = trunkHeight + i * 1.0;
    cone.castShadow = true;
    cone.receiveShadow = true;
    group.add(cone);
  }

  const scale = 0.8 + rand() * 0.6;
  group.scale.setScalar(scale);
  return group;
}

const TREE_COUNT = 60;
const FOREST_RADIUS = 32;
const CLEARING_RADIUS = 6; // keep a clearing near the camera target so the scene reads clearly
const treeRand = mulberry32(1234);
for (let i = 0; i < TREE_COUNT; i++) {
  let x, z, dist;
  do {
    x = (treeRand() - 0.5) * FOREST_RADIUS * 2;
    z = (treeRand() - 0.5) * FOREST_RADIUS * 2;
    dist = Math.hypot(x, z);
  } while (dist < CLEARING_RADIUS || dist > FOREST_RADIUS);

  const tree = makeTree(treeRand);
  tree.position.set(x, 0, z);
  tree.rotation.y = treeRand() * Math.PI * 2;
  scene.add(tree);
}

// ============================================================
// Clouds — drifting billboard sprites
// ============================================================
const cloudMat = new THREE.SpriteMaterial({ map: cloudTexture, transparent: true, depthWrite: false, opacity: 0.9 });
const clouds = [];
const cloudRand = mulberry32(99);
for (let i = 0; i < 14; i++) {
  const cloud = new THREE.Sprite(cloudMat);
  const scale = 4 + cloudRand() * 5;
  cloud.scale.set(scale * 1.6, scale, 1);
  cloud.position.set(
    (cloudRand() - 0.5) * 60,
    14 + cloudRand() * 6,
    (cloudRand() - 0.5) * 60
  );
  cloud.userData.driftSpeed = 0.15 + cloudRand() * 0.25;
  scene.add(cloud);
  clouds.push(cloud);
}

requestAnimationFrame(() => {
  resize();
  loadingEl.remove();
});

function animate() {
  controls.update();

  const dt = 0.016;
  clouds.forEach((cloud) => {
    cloud.position.x += cloud.userData.driftSpeed * dt;
    if (cloud.position.x > 40) cloud.position.x = -40;
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
