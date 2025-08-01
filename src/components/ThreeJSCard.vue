<template>
  <div class="threejs-container">
    <canvas ref="canvas" id="c"></canvas>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default {
  name: 'ThreeJSCard',
  data() {
    return {
      renderer: null,
      scene: null,
      camera: null,
      controls: null,
      card: null,
      particles: null,
      animationId: null
    }
  },
  mounted() {
    this.initThreeJS();
    this.animate();
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  },
  methods: {
    initThreeJS() {
      const canvas = this.$refs.canvas;
      this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x87CEEB); // Light sky blue

      this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
      this.camera.position.set(0, 0, 10);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableZoom = true;
      this.controls.enablePan = false;
      this.controls.autoRotate = false;

      // Lighting
      const light = new THREE.SpotLight(0xffffff, 1.5);
      light.position.set(5, 10, 5);
      light.castShadow = true;
      this.scene.add(light);

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
      this.scene.add(lightSphere);

      // Particle Effect
      this.createParticles();

      // Shadow Setup
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Card
      this.createCard();

      // Ground
      this.createGround();
    },

    createParticles() {
      const particleCount = 150;
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const baseY = new Float32Array(particleCount);
      const phases = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const radius = 3.5 + Math.random() * 2.5;
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.random() * Math.PI;
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.cos(phi);
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

      this.particles = new THREE.Points(particleGeometry, particleMaterial);
      this.particles.userData = { baseY, phases };
      this.scene.add(this.particles);
    },

    createCard() {
      const loader = new THREE.TextureLoader();

      const materials = [
        new THREE.MeshStandardMaterial({ color: 0x222 }), // right
        new THREE.MeshStandardMaterial({ color: 0x222 }), // left
        new THREE.MeshStandardMaterial({ color: 0x222 }), // top
        new THREE.MeshStandardMaterial({ color: 0x222 }), // bottom
        new THREE.MeshBasicMaterial({ map: loader.load('/assets/assets/card-front.png') }), // front
        new THREE.MeshBasicMaterial({ map: loader.load('/assets/assets/card-back.png') }),  // back
      ];

      const geometry = new THREE.BoxGeometry(3.5, 2, 0.05);
      this.card = new THREE.Mesh(geometry, materials);
      this.card.castShadow = true;
      this.scene.add(this.card);
    },

    createGround() {
      const groundGeometry = new THREE.PlaneGeometry(200, 200);
      const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.9 });
      groundMaterial.color.set(0x222);
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -1;
      ground.receiveShadow = true;
      this.scene.add(ground);
    },

    animate() {
      this.animationId = requestAnimationFrame(this.animate);

      // Animate particles
      if (this.particles) {
        const positions = this.particles.geometry.attributes.position.array;
        const baseY = this.particles.userData.baseY;
        const phases = this.particles.userData.phases;
        const time = Date.now() * 0.001;

        for (let i = 0; i < positions.length; i += 3) {
          const index = i / 3;
          positions[i + 1] = baseY[index] + Math.sin(time + phases[index]) * 0.3;
        }
        this.particles.geometry.attributes.position.needsUpdate = true;
      }

      // Animate card rotation
      if (this.card) {
        this.card.rotation.y += 0.005;
      }

      this.renderer.render(this.scene, this.camera);
    },

    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }
}
</script>

<style scoped>
.threejs-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style> 