# 🧪 Frontend-Backend Integration Testing Guide

## ✅ Current Status

**Backend:** ✅ Running on `http://localhost:8000`
**Frontend:** ✅ Running on `http://localhost:5173`
**CORS:** ✅ Configured (allows localhost:5173)
**Database:** ✅ Populated with categories and subcategories

---

## 🚀 Quick Start

### Backend is already running via Docker:
```bash
# Check backend status
docker ps

# View backend logs
docker logs smartwayz-backend -f

# Backend API is available at:
http://localhost:8000/api/
```

### Frontend is already running:
```bash
# If you need to restart:
cd frontend
npm run dev

# Frontend is available at:
http://localhost:5173
```

---

## 🧪 Testing the Report Form

### Step 1: Access the Application
1. Open your browser to: **http://localhost:5173**
2. Navigate to the "New Report" page (or wherever the ReportForm is rendered)

### Step 2: Test Issue Details (Step 1)
**What to test:**
- ✅ Categories load from API automatically
- ✅ Select "Infrastructure" or "Hazard" report type
- ✅ Subcategories load dynamically based on selection
- ✅ Form validation works (required fields)
- ✅ "Other" category shows text input

**Expected behavior:**
- Report Type dropdown shows: "Infrastructure Issue" and "Hazard Report"
- After selecting type, subcategories populate automatically
- Can't proceed to next step without filling required fields

### Step 3: Test Location Capture (Step 2)
**What to test:**
- ✅ Click "CAPTURE CURRENT LOCATION" button
- ✅ Browser asks for location permission
- ✅ Latitude/longitude captured and displayed
- ✅ Manual location entry works as alternative

**Expected behavior:**
- Button shows loading spinner while capturing
- Success message displays coordinates
- Can't proceed without capturing location

### Step 4: Test Evidence Upload (Step 3)
**What to test:**
- ✅ Upload images (drag & drop or click)
- ✅ Preview uploaded images
- ✅ Remove images
- ✅ Maximum 5 images enforced
- ✅ Contact info field (optional)

**Expected behavior:**
- Image previews show immediately
- Can remove individual images
- Warning shown if trying to upload more than 5

### Step 5: Test Report Submission
**What to test:**
- ✅ Click "SUBMIT REPORT" button
- ✅ Loading state shows "SUBMITTING..."
- ✅ Success alert appears
- ✅ Form resets after submission

**Expected behavior:**
- Button disabled during submission
- Success message: "Report submitted successfully!"
- Form returns to step 1

---

## 🔍 API Endpoints to Test

### 1. Get All Categories
```bash
curl http://localhost:8000/api/categories/
```
**Expected Response:**
```json
{
  "count": 2,
  "results": [
    {"id": 1, "report_type": "Hazard", "subcategories_count": 11},
    {"id": 2, "report_type": "Infrastructure", "subcategories_count": 8}
  ]
}
```

### 2. Get Subcategories by Category
```bash
# Hazard subcategories (category_id=1)
curl "http://localhost:8000/api/subcategories/?category=1"

# Infrastructure subcategories (category_id=2)
curl "http://localhost:8000/api/subcategories/?category=2"
```

### 3. Create a Report (Manual Test)
```bash
curl -X POST http://localhost:8000/api/reports/ \
  -H "Content-Type: application/json" \
  -d '{
    "citizen": 1,
    "title": "Test pothole on main street",
    "report_type": 2,
    "sub_category": 12,
    "description": "Large pothole causing traffic issues",
    "latitude": 14.5995,
    "longitude": 120.9842
  }'
```

### 4. Get All Reports
```bash
curl http://localhost:8000/api/reports/
```

---

## 🐛 Troubleshooting

### Issue: Categories not loading
**Check:**
1. Backend is running: `curl http://localhost:8000/api/categories/`
2. CORS is configured in backend settings
3. Browser console for errors (F12)
4. Frontend .env file exists with correct API URL

**Solution:**
```bash
# Verify frontend .env
cat frontend/.env
# Should show: VITE_API_URL=http://localhost:8000/api

# Check backend CORS settings
docker exec smartwayz-backend grep -A 5 "CORS_ALLOWED_ORIGINS" smartwayz_backend/settings.py
```

### Issue: Location permission denied
**Solution:**
- Browser settings → Site permissions → Allow location for localhost:5173
- Or use manual location entry as fallback

### Issue: Report submission fails
**Check:**
1. All required fields filled (title, report_type, sub_category, lat/long)
2. Citizen ID exists in database
3. Backend logs: `docker logs smartwayz-backend -f`

**Common errors:**
- `citizen: This field is required` → Need to create a citizen first
- `sub_category: Sub category is required for Hazard reports` → Select subcategory
- `latitude/longitude: Invalid range` → Check coordinate values

---

## 📊 Test Data

### Create a Test Citizen (if needed)
```bash
docker exec -it smartwayz-backend python manage.py shell
```
```python
from api.models import Citizen
citizen = Citizen.objects.create(
    name="Test User",
    email="test@example.com",
    phone_number="09123456789",
    address="Test Address"
)
print(f"Created citizen with ID: {citizen.id}")
# Save this ID for testing
exit()
```

### Update Frontend Default Citizen ID
Edit `frontend/src/pages/ReportForm/ReportForm.jsx` line 104:
```javascript
const citizenId = localStorage.getItem('citizen_id') || 1; // Change 1 to your citizen ID
```

Or set in browser console:
```javascript
localStorage.setItem('citizen_id', '1'); // Use your citizen ID
```

---

## ✅ Success Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] Categories load in dropdown
- [ ] Subcategories load when report type selected
- [ ] Location capture works
- [ ] Image upload works
- [ ] Form validation prevents invalid submissions
- [ ] Report submits successfully
- [ ] Success message appears
- [ ] Form resets after submission

---

## 📝 Notes

1. **Images:** Currently collected but not uploaded (backend may need file upload endpoint)
2. **Authentication:** Using default citizen ID (1) - implement proper auth later
3. **Navigation:** Success redirects to alert - uncomment navigate('/my-reports') when route exists
4. **Database:** PostgreSQL running in Docker at 192.168.100.181:5432

---

## 🔗 Useful Commands

```bash
# View all reports in database
docker exec smartwayz-backend python manage.py shell -c "from api.models import Report; print(f'Total reports: {Report.objects.count()}')"

# View backend API documentation
open http://localhost:8000/api/

# Restart backend
docker restart smartwayz-backend

# Restart frontend
cd frontend && npm run dev

# Clear browser cache and localStorage
# In browser console: localStorage.clear()
```

---

## 🎯 Next Steps

1. Test the complete flow end-to-end
2. Check browser console for any errors
3. Verify data is saved in database
4. Test with different report types and categories
5. Test error handling (invalid data, network errors)

Happy Testing! 🚀
