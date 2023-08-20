import client from '~scripts/plugins/axios-plugin';

export default {
  /**
   * Returns a list of posts
   *
   * @return {Promise}
   */
  fetchPosts (page, ppp, queryParamsObj = {}) {
    let params = {
      page: page,
      ppp: ppp
    };

    if (typeof queryParamsObj.filters !== 'undefined') {
      params.filters = queryParamsObj.filters;
    }

    if (typeof queryParamsObj.search_terms !== 'undefined') {
      params.search = queryParamsObj.search_terms;
    }

    return client.get('/posts', { params });
  }
};