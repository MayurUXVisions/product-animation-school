/**
 * Always include this file and re-use this axios instance for all your API calls to the backend.
 *
 * ::Important note::
 * Recent version of Axios no longer serialise the request params, leaving them as an array.
 * Could not get paramsSerializer to work, read about it here:
 * - https://axios-http.com/docs/req_config
 * - https://github.com/axios/axios/issues/5142
 *
 * Solution is to use version 0.27.2
 */
import axios from 'axios';

const client = axios.create({
  // Register the base url here
  baseURL: '/wp-json/product/v1', // TODO - Change 'product' to the project's name
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default client;