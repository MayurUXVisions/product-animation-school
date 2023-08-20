/**
 * Feed mixin
 *
 * Methods used to update the url with the corresponding page of the results being scrolled
 */
const scrollPaginationHandlerMixin = {
  data() {
    return {
      _previousScrollY: 0
    };
  },
  methods: {
    handleResultsScrollPosition() {
      if ( this.$refs['results-page'] ) {
        this.$refs['results-page'].forEach(page => {
          if ( this._isResultsPageInTopOfViewport( page ) ) {

            // Reads page number from DOM element
            const resultsPage = parseInt(page.dataset.page);

            this.onResultsPageInViewport( resultsPage, this._getScrollDirection() );
          }
        });
      }
    },

    _isResultsPageInTopOfViewport(element) {
      const rect = element.getBoundingClientRect();

      // Element (or part of) is visible up to 100px from the top of the page
      return rect.top < 100 && rect.bottom > 100;
    },

    _getScrollDirection() {
      const currentY = window.scrollY;
      const direction = currentY > this._previousScrollY
        ? 'scroll-down'
        : 'scroll-up'
      ;

      this._previousScrollY = currentY;

      return direction;
    },

    /**
     * Custom method actions should be set in the component that imports this mixin
     *
     * Example functionality to set in component that uses this mixin:
     * - update current page in url params
     */
    onResultsPageInViewport() {}
  }
};

export default scrollPaginationHandlerMixin;
