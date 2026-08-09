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

// ============================================================
// Two datasets, mirroring the two contact-resistance extraction
// methods compared in the thesis (Fig. 10 vs. Fig. 12): TLM plots
// total resistance against pad spacing; the Cox & Strack method
// plots it against inverse contact area (1/d^2). Both are
// illustrative — not the real thesis measurements — but use the
// same equations (thesis Eq. 4/5 and Eq. 11) and the same contact
// geometry as the Cox & Strack structure scene.
// ============================================================

const PLOT_WIDTH = 5;
const PLOT_HEIGHT = 3;

const MODES = {
  tlm: (() => {
    // R_T = 2*Rc + (Rsh/W) * d  (thesis Eq. 11 form)
    const R_C = 0.42;
    const R_SH_OVER_W = 0.65;
    const spacings = [0.46, 0.68, 0.94, 1.24];
    const noise = [0.03, -0.02, 0.04, -0.015];
    const points = spacings.map((d, i) => ({
      x: d,
      R_T: 2 * R_C + R_SH_OVER_W * d + noise[i],
      xLabel: `d=${d.toFixed(2)}`,
    }));
    return {
      points,
      maxX: 1.6,
      xAxisLabel: 'spacing (a.u.)',
      interceptLabel: (intercept) => `2Rc ≈ ${intercept.toFixed(2)}Ω`,
      resultsHtml: (intercept, slope) => `
        <div><strong>R<sub>c</sub></strong> ≈ ${(intercept / 2).toFixed(2)} Ω</div>
        <div><strong>R<sub>sh</sub>/W</strong> ≈ ${slope.toFixed(2)} Ω/unit</div>
      `,
    };
  })(),
  cs: (() => {
    // R_T = 4Rc/(pi*d^2) + 4*t*rho/(pi*d^2), i.e. linear in 1/d^2 (thesis Eq. 4).
    // Same five contact diameters as the Cox & Strack structure scene
    // (2x its pad radii: 0.28, 0.36, 0.46, 0.58, 0.72).
    const R_C = 0.42;
    const T_RHO = 0.18; // lumped 4*t*rho term, illustrative
    const diameters = [0.56, 0.72, 0.92, 1.16, 1.44];
    const noise = [0.02, -0.015, 0.025, -0.01, 0.015];
    const points = diameters.map((d, i) => {
      const invD2 = 1 / (d * d);
      return {
        x: invD2,
        R_T: (4 * R_C) / Math.PI * invD2 + T_RHO * invD2 + noise[i],
        xLabel: `d=${d.toFixed(2)}`,
      };
    });
    return {
      points,
      maxX: Math.max(...points.map((p) => p.x)) * 1.15,
      xAxisLabel: '1/d² (a.u.)',
      interceptLabel: () => `Rc read from slope`,
      resultsHtml: (intercept, slope) => `
        <div><strong>R<sub>c</sub></strong> ≈ ${((slope * Math.PI) / 4).toFixed(2)} Ω</div>
        <div><strong>intercept</strong> ≈ ${intercept.toFixed(3)} Ω</div>
      `,
    };
  })(),
};

let currentMode = 'tlm';
let sceneObjects = [];
let overlayLabels = [];
let markers = [];
let resultDiv = null;

function toSceneX(x, maxX) { return (x / maxX) * PLOT_WIDTH; }
function toSceneY(r, maxR) { return (r / maxR) * PLOT_HEIGHT; }

function clearScene() {
  sceneObjects.forEach((obj) => scene.remove(obj));
  sceneObjects = [];
  overlayLabels.forEach(({ div }) => div.remove());
  overlayLabels = [];
  markers = [];
  if (resultDiv) { resultDiv.remove(); resultDiv = null; }
}

function addLabel(worldPos, text, className = 'point-label') {
  const div = document.createElement('div');
  div.className = className;
  div.textContent = text;
  container.appendChild(div);
  overlayLabels.push({ worldPos, div });
}

const axisMat = new THREE.LineBasicMaterial({ color: 0x556277 });
function makeAxis(points, material) {
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geo, material || axisMat);
  scene.add(line);
  sceneObjects.push(line);
  return line;
}

const pointMat = new THREE.MeshStandardMaterial({ color: 0x8fd3ff, emissive: 0x2a5a80, emissiveIntensity: 0.4, metalness: 0.3, roughness: 0.4 });
const stemMat = new THREE.LineBasicMaterial({ color: 0x8fd3ff, transparent: true, opacity: 0.4 });
const interceptMat = new THREE.MeshStandardMaterial({ color: 0xe85d75, emissive: 0x6a2030, emissiveIntensity: 0.5 });

function buildMode(modeKey) {
  clearScene();
  currentMode = modeKey;
  const mode = MODES[modeKey];
  const { points, maxX, xAxisLabel } = mode;

  const maxR = Math.max(...points.map((p) => p.R_T)) * 1.25;

  // Axes
  makeAxis([new THREE.Vector3(0, 0, 0), new THREE.Vector3(PLOT_WIDTH + 0.4, 0, 0)]);
  makeAxis([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, PLOT_HEIGHT + 0.4, 0)]);

  const grid = new THREE.GridHelper(PLOT_WIDTH * 1.3, 10, 0x2a3040, 0x1c202c);
  grid.position.set(PLOT_WIDTH / 2, 0, 0);
  scene.add(grid);
  sceneObjects.push(grid);

  // Data points + stems
  markers = points.map(({ x, R_T, xLabel }) => {
    const sx = toSceneX(x, maxX);
    const sy = toSceneY(R_T, maxR);
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 20), pointMat);
    sphere.position.set(sx, sy, 0);
    sphere.castShadow = true;
    scene.add(sphere);
    sceneObjects.push(sphere);

    makeAxis([new THREE.Vector3(sx, 0, 0), new THREE.Vector3(sx, sy, 0)], stemMat);

    return { x, R_T, sx, sy, mesh: sphere, label: `${xLabel}, Rᴛ=${R_T.toFixed(2)}Ω` };
  });

  // Linear fit (least squares)
  const n = points.length;
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumR = points.reduce((s, p) => s + p.R_T, 0);
  const sumXR = points.reduce((s, p) => s + p.x * p.R_T, 0);
  const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);
  const slope = (n * sumXR - sumX * sumR) / (n * sumX2 - sumX * sumX);
  const intercept = (sumR - slope * sumX) / n;

  const fitLine = makeAxis([
    new THREE.Vector3(toSceneX(0, maxX), toSceneY(intercept, maxR), 0),
    new THREE.Vector3(toSceneX(maxX, maxX), toSceneY(intercept + slope * maxX, maxR), 0),
  ], new THREE.LineBasicMaterial({ color: 0xffb703, linewidth: 2 }));

  // Extrapolated y-intercept marker
  const interceptMarker = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), interceptMat);
  interceptMarker.position.set(0, toSceneY(intercept, maxR), 0);
  scene.add(interceptMarker);
  sceneObjects.push(interceptMarker);

  makeAxis([
    new THREE.Vector3(0, toSceneY(intercept, maxR), 0.6),
    new THREE.Vector3(0, toSceneY(intercept, maxR), 0),
  ]);

  // Labels
  markers.forEach(({ sx, sy, x }) => {
    const p = points.find((pt) => toSceneX(pt.x, maxX) === sx);
    addLabel(new THREE.Vector3(sx, sy + 0.45, 0), p.xLabel);
  });
  addLabel(new THREE.Vector3(0, toSceneY(intercept, maxR) + 0.3, 0.6), mode.interceptLabel(intercept));
  addLabel(new THREE.Vector3(PLOT_WIDTH + 0.4, -0.2, 0), xAxisLabel);
  addLabel(new THREE.Vector3(-0.3, PLOT_HEIGHT + 0.4, 0), 'Rᴛ (Ω)');

  // Results readout
  resultDiv = document.createElement('div');
  resultDiv.className = 'result-card';
  resultDiv.innerHTML = mode.resultsHtml(intercept, slope);
  container.appendChild(resultDiv);
}

// === Ground shadow catcher (persists across mode switches) ===
const shadowGround = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30),
  new THREE.ShadowMaterial({ opacity: 0.25 })
);
shadowGround.rotation.x = -Math.PI / 2;
shadowGround.position.set(PLOT_WIDTH / 2, -0.01, 0);
shadowGround.receiveShadow = true;
scene.add(shadowGround);

function updateLabels() {
  overlayLabels.forEach(({ worldPos, div }) => {
    const v = worldPos.clone().project(camera);
    const offFrustum = v.z < -1 || v.z > 1 || !Number.isFinite(v.x) || !Number.isFinite(v.y);
    div.style.display = offFrustum ? 'none' : '';
    if (offFrustum) return;
    const x = (v.x * 0.5 + 0.5) * container.clientWidth;
    const y = (-v.y * 0.5 + 0.5) * container.clientHeight;
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
  });
}

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

// === Mode toggle ===
const toggleButtons = document.querySelectorAll('[data-plot-mode]');
toggleButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const mode = btn.getAttribute('data-plot-mode');
    if (mode === currentMode) return;
    toggleButtons.forEach((b) => b.classList.toggle('active', b === btn));
    hoveredMarker = null;
    if (hoverLabel) { hoverLabel.remove(); hoverLabel = null; }
    buildMode(mode);
  });
});

buildMode('tlm');

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
