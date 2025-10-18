import axios from 'axios';

// Base API URL - adjust this based on your backend configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Category API
export const categoryAPI = {
  // Get all categories
  getAll: async () => {
    const response = await apiClient.get('/categories/');
    // Handle paginated response - return results array
    return response.data.results || response.data;
  },

  // Get single category by ID
  getById: async (id) => {
    const response = await apiClient.get(`/categories/${id}/`);
    return response.data;
  },

  // Get subcategories for a specific category
  getSubcategories: async (categoryId) => {
    const response = await apiClient.get(`/categories/${categoryId}/subcategories/`);
    return response.data;
  },
};

// SubCategory API
export const subCategoryAPI = {
  // Get all subcategories
  getAll: async () => {
    const response = await apiClient.get('/subcategories/');
    // Handle paginated response - return results array
    return response.data.results || response.data;
  },

  // Get subcategories filtered by category
  getByCategory: async (categoryId) => {
    const response = await apiClient.get(`/subcategories/?category=${categoryId}`);
    // Handle paginated response - return results array
    return response.data.results || response.data;
  },

  // Get single subcategory by ID
  getById: async (id) => {
    const response = await apiClient.get(`/subcategories/${id}/`);
    return response.data;
  },
};

// Report API
export const reportAPI = {
  // Create a new report
  create: async (reportData) => {
    const response = await apiClient.post('/reports/', reportData);
    return response.data;
  },

  // Get all reports
  getAll: async () => {
    const response = await apiClient.get('/reports/');
    return response.data;
  },

  // Get single report by ID
  getById: async (id) => {
    const response = await apiClient.get(`/reports/${id}/`);
    return response.data;
  },

  // Update report
  update: async (id, reportData) => {
    const response = await apiClient.put(`/reports/${id}/`, reportData);
    return response.data;
  },

  // Delete report
  delete: async (id) => {
    const response = await apiClient.delete(`/reports/${id}/`);
    return response.data;
  },
};

export default apiClient;
