/**
 * Legacy API service - Uses secure apiClient
 * 
 * NOTE: For new code, prefer using the useApi hook:
 * import { useApi } from '../hooks/useApi';
 * 
 * This file is kept for backward compatibility with existing code.
 */

import { apiClient } from './apiClient';

// Category API
export const categoryAPI = {
  // Get all categories
  getAll: async () => {
    const data = await apiClient.get('/categories/');
    // Handle paginated response - return results array
    return data.results || data;
  },

  // Get single category by ID
  getById: async (id) => {
    const data = await apiClient.get(`/categories/${id}/`);
    return data;
  },

  // Get subcategories for a specific category
  getSubcategories: async (categoryId) => {
    const data = await apiClient.get(`/categories/${categoryId}/subcategories/`);
    return data;
  },
};

// SubCategory API
export const subCategoryAPI = {
  // Get all subcategories
  getAll: async () => {
    const data = await apiClient.get('/subcategories/');
    // Handle paginated response - return results array
    return data.results || data;
  },

  // Get subcategories filtered by category
  getByCategory: async (categoryId) => {
    const data = await apiClient.get(`/subcategories/?category=${categoryId}`);
    // Handle paginated response - return results array
    return data.results || data;
  },

  // Get single subcategory by ID
  getById: async (id) => {
    const data = await apiClient.get(`/subcategories/${id}/`);
    return data;
  },
};

// Report API
export const reportAPI = {
  create: async (reportData) => {
    const data = await apiClient.post('/reports/', reportData);
    return data;
  },

  getAll: async () => {
    const data = await apiClient.get('/reports/');
    return data;
  },

  getAuthorityReports: async () => {
    const data = await apiClient.get('/reports/');
    return data;
  },

  getById: async (id) => {
    const data = await apiClient.get(`/reports/${id}/`);
    return data;
  },

  update: async (id, reportData) => {
    const data = await apiClient.put(`/reports/${id}/`, reportData);
    return data;
  },

  delete: async (id) => {
    const data = await apiClient.delete(`/reports/${id}/`);
    return data;
  },

  updateStatus: async (reportId, statusId) => {
    const { data } = await apiClient.patch(`/reports/${reportId}/status/`, { status_id: statusId });
    return data;
  },
  
  getStats: async () => {
    const { data } = await apiClient.get("/reports/stats/");
    return data;
  },  
};
