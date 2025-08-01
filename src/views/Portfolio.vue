<template>
  <Layout>
    <div class="portfolio-container">
      <div class="container py-5">
        <h1>Mateo Estrada</h1>
        
        <div class="intro-section">
          <p>
            My name is Mateo and I'm a physics graduate from Oregon State University.<br>
            I'm currently working on a computer science postbacc online degree from OSU.<br>
            My favorite sport is soccer, some of my hobbies include rock climbing,<br>
            <router-link to="/images/canyon.JPG">canyoneering,</router-link> running, and classic movies.
          </p>
        </div>

        <article class="education-section">
          <h2>Undergrad in Physics:</h2>
          <p>
            I've worked in Renewable energy research and delivered my Undergrad research Physics thesis 
            on Heterojunction solar cell contact resistance.
          </p>
          <p>
            Thesis: <a href="#" target="_blank">
              Cox and Strack method for Heterojunction solar cells
            </a>
          </p>
          <p>
            <a href="#" target="_blank">My Resume</a>
          </p>
        </article>

        <div class="projects-section mt-5">
          <h2>Projects</h2>
          <div class="row">
            <div class="col-md-6 mb-4">
              <div class="project-card">
                <h3>3D Business Card</h3>
                <p>Interactive 3D business card built with Three.js and WebGL</p>
                <router-link to="/" class="btn btn-primary">View Project</router-link>
              </div>
            </div>
            <div class="col-md-6 mb-4">
              <div class="project-card">
                <h3>Arcade Games</h3>
                <p>Collection of classic arcade games including Pong and Breakout</p>
                <router-link to="/arcade" class="btn btn-primary">Play Games</router-link>
              </div>
            </div>
            <div class="col-md-6 mb-4">
              <div class="project-card">
                <h3>Art Gallery</h3>
                <p>Digital art showcase and gallery</p>
                <router-link to="/art" class="btn btn-primary">View Gallery</router-link>
              </div>
            </div>
            <div class="col-md-6 mb-4">
              <div class="project-card">
                <h3>Physics Research</h3>
                <p>Semiconductor research and solar cell analysis</p>
                <a href="#" class="btn btn-primary" target="_blank">
                  Read Thesis
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="skills-section mt-5">
          <h2>Skills & Technologies</h2>
          <div class="row">
            <div class="col-md-4">
              <h4>Programming</h4>
              <ul>
                <li>JavaScript/TypeScript</li>
                <li>Python</li>
                <li>Vue.js</li>
                <li>Three.js</li>
              </ul>
            </div>
            <div class="col-md-4">
              <h4>Physics & Research</h4>
              <ul>
                <li>Semiconductor Physics</li>
                <li>Solar Cell Analysis</li>
                <li>Data Analysis</li>
                <li>Research Methodology</li>
              </ul>
            </div>
            <div class="col-md-4">
              <h4>Web Technologies</h4>
              <ul>
                <li>HTML/CSS</li>
                <li>WebGL</li>
                <li>Bootstrap</li>
                <li>Responsive Design</li>
              </ul>
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
  name: 'Portfolio',
  components: {
    Layout
  }
}
</script>

<style scoped>
@import '../assets/css/portfolio.css';

.portfolio-container {
  background-color: #F0FFFF;
  min-height: 100vh;
  font-family: sans-serif;
  margin: 0 10%;
}

h1 {
  text-align: right;
  font-family: serif;
  font-weight: normal;
  text-transform: uppercase;
  border-bottom: 9px solid #57b1dc;
  margin-top: 10px;
}

h2 {
  color: #d1633c;
  font-size: 1.5em;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.intro-section {
  margin: 2rem 0;
  font-size: 1.1em;
  line-height: 1.6;
}

.education-section {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
}

.project-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
  transition: transform 0.2s;
}

.project-card:hover {
  transform: translateY(-5px);
}

.project-card h3 {
  color: #57b1dc;
  margin-bottom: 1rem;
}

.skills-section {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.skills-section h4 {
  color: #57b1dc;
  margin-bottom: 1rem;
}

.skills-section ul {
  list-style-type: none;
  padding-left: 0;
}

.skills-section li {
  padding: 0.25rem 0;
  border-bottom: 1px solid #eee;
}

.btn-primary {
  background-color: #57b1dc;
  border-color: #57b1dc;
}

.btn-primary:hover {
  background-color: #d1633c;
  border-color: #d1633c;
}
</style>
