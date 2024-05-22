import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import startView from '../views/startView/index.vue'
import createView from '../views/createView/index.vue'
import matView from '../views/matView/index.vue'
import detailView from '../views/detailView/index.vue'
import canvasView from '../views/canvasView/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: startView
    },
    {
      path: '/create',
      name: 'create',
      component: createView
    },
    {
      path: '/mat',
      name: 'mat',
      component: matView
    },
    { 
      path: '/detail/:id',
      name: 'detail',
      component: detailView 
    },
    { 
      path: '/canvas',
      name: 'canvas',
      component: canvasView 
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
