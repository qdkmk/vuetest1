import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: '',
    count: 1
  },

  mutations: {
    increment(state) {
      // 状態を変更する
      state.count++
    },

    setMessageAction(state, newValue) {
      this.state.message = newValue
    },
    clearMessageAction() {
      this.state.message = ''
    },

  },
  actions: {

  }
})
