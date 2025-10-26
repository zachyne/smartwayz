# Authentication & API Test Guide

## ✅ Backend Status: FIXED

All backend issues have been resolved:
- ✅ Categories endpoint is public (no auth required)
- ✅ Report status field fixed
- ✅ Pagination warnings fixed
- ✅ Backend restarted and running

## 🧪 Test Your Setup

### 1. Test Backend Directly

Open a terminal and run:

```bash
# Test categories (should work without auth)
curl http://localhost:8000/api/categories/

# Expected: {"count":2,"next":null,"previous":null,"results":[...]}
```

### 2. Test Frontend

Open your browser to: `http://localhost:5173`

#### Test Scenario 1: Login
1. Go to `/auth`
2. Enter credentials
3. Select user type (Citizen/Authority)
4. Click "Login to Account"
5. **Expected**: Redirect to `/new-report`

#### Test Scenario 2: Categories Loading
1. After login, go to `/new-report`
2. Open browser DevTools (F12) → Console
3. Check for any errors
4. **Expected**: Categories should load without 401 errors

#### Test Scenario 3: Logout
1. Click "Sign Out" in sidebar
2. **Expected**: Redirect to `/auth` without errors

### 3. Check Browser Console

Open DevTools (F12) and check for:
- ❌ Red errors
- ⚠️ Yellow warnings
- Network tab for failed requests

## 🔍 Common Issues & Solutions

### Issue: "VITE_API_URL is not defined"
**Solution**: Make sure `.env` file exists in `/frontend/` with:
```
VITE_API_URL=http://localhost:8000/api
```

Then restart frontend:
```bash
npm run dev
```

### Issue: Categories still return 401
**Solution**: Backend needs restart (already done if you see "Up 22 seconds")

### Issue: Login fails
**Check**:
1. Backend is running: `docker ps | grep smartwayz-backend`
2. User exists in database
3. Correct credentials

### Issue: Logout shows 401 error
**This is OK!** The frontend handles this gracefully. Tokens are cleared locally.

## 📝 Quick Verification Checklist

Run these commands to verify everything:

```bash
# 1. Check backend is running
docker ps | grep smartwayz-backend
# Expected: Should show "Up X seconds/minutes"

# 2. Test categories endpoint
curl http://localhost:8000/api/categories/
# Expected: JSON response with categories

# 3. Check frontend is running
curl http://localhost:5173
# Expected: HTML response

# 4. Check environment variable
cd /home/oxkenn/Documents/projects/smartwayz/frontend
cat .env
# Expected: VITE_API_URL=http://localhost:8000/api
```

## 🚀 If Everything Works

You should be able to:
1. ✅ Visit `http://localhost:5173`
2. ✅ See login page
3. ✅ Login successfully
4. ✅ Get redirected to `/new-report`
5. ✅ See categories loaded
6. ✅ Logout without errors

## 🐛 If Still Having Issues

Please provide:
1. **Browser console errors** (F12 → Console tab)
2. **Network tab errors** (F12 → Network tab, filter by "Fetch/XHR")
3. **Specific error message** you're seeing
4. **When it happens** (login, logout, loading page, etc.)

Then I can provide a targeted fix!

---

**Status**: ✅ Backend Fixed & Running  
**Next**: Test frontend and report any specific errors
