import api from './api';

export default {
  getAll() {
    return api.get('/matches');
  },
  getById(id) {
    return api.get(`/matches/${id}`);
  },
  markAdShown(id) {
    return api.post(`/matches/${id}/ad-shown`);
  },
};
