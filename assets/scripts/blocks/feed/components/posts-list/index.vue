<template>
  <div class="feed-results  feed-results--posts">
    <div
      v-for="(page, pageKey) in resultsByPage"
      ref="results-page"
      :key="pageKey"
      class="feed-results__page"
      :data-page="page.page"
    >
      <post-item
        v-for="(post, key) in page.items"
        :key="key"
        :post="post"
      />
    </div>
  </div>
</template>

<script>
// Components
import PostItem from './post-item';

// Mixins
import scrollPaginationHandlerMixin from '../../mixins/scroll-pagination-handler-mixin';

export default {
  name: 'PostsList',
  components: {
    PostItem
  },
  mixins: [scrollPaginationHandlerMixin],
  props: {
    resultsByPage: {
      type: Array,
      required: true
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleResultsScrollPosition);
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleResultsScrollPosition);
  },
  methods: {
    /**
     * Updates url param with the currently scrolled results page number
     *
     * Override to scrollPaginationHandlerMixin
     */
    onResultsPageInViewport( page, scrollDirection ) {

      const direction = scrollDirection === 'scroll-up'
        ? 'prev'
        : 'next'
      ;

      this.$store.dispatch('feed/updateCurrentPage', {
        page: page,
        direction: direction
      });
    }
  },
};
</script>
