import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { requireWebGLOrFail } from './webgl-check.js';

const container = document.getElementById('scene-container');
const loadingEl = document.getElementById('scene-loading');
requireWebGLOrFail(loadingEl);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
camera.position.set(7, 4.5, 8);

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
controls.target.set(1.5, 1, 0);

// === Lighting ===
scene.add(new THREE.AmbientLight(0x8899bb, 0.6));
const key = new THREE.DirectionalLight(0xffffff, 1.3);
key.position.set(6, 10, 5);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
scene.add(key);
const rim = new THREE.DirectionalLight(0x6c8ebf, 0.5);
rim.position.set(-6, 4, -6);
scene.add(rim);

// === Data ===
// Spacings mirror the mesa gaps between pads in the Cox & Strack scene
// (pad radii 0.28..0.72, gap 1.3 -> edge-to-edge spacings below).
// R_T = 2*Rc + (Rsh/W) * d, illustrative values with light synthetic noise.
const R_C = 0.42;   // ohm (specific contact resistance, per contact)
const R_SH_OVER_W = 0.65; // ohm per unit spacing (sheet resistance / contact width)
const dataPoints = [0.46, 0.68, 0.94, 1.24].map((d, i) => {
  const noise = [0.03, -0.02, 0.04, -0.015][i];
  const R_T = 2 * R_C + R_SH_OVER_W * d + noise;
  return { d, R_T };
});

// === Axes ===
const PLOT_WIDTH = 5;   // maps to spacing axis (X)
const PLOT_HEIGHT = 3;  // maps to resistance axis (Y)
const maxD = 1.6;
const maxR = 2 * R_C + R_SH_OVER_W * maxD + 0.3;

function toSceneX(d) { return (d / maxD) * PLOT_WIDTH; }
function toSceneY(r) { return (r / maxR) * PLOT_HEIGHT; }

const axisMat = new THREE.LineBasicMaterial({ color: 0x556277 });
function makeAxis(points) {
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.Line(geo, axisMat);
}
scene.add(makeAxis([new THREE.Vector3(0, 0, 0), new THREE.Vector3(PLOT_WIDTH + 0.4, 0, 0)])); // X axis (spacing)
scene.add(makeAxis([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, PLOT_HEIGHT + 0.4, 0)])); // Y axis (resistance)

// Floor grid for depth reference
const grid = new THREE.GridHelper(PLOT_WIDTH * 1.3, 10, 0x2a3040, 0x1c202c);
grid.position.set(PLOT_WIDTH / 2, 0, 0);
scene.add(grid);

// === Data point markers + stems ===
const pointMat = new THREE.MeshStandardMaterial({ color: 0x8fd3ff, emissive: 0x2a5a80, emissiveIntensity: 0.4, metalness: 0.3, roughness: 0.4 });
const stemMat = new THREE.LineBasicMaterial({ color: 0x8fd3ff, transparent: true, opacity: 0.4 });

const markers = dataPoints.map(({ d, R_T }) => {
  const x = toSceneX(d);
  const y = toSceneY(R_T);
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 20), pointMat);
  sphere.position.set(x, y, 0);
  sphere.castShadow = true;
  scene.add(sphere);

  const stem = makeAxis([new THREE.Vector3(x, 0, 0), new THREE.Vector3(x, y, 0)]);
  stem.material = stemMat;
  scene.add(stem);

  return { d, R_T, x, y, mesh: sphere, label: `d=${d.toFixed(2)}, Rᴛ=${R_T.toFixed(2)}Ω` };
});

// === Linear fit ===
// Simple least-squares fit over the (illustrative) data points.
const n = dataPoints.length;
const sumD = dataPoints.reduce((s, p) => s + p.d, 0);
const sumR = dataPoints.reduce((s, p) => s + p.R_T, 0);
const sumDR = dataPoints.reduce((s, p) => s + p.d * p.R_T, 0);
const sumD2 = dataPoints.reduce((s, p) => s + p.d * p.d, 0);
const slope = (n * sumDR - sumD * sumR) / (n * sumD2 - sumD * sumD);
const intercept = (sumR - slope * sumD) / n;

const fitLine = makeAxis([
  new THREE.Vector3(toSceneX(0), toSceneY(intercept), 0),
  new THREE.Vector3(toSceneX(maxD), toSceneY(intercept + slope * maxD), 0),
]);
fitLine.material = new THREE.LineBasicMaterial({ color: 0xffb703, linewidth: 2 });
scene.add(fitLine);

// === Extrapolated y-intercept (2*Rc) ===
const interceptMat = new THREE.MeshStandardMaterial({ color: 0xe85d75, emissive: 0x6a2030, emissiveIntensity: 0.5 });
const interceptMarker = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), interceptMat);
interceptMarker.position.set(0, toSceneY(intercept), 0);
scene.add(interceptMarker);

const interceptDash = makeAxis([
  new THREE.Vector3(0, toSceneY(intercept), 0.6),
  new THREE.Vector3(0, toSceneY(intercept), 0),
]);
scene.add(interceptDash);

// === Axis tick labels (DOM overlay, projected each frame) ===
const overlayLabels = [];
function addLabel(worldPos, text, className = 'point-label') {
  const div = document.createElement('div');
  div.className = className;
  div.textContent = text;
  container.appendChild(div);
  overlayLabels.push({ worldPos, div });
}

markers.forEach(({ d, x, y }) => {
  addLabel(new THREE.Vector3(x, y + 0.45, 0), `d=${d.toFixed(2)}`);
});
addLabel(new THREE.Vector3(0, toSceneY(intercept) + 0.3, 0.6), `2Rc ≈ ${intercept.toFixed(2)}Ω`);
addLabel(new THREE.Vector3(PLOT_WIDTH + 0.4, -0.2, 0), 'spacing (a.u.)');
addLabel(new THREE.Vector3(-0.3, PLOT_HEIGHT + 0.4, 0), 'Rᴛ (Ω)');

function updateLabels() {
  overlayLabels.forEach(({ worldPos, div }) => {
    const v = worldPos.clone().project(camera);
    // Points behind the camera (or far outside the frustum) project to
    // nonsensical screen coordinates rather than clipping — hide them
    // instead of letting them flash across the screen during orbit. Also
    // guards against a NaN world position silently no-oping as `left: NaNpx`
    // (CSS ignores it, leaving the label stuck at its default position).
    const offFrustum = v.z < -1 || v.z > 1 || !Number.isFinite(v.x) || !Number.isFinite(v.y);
    div.style.display = offFrustum ? 'none' : '';
    if (offFrustum) return;
    const x = (v.x * 0.5 + 0.5) * container.clientWidth;
    const y = (-v.y * 0.5 + 0.5) * container.clientHeight;
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
  });
}

// === Results readout ===
const resultDiv = document.createElement('div');
resultDiv.className = 'result-card';
resultDiv.innerHTML = `
  <div><strong>R<sub>c</sub></strong> ≈ ${(intercept / 2).toFixed(2)} Ω</div>
  <div><strong>R<sub>sh</sub>/W</strong> ≈ ${slope.toFixed(2)} Ω/unit</div>
`;
container.appendChild(resultDiv);

// === Ground shadow catcher ===
const shadowGround = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30),
  new THREE.ShadowMaterial({ opacity: 0.25 })
);
shadowGround.rotation.x = -Math.PI / 2;
shadowGround.position.set(PLOT_WIDTH / 2, -0.01, 0);
shadowGround.receiveShadow = true;
scene.add(shadowGround);

// === Point hover highlight ===
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let hoveredMarker = null;
let hoverLabel = null;

function showHoverLabel(marker) {
  if (hoverLabel) hoverLabel.remove();
  const div = document.createElement('div');
  div.className = 'point-label';
  div.style.color = '#8fd3ff';
  div.style.fontSize = '0.85rem';
  div.textContent = marker.label;
  container.appendChild(div);
  hoverLabel = div;
}

renderer.domElement.addEventListener('mousemove', (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(markers.map((m) => m.mesh));
  if (hits.length > 0) {
    const marker = markers.find((m) => m.mesh === hits[0].object);
    if (hoveredMarker !== marker) {
      hoveredMarker = marker;
      showHoverLabel(marker);
    }
  } else if (hoveredMarker) {
    hoveredMarker = null;
    if (hoverLabel) { hoverLabel.remove(); hoverLabel = null; }
  }
});

requestAnimationFrame(() => {
  resize();
  loadingEl.remove();
});

function animate() {
  controls.update();
  updateLabels();
  if (hoveredMarker && hoverLabel) {
    const v = hoveredMarker.mesh.position.clone();
    v.y += 0.25;
    v.project(camera);
    hoverLabel.style.left = `${(v.x * 0.5 + 0.5) * container.clientWidth}px`;
    hoverLabel.style.top = `${(-v.y * 0.5 + 0.5) * container.clientHeight}px`;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
