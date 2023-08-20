<template>
  <div>
    <h1>Example Events VueJS app</h1>
    <svg-icon v-if="loading" name="spinner" />
    <events v-if="!loading && events.length > 0" :events="events" />
    <p v-else>
      No results found.
    </p>
  </div>
</template>

<script>
// Components
import Events from './components/events';
import SvgIcon from '~scripts/components/SvgIcon';

// Services
import EventService from './services/EventService';

export default {
  components: {
    Events,
    SvgIcon
  },
  data() {
    return {
      loading: false,
      events: []
    };
  },
  created() {
    this.loadEvents();
  },
  methods: {
    loadEvents() {
      this.loading = true;

      // Always use a service to make API calls instead of including Axios and querying logic in the component
      EventService.fetchAllEvents()
        .then((response) => {
          this.events = response.data.items;
        })
        // .catch((error) => {
        //   // handle errors here
        // })
        .finally(() => {
          this.loading = false;
        })
      ;
    }
  }
};
</script>
