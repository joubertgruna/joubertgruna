import api from './api';

export default {
  getMessages(matchId, page = 1) {
    return api.get(`/chat/${matchId}`, { params: { page } });
  },
  sendMessage(matchId, content) {
    return api.post(`/chat/${matchId}`, { content });
  },
};
