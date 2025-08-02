import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';
import { useAuthStore, AuthResponse, User } from './stores/auth-store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage directly for better reliability
    let token = null;
    try {
      const stored = localStorage.getItem('auth-storage');
      if (stored) {
        const parsed = JSON.parse(stored);
        token = parsed.state?.token;
      }
    } catch (error) {
      console.error('Error reading token from localStorage:', error);
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and responses
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Handle successful responses - unwrap the data field from backend response structure
    if (response.data && response.data.success && response.data.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  (error: AxiosError) => {
    const { response } = error;
    
    // Handle different error scenarios
    if (response?.status === 401) {
      toast.error('Session expired. Please login again.');
      useAuthStore.getState().logout();
      window.location.href = '/login';
    } else if (response?.status === 403) {
      toast.error('Access denied. You do not have permission for this action.');
    } else if (response?.status === 404) {
      toast.error('Resource not found.');
    } else if (response?.status === 429) {
      toast.error('Too many requests. Please try again later.');
    } else if (response?.status === 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your connection.');
    } else if (!navigator.onLine) {
      toast.error('No internet connection. Please check your network.');
    } else {
      // Generic error handling
      const errorData = response?.data as any;
      const errorMessage = errorData?.message || 
                          (Array.isArray(errorData?.message) ? errorData?.message[0] : null) ||
                          error.message || 
                          'An unexpected error occurred';
      toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    department?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },
  
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },
  
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.patch<User>('/auth/profile', userData);
    return response.data;
  },
  
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post('/auth/change-password', { currentPassword, newPassword });
  },
};

// Doctors API endpoints
export const doctorsAPI = {
  getAll: async (params?: {
    specialization?: string;
    gender?: string;
    isActive?: boolean;
    search?: string;
  }) => {
    const response = await api.get('/doctors', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },
  
  create: async (doctorData: any) => {
    const response = await api.post('/doctors', doctorData);
    return response.data;
  },
  
  update: async (id: string, doctorData: any) => {
    const response = await api.patch(`/doctors/${id}`, doctorData);
    return response.data;
  },
  
  delete: async (id: string) => {
    await api.delete(`/doctors/${id}`);
  },
};

// Appointments API endpoints
export const appointmentsAPI = {
  getAll: async (params?: {
    date?: string;
    doctorId?: string;
    status?: string;
    patientName?: string;
  }) => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
  
  create: async (appointmentData: any) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },
  
  update: async (id: string, appointmentData: any) => {
    const response = await api.patch(`/appointments/${id}`, appointmentData);
    return response.data;
  },
  
  cancel: async (id: string, reason?: string) => {
    await api.delete(`/appointments/${id}`, { data: { reason } });
  },
  
  getStats: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await api.get('/appointments/stats', { params });
    return response.data;
  },
};

// Queue API endpoints
export const queueAPI = {
  getAll: async () => {
    const response = await api.get('/queue');
    return response.data;
  },
  
  addToQueue: async (queueData: any) => {
    const response = await api.post('/queue', queueData);
    return response.data;
  },
  
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/queue/${id}/status`, { status });
    return response.data;
  },
  
  updatePriority: async (id: string, isUrgent: boolean) => {
    const response = await api.patch(`/queue/${id}/priority`, { isUrgent });
    return response.data;
  },
  
  remove: async (id: string) => {
    await api.delete(`/queue/${id}`);
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

// Dashboard analytics
export const analyticsAPI = {
  getDashboardStats: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },
  
  getAppointmentStats: async (period = '7d') => {
    const response = await api.get(`/analytics/appointments?period=${period}`);
    return response.data;
  },
  
  getPatientStats: async (period = '7d') => {
    const response = await api.get(`/analytics/patients?period=${period}`);
    return response.data;
  },
  
  exportData: async (type: 'csv' | 'pdf', entity: string, filters?: any) => {
    const response = await api.post(`/analytics/export`, {
      type,
      entity,
      filters
    }, {
      responseType: 'blob'
    });
    return response.data;
  },
};

// Patients/Customers API
export const patientsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: any;
  }) => {
    const response = await api.get('/patients', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },
  
  create: async (patientData: any) => {
    const response = await api.post('/patients', patientData);
    return response.data;
  },
  
  update: async (id: string, patientData: any) => {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  },
  
  delete: async (id: string) => {
    await api.delete(`/patients/${id}`);
  },
  
  export: async (format: 'csv' | 'pdf', filters?: any) => {
    const response = await api.post('/patients/export', {
      format,
      filters
    }, {
      responseType: 'blob'
    });
    return response.data;
  },
};

export default api; 