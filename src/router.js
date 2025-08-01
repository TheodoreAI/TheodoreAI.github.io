import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Projects from './views/Projects.vue'
import Contact from './views/Contact.vue'
import Main from './views/Main.vue'
import Arcade from './views/Arcade.vue'
import Art from './views/Art.vue'
import ContactMe from './views/ContactMe.vue'
import Portfolio from './views/Portfolio.vue'
import Paloma from './views/Paloma.vue'
import Poems from './views/Poems.vue'
import Truth from './views/Truth.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/main',
    name: 'Main',
    component: Main
  },
  {
    path: '/arcade',
    name: 'Arcade',
    component: Arcade
  },
  {
    path: '/art',
    name: 'Art',
    component: Art
  },
  {
    path: '/contact-me',
    name: 'ContactMe', 
    component: ContactMe
  },
  {
    path: '/portfolio',
    name: 'Portfolio',
    component: Portfolio
  },
  {
    path: '/paloma',
    name: 'Paloma',
    component: Paloma
  },
  {
    path: '/poems',
    name: 'Poems',
    component: Poems
  },
  {
    path: '/truth',
    name: 'Truth',
    component: Truth
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
