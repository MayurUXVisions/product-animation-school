import Vue from 'vue';
import Vuex from 'vuex';

// Modules
import * as feed from './modules/feed';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    translations: {}
  },
  mutations: {
    SET_TRANSLATION_STRINGS(state, payload) {
      state.translations = payload;
    }
  },
  actions: {
    setTranslations({ commit }, payload) {
      commit('SET_TRANSLATION_STRINGS', payload);
    }
  },
  modules: {
    feed
  }
});

export default store;
