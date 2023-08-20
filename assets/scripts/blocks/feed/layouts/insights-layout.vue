<template>
  <div class="feed-layout  insights-layout">
    <filters
      v-if="feedLayout.enableFilters"
      :taxonomies-list="taxonomiesList"
      :selected-filters="filters"
      @select-filters="onSelectFilters($event)"
      @clear-filters="onClearFilters"
    />
    <posts-list v-if="resultsByPage.length > 0" :results-by-page="resultsByPage" />
    <p v-if="noResultsFound">
      {{ trans('No results to show') }}
    </p>
  </div>
</template>

<script>
// Components
import PostsList from '../components/posts-list';
import Filters from '../components/filters';

import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    PostsList,
    Filters
  },
  props: {
    feedLayout: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      resultsByPage: state => state.feed.resultsByPage,
      loading: state => state.feed.loading,
      filters: state => state.feed.filters
    }),
    ...mapGetters('feed', { hasResults: 'hasResults' }),

    taxonomiesList() {
      if ( ! this.feedLayout.enableFilters ) {
        return [];
      }

      return this.feedLayout.taxonomiesList;
    },

    noResultsFound() {
      // Finished loading and no results were found
      return this.loading === false && this.hasResults === false;
    }
  },
  created() {
    this.setupFeed();

    // Initial load filtered by any params in the url
    this.readSearchParamsFromQueryString();
    this.$store.dispatch('feed/loadPosts');
  },
  methods: {
    /**
     * Reads search params from query string and updates Vuex store
     */
    readSearchParamsFromQueryString() {

      // Reads params in url
      const urlParams = new URLSearchParams( window.location.search );

      // Filters
      const filters = [];
      for ( const item of this.taxonomiesList ) {
        if ( urlParams.has(item.taxonomy.slug) ) {
          filters.push({
            [item.taxonomy.slug]: urlParams.get(item.taxonomy.slug).split(',')
          });
          break;
        }
      }
      this.$store.dispatch('feed/updateFilters', filters);

      // Reads pagination
      if ( urlParams.has('current_page') ) {
        this.$store.dispatch('feed/updateCurrentPage', {
          page: parseInt( urlParams.get('current_page') )
        });
      }
    },

    /**
     * Configuration for how feed should behave
     */
    setupFeed() {
      let filters = [];

      // Sets post type and category as the default filter
      if ( this.feedLayout.layout === 'single_category' ) {
        filters.push({
          'post_types': [this.feedLayout.postType]
        });

        filters.push({
          [this.feedLayout.category.taxonomy]: [this.feedLayout.category.slug]
        });
      }

      // Sets post type as the default filter
      else if ( this.feedLayout.layout === 'single_post_type' ) {
        filters.push({
          'post_types': [this.feedLayout.postType]
        });
      }

      // Sets list of post types as the default filters
      else {
        filters.push({
          'post_types': this.feedLayout.postTypes
        });
      }

      // Updates permanent filters
      this.$store.dispatch('feed/updatePermanentFilters', filters);
    },

    /**
     * Filters :: updates selected filters
     */
    onSelectFilters({ options }) {
      this.$store.dispatch('feed/updateFilters', options);
      this.$store.dispatch('feed/resetSearch');
      this.$store.dispatch('feed/loadPosts');
    },

    /**
     * Filters :: reset filter selection
     */
    onClearFilters() {
      this.$store.dispatch('feed/updateFilters', []);
      this.$store.dispatch('feed/resetSearch');
      this.$store.dispatch('feed/loadPosts');
    }
  }
};
</script>

<style lang="scss">
@import "~styles/blocks/feed/layouts/insights-layout";
</style>