<template>
  <Layout>
    <div class="hero-image">
      <div class="hero-text">
        <h1 style="font-size:50px">RWK Arts</h1>
        <p>Digital Art Gallery</p>
      </div>
    </div>

    <div class="topnav">
      <a href="#">RWK</a>
      <router-link to="/">Home</router-link>
      <a href="#">Shop</a>
      <a href="#" style="float:right">Sign up</a>
    </div>

    <div class="vertical-menu">
      <a href="#">Categories</a>
      <a href="#">Coming soon</a>
      <a href="#">Gallery</a>
      <a href="#">Supplies</a>
    </div>

    <!-- Gallery Section -->
    <div class="gallery-container">
      <h2 class="text-center">Art Gallery</h2>
      <div class="row">
        <!-- Add your art pieces here -->
        <div class="col-md-4 mb-4" v-for="artwork in artworks" :key="artwork.id">
          <div class="card">
            <img :src="artwork.image" class="card-img-top" :alt="artwork.title">
            <div class="card-body">
              <h5 class="card-title">{{ artwork.title }}</h5>
              <p class="card-text">{{ artwork.description }}</p>
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
  name: 'Art',
  components: {
    Layout
  },
  data() {
    return {
      artworks: [
        // Add your artwork data here
        // {
        //   id: 1,
        //   title: 'Sample Artwork',
        //   description: 'Description of the artwork',
        //   image: '/path/to/image.jpg'
        // }
      ]
    }
  }
}
</script>

<style>
@import '../assets/css/art.css';

.hero-image {
  background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('../assets/images/art-hero.jpg');
  height: 50%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
}

.hero-text {
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
}

.topnav {
  overflow: hidden;
  background-color: #333;
}

.topnav a {
  float: left;
  display: block;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

.topnav a:hover {
  background-color: #ddd;
  color: black;
}

.vertical-menu {
  width: 200px;
  height: 200px;
}

.vertical-menu a {
  background-color: #eee;
  color: black;
  display: block;
  padding: 12px;
  text-decoration: none;
}

.vertical-menu a:hover {
  background-color: #ccc;
}

.gallery-container {
  padding: 2rem;
}
</style>
