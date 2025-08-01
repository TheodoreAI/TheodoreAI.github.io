<template>
  <Layout>
    <!-- Hero Section -->
    <section id="home" class="hero-section d-flex align-items-center justify-content-center text-center py-5" style="min-height: 80vh;">
      <div class="container">
        <h1 class="display-3 fw-bold">Welcome to My Portfolio</h1>
        <p class="lead">A showcase of my projects and skills in web development and beyond.</p>
        <router-link to="/projects" class="btn btn-primary btn-lg mt-3">View My Work</router-link>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center">
            <h2>About Me</h2>
            <p class="lead">I am a passionate developer with experience in web technologies, AI, and creative coding.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="py-5 bg-light text-dark">
      <div class="container">
        <h2 class="text-center mb-5">My Projects</h2>
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">3D Business Card</h5>
                <p class="card-text">Interactive 3D business card built with Three.js</p>
                <router-link to="/" class="btn btn-primary">View Project</router-link>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Arcade Games</h5>
                <p class="card-text">Collection of classic arcade games</p>
                <router-link to="/arcade" class="btn btn-primary">Play Games</router-link>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Art Gallery</h5>
                <p class="card-text">Digital art showcase</p>
                <router-link to="/art" class="btn btn-primary">View Gallery</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center">
            <h2>Get In Touch</h2>
            <p class="lead">Ready to start your next project with me? Let's talk!</p>
            <router-link to="/contact" class="btn btn-outline-primary btn-lg">Contact Me</router-link>
          </div>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue'

export default {
  name: 'Main',
  components: {
    Layout
  }
}
</script>

<style>
@import '../assets/css/index.css';

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}
</style>
