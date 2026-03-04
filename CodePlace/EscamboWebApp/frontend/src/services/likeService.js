import api from './api';

export default {
  like(itemId) {
    return api.post('/likes', { itemId });
  },
  unlike(itemId) {
    return api.delete(`/likes/${itemId}`);
  },
  getReceived() {
    return api.get('/likes/received');
  },
};
