<template>
  <Layout>
    <div class="poems-container">
      <article class="poems-content">
        <h1>"As time goes by"</h1>
        
        <div class="gallery-section">
          <h2>Memory Gallery</h2>
          <div class="gallery-grid">
            <div 
              class="gallery-item" 
              v-for="(image, index) in galleryImages" 
              :key="index"
            >
              <img :src="image.src" :alt="image.alt">
              <div class="desc">{{ image.description }}</div>
            </div>
          </div>
        </div>

        <div class="poems-section mt-5">
          <h2>Memories & Moments</h2>
          <div class="poem-content">
            <p class="poem-line">Every moment we shared,</p>
            <p class="poem-line">Every laugh, every tear,</p>
            <p class="poem-line">Time may pass us by,</p>
            <p class="poem-line">But memories remain dear.</p>
          </div>
        </div>

        <div class="navigation-section mt-5">
          <router-link to="/paloma" class="btn btn-primary">
            Back to Main
          </router-link>
        </div>
      </article>
    </div>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue'

export default {
  name: 'Poems',
  components: {
    Layout
  },
  data() {
    return {
      galleryImages: [
        // Images temporarily removed for build
        // Will be added back later with proper import handling
      ]
    }
  }
}
</script>

<style scoped>
@import '../assets/css/paloma.css';

.poems-container {
  min-height: 100vh;
  background-image: linear-gradient(white, hsl(196, 92%, 50%), white);
  padding: 2rem;
}

.poems-content {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  font-size: 3rem;
  color: #333;
  margin-bottom: 2rem;
  font-style: italic;
}

h2 {
  text-align: center;
  font-size: 2rem;
  color: #555;
  margin-bottom: 1.5rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.gallery-item {
  margin: 5px;
  border: 1px solid #ccc;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.gallery-item:hover {
  border: 1px solid #777;
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.gallery-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.desc {
  padding: 15px;
  text-align: center;
  font-style: italic;
  color: #666;
}

.poems-section {
  background: rgba(255, 255, 255, 0.8);
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  backdrop-filter: blur(10px);
}

.poem-content {
  max-width: 600px;
  margin: 0 auto;
}

.poem-line {
  font-size: 1.2rem;
  line-height: 2;
  color: #444;
  font-style: italic;
  margin: 0.5rem 0;
}

.navigation-section {
  text-align: center;
}

.btn-primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  color: white;
  text-decoration: none;
}

@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .poem-line {
    font-size: 1rem;
  }
}
</style>
