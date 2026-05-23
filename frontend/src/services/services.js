import api from './api';

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
};

export const billService = {
  createBill: (formData) => api.post('/bills', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  submitBill: (id) => api.post(`/bills/${id}/submit`),
  getMyBills: () => api.get('/bills/my'),
  getOpenRequests: () => api.get('/bills/my/open'),
  getBillById: (id) => api.get(`/bills/${id}`),

  // Manager
  getManagerPending: () => api.get('/bills/manager/pending'),
  approveBillByManager: (id, data) => api.post(`/bills/${id}/approve/manager`, data),
  rejectBillByManager: (id, data) => api.post(`/bills/${id}/reject/manager`, data),

  // Finance
  getFinancePending: () => api.get('/bills/finance/pending'),
  approveBillByFinance: (id, data) => api.post(`/bills/${id}/approve/finance`, data),
  rejectBillByFinance: (id, data) => api.post(`/bills/${id}/reject/finance`, data),
  closeBill: (id, data) => api.post(`/bills/${id}/close`, data),

  // Admin
  getAllBills: () => api.get('/bills/all'),
};

export const adminService = {
  createUser: (data) => api.post('/admin/users', data),
  getAllUsers: () => api.get('/admin/users'),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deactivateUser: (id) => api.delete(`/admin/users/${id}`),
  getManagers: () => api.get('/admin/managers'),
  getFinanceManagers: () => api.get('/admin/finance-managers'),
};

export const userService = {
  getProfile: () => api.get('/bills/profile'),
  getManagers: () => api.get('/bills/managers'),
};
