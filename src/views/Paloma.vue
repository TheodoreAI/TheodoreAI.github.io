<template>
  <Layout>
    <div class="paloma-container">
      <div class="bg"></div>
      
      <div class="content-wrapper">
        <h1>Paloma,</h1>
        <h2>
          Forget about making a mixtape, this is...
          <p>Making you a lil website</p>
        </h2>

        <h3>================</h3>

        <div class="image-section">
          <div class="container">
            <!-- Image temporarily removed for build -->
            <div class="button-container">
              <router-link to="/poems">
                <button 
                  type="button" 
                  class="action-button" 
                  @click="showAlert"
                >
                  Memories
                </button>
              </router-link>
              <button class="action-button">For a surprise</button>
            </div>
          </div>
        </div>

        <div class="message-section mt-4">
          <p>A special place created with love 💕</p>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue'

export default {
  name: 'Paloma',
  components: {
    Layout
  },
  data() {
    return {
      // Image paths will be handled later
    }
  },
  methods: {
    showAlert() {
      alert('Lil shit')
    }
  }
}
</script>

<style scoped>
@import '../assets/css/paloma.css';

.paloma-container {
  min-height: 100vh;
  background-image: linear-gradient(white, rgb(242, 233, 12), rgb(44, 230, 242));
  padding: 2rem;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.paloma-image {
  width: 370px;
  height: 270px;
  float: right;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.rotateimg90 {
  transform: rotate(90deg);
}

.action-button {
  background-color: yellow;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  margin: 0.5rem;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.action-button:hover {
  background-color: #ffed4e;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 1rem;
}

.message-section {
  clear: both;
  margin-top: 3rem;
  font-size: 1.2em;
  font-style: italic;
}

h1 {
  font-size: 3rem;
  color: #333;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  color: #555;
  margin-bottom: 1rem;
}

h2 p {
  font-size: 1.2rem;
  margin-top: 0.5rem;
}

h3 {
  font-size: 2rem;
  color: #777;
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .paloma-image {
    width: 100%;
    height: auto;
    float: none;
    transform: none;
  }
  
  .button-container {
    align-items: center;
  }
}
</style>
