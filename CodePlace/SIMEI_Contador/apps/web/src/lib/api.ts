import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor para refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh falhou - redirecionar para login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Funções auxiliares tipadas
export const authApi = {
  login: (email: string, senha: string) =>
    api.post('/auth/login', { email, senha }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

export const empresaApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get('/empresas', { params }),
  get: (id: number) => api.get(`/empresas/${id}`),
  create: (data: any) => api.post('/empresas', data),
  update: (id: number, data: any) => api.put(`/empresas/${id}`, data),
  delete: (id: number) => api.delete(`/empresas/${id}`),
  dashboard: (id: number, periodo?: string) =>
    api.get(`/empresas/${id}/dashboard`, { params: { periodo } }),
};

export const lancamentoApi = {
  list: (empresaId: number, params?: any) =>
    api.get('/lancamentos', { params: { empresa_id: empresaId, ...params } }),
  get: (id: number) => api.get(`/lancamentos/${id}`),
  create: (data: any) => api.post('/lancamentos', data),
  update: (id: number, data: any) => api.put(`/lancamentos/${id}`, data),
  delete: (id: number) => api.delete(`/lancamentos/${id}`),
};

export const relatorioApi = {
  dre: (params: { empresa_id: number; ano?: number; mes?: number }) =>
    api.get('/relatorios/dre', { params }),
  balancete: (params: { empresa_id: number; ano?: number; mes?: number; dataInicio?: string; dataFim?: string }) =>
    api.get('/relatorios/balancete', { params }),
  fluxoCaixa: (params: { empresa_id: number; ano?: number }) =>
    api.get('/relatorios/fluxo-caixa', { params }),
};

export const apuracaoApi = {
  calcularDAS: (data: any) => api.post('/apuracao/das', data),
  simular: (params: any) => api.get('/apuracao/simular', { params }),
  tabelas: () => api.get('/apuracao/tabelas'),
};

export const agenteApi = {
  chat: (messages: { role: 'user' | 'assistant'; content: string }[], empresa_id?: number) =>
    api.post('/agente/chat', { messages, empresa_id }),
  status: () => api.get('/agente/status'),
};
