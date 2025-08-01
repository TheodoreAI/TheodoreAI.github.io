<template>
  <Layout>
    <div class="container">
      <div class="bg-dark">
        <div class="text-center text-light">
          <div class="text-center">
            <h1>Arcade Games</h1>
          </div>
          <div class="row">
            <p class="lead text-center">Please select a game you would like to play</p>
            <div class="game-selection text-center">
              <div class="dropdown">
                <button 
                  class="btn btn-primary dropdown-toggle" 
                  type="button" 
                  id="dropdownMenuButton1" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  Select A Game
                </button>
                <ul class="dropdown-menu m-3 p-2" aria-labelledby="dropdownMenuButton1">
                  <li class="row m-1 p-2">
                    <button 
                      class="game-button btn btn-primary dropdown-item text-light text-center rounded-1" 
                      style="background-color: rgb(197, 0, 21);" 
                      data-game="pong"
                      @click="selectGame('pong')"
                    >
                      Pong
                    </button>
                  </li>
                  <li class="row m-1 p-2">
                    <button 
                      class="game-button btn btn-primary dropdown-item text-light text-center rounded-1" 
                      style="background-color: rgb(42, 122, 162);" 
                      data-game="breakout"
                      @click="selectGame('breakout')"
                    >
                      Breakout
                    </button>
                  </li>
                  <li class="row m-1 p-2">
                    <button 
                      class="game-button btn btn-primary dropdown-item text-light text-center rounded-1" 
                      style="background-color: rgb(136, 42, 162);" 
                      data-game="asteroids"
                      @click="selectGame('asteroids')"
                    >
                      Asteroids (In Progress)
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-dark">
          <div class="row" id="gameOne">
            <div class="col-12 d-flex justify-content-center align-items-center" style="height: 60vh;">
              <canvas 
                id="pongCanvas" 
                width="700" 
                height="500" 
                style="background-color: rgb(216, 230, 232);"
              ></canvas>
            </div>
          </div>
        </div>
        
        <div class="card-footer m-3">
          <div class="row">
            <div class="col-12 text-center">
              <router-link to="/" class="btn btn-danger text-light">Back</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue'

export default {
  name: 'Arcade',
  components: {
    Layout
  },
  methods: {
    selectGame(game) {
      // Add game selection logic here
      console.log('Selected game:', game)
    }
  },
  mounted() {
    // Add any arcade game initialization logic here
  }
}
</script>

<style>
/* Add any specific arcade styles here */
.game-selection {
  margin: 2rem 0;
}

.game-button:hover {
  opacity: 0.8;
}
</style>
