<template>
  <Layout>
    <!-- Hero Section -->
    <section id="home" class="hero-section position-relative" style="min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div class="overlay-content d-flex align-items-center justify-content-center text-center">
        <div class="container">
          <h1 class="display-3 fw-bold text-white">Welcome to My Portfolio</h1>
          <p class="lead text-white">A showcase of my projects and skills in web development and beyond.</p>
          <router-link to="/projects" class="btn btn-primary btn-lg mt-3">View My Work</router-link>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue'

export default {
  name: 'Home',
  components: {
    Layout
  }
}
</script>

<style>
@import '../assets/css/index.css';

.overlay-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}

.hero-section {
  position: relative;
}
</style>
