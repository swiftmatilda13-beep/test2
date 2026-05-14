import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000
});

export interface UserInfo {
  name: string;
  education: string;
  internships: Array<{ company: string; role: string; description: string }>;
  projects: Array<{ name: string; description: string; role: string }>;
  skills: string[];
  targetPosition: string;
  targetCompany: string;
}

export interface YuanbaoInfo {
  company: { name: string; parent: string; description: string };
  products: Array<{ name: string; description: string; features: string[] }>;
  businessFocus: string[];
  interviewKeyPoints: string[];
}

export interface ProductKnowledge {
  questions: Array<{ id: number; category: string; question: string; answer: string }>;
  frameworks: string[];
}

export const apiService = {
  getUserInfo: () => api.get<UserInfo>('/user-info'),
  updateUserInfo: (data: UserInfo) => api.put('/user-info', data),
  getYuanbaoInfo: () => api.get<YuanbaoInfo>('/yuanbao-info'),
  getProductKnowledge: (category?: string) => api.get<ProductKnowledge>('/product-knowledge', { params: { category } }),
  chat: (message: string) => api.post<{ response: string }>('/chat', { message })
};
