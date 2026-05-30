import { createRouter, createWebHistory } from 'vue-router'
import GraphPage from '@/pages/GraphPage.vue'
import CharacterDetailPage from '@/pages/CharacterDetailPage.vue'
import FactionsPage from '@/pages/FactionsPage.vue'
import TimelinePage from '@/pages/TimelinePage.vue'

const routes = [
  { path: '/', name: 'graph', component: GraphPage },
  { path: '/character/:id', name: 'character', component: CharacterDetailPage },
  { path: '/factions', name: 'factions', component: FactionsPage },
  { path: '/timeline', name: 'timeline', component: TimelinePage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
