import Vue from 'vue'
import VueRouter from 'vue-router'
import Frame from '../views/FramePage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Frame,
    children: [
      {
        path: '',
        component: () => import( '../views/LandingPage/index.vue'),
      },
      // {
      //   path: 'airdrop',
      //   component: () => import( '../views/AirdropPage/index.vue'),
      // }
    ]
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
