<template>
  <Layout>
    <section id="projects" class="projects-section py-5 bg-secondary">
      <div class="container">
        <h2 class="text-light text-center mb-4">My GitHub Pages</h2>
        <div class="row row-cols-1 row-cols-md-3 g-4">
          <Card
            v-for="(card, index) in cards"
            :key="index"
            :image-src="card.imageSrc"
            :alt-text="card.altText"
            :title="card.title"
            :description="card.description"
            :link="card.link"
          />
        </div>
      </div>
    </section>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue';
import Card from '../components/Card.vue';

export default {
  name: 'Projects',
  components: {
    Layout,
    Card
  },
  data() {
    return {
      cards: [
        {
          imageSrc: 'https://picsum.photos/400?random=1',
          altText: 'Screenshot of Main Page',
          title: '3D Solar System',
          description: 'Explore this GitHub Page.',
          link: 'https://theodoreai.github.io/planet/'
        },
        {
          imageSrc: 'https://picsum.photos/400?random=2',
          altText: 'Screenshot of Index',
          title: 'Study Guide',
          description: 'Explore this GitHub Page.',
          link: 'https://theodoreai.github.io/study-guide/#'
        },
        {
          imageSrc: 'https://picsum.photos/400?random=3',
          altText: 'Screenshot of Main Index',
          title: 'Online Store',
          description: 'Explore this GitHub Page.',
          link: 'https://main.d295jh51iix02r.amplifyapp.com/'
        },
        {
          imageSrc: 'https://picsum.photos/400?random=4',
          altText: 'Screenshot of Main Index',
          title: 'Main Index',
          description: 'Explore this GitHub Page.',
          link: '../index.html'
        },
        {
          imageSrc: 'https://picsum.photos/400?random=5',
          altText: 'Screenshot of Pages Arcade',
          title: 'Pages Arcade',
          description: 'Explore this GitHub Page.',
          link: 'arcade.html'
        },
        {
          imageSrc: 'https://picsum.photos/400?random=6',
          altText: 'Screenshot of Pages Art',
          title: 'Pages Art',
          description: 'Explore this GitHub Page.',
          link: 'art.html'
        },
        {
          imageSrc: 'https://picsum.photos/400?random=7',
          altText: 'Screenshot of Contact Me',
          title: 'Contact Me',
          description: 'Explore this GitHub Page.',
          link: 'contact_me.html'
        },
        {
          imageSrc: 'https://picsum.photos/400?random=8',
          altText: 'Screenshot of Home',
          title: 'Home',
          description: 'Explore this GitHub Page.',
          link: 'home.html'
        },
        {
          imageSrc: 'https://picsum.photos/400?random=9',
          altText: 'Screenshot of Portfolio',
          title: 'Portfolio',
          description: 'Explore this GitHub Page.',
          link: 'portfolio.html'
        }
      ]
    }
  }
}
</script>
