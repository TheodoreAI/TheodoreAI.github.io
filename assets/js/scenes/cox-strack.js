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

const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
camera.position.set(6, 4.2, 8.5);

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
controls.minDistance = 4;
controls.maxDistance = 20;
controls.target.set(0, 0.1, 0);

// === Lighting ===
scene.add(new THREE.AmbientLight(0x8899bb, 0.6));
const key = new THREE.DirectionalLight(0xffffff, 1.4);
key.position.set(6, 10, 4);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
scene.add(key);
const rim = new THREE.DirectionalLight(0x6c8ebf, 0.5);
rim.position.set(-6, 4, -6);
scene.add(rim);

// === Layer stack ===
// Substrate (bottom), semiconductor layer (top of substrate),
// and an array of circular metal contact pads on top of the semiconductor,
// separated by mesa-etched isolation gaps.
const STACK_WIDTH = 8;
const STACK_DEPTH = 3;
const SUBSTRATE_HEIGHT = 1.1;
const SEMI_HEIGHT = 0.25;

const substrateMat = new THREE.MeshStandardMaterial({ color: 0x555a63, roughness: 0.85, metalness: 0.1 });
const substrate = new THREE.Mesh(
  new THREE.BoxGeometry(STACK_WIDTH, SUBSTRATE_HEIGHT, STACK_DEPTH),
  substrateMat
);
substrate.position.y = -SUBSTRATE_HEIGHT / 2;
substrate.receiveShadow = true;
substrate.castShadow = true;
scene.add(substrate);

const semiMat = new THREE.MeshStandardMaterial({ color: 0x3a6ea5, roughness: 0.5, metalness: 0.2 });
const semiLayer = new THREE.Mesh(
  new THREE.BoxGeometry(STACK_WIDTH, SEMI_HEIGHT, STACK_DEPTH),
  semiMat
);
semiLayer.position.y = SEMI_HEIGHT / 2;
semiLayer.receiveShadow = true;
semiLayer.castShadow = true;
scene.add(semiLayer);

// Contact pads: increasing radius, evenly spaced along X, isolated by mesa gaps (visualized as thin grooves).
const padRadii = [0.28, 0.36, 0.46, 0.58, 0.72];
const padHeight = 0.12;
const padGap = 1.3;
const totalPadSpan = (padRadii.length - 1) * padGap;
const padStartX = -totalPadSpan / 2;

const padMat = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, roughness: 0.35, metalness: 0.75 });
const pads = [];
const padNames = ['A', 'B', 'C', 'D', 'E'];

padRadii.forEach((radius, i) => {
  const pad = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, padHeight, 32),
    padMat.clone()
  );
  pad.position.set(padStartX + i * padGap, SEMI_HEIGHT + padHeight / 2, 0);
  pad.castShadow = true;
  pad.receiveShadow = true;
  pad.userData.name = padNames[i];
  pad.userData.radius = radius;
  pad.userData.label = `Pad ${padNames[i]} (r=${radius})`;
  scene.add(pad);
  pads.push(pad);

  // Mesa isolation groove between this pad and the next
  if (i < padRadii.length - 1) {
    const grooveWidth = padGap - radius - padRadii[i + 1] - 0.15;
    if (grooveWidth > 0.05) {
      const groove = new THREE.Mesh(
        new THREE.BoxGeometry(grooveWidth, 0.06, STACK_DEPTH * 0.9),
        new THREE.MeshStandardMaterial({ color: 0x14161c, roughness: 1 })
      );
      const grooveX = padStartX + i * padGap + radius + grooveWidth / 2 + 0.05;
      groove.position.set(grooveX, SEMI_HEIGHT + 0.03, 0);
      scene.add(groove);
    }
  }
});

// === Ground shadow catcher ===
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 60),
  new THREE.ShadowMaterial({ opacity: 0.35 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -SUBSTRATE_HEIGHT - 0.01;
ground.receiveShadow = true;
scene.add(ground);

// === Always-visible pad radius tags ===
// A screenshot of the scene should convey the TLM geometry on its own,
// without requiring a click — so each pad gets a small persistent tag
// in addition to the bigger click-to-highlight label below.
const padTags = pads.map((pad) => {
  const div = document.createElement('div');
  div.className = 'pad-tag';
  div.textContent = `${pad.userData.name} · r=${pad.userData.radius}`;
  container.appendChild(div);
  return { pad, div };
});

function updatePadTags() {
  padTags.forEach(({ pad, div }) => {
    const vector = pad.position.clone();
    vector.y += pad.geometry.parameters.height / 2 + 0.06;
    vector.project(camera);
    const x = (vector.x * 0.5 + 0.5) * container.clientWidth;
    const y = (-vector.y * 0.5 + 0.5) * container.clientHeight;
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
  });
}

// === Current-path visualization ===
// Illustrates what the structure actually measures: current forced between
// a pair of adjacent contacts, through the semiconductor layer beneath them.
const CURRENT_PAIR = [1, 2]; // pads B -> C
const arcStart = pads[CURRENT_PAIR[0]].position;
const arcEnd = pads[CURRENT_PAIR[1]].position;
const arcMid = new THREE.Vector3(
  (arcStart.x + arcEnd.x) / 2,
  SEMI_HEIGHT + 0.55,
  (arcStart.z + arcEnd.z) / 2
);
const arcCurve = new THREE.QuadraticBezierCurve3(
  new THREE.Vector3(arcStart.x, SEMI_HEIGHT + padHeight, arcStart.z),
  arcMid,
  new THREE.Vector3(arcEnd.x, SEMI_HEIGHT + padHeight, arcEnd.z)
);
const arcPoints = arcCurve.getPoints(40);
const arcGeometry = new THREE.BufferGeometry().setFromPoints(arcPoints);
const arcMaterial = new THREE.LineBasicMaterial({ color: 0xffb703, transparent: true, opacity: 0.9 });
const currentArc = new THREE.Line(arcGeometry, arcMaterial);
scene.add(currentArc);

// A small glowing sphere travels along the arc to read as "current flowing"
// rather than a static line.
const currentDotGeo = new THREE.SphereGeometry(0.05, 16, 16);
const currentDotMat = new THREE.MeshStandardMaterial({
  color: 0xffb703,
  emissive: 0xffb703,
  emissiveIntensity: 1.2,
});
const currentDot = new THREE.Mesh(currentDotGeo, currentDotMat);
scene.add(currentDot);

// === Click-to-label interaction ===
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let activeLabel = null;

function showLabel(pad) {
  if (activeLabel) activeLabel.remove();
  const div = document.createElement('div');
  div.className = 'pad-label position-absolute bg-dark border border-info rounded px-2 py-1';
  div.style.pointerEvents = 'none';
  div.textContent = pad.userData.label;
  container.appendChild(div);
  activeLabel = div;

  function updatePosition() {
    const vector = pad.position.clone();
    vector.y += 0.4;
    vector.project(camera);
    const x = (vector.x * 0.5 + 0.5) * container.clientWidth;
    const y = (-vector.y * 0.5 + 0.5) * container.clientHeight;
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    div.style.transform = 'translate(-50%, -100%)';
  }
  updatePosition();
  pad.userData.updateLabelPosition = updatePosition;
}

renderer.domElement.addEventListener('click', (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(pads);
  if (hits.length > 0) {
    showLabel(hits[0].object);
  } else if (activeLabel) {
    activeLabel.remove();
    activeLabel = null;
  }
});

// === Texture "loading" gate (procedural scene, so just wait a frame) ===
requestAnimationFrame(() => {
  resize();
  loadingEl.remove();
});

function animate() {
  controls.update();
  pads.forEach((pad) => {
    if (pad.userData.updateLabelPosition && activeLabel) pad.userData.updateLabelPosition();
  });
  updatePadTags();

  // Animate the current-flow dot back and forth along the arc.
  const t = (Math.sin(performance.now() * 0.0012) + 1) / 2;
  currentDot.position.copy(arcCurve.getPoint(t));

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
