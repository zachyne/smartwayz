/**
 * Legacy API service built on top of `apiClient`.
 *
 * Prefer `useApi` for new React code. This module remains in place for
 * existing consumers that still depend on the older service surface.
 */

import { apiClient } from './apiClient';

export const categoryAPI = {
  getAll: async () => {
    const data = await apiClient.get('/categories/');
    return data.results || data;
  },

  getById: async (id) => {
    const data = await apiClient.get(`/categories/${id}/`);
    return data;
  },

  getSubcategories: async (categoryId) => {
    const data = await apiClient.get(`/categories/${categoryId}/subcategories/`);
    return data;
  },
};

export const subCategoryAPI = {
  getAll: async () => {
    const data = await apiClient.get('/subcategories/');
    return data.results || data;
  },

  getByCategory: async (categoryId) => {
    const data = await apiClient.get(`/subcategories/?category=${categoryId}`);
    return data.results || data;
  },

  getById: async (id) => {
    const data = await apiClient.get(`/subcategories/${id}/`);
    return data;
  },
};

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
