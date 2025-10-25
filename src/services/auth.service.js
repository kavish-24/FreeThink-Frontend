import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Company Auth API
export const companyAuth = {
  register: async (companyData) => {
    try {
      const payload = {
        companyName: companyData.companyName.trim(),
        email: companyData.email.trim().toLowerCase(),
        password: companyData.password,
        contactNumber: companyData.contactNumber || null,
        website: companyData.website || null,
        logo: companyData.logo || null,
        description: companyData.description || null,
        industry: companyData.industry || null,
        location: companyData.location || null,
        companySize: companyData.companySize || null,
        foundedYear: companyData.foundedYear ? Number(companyData.foundedYear) : null,
        linkedinUrl: companyData.linkedinUrl || null,
        twitterHandle: companyData.twitterHandle || null
      };

      const response = await api.post('/auth/company/register', payload);

      // Return token + user data separately
      return {
        success: true,
        data: response.data.data, // user info
        token: response.data.token // JWT
      };
    } catch (error) {
      console.error('Company registration error:', error);
      let errorMessage = 'Company registration failed. Please try again.';
      if (error.response?.data?.message) errorMessage = error.response.data.message;

      return {
        success: false,
        error: errorMessage,
        response: error.response?.data
      };
    }
  }
};


// Unified Auth API
export const auth = {
  // Unified login for both job seekers and companies
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      return {
        success: true,
        data: response.data,
        role: response.data.user.role // 'job_seeker' or 'company'
      };
    } catch (error) {
      console.error('Login error:', error);

      let errorMessage = 'Login failed. Please check your credentials and try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      return {
        success: false,
        error: errorMessage,
        response: error.response?.data
      };
    }
  },
};

// Job Seeker Auth API
export const jobSeekerAuth = {
  // Register a new job seeker
  register: async (userData) => {
    try {
      // Map frontend fields to backend expectations
      const payload = {
        name: `${userData.firstName} ${userData.lastName}`.trim(),
        email: userData.email,
        password: userData.password,
        // Include phone if available
        ...(userData.phone && { phone: userData.phone })
      };

      const response = await api.post('/auth/job-seeker/register', payload);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  },

  // Login job seeker
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/job-seeker/login', credentials);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/jobseeker/profile');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch profile',
      };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/jobseeker/profile', profileData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile',
      };
    }
  },
};

// Auth helper functions
export const authHelpers = {
  // Save auth data to local storage
  setAuthData: (token, userData) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userType', 'jobseeker');
  },

  // Clear auth data from local storage
  clearAuthData: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Get current user data
  getCurrentUser: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('authToken');
  },
};

export default api;
