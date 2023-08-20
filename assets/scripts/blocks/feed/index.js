import Vue from 'vue';
import FeedComponent from './Feed';
import translationMixin from './mixins/translation-mixin';
import '~styles/blocks/feed/index.scss';

import store from './store';

// Set global mixin
Vue.mixin(translationMixin);

// Registers directive to handle clicks outside an element
Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  },
});

new Vue({
  store,
  el: '#feed',
  components: {
    FeedComponent
  }
});
