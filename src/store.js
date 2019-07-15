import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: [],
    count: 1,
    loading:false,
    moreKeyword:false,
    promptScroll:false,
    keyword:"",
    noMoreFlag:false,
  },

  mutations: {
    increment(state) {
      // 状態を変更する
      state.count++
    },

    setMessageAction(state, newValue) {
      this.state.message = this.state.message.concat(newValue);
    },
    clearMessageAction() {
      this.state.message = [];
    },
    setLoadingAction (state,newboolean) {
      this.state.loading = newboolean;
    },
    setMoreKeyWordButtonAction (state,newboolean) {
      this.state.moreKeyword = newboolean;
    },
    setPromptScrollAction (state,newboolean) {
      this.state.promptScroll = newboolean;
    },
    setKeyWordAction (state,newkeyWord) {
      this.state.keyword = newkeyWord;
    },
    setNoMoreFlagAction (state,newboolean) {
      this.state.noMoreFlag = newboolean;
    },

  },
  actions: {

  }
})
