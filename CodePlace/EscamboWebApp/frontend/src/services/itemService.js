import api from './api';

export default {
  getFeed(page = 1, limit = 20, category) {
    const params = { page, limit };
    if (category) params.category = category;
    return api.get('/items', { params });
  },
  getById(id) {
    return api.get(`/items/${id}`);
  },
  getMyItems() {
    return api.get('/items/mine');
  },
  create(formData) {
    return api.post('/items', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update(id, data) {
    return api.put(`/items/${id}`, data);
  },
  delete(id) {
    return api.delete(`/items/${id}`);
  },
  addPhotos(id, formData) {
    return api.post(`/items/${id}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deletePhoto(itemId, photoId) {
    return api.delete(`/items/${itemId}/photos/${photoId}`);
  },
};
