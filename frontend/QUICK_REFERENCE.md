# Quick Reference - Smartwayz Auth & API

## 🔐 Authentication

### Login
```javascript
import { useAuth } from '../pages/AuthPages';

const { login } = useAuth();
await login(email, password, 'citizen'); // or 'authority'
// Automatically redirects to /new-report
```

### Logout
```javascript
const { logout } = useAuth();
await logout(); // Always succeeds, even if backend is down
```

### Check Auth Status
```javascript
const { isAuthenticated, user } = useAuth();

if (isAuthenticated) {
  console.log('Logged in as:', user.name);
}
```

## 🌐 Making API Calls

### Using useApi Hook (Recommended)
```javascript
import { useApi } from '../hooks/useApi';

const api = useApi();

// GET
const reports = await api.get('/reports/');

// POST
const newReport = await api.post('/reports/', {
  title: 'Pothole',
  description: 'Large pothole on Main St'
});

// PUT
const updated = await api.put('/reports/123/', data);

// PATCH
const patched = await api.patch('/reports/123/', { status: 'resolved' });

// DELETE
await api.delete('/reports/123/');
```

### Complete Example
```javascript
import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

function MyComponent() {
  const api = useApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.get('/reports/');
        setData(result.results || result);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  
  return <div>{/* Render data */}</div>;
}
```

## 🔒 Endpoint Security

### Public (No Auth Required)
```javascript
POST /api/auth/login/citizen/
POST /api/auth/login/authority/
POST /api/citizens/  // Registration
```

### Protected (Auth Required)
```javascript
GET  /api/reports/
POST /api/reports/
GET  /api/citizens/
// All other endpoints
```

## 🎯 Common Patterns

### Fetch and Display
```javascript
const api = useApi();
const [items, setItems] = useState([]);

useEffect(() => {
  api.get('/reports/')
    .then(data => setItems(data.results || data))
    .catch(err => console.error(err));
}, []);
```

### Create Item
```javascript
const api = useApi();

const handleCreate = async (formData) => {
  try {
    await api.post('/reports/', formData);
    alert('Success!');
  } catch (error) {
    alert('Failed!');
  }
};
```

### Update Item
```javascript
const api = useApi();

const handleUpdate = async (id, updates) => {
  try {
    await api.patch(`/reports/${id}/`, updates);
    alert('Updated!');
  } catch (error) {
    alert('Failed!');
  }
};
```

### Delete Item
```javascript
const api = useApi();

const handleDelete = async (id) => {
  if (!confirm('Are you sure?')) return;
  
  try {
    await api.delete(`/reports/${id}/`);
    alert('Deleted!');
  } catch (error) {
    alert('Failed!');
  }
};
```

## 🛡️ Error Handling

### Automatic Token Refresh
```javascript
// Token expired? No problem!
// The system automatically:
// 1. Catches 401 error
// 2. Refreshes token
// 3. Retries request
// 4. Returns data

const data = await api.get('/reports/');
// Just works! ✨
```

### Manual Error Handling
```javascript
try {
  await api.post('/reports/', data);
} catch (error) {
  if (error.message.includes('401')) {
    // Token refresh failed - user redirected to login
  } else if (error.message.includes('403')) {
    alert('No permission');
  } else {
    alert('Network error');
  }
}
```

## 📱 Component Examples

### Protected Page
```javascript
import { useAuth } from '../pages/AuthPages';

function ProtectedPage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user.name}!</div>;
}
```

### Logout Button
```javascript
import { useAuth } from '../pages/AuthPages';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return <button onClick={handleLogout}>Sign Out</button>;
}
```

### User Profile
```javascript
import { useAuth } from '../pages/AuthPages';

function UserProfile() {
  const { user } = useAuth();

  return (
    <div>
      <h1>{user.name || user.authority_name}</h1>
      <p>Type: {user.user_type}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

## 🚀 Quick Start Checklist

1. ✅ Backend running on `http://localhost:8000`
2. ✅ Frontend running on `http://localhost:5173`
3. ✅ Environment variable set: `VITE_API_URL=http://localhost:8000/api`
4. ✅ User registered via signup form
5. ✅ User logged in successfully
6. ✅ Access token stored in memory
7. ✅ Refresh token stored in localStorage
8. ✅ Protected routes accessible
9. ✅ API calls working with auth

## 🐛 Troubleshooting

### "Not authenticated" error
```javascript
const { isAuthenticated } = useAuth();
console.log('Auth status:', isAuthenticated);
// If false, user needs to log in
```

### Requests failing with 401
```javascript
// Check tokens
const { accessToken } = useAuth();
console.log('Access token:', accessToken);

const refreshToken = localStorage.getItem('refresh_token');
console.log('Refresh token:', refreshToken);

// If both null, user needs to log in
```

### Logout returns 401 (This is OK!)
```javascript
// The logout function handles this gracefully
// Tokens are cleared locally even if backend fails
await logout(); // Always succeeds ✅
```

## 📚 Full Documentation

- **`AUTH_INTEGRATION.md`** - Complete auth system overview
- **`SECURE_API_GUIDE.md`** - Detailed API usage guide
- **`LOGOUT_FIX_SUMMARY.md`** - Logout error fix explanation
- **`QUICK_REFERENCE.md`** - This document

## 💡 Best Practices

### ✅ DO
- Use `useApi()` hook for all authenticated requests
- Handle errors with try-catch
- Show loading states
- Validate user input
- Check `isAuthenticated` before rendering protected content

### ❌ DON'T
- Don't manually add Authorization headers (automatic)
- Don't store tokens in plain text
- Don't retry failed requests manually (automatic)
- Don't expose tokens in URLs or logs
- Don't assume requests will succeed (always handle errors)

## 🎉 You're Ready!

Everything is set up and working. Just:

1. Import `useApi()` hook
2. Make your API calls
3. Handle success/error
4. That's it!

The system handles:
- ✅ Token management
- ✅ Token refresh
- ✅ Error handling
- ✅ Logout
- ✅ Redirects

Focus on building features! 🚀

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-26
