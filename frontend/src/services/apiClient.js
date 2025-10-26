/**
 * Secure API Client with Automatic Token Refresh
 * 
 * This client handles:
 * - Automatic token refresh on 401 errors
 * - Secure token management
 * - Request/response interceptors
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

class ApiClient {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  /**
   * Set authentication tokens
   */
  setTokens(access, refresh) {
    this.accessToken = access;
    this.refreshToken = refresh;
  }

  /**
   * Clear authentication tokens
   */
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
  }

  /**
   * Get current access token
   */
  getAccessToken() {
    return this.accessToken;
  }

  /**
   * Process queued requests after token refresh
   */
  processQueue(error, token = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  /**
   * Refresh the access token
   */
  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: this.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      if (data.success && data.data.access) {
        this.accessToken = data.data.access;
        return data.data.access;
      }
      
      throw new Error('Invalid refresh response');
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  /**
   * Make an authenticated request
   */
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available and not a public endpoint
    const publicEndpoints = [
      '/auth/login/citizen/', 
      '/auth/login/authority/', 
      '/citizens/',
      '/categories/',
      '/subcategories/'
    ];
    const isPublicEndpoint = publicEndpoints.some(ep => endpoint.includes(ep));
    
    if (this.accessToken && !isPublicEndpoint) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    // Make the request
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 - Token expired
      if (response.status === 401 && !isPublicEndpoint) {
        // If already refreshing, queue this request
        if (this.isRefreshing) {
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          })
            .then(token => {
              headers['Authorization'] = `Bearer ${token}`;
              return fetch(url, { ...options, headers });
            })
            .then(response => response.json());
        }

        // Try to refresh token
        this.isRefreshing = true;

        try {
          const newToken = await this.refreshAccessToken();
          this.isRefreshing = false;
          this.processQueue(null, newToken);

          // Retry original request with new token
          headers['Authorization'] = `Bearer ${newToken}`;
          const retryResponse = await fetch(url, { ...options, headers });
          return retryResponse.json();
        } catch (refreshError) {
          this.isRefreshing = false;
          this.processQueue(refreshError, null);
          
          // Redirect to login
          window.location.href = '/auth';
          throw refreshError;
        }
      }

      // Parse response
      const data = await response.json();

      // Handle other errors
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  /**
   * Convenience methods
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for testing
export default ApiClient;
