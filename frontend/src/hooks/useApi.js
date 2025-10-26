/**
 * Custom hook for making authenticated API calls
 * 
 * Usage:
 * const api = useApi();
 * const reports = await api.get('/reports/');
 * const newReport = await api.post('/reports/', { title: 'Test' });
 */

import { useAuth } from '../pages/AuthPages';
import { apiClient } from '../services/apiClient';
import { useEffect } from 'react';

export const useApi = () => {
  const { accessToken, isAuthenticated } = useAuth();

  // Sync access token with API client whenever it changes
  useEffect(() => {
    if (accessToken) {
      const refreshToken = localStorage.getItem('refresh_token');
      apiClient.setTokens(accessToken, refreshToken);
    }
  }, [accessToken]);

  return {
    /**
     * Make a GET request
     */
    get: async (endpoint, options = {}) => {
      if (!isAuthenticated) {
        throw new Error('Not authenticated');
      }
      return apiClient.get(endpoint, options);
    },

    /**
     * Make a POST request
     */
    post: async (endpoint, data, options = {}) => {
      if (!isAuthenticated) {
        throw new Error('Not authenticated');
      }
      return apiClient.post(endpoint, data, options);
    },

    /**
     * Make a PUT request
     */
    put: async (endpoint, data, options = {}) => {
      if (!isAuthenticated) {
        throw new Error('Not authenticated');
      }
      return apiClient.put(endpoint, data, options);
    },

    /**
     * Make a PATCH request
     */
    patch: async (endpoint, data, options = {}) => {
      if (!isAuthenticated) {
        throw new Error('Not authenticated');
      }
      return apiClient.patch(endpoint, data, options);
    },

    /**
     * Make a DELETE request
     */
    delete: async (endpoint, options = {}) => {
      if (!isAuthenticated) {
        throw new Error('Not authenticated');
      }
      return apiClient.delete(endpoint, options);
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated,
  };
};

export default useApi;
