<template>
  <Layout>
    <section id="about" class="about-section py-5 bg-dark">
      <div class="container">
        <h2 class="text-center mb-4">About Me</h2>
        <div class="row">
          <div class="col-md-6">
            <p>Hello! I'm TheodoreAI, a passionate developer with a keen interest in creating engaging and functional web experiences. My journey in development has led me through various technologies and projects, constantly learning and adapting to new challenges.</p>
            <p>I specialize in front-end development, with a strong foundation in HTML, CSS, and JavaScript. I enjoy bringing ideas to life through clean, efficient, and user-friendly code.</p>
          </div>
          <div class="col-md-6">
            <h3 class="mb-3">Skills</h3>
            <ul class="list-group list-group-flush">
              <li class="list-group-item bg-dark text-light">HTML5, CSS3, JavaScript (ES6+)</li>
              <li class="list-group-item bg-dark text-light">Bootstrap, Responsive Design</li>
              <li class="list-group-item bg-dark text-light">Git, GitHub</li>
              <li class="list-group-item bg-dark text-light">Problem Solving, Debugging</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue'

export default {
  name: 'About',
  components: {
    Layout
  }
}
</script>
