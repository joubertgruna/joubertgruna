import api from './api';

export default {
  register(data) {
    return api.post('/auth/register', data);
  },
  login(data) {
    return api.post('/auth/login', data);
  },
  getProfile() {
    return api.get('/users/me');
  },
  updateProfile(data) {
    return api.put('/users/me', data);
  },
  updateAvatar(formData) {
    return api.put('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
