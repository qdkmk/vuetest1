import Vue from 'vue'
import App from './App.vue'
import toasted from 'vue-toasted';
import router from './router'
import store from './store'
import VueAnalytics from 'vue-analytics'

Vue.use(toasted)

Vue.use(VueAnalytics, {
  id:'UA-143677064-1',
  router
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
