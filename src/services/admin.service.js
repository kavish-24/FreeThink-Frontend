import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL || 'https://freethink-backend.onrender.com/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important for sending cookies with cross-origin requests
});

// Add request interceptor to include token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Remove any existing Bearer prefix and trim whitespace
      const cleanToken = token.replace(/^Bearer\s+/i, '').trim();

      // Only add Bearer if it's not already present in the token
      const authHeader = cleanToken.startsWith('Bearer ')
        ? cleanToken
        : `Bearer ${cleanToken}`;

      config.headers.Authorization = authHeader;

      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log('Adding Authorization header:', {
          hasToken: !!token,
          cleanTokenLength: cleanToken.length,
          authHeaderValue: authHeader.substring(0, 30) + '...'
        });
      }
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, log out the user
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

const adminService = {
  // Admin login
  login: async (credentials) => {
    try {
      const response = await api.post('/admin/login', {
        email: credentials.email,
        password: credentials.password
      });

      // Ensure the token has the Bearer prefix when storing
      if (response.data && response.data.token) {
        // Remove any existing Bearer prefix and add a new one
        const token = response.data.token.replace(/^Bearer\s+/i, '');
        localStorage.setItem('adminToken', `Bearer ${token}`);
        response.data.token = `Bearer ${token}`;
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Admin login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Admin login failed'
      };
    }
  },

  // Get admin dashboard data
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to load dashboard stats',
        data: {
          totalUsers: 0,
          activeJobs: 0,
          totalCompanies: 0
        }
      };
    }
  },

  // Get pending jobs for approval
  getPendingJobs: async () => {
    try {
      const response = await api.get('/admin/jobs/pending');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching pending jobs:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch pending jobs',
        data: []
      };
    }
  },

  // Approve a job
  approveJob: async (jobId) => {
    try {
      const response = await api.put(`/admin/jobs/${jobId}/approve`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error approving job:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to approve job'
      };
    }
  },

  // Reject a job
  rejectJob: async (jobId, reason) => {
    try {
      const response = await api.put(`/admin/jobs/${jobId}/reject`, { reason });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error rejecting job:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to reject job'
      };
    }
  },

  // Check if admin is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },

  // Get unverified companies
  getUnverifiedCompanies: async () => {
    try {
      console.log('Fetching unverified companies from /admin/companies/pending');
      const response = await api.get('/admin/companies/pending');
      console.log('Unverified companies response:', response.data);
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.error('Error fetching unverified companies:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch unverified companies',
        data: []
      };
    }
  },

  // Get verified companies
  getVerifiedCompanies: async () => {
    try {
      console.log('Fetching verified companies from /admin/companies/verified');
      const response = await api.get('/admin/companies/verified');
      console.log('Verified companies response:', response.data);
      
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.error('Error fetching verified companies:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch verified companies',
        data: []
      };
    }
  },

  // Approve a company (alias for verifyCompany for backward compatibility)
  approveCompany: async (companyId) => {
    try {
      // Using POST method as per backend route definition
      const response = await api.post(`/admin/companies/${companyId}/approve`);
      return {
        success: true,
        data: response.data,
        message: 'Company approved successfully'
      };
    } catch (error) {
      console.error('Error approving company:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to approve company',
        status: error.response?.status
      };
    }
  },

  // Reject a company
  rejectCompany: async (companyId, reason) => {
    try {
      // Make sure we're using the correct endpoint format
      const response = await api.post(`/admin/companies/${companyId}/reject`, { reason });
      return {
        success: true,
        data: response.data,
        message: 'Company rejected successfully'
      };
    } catch (error) {
      console.error('Error rejecting company:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to reject company',
        status: error.response?.status
      };
    }
  },

  // Keep verifyCompany for backward compatibility
  verifyCompany: async (companyId) => {
    return adminService.approveCompany(companyId);
  },

  // Get available admins
  getAvailableAdmins: async () => {
    // Since we don't have a direct endpoint for available admins,
    // we'll return the current admin for now
    return {
      success: true,
      data: [
        {
          id: 'current',
          name: 'Current Admin',
          email: 'admin@example.com'
        }
      ]
    };
  },

  // Assign company to admin
  assignCompanyToAdmin: async (companyId, adminId) => {
    try {
      // Since we don't have a direct endpoint for assigning companies to admins,
      // we'll simulate a successful response
      console.log(`Would assign company ${companyId} to admin ${adminId}`);
      return {
        success: true,
        data: {
          id: companyId,
          assignedAdminId: adminId,
          status: 'assigned'
        }
      };
    } catch (error) {
      console.error('Error assigning company to admin:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to assign company to admin'
      };
    }
  },

  // Logout admin
  logout: () => {
    localStorage.removeItem('adminToken');
    // Optional: Call backend to invalidate token
    // api.post('/admin/logout').catch(console.error);
  }
};

export default adminService;
