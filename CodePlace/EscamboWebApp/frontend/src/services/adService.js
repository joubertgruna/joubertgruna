import api from './api';

export default {
  getNext() {
    return api.get('/ads/next');
  },
  registerClick(id) {
    return api.post(`/ads/${id}/click`);
  },
};
