/**
 * Secure API Client with Automatic Token Refresh
 *
 * This client handles:
 * - Automatic token refresh on 401 errors
 * - Secure token management
 * - Request/response interceptors
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

/**
 * Decode JWT token to inspect payload (for debugging)
 */
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode JWT:', e);
    return null;
  }
}

class ApiClient {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.isRefreshing = false;
    this.failedQueue = [];
    
    // Try to restore tokens from localStorage on initialization
    this.restoreTokens();
  }

  /**
   * Restore tokens from localStorage
   */
  restoreTokens() {
    const refreshToken = localStorage.getItem('refresh_token');
    const accessToken = localStorage.getItem('access_token');

    if (refreshToken) {
      this.refreshToken = refreshToken;
    }

    if (accessToken) {
      this.accessToken = accessToken;
      console.log('✓ Tokens restored from localStorage');
    }
  }

  /**
   * Set authentication tokens
   */
  setTokens(access, refresh) {
    this.accessToken = access;
    this.refreshToken = refresh;

    // Persist to localStorage
    if (access) {
      localStorage.setItem('access_token', access);
    }
    if (refresh) {
      localStorage.setItem('refresh_token', refresh);
    }

    // Debug: Decode and log token contents
    const accessPayload = access ? decodeJWT(access) : null;
    const refreshPayload = refresh ? decodeJWT(refresh) : null;

    console.log('✓ Tokens set in apiClient:', {
      hasAccess: !!access,
      hasRefresh: !!refresh,
      accessPayload: accessPayload,
      refreshPayload: refreshPayload
    });

    // Warn if tokens are missing critical claims
    if (accessPayload && (!accessPayload.user_id || !accessPayload.user_type)) {
      console.error('⚠️ WARNING: Access token is missing user_id or user_type!', accessPayload);
    }
  }

  /**
   * Clear authentication tokens
   */
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;

    // Clear from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    console.log('✓ Tokens cleared from apiClient');
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

    console.log('🔄 Attempting to refresh access token...');

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
        console.log('✓ Token refreshed successfully');
        return data.data.access;
      }
      
      throw new Error('Invalid refresh response');
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
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

    // Define public endpoints that don't need authentication
    const publicEndpoints = [
      '/auth/login/citizen/',
      '/auth/login/authority/',
      '/auth/logout/',
      '/auth/refresh/',
      '/citizens/',
      '/categories/',
      '/subcategories/'
    ];
    // Check if endpoint is public (but POST to /citizens/ needs auth for registration)
    const isPublicEndpoint = publicEndpoints.some(ep => endpoint.includes(ep)) &&
      !(endpoint.includes('/reports'));
    
    // Add auth token if available and not a public endpoint
    if (this.accessToken && !isPublicEndpoint) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
      console.log('🔐 Request with auth:', endpoint, '- Token present');
    } else if (!isPublicEndpoint) {
      console.warn('⚠️ Making authenticated request without token:', endpoint);
    }

    // Make the request
    try {
      console.log(`📤 ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log(`📥 Response: ${response.status} ${response.statusText}`);

      // Handle 401 - Token expired
      if (response.status === 401 && !isPublicEndpoint) {
        console.warn('⚠️ 401 Unauthorized - attempting token refresh');
        
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
          console.log('🔄 Retrying request with new token');
          const retryResponse = await fetch(url, { ...options, headers });
          return retryResponse.json();
        } catch (refreshError) {
          this.isRefreshing = false;
          this.processQueue(refreshError, null);
          
          console.error('❌ Token refresh failed - redirecting to login');
          // Redirect to login
          window.location.href = '/auth';
          throw refreshError;
        }
      }

      // Parse response
      const data = await response.json();

      // Handle other errors
      if (!response.ok) {
        console.error('❌ API Error:', data);
        const error = new Error(data.message || data.detail || `HTTP ${response.status}: ${response.statusText}`);
        error.response = { data, status: response.status };
        throw error;
      }

      return data;
    } catch (error) {
      console.error('❌ API Request failed:', error);
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