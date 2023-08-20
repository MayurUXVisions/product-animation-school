import PostService from '../../services/PostService';
import UrlQueryParamUpdater from '../../utility/url-query-param-updater';

// Enables namespace for all mutations, actions and getters in this module (i.e. 'moduleName/actionToCall')
export const namespaced = true;

export const state = {
  useInfiniteLoading: false,
  resultsByPage: [],
  // Selected by the user
  filters: [],
  // Filters that are always applied (user cannot control)
  permanentFilters: [],
  searchString: '',
  errorMessage: '',
  loading: false,
  pagination: {
    ppp: 6,
    currentPage: 1,
    // Identifies whether we are querying for next/previous posts
    direction: 'next', // options are 'prev' and 'next'
    maxPages: 1,
    itemsLoaded: 0,
    totalItems: 0
  }
};

export const mutations = {
  UPDATE_CURRENT_PAGE(state, payload) {
    state.pagination.currentPage = payload.page;
    state.pagination.direction = typeof payload.direction !== 'undefined'
      ? payload.direction
      : 'next' // default value
    ;
  },
  UPDATE_POSTS(state, payload) {
    if (payload.count === 0) {
      return;
    }

    if ( state.pagination.direction === 'prev' ) {
      // Loading previous posts, add them to the start of the array
      state.resultsByPage.unshift({
        page: state.pagination.currentPage,
        items: payload.items
      });
    } else  {
      // Load next posts, add them to the end of the array
      state.resultsByPage.push({
        page: state.pagination.currentPage,
        items: payload.items
      });
    }
  },
  RESET_POSTS(state) {
    state.resultsByPage = [];
  },
  UPDATE_LOADING(state, payload) {
    state.loading = payload;
  },
  UPDATE_FILTERS(state, payload) {
    state.filters = payload;
  },
  UPDATE_PERMANENT_FILTERS(state, payload) {
    state.permanentFilters = payload;
  },
  UPDATE_SEARCH_STRING(state, payload) {
    state.searchString = payload;
  },
  UPDATE_ERROR_MESSAGE(state, payload) {
    state.errorMessage = payload;
  },
  UPDATE_PAGINATION_POSTS_PER_PAGE(state, payload) {
    state.pagination.ppp = payload;
  },
  UPDATE_PAGINATION(state, payload) {
    state.pagination.maxPages = payload.maxPages;
    state.pagination.itemsLoaded += payload.count;
    state.pagination.totalItems = payload.totalItems;
  },
  RESET_PAGINATION(state) {
    state.pagination.currentPage = 1;
    state.pagination.direction = 'next';
    state.pagination.maxPages = 1;
    state.pagination.itemsLoaded = 0;
    state.pagination.totalItems = 0;
  }
};

export const actions = {
  loadPosts({ commit, state, dispatch }) {
    if (state.loading) return;

    commit('UPDATE_LOADING', true);
    commit('UPDATE_ERROR_MESSAGE', '');

    // Builds query params object including any permanent filters
    const queryParamsObj = _buildQueryParamsObj(state, true);

    PostService.fetchPosts(state.pagination.currentPage, state.pagination.ppp, queryParamsObj)
      .then(response => {
        commit('UPDATE_POSTS', response.data);
        commit('UPDATE_PAGINATION', response.data);

        dispatch('updateURL');
      })
      .catch(() => {
        commit('UPDATE_ERROR_MESSAGE', 'Sorry, there was an error. Please try again.');
      })
      .finally(() => {
        commit('UPDATE_LOADING', false);
      })
    ;
  },

  prevPage({ state, dispatch, getters }) {
    if (state.loading) return;
    if (!getters.hasPreviousItemsToLoad) return;

    dispatch('updateCurrentPage', {
      page: state.pagination.currentPage - 1,
      direction: 'prev'
    });
    dispatch('loadPosts');
  },

  nextPage({ state, dispatch, getters }) {
    if (state.loading) return;
    if (!getters.hasNextItemsToLoad) return;

    dispatch('updateCurrentPage', {
      page: state.pagination.currentPage + 1,
      direction: 'next'
    });
    dispatch('loadPosts');
  },

  updateCurrentPage({ state, commit, dispatch }, payload) {
    // No page change, ignore
    if ( payload.page === state.pagination.currentPage ) {
      return;
    }

    commit('UPDATE_CURRENT_PAGE', payload);
    dispatch('updateURL');
  },

  updateFilters({ commit }, payload) {
    commit('UPDATE_FILTERS', payload);
  },

  updatePermanentFilters({ commit }, payload) {
    commit('UPDATE_PERMANENT_FILTERS', payload);
  },

  updateSearchString({ commit }, payload) {
    commit('UPDATE_SEARCH_STRING', payload);
  },

  updatePaginationPostsPerPage({ commit }, payload) {
    commit('UPDATE_PAGINATION_POSTS_PER_PAGE', payload);
  },

  /**
   * TODO - improve UrlQueryParamUpdater.updateUrlWithParams() so we don't have to build a normalised flatQueryParamsObj
   */
  updateURL({ state }) {
    // Do not include permanent filters in the url
    const queryParamsObj = _buildQueryParamsObj(state);

    let flatQueryParamsObj = {};

    // Flattens filters object so we don't end up with a 'filters' query param that contains the grouped structure.
    // This is required by UrlQueryParamUpdater
    if (typeof queryParamsObj.filters !== 'undefined') {
      flatQueryParamsObj = Object.assign({}, flatQueryParamsObj, queryParamsObj.filters);
    }

    // Sets value as an array as required by UrlQueryParamUpdater
    if (typeof queryParamsObj.search_terms !== 'undefined') {
      flatQueryParamsObj.search_terms = [queryParamsObj.search_terms];
    }

    // Sets value as an array as required by UrlQueryParamUpdater
    flatQueryParamsObj.current_page = [queryParamsObj.current_page];

    UrlQueryParamUpdater.updateUrlWithParams(flatQueryParamsObj);
  },

  resetSearch({ commit }) {
    commit('RESET_POSTS');
    commit('RESET_PAGINATION');
  }
};

export const getters = {
  hasPreviousItemsToLoad(state, getters) {
    if (!getters.hasResults || state.pagination.currentPage <= 1) {
      return false;
    }

    // First page with results hasn't been loaded yet
    return state.resultsByPage[0].page !== 1;
  },

  hasNextItemsToLoad(state, getters) {
    if (!getters.hasResults) {
      return false;
    }

    // Last page of results hasn't been loaded
    return state.resultsByPage[ state.resultsByPage.length - 1 ].page !== state.pagination.maxPages;
  },

  hasLoadedAllResults(state) {
    return state.pagination.itemsLoaded === state.pagination.totalItems;
  },

  hasResults(state) {
    return state.pagination.totalItems > 0;
  }
};

/**
 * Returns object with query params (filters, search terms, pagination, etc..).
 *
 * UX improvement:
 * Permanent filters should be included when making the API call so it fetches the correct data,
 * but should be hidden when updating the url params in the browser.
 *
 * example:
 *  {
 *    filters: {
 *      taxonomy-1: ['term-1', 'term-2'],
 *      taxonomy-2: ['term-1'],
 *      ...
 *    }
 *    search_terms: 'some search terms'
 *    current_page: 1,
 *    ...
 *  }
 */
function _buildQueryParamsObj(state, includePermanentFilters = false) {
  const queryParamsObj = {};

  let filters = state.filters;

  // Merges permanent and user-selected filters
  if ( includePermanentFilters ) {
    filters = [...state.permanentFilters, ...filters];
  }

  // Sets filters grouped by their taxonomy
  if (filters.length > 0) {
    queryParamsObj.filters = {};

    filters.forEach(option => {
      for (const taxonomySlug in option) {
        queryParamsObj.filters[taxonomySlug] = option[taxonomySlug];
      }
    });
  }

  // Sets search string
  if (state.searchString !== '') {
    queryParamsObj.search_terms = state.searchString;
  }

  // Sets pagination
  queryParamsObj.current_page = state.pagination.currentPage;

  return queryParamsObj;
}
