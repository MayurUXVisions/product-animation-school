import Vue from 'vue';
import ExampleComponentApp from './App';
import '~styles/components/example/index.scss';

new Vue({
  el: '#component-app',
  components: {
    ExampleComponentApp
  }
});