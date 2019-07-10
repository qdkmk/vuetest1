import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import sns from './components/sns.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/detail/:sysid',
      name: 'detail',
      component: () => import(/* webpackChunkName: "about" */ './views/Detail.vue')
    },
    {
      path: '/aboutservice',
      name: 'aboutservice',
      component: () => import('./views/aboutservice.vue')
    }
  ]
})
