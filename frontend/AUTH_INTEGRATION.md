# Frontend Authentication Integration

## Overview

The authentication system has been fully integrated into the Smartwayz frontend application. It uses JWT tokens and connects to the backend API endpoints documented in `/backend/AUTH_API.md`.

## Architecture

### 1. **main.jsx** - Root Level Setup
```javascript
<StrictMode>
  <AuthProvider>
    <App />
  </AuthProvider>
</StrictMode>
```
- `AuthProvider` wraps the entire app to provide authentication context globally
- `BrowserRouter` is inside `App.jsx` to work with the routing structure

### 2. **AuthPages.jsx** - Authentication Logic

#### Components:
- **AuthContext**: React context for managing authentication state
- **AuthProvider**: Provides authentication methods and state to the app
- **authAPI**: Service functions for API calls
- **Toast**: Notification component for success/error messages
- **AuthPages**: Login and signup UI component

#### Key Features:
- **Login for Citizens and Authorities**: Separate endpoints based on user type
- **Registration**: New citizen registration
- **Token Management**: Stores access and refresh tokens
- **Auto Token Refresh**: Refreshes access token when expired
- **Logout**: Clears tokens and user data

#### API Integration:
```javascript
const authAPI = {
  loginCitizen: async (email, password) => {
    // POST /api/auth/login/citizen/
  },
  loginAuthority: async (email, password) => {
    // POST /api/auth/login/authority/
  },
  registerCitizen: async (userData) => {
    // POST /api/citizens/
  },
  refreshToken: async (refreshToken) => {
    // POST /api/auth/refresh/
  },
  logout: async (accessToken, refreshToken) => {
    // POST /api/auth/logout/
  }
}
```

#### Auth Context Methods:
```javascript
const { 
  user,           // Current user object
  accessToken,    // JWT access token
  loading,        // Loading state
  login,          // Login function
  register,       // Register function
  logout,         // Logout function
  isAuthenticated // Boolean auth status
} = useAuth();
```

### 3. **App.jsx** - Route Protection

#### Protected Routes:
- **ProtectedRoute**: Wraps authenticated pages, redirects to `/auth` if not logged in
- **AuthRoute**: Wraps login page, redirects to `/new-report` if already logged in

#### Route Structure:
```
/auth              → Login/Signup page (public, redirects if authenticated)
/                  → Redirects to /new-report
/new-report        → Protected (requires authentication)
/map-view          → Protected
/my-reports        → Protected
/traffic-map       → Protected
/scenarios         → Protected
/controls          → Protected
/analysis          → Protected
```

### 4. **Sidebar.jsx** - User Display & Logout

#### Features:
- Displays current user's name and type
- Shows user avatar with first letter
- Logout button with loading state
- Redirects to `/auth` after logout

## Authentication Flow

### Login Flow:
1. User enters email and password
2. Selects user type (Citizen or Authority)
3. Frontend calls appropriate login endpoint
4. Backend validates credentials and returns JWT tokens
5. Frontend stores tokens in memory and localStorage
6. User is automatically redirected to `/new-report`
7. Protected routes now accessible

### Registration Flow:
1. User enters name, email, password, and confirmation
2. Frontend validates form data
3. Calls `/api/citizens/` endpoint
4. Backend creates new user account
5. Success message shown
6. User switches to login form
7. User can now log in with credentials

### Token Management:
- **Access Token**: Stored in memory (React state), expires in 1 hour
- **Refresh Token**: Stored in localStorage, expires in 7 days
- **Auto Refresh**: When access token expires, automatically refreshes using refresh token
- **Logout**: Clears both tokens and redirects to login

### Logout Flow:
1. User clicks "Sign Out" button
2. Frontend calls logout endpoint with tokens
3. Backend blacklists the refresh token
4. Frontend clears all stored tokens
5. User redirected to `/auth`

## Security Features

### Token Storage:
- ✅ Access token in memory (React state)
- ✅ Refresh token in localStorage (temporary solution)
- ✅ Tokens cleared on logout
- ✅ Auto-redirect on authentication state change

### Route Protection:
- ✅ All main routes require authentication
- ✅ Login page redirects if already authenticated
- ✅ Unauthorized users redirected to login
- ✅ Loading states prevent flickering

### API Security:
- ✅ JWT tokens in Authorization header
- ✅ Token validation on backend
- ✅ Secure password hashing
- ✅ Token expiration handling

## Usage Examples

### Using Auth in Components:
```javascript
import { useAuth } from '../pages/AuthPages';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Calls:
```javascript
const { accessToken } = useAuth();

const fetchReports = async () => {
  const response = await fetch('http://localhost:8000/api/reports/', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};
```

## Testing

### Test Credentials:
Create test users using the registration form or backend seeding.

### Login Test:
1. Navigate to `http://localhost:5173/auth`
2. Enter email and password
3. Select user type (Citizen/Authority)
4. Click "Login to Account"
5. Should redirect to `/new-report`

### Protected Route Test:
1. Without logging in, try to access `http://localhost:5173/new-report`
2. Should redirect to `/auth`
3. After login, should be able to access all protected routes

### Logout Test:
1. Log in successfully
2. Click "Sign Out" in sidebar
3. Should redirect to `/auth`
4. Try accessing protected routes - should redirect to login

## API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login/citizen/` | POST | Citizen login |
| `/api/auth/login/authority/` | POST | Authority login |
| `/api/citizens/` | POST | Register new citizen |
| `/api/auth/refresh/` | POST | Refresh access token |
| `/api/auth/logout/` | POST | Logout and blacklist token |

## Environment Configuration

Ensure your `.env` file has:
```env
VITE_API_URL=http://localhost:8000/api
```

## Next Steps

### Recommended Improvements:
1. **Secure Token Storage**: Move refresh token to httpOnly cookies
2. **Token Refresh Interceptor**: Add axios interceptor for automatic token refresh
3. **Remember Me**: Add option to persist login
4. **Password Reset**: Implement forgot password flow
5. **Email Verification**: Add email verification on registration
6. **Role-Based Access**: Different routes for citizens vs authorities
7. **Session Timeout**: Add idle timeout warning

### Future Features:
- Two-factor authentication
- Social login (Google, Facebook)
- Account settings page
- Profile picture upload
- Activity log

## Troubleshooting

### "useAuth must be used within AuthProvider"
- Ensure `AuthProvider` wraps your app in `main.jsx`
- Check that you're not using `useAuth` outside the provider

### "Cannot render Router inside another Router"
- Only one `BrowserRouter` should exist (in `App.jsx`)
- Don't add another `BrowserRouter` in `main.jsx`

### Login not redirecting
- Check that `isAuthenticated` is updating correctly
- Verify tokens are being stored
- Check browser console for errors

### 401 Unauthorized on API calls
- Verify access token is being sent in Authorization header
- Check if token has expired
- Ensure backend is running and accessible

## Status

✅ **Complete and Functional**

- Login for citizens and authorities
- Registration for citizens
- Protected routes
- Automatic redirects
- Token management
- Logout functionality
- User display in sidebar
- Error handling
- Loading states
- Form validation

---

**Last Updated**: 2025-10-26  
**Version**: 1.0.0
