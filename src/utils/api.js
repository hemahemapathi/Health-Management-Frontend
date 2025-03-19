import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to attach the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // You could implement token refresh logic here
        // const refreshToken = localStorage.getItem('refreshToken');
        // const response = await axios.post('/api/auth/refresh-token', { refreshToken });
        // localStorage.setItem('token', response.data.token);
        // originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
        // return api(originalRequest);
        
        // For now, just redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      } catch (refreshError) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle server errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  verifyToken: () => api.get('/auth/verify')
};

// Doctor API calls
export const doctorAPI = {
  getAllDoctors: (page = 1, limit = 10, specialization = '') => 
    api.get(`/doctors?page=${page}&limit=${limit}${specialization ? `&specialization=${specialization}` : ''}`),
  getDoctorById: (id) => api.get(`/doctors/${id}`),
  getDoctorByUserId: (userId) => api.get(`/doctors/user/${userId}`),
  updateDoctor: (id, data) => api.put(`/doctors/${id}`, data),
  deleteDoctor: (id) => api.delete(`/doctors/${id}`),
  addRating: (id, data) => api.post(`/doctors/${id}/ratings`, data),
  getDoctorAvailability: (id) => api.get(`/doctors/${id}/availability`),
  updateAvailability: (id, availability) => api.put(`/doctors/${id}/availability`, { availability }),
  getDoctorStats: (id) => api.get(`/doctors/${id}/stats`),
  getSpecializations: () => api.get('/doctors/specializations')
};

// Patient API calls
export const patientAPI = {
  getPatientProfile: () => api.get('/users/profile'),
  updatePatientProfile: (data) => api.put('/users/profile', data),
  getPatientMedicalHistory: () => api.get('/patients/medical-history'),
  updateMedicalHistory: (data) => api.put('/patients/medical-history', data)
};

// Appointment API calls
export const appointmentAPI = {
  getPatientAppointments: () => api.get('/patients/appointments'),
  getAppointmentById: (id) => api.get(`/appointments/${id}`),
  createAppointment: (data) => api.post('/appointments', data),
  cancelAppointment: (id) => api.delete(`/appointments/${id}`),
  getDoctorAppointments: () => api.get('/appointments/doctor'),
  updateAppointmentStatus: (id, data) => api.patch(`/appointments/${id}`, data),
  getAvailableSlots: (doctorId, date) => api.get(`/appointments/available-slots?doctorId=${doctorId}&date=${date}`)
};

// Prescription API calls
export const prescriptionAPI = {
  getPatientPrescriptions: () => api.get('/prescriptions'),
  getPrescriptionById: (id) => api.get(`/prescriptions/${id}`),
  createPrescription: (data) => api.post('/prescriptions', data),
  updatePrescription: (id, data) => api.put(`/prescriptions/${id}`, data),
  deletePrescription: (id) => api.delete(`/prescriptions/${id}`),
  getPatientDetails: () => api.get('/prescriptions/patient-details'),
  getAllPatients: () => api.get('/prescriptions')
};

export default api;
