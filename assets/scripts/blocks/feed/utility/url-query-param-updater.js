export default {
  /**
   * Updates url query string form an object containing params
   *
   * example input:
   * {
   *   var1: ['value1', 'value2'],
   *   var2: ['value1']
   * }
   * example output: ?var1=value1,value2&var2=value1
   *
   * @param paramsObj
   */
  updateUrlWithParams (paramsObj) {
    const queryString = this._buildUrlQueryString(paramsObj);
    const baseUrl = this._getBaseUrl();
    this._updateUrlInBrowser(baseUrl + queryString);
  },

  clearQueryString () {
    const baseUrl = this._getBaseUrl();
    this._updateUrlInBrowser(baseUrl);
  },

  /**
   * Builds query string from an object of params.
   *
   * @param paramsObj
   * @return {string}
   * @private
   */
  _buildUrlQueryString (paramsObj) {

    // Generates query string
    const queryString = Object.keys(paramsObj).map((key) => {
      // Encodes each option of the array
      const options = paramsObj[key].map(encodeURIComponent);
      // Encodes query var name and sets its value as string
      return encodeURIComponent(key) + '=' + options.join(',');
    })
      // joins multiple query vars with &
      .join('&')
    ;

    return '?' + queryString;
  },

  /**
   * Returns the base url of current page without query args or pagination info
   *
   * @return {string}
   * @private
   */
  _getBaseUrl () {
    // Fetches url without query args
    const baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
    return baseUrl;
  },

  /**
   * Replaces query string in url address bar
   * - https://stackoverflow.com/questions/824349/how-do-i-modify-the-url-without-reloading-the-page
   *
   * @param newUrl
   * @private
   */
  _updateUrlInBrowser (newUrl) {
    // Replaces the current state in browser history
    history.replaceState(null, null, newUrl);
  }
};