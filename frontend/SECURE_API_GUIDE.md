# Secure API Usage Guide

## Overview

This guide explains how to make secure, authenticated API calls in the Smartwayz frontend application. The system automatically handles token refresh, authentication, and error handling.

## Key Features

✅ **Automatic Token Refresh** - Tokens are refreshed automatically when they expire
✅ **Secure Logout** - Always clears local tokens even if backend fails
✅ **Request Queuing** - Multiple requests wait for token refresh
✅ **Public Endpoints** - Login/register don't require authentication
✅ **Error Handling** - Graceful handling of network and auth errors

## Authentication Flow

### 1. Login (Public Endpoint)
```javascript
// Users can access login without being authenticated
POST /api/auth/login/citizen/
POST /api/auth/login/authority/
```

### 2. Register (Public Endpoint)
```javascript
// Users can register without being authenticated
POST /api/citizens/
```

### 3. Protected Endpoints
```javascript
// All other endpoints require authentication
GET /api/reports/
POST /api/reports/
GET /api/citizens/
// etc.
```

## Using the API

### Method 1: Using the `useApi` Hook (Recommended)

This is the easiest and most secure way to make API calls:

```javascript
import { useApi } from '../hooks/useApi';

function MyComponent() {
  const api = useApi();

  const fetchReports = async () => {
    try {
      const data = await api.get('/reports/');
      console.log('Reports:', data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  };

  const createReport = async (reportData) => {
    try {
      const data = await api.post('/reports/', reportData);
      console.log('Created report:', data);
    } catch (error) {
      console.error('Failed to create report:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchReports}>Load Reports</button>
      <button onClick={() => createReport({ title: 'Test' })}>
        Create Report
      </button>
    </div>
  );
}
```

### Method 2: Using `apiClient` Directly

For more control, you can use the API client directly:

```javascript
import { apiClient } from '../services/apiClient';

// GET request
const reports = await apiClient.get('/reports/');

// POST request
const newReport = await apiClient.post('/reports/', {
  title: 'Pothole on Main St',
  description: 'Large pothole',
  location: { lat: 14.5995, lng: 120.9842 }
});

// PUT request
const updated = await apiClient.put('/reports/123/', {
  status: 'in_progress'
});

// PATCH request
const patched = await apiClient.patch('/reports/123/', {
  status: 'resolved'
});

// DELETE request
await apiClient.delete('/reports/123/');
```

## Logout Behavior

The logout function is designed to **always succeed** on the frontend, even if the backend is unreachable:

```javascript
const { logout } = useAuth();

// This will ALWAYS clear local tokens
await logout();

// User will be logged out locally even if:
// - Backend is down
// - Network is offline
// - Token has expired
// - Backend returns an error
```

### Why This Matters

1. **User Experience**: Users can always log out, even with network issues
2. **Security**: Tokens are cleared from browser immediately
3. **No Errors**: No 401 errors shown to users during logout
4. **Backend Notification**: Backend is notified when possible (best effort)

## Error Handling

### 401 Unauthorized (Token Expired)

The system automatically handles this:

```javascript
// Your code
const data = await api.get('/reports/');

// What happens behind the scenes:
// 1. Request fails with 401
// 2. System automatically refreshes token
// 3. Request is retried with new token
// 4. You get the data (or final error)
```

### 403 Forbidden (No Permission)

```javascript
try {
  await api.delete('/reports/123/');
} catch (error) {
  if (error.message.includes('403')) {
    console.log('You do not have permission');
  }
}
```

### Network Errors

```javascript
try {
  await api.get('/reports/');
} catch (error) {
  console.error('Network error:', error);
  // Show user-friendly message
}
```

## Public vs Protected Endpoints

### Public Endpoints (No Auth Required)

These endpoints can be accessed without authentication:

```javascript
// Login
POST /api/auth/login/citizen/
POST /api/auth/login/authority/

// Register
POST /api/citizens/

// These will NOT include Authorization header
```

### Protected Endpoints (Auth Required)

All other endpoints require authentication:

```javascript
// Reports
GET /api/reports/
POST /api/reports/
PUT /api/reports/:id/
DELETE /api/reports/:id/

// Citizens
GET /api/citizens/
GET /api/citizens/:id/
PUT /api/citizens/:id/

// Authorities
GET /api/authorities/
GET /api/authorities/:id/

// These will automatically include:
// Authorization: Bearer <access_token>
```

## Token Management

### Token Storage

```javascript
// Access Token
// - Stored in: React state + apiClient memory
// - Lifetime: 1 hour
// - Used for: All authenticated requests

// Refresh Token
// - Stored in: localStorage
// - Lifetime: 7 days
// - Used for: Getting new access tokens
```

### Automatic Token Refresh

```javascript
// You don't need to do anything!
// The system handles this automatically:

const data = await api.get('/reports/');
// If token expired:
// 1. Catches 401 error
// 2. Refreshes token automatically
// 3. Retries request
// 4. Returns data
```

### Manual Token Refresh

If you need to manually refresh (rare):

```javascript
import { apiClient } from '../services/apiClient';

try {
  const newToken = await apiClient.refreshAccessToken();
  console.log('Token refreshed:', newToken);
} catch (error) {
  console.error('Refresh failed:', error);
  // User will be redirected to login
}
```

## Complete Examples

### Example 1: Fetch and Display Reports

```javascript
import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

function ReportsList() {
  const api = useApi();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const data = await api.get('/reports/');
        setReports(data.results || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {reports.map(report => (
        <div key={report.id}>{report.title}</div>
      ))}
    </div>
  );
}
```

### Example 2: Create a New Report

```javascript
import { useState } from 'react';
import { useApi } from '../hooks/useApi';

function CreateReport() {
  const api = useApi();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'pothole'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const newReport = await api.post('/reports/', formData);
      console.log('Report created:', newReport);
      alert('Report submitted successfully!');
    } catch (error) {
      console.error('Failed to create report:', error);
      alert('Failed to submit report');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Title"
      />
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Description"
      />
      <button type="submit">Submit Report</button>
    </form>
  );
}
```

### Example 3: Update Report Status

```javascript
import { useApi } from '../hooks/useApi';

function ReportActions({ reportId }) {
  const api = useApi();

  const updateStatus = async (newStatus) => {
    try {
      await api.patch(`/reports/${reportId}/`, {
        status: newStatus
      });
      alert('Status updated!');
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div>
      <button onClick={() => updateStatus('in_progress')}>
        Mark In Progress
      </button>
      <button onClick={() => updateStatus('resolved')}>
        Mark Resolved
      </button>
    </div>
  );
}
```

### Example 4: Delete Report

```javascript
import { useApi } from '../hooks/useApi';

function DeleteButton({ reportId, onDeleted }) {
  const api = useApi();

  const handleDelete = async () => {
    if (!confirm('Are you sure?')) return;

    try {
      await api.delete(`/reports/${reportId}/`);
      onDeleted(reportId);
      alert('Report deleted!');
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete report');
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

## Best Practices

### ✅ DO

1. **Use the `useApi` hook** for all authenticated requests
2. **Handle errors gracefully** with try-catch blocks
3. **Show loading states** to users
4. **Clear sensitive data** on logout
5. **Validate user input** before sending to API

### ❌ DON'T

1. **Don't store tokens in plain text** (system handles this)
2. **Don't manually add Authorization headers** (automatic)
3. **Don't retry failed requests manually** (automatic)
4. **Don't expose tokens in URLs** or logs
5. **Don't assume requests will succeed** (always handle errors)

## Troubleshooting

### "Not authenticated" Error

```javascript
// Make sure you're logged in
const { isAuthenticated } = useAuth();

if (!isAuthenticated) {
  // Redirect to login or show message
  return <div>Please log in</div>;
}
```

### Requests Failing with 401

```javascript
// Check if token is valid
const { accessToken } = useAuth();
console.log('Access token:', accessToken);

// If null, user needs to log in again
```

### Logout Returns 401

This is **normal and expected**! The logout function handles this gracefully:

```javascript
// This is OK - tokens are cleared locally
await logout();
// User is logged out even if backend returns 401
```

### Token Not Refreshing

```javascript
// Check refresh token exists
const refreshToken = localStorage.getItem('refresh_token');
console.log('Refresh token:', refreshToken);

// If null, user needs to log in again
```

## Security Checklist

- ✅ Tokens stored securely (memory + localStorage)
- ✅ Automatic token refresh on expiration
- ✅ Tokens cleared on logout
- ✅ Public endpoints don't require auth
- ✅ Protected endpoints require valid token
- ✅ Failed logout still clears local tokens
- ✅ Expired tokens trigger re-authentication
- ✅ No tokens in URL parameters
- ✅ No tokens in console logs (production)

## Summary

The Smartwayz API client provides:

1. **Automatic Authentication** - Tokens added to requests automatically
2. **Token Refresh** - Expired tokens refreshed transparently
3. **Error Handling** - Network and auth errors handled gracefully
4. **Secure Logout** - Always succeeds, even with backend errors
5. **Easy to Use** - Simple hook-based API

Just use `useApi()` and make requests - everything else is handled for you!

---

**Last Updated**: 2025-10-26  
**Version**: 1.0.0
