import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import PlatformView from './views/PlatformView.vue'
import PlatformsView from './views/PlatformsView.vue'
import PlatformOverviewView from './views/PlatformOverviewView.vue'
import MagazineView from './views/MagazineView.vue'
import ArticleView from './views/ArticleView.vue'
import AboutView from './views/AboutView.vue'
import ContactView from './views/ContactView.vue'
import AdminView from './views/AdminView.vue'
import OperationsView from './views/OperationsView.vue'
import './style.css'
import './style-pages.css'
import './style-admin.css'
import './experience.css'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: (to) => to.hash ? { el: to.hash, behavior: 'smooth' } : { top: 0 },
  routes: [
    { path: '/', component: HomeView },
    { path: '/platforms', component: PlatformsView },
    { path: '/platforms/:slug/overview', component: PlatformOverviewView },
    { path: '/platforms/:slug', component: PlatformView },
    { path: '/magazine', component: MagazineView },
    { path: '/magazine/:slug', component: ArticleView },
    { path: '/about', component: AboutView },
    { path: '/contact', component: ContactView },
    { path: '/admin/magazine', component: AdminView },
    { path: '/admin', component: OperationsView },
    { path: '/admin/platforms/:slug', component: OperationsView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

createApp(App).use(router).mount('#app')

import './editorial.css'

import './refinements.css'
import './site-updates.css'
import './care-refresh.css'
import './experience-refresh.css'
