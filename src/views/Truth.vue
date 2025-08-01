<template>
  <Layout>
    <div class="truth-container">
      <div class="content-center">
        <h1>Will you be my Valentine?</h1>
        
        <div class="buttons-container">
          <a href="https://www.youtube.com/watch?v=Qtb11P1FWnc" target="_blank">
            <button type="button" class="truth-button yes-button">
              Yes 💕
            </button>
          </a>
          
          <a href="https://www.youtube.com/watch?v=sc4I9MweBy4" target="_blank">
            <button type="button" class="truth-button maybe-button">
              Maybe 🤔
            </button>
          </a>
          
          <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">
            <button type="button" class="truth-button no-button">
              Nah fam (too much drama) 😅
            </button>
          </a>
        </div>

        <div class="heart-animation">
          <span class="heart" v-for="n in 5" :key="n">💖</span>
        </div>

        <div class="back-navigation mt-4">
          <router-link to="/paloma" class="btn btn-outline-light">
            Back to Paloma
          </router-link>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue'

export default {
  name: 'Truth',
  components: {
    Layout
  }
}
</script>

<style scoped>
.truth-container {
  min-height: 100vh;
  background-image: linear-gradient(blue, white);
  background-size: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.content-center {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

h1 {
  font-size: 3rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 3rem;
  animation: pulse 2s infinite;
}

.buttons-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.truth-button {
  background-color: red;
  border: none;
  padding: 15px 30px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  border-radius: 25px;
  color: white;
  font-weight: bold;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  min-width: 250px;
}

.yes-button {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
}

.yes-button:hover {
  background: linear-gradient(45deg, #ee5a24, #ff6b6b);
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(255, 107, 107, 0.4);
}

.maybe-button {
  background: linear-gradient(45deg, #ffa726, #ff7043);
}

.maybe-button:hover {
  background: linear-gradient(45deg, #ff7043, #ffa726);
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(255, 167, 38, 0.4);
}

.no-button {
  background: linear-gradient(45deg, #8e44ad, #9b59b6);
}

.no-button:hover {
  background: linear-gradient(45deg, #9b59b6, #8e44ad);
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(155, 89, 182, 0.4);
}

.heart-animation {
  margin: 2rem 0;
}

.heart {
  font-size: 2rem;
  margin: 0 10px;
  animation: float 3s ease-in-out infinite;
  display: inline-block;
}

.heart:nth-child(1) { animation-delay: 0s; }
.heart:nth-child(2) { animation-delay: 0.5s; }
.heart:nth-child(3) { animation-delay: 1s; }
.heart:nth-child(4) { animation-delay: 1.5s; }
.heart:nth-child(5) { animation-delay: 2s; }

.btn-outline-light {
  border: 2px solid white;
  color: white;
  padding: 10px 25px;
  border-radius: 25px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-outline-light:hover {
  background-color: white;
  color: blue;
  text-decoration: none;
  transform: translateY(-2px);
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }
  
  .truth-button {
    font-size: 14px;
    padding: 12px 25px;
    min-width: 200px;
  }
  
  .heart {
    font-size: 1.5rem;
    margin: 0 5px;
  }
}
</style>
