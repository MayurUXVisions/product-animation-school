/**
 * This file should execute all api calls, in this example it's to fetch Event related data.
 * The object's methods should always return a promise to be handled in the component that calls this service.
 */
import client from '~scripts/plugins/axios-plugin';

export default {
  /**
   * @return {Promise}
   */
  fetchAllEvents() {
    return client.get('/example/all');
  },

  /**
   * @return {Promise}
   */
  fetchEventById(id) {
    return client.get('/example', {
      params: {
        id: id
      }
    });
  }
};