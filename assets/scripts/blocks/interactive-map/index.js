import Vue from "vue";
import * as VueGMaps from "vue2-google-maps";
import GoogleMap from "./components/GoogleMap.vue";

Vue.use(VueGMaps, {
  load: {
    key: "AIzaSyDUjun8QbGegl6lMIqS-L9hKJFVl0FGo2Q",
    libraries: "places",
  },
});

new Vue({
  el: "#map",
  components: {
    GoogleMap
  },
});
