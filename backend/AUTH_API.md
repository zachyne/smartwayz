# Authentication API Documentation

## Overview

The Smartwayz API uses JWT (JSON Web Token) authentication. Users receive an access token and refresh token upon successful login.

## Authentication Flow

```
1. User Registration (POST /api/citizens/ or /api/authorities/)
   ↓
2. User Login (POST /api/auth/login/citizen/ or /api/auth/login/authority/)
   ↓
3. Receive Access Token (valid for 1 hour) & Refresh Token (valid for 7 days)
   ↓
4. Use Access Token in Authorization header for protected endpoints
   ↓
5. When Access Token expires, use Refresh Token to get new Access Token
   ↓
6. Logout (optional - blacklist refresh token)
```

## Endpoints

### 1. Login (Citizen)

**Endpoint:** `POST /api/auth/login/citizen/`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "user_type": "citizen"
    },
    "tokens": {
      "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/auth/login/citizen/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

### 2. Login (Authority)

**Endpoint:** `POST /api/auth/login/authority/`

**Request Body:**
```json
{
  "email": "traffic@city.gov",
  "password": "securepass123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "authority_name": "City Traffic Department",
      "email": "traffic@city.gov",
      "user_type": "authority"
    },
    "tokens": {
      "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/auth/login/authority/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "traffic@city.gov",
    "password": "securepass123"
  }'
```

### 3. Refresh Access Token

**Endpoint:** `POST /api/auth/refresh/`

**Request Body:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid or expired refresh token"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/auth/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "your_refresh_token_here"
  }'
```

### 4. Logout

**Endpoint:** `POST /api/auth/logout/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/auth/logout/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_access_token" \
  -d '{
    "refresh": "your_refresh_token_here"
  }'
```

## Using Authentication

### Making Authenticated Requests

Include the access token in the Authorization header:

```bash
curl http://localhost:8000/api/citizens/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Token Information

**Access Token:**
- **Lifetime:** 1 hour
- **Purpose:** Authenticate API requests
- **Storage:** Store securely (e.g., httpOnly cookie, secure storage)

**Refresh Token:**
- **Lifetime:** 7 days
- **Purpose:** Obtain new access tokens
- **Storage:** Store very securely (never in localStorage)

### JWT Token Payload

The access token contains:
```json
{
  "token_type": "access",
  "exp": 1760172989,
  "iat": 1760169389,
  "jti": "b4c4b4c61bd24111a3caedb47c37ee41",
  "user_id": 1,
  "user_type": "citizen",
  "email": "john@example.com",
  "name": "John Doe"
}
```

## Complete Authentication Example

### 1. Register a New User

```bash
curl -X POST http://localhost:8000/api/citizens/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepass123",
    "confirm_password": "securepass123"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:8000/api/auth/login/citizen/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

**Save the tokens from the response:**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Make Authenticated Request

```bash
curl http://localhost:8000/api/reports/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Refresh Token (when access token expires)

```bash
curl -X POST http://localhost:8000/api/auth/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

### 5. Logout

```bash
curl -X POST http://localhost:8000/api/auth/logout/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_access_token" \
  -d '{
    "refresh": "your_refresh_token_here"
  }'
```

## Error Handling

### Common Errors

**Missing Credentials (400 Bad Request):**
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

**Invalid Credentials (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Expired Token (401 Unauthorized):**
```json
{
  "detail": "Given token not valid for any token type",
  "code": "token_not_valid",
  "messages": [
    {
      "token_class": "AccessToken",
      "token_type": "access",
      "message": "Token is expired"
    }
  ]
}
```

**Missing Authorization Header (401 Unauthorized):**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

## Security Best Practices

### Client-Side Storage

**❌ DON'T:**
- Store tokens in localStorage (vulnerable to XSS)
- Store tokens in sessionStorage
- Expose tokens in URL parameters

**✅ DO:**
- Store access token in memory (React state, Vue store)
- Store refresh token in httpOnly cookie
- Use secure, httpOnly cookies when possible
- Clear tokens on logout

### Token Handling

**✅ Best Practices:**
1. Always use HTTPS in production
2. Implement token refresh before expiration
3. Handle 401 errors gracefully
4. Clear tokens on logout
5. Don't share tokens between users
6. Validate tokens on the server

### Example: React Token Management

```javascript
// Store tokens
const handleLogin = async (email, password) => {
  const response = await fetch('/api/auth/login/citizen/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Store access token in memory
    setAccessToken(data.data.tokens.access);
    
    // Store refresh token in httpOnly cookie (backend should set this)
    // Or store securely in a state management solution
    localStorage.setItem('refresh_token', data.data.tokens.refresh);
  }
};

// Use token in requests
const fetchData = async () => {
  const response = await fetch('/api/reports/', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (response.status === 401) {
    // Token expired, refresh it
    await refreshAccessToken();
  }
};

// Refresh token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  
  const response = await fetch('/api/auth/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken })
  });
  
  const data = await response.json();
  
  if (data.success) {
    setAccessToken(data.data.access);
  } else {
    // Refresh token expired, redirect to login
    redirectToLogin();
  }
};
```

## Configuration

### JWT Settings (in settings.py)

```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),      # Access token expires in 1 hour
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),      # Refresh token expires in 7 days
    'ROTATE_REFRESH_TOKENS': False,                   # Don't rotate refresh tokens
    'BLACKLIST_AFTER_ROTATION': True,                 # Blacklist old tokens after rotation
    'ALGORITHM': 'HS256',                             # Signing algorithm
    'AUTH_HEADER_TYPES': ('Bearer',),                 # Authorization header type
}
```

### Customizing Token Lifetime

To change token lifetimes, update `settings.py`:

```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),   # 30 minutes
    'REFRESH_TOKEN_LIFETIME': timedelta(days=14),     # 14 days
}
```

## Testing

### Test Login Flow

```bash
# 1. Register
curl -X POST http://localhost:8000/api/citizens/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "test@example.com", "password": "test1234", "confirm_password": "test1234"}'

# 2. Login
curl -X POST http://localhost:8000/api/auth/login/citizen/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test1234"}'

# 3. Save access token from response

# 4. Test authenticated endpoint
curl http://localhost:8000/api/citizens/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Troubleshooting

### Token Not Working

1. **Check token format:** Should be `Bearer <token>`
2. **Verify token hasn't expired:** Access tokens expire after 1 hour
3. **Ensure correct header:** `Authorization: Bearer <token>`
4. **Check for typos:** Token should be copied exactly

### Refresh Token Issues

1. **Token expired:** Refresh tokens expire after 7 days
2. **Token blacklisted:** After logout, refresh token is invalidated
3. **Invalid format:** Ensure you're sending the refresh token, not access token

### Login Failures

1. **Check email:** Emails are case-insensitive and stored lowercase
2. **Verify password:** Passwords are case-sensitive
3. **Account exists:** User must be registered first

## Summary

✅ **JWT authentication is fully implemented**

- Separate login endpoints for citizens and authorities
- Access tokens valid for 1 hour
- Refresh tokens valid for 7 days
- Token refresh endpoint available
- Logout with token blacklisting
- Secure password verification
- User information included in token payload

**Next Steps:**
1. Implement token storage strategy in frontend
2. Add token refresh logic
3. Handle authentication errors gracefully
4. Implement protected routes
5. Add role-based access control (optional)

---

**Last Updated:** 2025-10-11  
**Status:** ✅ Complete and Functional  
**Version:** 1.0.0
