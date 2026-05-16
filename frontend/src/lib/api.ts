import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data: any) => api.post('/auth/signup', data),
  login: (data: any) => api.post('/auth/login', data),
  loginAdmin: (data: any) => api.post('/auth/login-admin', data),
  getProfile: () => api.get('/auth/profile'),
};

export const borrowerAPI = {
  updateProfile: (data: any) => api.put('/borrower/profile', data),
  checkEligibility: () => api.get('/borrower/check-eligibility'),
  getLoanApplications: () => api.get('/borrower/applications'),
  getLoanById: (id: string) => api.get(`/borrower/applications/${id}`),
};

export const loanAPI = {
  createLoan: (data: FormData) => api.post('/loan/apply', data),
  getSalesLoans: () => api.get('/loan/sales/loans'),
  getSanctionedLoans: () => api.get('/loan/sanctioned/loans'),
  getDisbursedLoans: () => api.get('/loan/disbursed/loans'),
  sanctionLoan: (data: any) => api.post('/loan/sanction', data),
  disburseLoan: (data: any) => api.post('/loan/disburse', data),
  recordPayment: (data: any) => api.post('/loan/collect/payment', data),
  getDashboardData: () => api.get('/loan/dashboard'),
};

export default api;
