<template>
  <div
    :class="{
      'feed' : true,
      'feed--loading': loading
    }"
  >
    <button
      v-if="hasPreviousItemsToLoad"
      type="button"
      class="btn btn--black load-previous-page-btn"
      @click="prevPage"
    >
      {{ trans('Load Previous') }}
    </button>

    <component :is="layout" :feed-layout="feedLayout" />

    <button
      v-if="hasNextItemsToLoad"
      type="button"
      class="btn btn--black load-next-page-btn"
      @click="nextPage"
    >
      {{ trans('Load More') }}
      <span class="arrow-container" />
    </button>
  </div>
</template>

<script>
import InsightsLayout from './layouts/insights-layout';

import { mapState, mapGetters } from 'vuex';

export default {
  props: {
    feedLayout: {
      type: Object,
      required: true
    },
    translations: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      loading: state => state.feed.loading
    }),
    ...mapGetters('feed', { hasPreviousItemsToLoad: 'hasPreviousItemsToLoad' }),
    ...mapGetters('feed', { hasNextItemsToLoad: 'hasNextItemsToLoad' }),

    layout() {
      // Example
      // if ( this.feedLayout.layout === 'single_post_type' && this.feedLayout.postType === 'event' ) {
      //   return EventsLayout;
      // }

      return InsightsLayout;
    }
  },
  created() {
    this.$store.dispatch('setTranslations', this.translations);
  },
  methods: {
    prevPage() {
      this.$store.dispatch('feed/prevPage');
    },

    nextPage() {
      this.$store.dispatch('feed/nextPage');
    }
  }
};
</script>