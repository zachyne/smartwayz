# Smartwayz API Testing Guide

Complete guide for testing the Smartwayz Backend API using Postman or cURL.

## Base URL

```
http://localhost:8000/api/
```

## API Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/` | GET | List all available endpoints |
| **Authentication** |
| `/api/citizens/` | POST | **Signup** - Register new citizen |
| `/api/authorities/` | POST | **Signup** - Register new authority |
| `/api/auth/login/citizen/` | POST | **Login** - Citizen login |
| `/api/auth/login/authority/` | POST | **Login** - Authority login |
| `/api/auth/logout/` | POST | **Logout** - Invalidate refresh token |
| `/api/auth/refresh/` | POST | **Refresh Token** - Get new access token |
| **Citizens** |
| `/api/citizens/` | GET | List all citizens |
| `/api/citizens/{id}/` | GET, PUT, PATCH, DELETE | Retrieve/Update/Delete citizen |
| **Authorities** |
| `/api/authorities/` | GET | List all authorities |
| `/api/authorities/{id}/` | GET, PUT, PATCH, DELETE | Retrieve/Update/Delete authority |
| **Categories** |
| `/api/categories/` | GET | List all categories |
| `/api/categories/{id}/` | GET | Retrieve specific category |
| `/api/categories/{id}/subcategories/` | GET | Get subcategories for a category |
| `/api/subcategories/` | GET | List all subcategories |
| `/api/subcategories/{id}/` | GET | Retrieve specific subcategory |
| `/api/subcategories/by_category/?category={id}` | GET | Filter subcategories by category |
| **Reports** |
| `/api/reports/` | GET, POST | List/Create reports |
| `/api/reports/{id}/` | GET | Retrieve specific report |
| `/api/reports/stats/` | GET | Get report statistics |

---

## 0. Authentication & Authorization

### 0.1 Signup (Register Citizen)

**Endpoint:** `POST /api/citizens/`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "confirm_password": "securepass123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Citizen registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**cURL Example:**
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

### 0.2 Login (Citizen)

**Endpoint:** `POST /api/auth/login/citizen/`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response (200 OK):**
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

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/auth/login/citizen/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

### 0.3 Login (Authority)

**Endpoint:** `POST /api/auth/login/authority/`

**Request Body:**
```json
{
  "email": "traffic@city.gov",
  "password": "securepass123"
}
```

**Response (200 OK):**
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

### 0.4 Refresh Access Token

**Endpoint:** `POST /api/auth/refresh/`

**Request Body:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
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

### 0.5 Logout

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

**Response (200 OK):**
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

### 0.6 Using Authentication in Requests

After logging in, include the access token in the Authorization header for protected endpoints:

```bash
curl http://localhost:8000/api/reports/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Token Information:**
- **Access Token:** Valid for 1 hour
- **Refresh Token:** Valid for 7 days
- Use refresh token to get a new access token when it expires

---

## 1. Citizen Endpoints

### 1.1 Create Citizen (Signup)

**Endpoint:** `POST /api/citizens/`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securepassword123",
  "confirm_password": "securepassword123"
}
```

**Notes:** 
- Password is automatically hashed using Django's PBKDF2 algorithm before storage
- `confirm_password` must match `password` or validation will fail

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Citizen registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/citizens/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securepassword123",
    "confirm_password": "securepassword123"
  }'
```

### 1.2 List All Citizens

**Endpoint:** `GET /api/citizens/`

**Query Parameters:**
- `email` (optional): Filter by email (case-insensitive contains)

**Response (200 OK):**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane.smith@example.com"
    }
  ]
}
```

**cURL Example:**
```bash
curl http://localhost:8000/api/citizens/
```

### 1.3 Get Specific Citizen

**Endpoint:** `GET /api/citizens/{id}/`

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

**cURL Example:**
```bash
curl http://localhost:8000/api/citizens/1/
```

### 1.4 Update Citizen

**Endpoint:** `PUT /api/citizens/{id}/` or `PATCH /api/citizens/{id}/`

**Request Body (PUT - all fields required):**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "password": "newpassword123"
}
```

**Request Body (PATCH - partial update):**
```json
{
  "name": "John Updated"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Citizen updated successfully",
  "data": {
    "id": 1,
    "name": "John Updated",
    "email": "john.updated@example.com"
  }
}
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:8000/api/citizens/1/ \
  -H "Content-Type: application/json" \
  -d '{"name": "John Updated"}'
```

### 1.5 Delete Citizen

**Endpoint:** `DELETE /api/citizens/{id}/`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Citizen deleted successfully"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:8000/api/citizens/1/
```

### 1.6 Get Citizens Count

**Endpoint:** `GET /api/citizens/count/`

**Response (200 OK):**
```json
{
  "count": 5
}
```

---

## 2. Authority Endpoints

### 2.1 Create Authority

**Endpoint:** `POST /api/authorities/`

**Request Body:**
```json
{
  "authority_name": "City Traffic Department",
  "email": "traffic@city.gov",
  "password": "securepassword123",
  "confirm_password": "securepassword123"
}
```

**Notes:**
- Password is automatically hashed using Django's PBKDF2 algorithm before storage
- `confirm_password` must match `password` or validation will fail

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Authority registered successfully",
  "data": {
    "id": 1,
    "authority_name": "City Traffic Department",
    "email": "traffic@city.gov"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/authorities/ \
  -H "Content-Type: application/json" \
  -d '{
    "authority_name": "City Traffic Department",
    "email": "traffic@city.gov",
    "password": "securepassword123",
    "confirm_password": "securepassword123"
  }'
```

### 2.2 List All Authorities

**Endpoint:** `GET /api/authorities/`

**Query Parameters:**
- `search` (optional): Search by authority name or email

**Response (200 OK):**
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "authority_name": "City Traffic Department",
      "email": "traffic@city.gov"
    }
  ]
}
```

**cURL Example:**
```bash
curl http://localhost:8000/api/authorities/
```

### 2.3 Get Authorities Count

**Endpoint:** `GET /api/authorities/count/`

**Response (200 OK):**
```json
{
  "count": 3
}
```

---

## 3. Category Endpoints

### 3.1 List All Categories

**Endpoint:** `GET /api/categories/`

**Response (200 OK):**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "report_type": "Hazard",
      "subcategories_count": 11
    },
    {
      "id": 2,
      "report_type": "Infrastructure",
      "subcategories_count": 8
    }
  ]
}
```

**cURL Example:**
```bash
curl http://localhost:8000/api/categories/
```

### 3.2 Get Specific Category

**Endpoint:** `GET /api/categories/{id}/`

**Response (200 OK):**
```json
{
  "id": 1,
  "report_type": "Hazard",
  "subcategories_count": 11
}
```

### 3.3 Get Category with Subcategories

**Endpoint:** `GET /api/categories/{id}/subcategories/`

**Response (200 OK):**
```json
{
  "category": {
    "id": 1,
    "report_type": "Hazard",
    "subcategories_count": 11
  },
  "subcategories": [
    {
      "id": 1,
      "report_type": 1,
      "category_id": 1,
      "category_name": "Hazard",
      "sub_category": "FLOODING",
      "sub_category_display": "Flooding/Water Overflow"
    }
  ]
}
```

**cURL Example:**
```bash
curl http://localhost:8000/api/categories/1/subcategories/
```

---

## 4. SubCategory Endpoints

### 4.1 List All Subcategories

**Endpoint:** `GET /api/subcategories/`

**Query Parameters:**
- `category` (optional): Filter by category ID

**Response (200 OK):**
```json
{
  "count": 19,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "report_type": 1,
      "category_id": 1,
      "category_name": "Hazard",
      "sub_category": "FLOODING",
      "sub_category_display": "Flooding/Water Overflow"
    }
  ]
}
```

**cURL Example:**
```bash
curl http://localhost:8000/api/subcategories/
```

### 4.2 Filter Subcategories by Category

**Endpoint:** `GET /api/subcategories/?category={id}`

**Response (200 OK):**
```json
{
  "count": 11,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "report_type": 1,
      "category_id": 1,
      "category_name": "Hazard",
      "sub_category": "FLOODING",
      "sub_category_display": "Flooding/Water Overflow"
    }
  ]
}
```

**cURL Example:**
```bash
curl http://localhost:8000/api/subcategories/?category=1
```

### 4.3 Get Subcategories by Category (Alternative)

**Endpoint:** `GET /api/subcategories/by_category/?category={id}`

**Response (200 OK):**
```json
{
  "success": true,
  "count": 11,
  "data": [
    {
      "id": 1,
      "report_type": 1,
      "category_id": 1,
      "category_name": "Hazard",
      "sub_category": "FLOODING",
      "sub_category_display": "Flooding/Water Overflow"
    }
  ]
}
```

**cURL Example:**
```bash
curl http://localhost:8000/api/subcategories/by_category/?category=1
```

---

## 5. Report Endpoints

### 5.1 Create Report

**Endpoint:** `POST /api/reports/`

**Request Body (Infrastructure - sub_category optional):**
```json
{
  "citizen": 1,
  "title": "Broken sidewalk on Main St",
  "report_type": 2,
  "sub_category": 3,
  "description": "Large crack in sidewalk near intersection",
  "latitude": 14.5995,
  "longitude": 120.9842
}
```

**Request Body (Hazard - sub_category REQUIRED):**
```json
{
  "citizen": 1,
  "title": "Flooding on Highway 1",
  "report_type": 1,
  "sub_category": 1,
  "description": "Severe flooding blocking the road",
  "latitude": 14.5995,
  "longitude": 120.9842
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Report created successfully. Your report has been submitted.",
  "data": {
    "id": 1,
    "citizen": 1,
    "citizen_name": "John Doe",
    "citizen_email": "john@example.com",
    "report_type": 1,
    "category_name": "Hazard",
    "sub_category": 1,
    "sub_category_name": "Flooding/Water Overflow",
    "title": "Flooding on Highway 1",
    "latitude": "14.599500",
    "longitude": "120.984200",
    "description": "Severe flooding blocking the road",
    "created_at": "2025-10-18T07:30:00Z"
  }
}
```

**cURL Example (Hazard with sub_category):**
```bash
curl -X POST http://localhost:8000/api/reports/ \
  -H "Content-Type: application/json" \
  -d '{
    "citizen": 1,
    "title": "Flooding on Highway 1",
    "report_type": 1,
    "sub_category": 1,
    "description": "Severe flooding blocking the road",
    "latitude": 14.5995,
    "longitude": 120.9842
  }'
```

**cURL Example (Infrastructure without sub_category):**
```bash
curl -X POST http://localhost:8000/api/reports/ \
  -H "Content-Type: application/json" \
  -d '{
    "citizen": 1,
    "title": "Broken sidewalk",
    "report_type": 2,
    "description": "Large crack in sidewalk",
    "latitude": 14.5995,
    "longitude": 120.9842
  }'
```

### 5.2 Validation Errors for Sub Category

**Error: Missing sub_category for Hazard report**

**Request:**
```json
{
  "citizen": 1,
  "title": "Flooding on Highway 1",
  "report_type": 1,
  "description": "Severe flooding",
  "latitude": 14.5995,
  "longitude": 120.9842
}
```

**Response (400 Bad Request):**
```json
{
  "sub_category": [
    "Sub category is required for Hazard reports."
  ]
}
```

**Error: Wrong sub_category for category**

**Request (Using Infrastructure sub_category for Hazard report):**
```json
{
  "citizen": 1,
  "title": "Flooding on Highway 1",
  "report_type": 1,
  "sub_category": 3,
  "description": "Severe flooding",
  "latitude": 14.5995,
  "longitude": 120.9842
}
```

**Response (400 Bad Request):**
```json
{
  "sub_category": [
    "Sub category must belong to Hazard category."
  ]
}
```

### 5.3 List All Reports

**Endpoint:** `GET /api/reports/`

**Query Parameters:**
- `citizen_id` (optional): Filter by citizen ID
- `category` (optional): Filter by category ID
- `sub_category` (optional): Filter by sub_category ID

**Response (200 OK):**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "citizen": 1,
      "citizen_name": "John Doe",
      "citizen_email": "john@example.com",
      "report_type": 1,
      "category_name": "Hazard",
      "sub_category": 1,
      "sub_category_name": "Flooding/Water Overflow",
      "title": "Flooding on Highway 1",
      "latitude": "14.599500",
      "longitude": "120.984200",
      "description": "Severe flooding blocking the road",
      "created_at": "2025-10-18T07:30:00Z"
    },
    {
      "id": 2,
      "citizen": 1,
      "citizen_name": "John Doe",
      "citizen_email": "john@example.com",
      "report_type": 2,
      "category_name": "Infrastructure",
      "sub_category": null,
      "sub_category_name": null,
      "title": "Broken sidewalk",
      "latitude": "14.599500",
      "longitude": "120.984200",
      "description": "Large crack in sidewalk",
      "created_at": "2025-10-18T07:25:00Z"
    }
  ]
}
```

**cURL Example:**
```bash
curl http://localhost:8000/api/reports/
```

**cURL Example (Filter by category):**
```bash
curl http://localhost:8000/api/reports/?category=1
```

**cURL Example (Filter by sub_category):**
```bash
curl http://localhost:8000/api/reports/?sub_category=1
```

### 5.4 Get Report Statistics

**Endpoint:** `GET /api/reports/stats/`

**Response (200 OK):**
```json
{
  "total_reports": 10,
  "by_category": [
    {
      "report_type__report_type": "Hazard",
      "count": 6
    },
    {
      "report_type__report_type": "Infrastructure",
      "count": 4
    }
  ]
}
```

**cURL Example:**
```bash
curl http://localhost:8000/api/reports/stats/
```

### 5.5 Update Report (Citizens CANNOT update)

**Endpoint:** `PUT /api/reports/{id}/` or `PATCH /api/reports/{id}/`

**Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Citizens cannot update reports. Reports are read-only once submitted."
}
```

### 5.6 Delete Report (Citizens CANNOT delete)

**Endpoint:** `DELETE /api/reports/{id}/`

**Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Citizens cannot delete reports. Please contact authorities if you need to remove a report."
}
```

---

## Error Responses

### 400 Bad Request

**Duplicate Email:**
```json
{
  "email": [
    "A citizen with this email already exists."
  ]
}
```

**Password Mismatch:**
```json
{
  "confirm_password": [
    "Passwords do not match."
  ]
}
```

**Password Too Short:**
```json
{
  "password": [
    "Ensure this field has at least 8 characters."
  ]
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Postman Collection Setup

### 1. Create Environment Variables

Create a Postman environment with the following variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:8000` | `http://localhost:8000` |
| `citizen_id` | | (auto-populated) |
| `authority_id` | | (auto-populated) |
| `report_id` | | (auto-populated) |

### 2. Import Collection

You can import the following collection structure:

```
Smartwayz API
├── Citizens
│   ├── Create Citizen
│   ├── List Citizens
│   ├── Get Citizen
│   ├── Update Citizen
│   ├── Delete Citizen
│   └── Get Citizens Count
├── Authorities
│   ├── Create Authority
│   ├── List Authorities
│   ├── Get Authority
│   ├── Update Authority
│   ├── Delete Authority
│   └── Get Authorities Count
├── Categories
│   ├── List Categories
│   ├── Get Category
│   └── Get Category Subcategories
├── SubCategories
│   ├── List Subcategories
│   ├── Filter by Category
│   └── By Category (Alternative)
└── Reports
    ├── Create Report
    ├── List Reports
    ├── Get Report
    ├── Update Report
    ├── Delete Report
    └── Get Statistics
```

### 3. Auto-Save IDs

Add this script to the **Tests** tab of POST requests to auto-save IDs:

**For Create Citizen:**
```javascript
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("citizen_id", jsonData.data.id);
}
```

**For Create Authority:**
```javascript
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("authority_id", jsonData.data.id);
}
```

**For Create Report:**
```javascript
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("report_id", jsonData.data.id);
}
```

---

## Testing Workflow

### Complete Test Flow

1. **Setup**
   ```bash
   # Verify API is running
   curl http://localhost:8000/api/
   ```

2. **Test Categories and SubCategories**
   ```bash
   # Get all categories
   curl http://localhost:8000/api/categories/
   
   # Get Hazard subcategories (category_id=1)
   curl http://localhost:8000/api/subcategories/?category=1
   
   # Get Infrastructure subcategories (category_id=2)
   curl http://localhost:8000/api/subcategories/?category=2
   ```

3. **Create Citizen**
   ```bash
   curl -X POST http://localhost:8000/api/citizens/ \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123",
       "confirm_password": "password123"
     }'
   # Save the returned citizen ID
   ```

4. **Test Report Creation - Hazard Category**
   
   **✅ Valid: Hazard with sub_category**
   ```bash
   curl -X POST http://localhost:8000/api/reports/ \
     -H "Content-Type: application/json" \
     -d '{
       "citizen": 1,
       "title": "Flooding on Main Street",
       "report_type": 1,
       "sub_category": 1,
       "description": "Severe flooding blocking the road",
       "latitude": 14.5995,
       "longitude": 120.9842
     }'
   ```
   
   **❌ Invalid: Hazard without sub_category (should fail)**
   ```bash
   curl -X POST http://localhost:8000/api/reports/ \
     -H "Content-Type: application/json" \
     -d '{
       "citizen": 1,
       "title": "Flooding on Main Street",
       "report_type": 1,
       "description": "Severe flooding",
       "latitude": 14.5995,
       "longitude": 120.9842
     }'
   # Expected: 400 Bad Request - "Sub category is required for Hazard reports."
   ```
   
   **❌ Invalid: Hazard with wrong sub_category (should fail)**
   ```bash
   curl -X POST http://localhost:8000/api/reports/ \
     -H "Content-Type: application/json" \
     -d '{
       "citizen": 1,
       "title": "Flooding on Main Street",
       "report_type": 1,
       "sub_category": 9,
       "description": "Severe flooding",
       "latitude": 14.5995,
       "longitude": 120.9842
     }'
   # Expected: 400 Bad Request - "Sub category must belong to Hazard category."
   # (sub_category 9 is ROAD_DAMAGE which belongs to Infrastructure)
   ```

5. **Test Report Creation - Infrastructure Category**
   
   **✅ Valid: Infrastructure without sub_category**
   ```bash
   curl -X POST http://localhost:8000/api/reports/ \
     -H "Content-Type: application/json" \
     -d '{
       "citizen": 1,
       "title": "Broken sidewalk",
       "report_type": 2,
       "description": "Large crack in sidewalk",
       "latitude": 14.5995,
       "longitude": 120.9842
     }'
   ```
   
   **✅ Valid: Infrastructure with sub_category (optional)**
   ```bash
   curl -X POST http://localhost:8000/api/reports/ \
     -H "Content-Type: application/json" \
     -d '{
       "citizen": 1,
       "title": "Broken sidewalk on Main St",
       "report_type": 2,
       "sub_category": 11,
       "description": "Large crack in sidewalk near intersection",
       "latitude": 14.5995,
       "longitude": 120.9842
     }'
   ```

6. **Filter Reports**
   ```bash
   # Get all reports
   curl http://localhost:8000/api/reports/
   
   # Filter by Hazard category
   curl http://localhost:8000/api/reports/?category=1
   
   # Filter by specific sub_category (e.g., Flooding)
   curl http://localhost:8000/api/reports/?sub_category=1
   
   # Filter by citizen
   curl http://localhost:8000/api/reports/?citizen_id=1
   ```

7. **Get Statistics**
   ```bash
   curl http://localhost:8000/api/reports/stats/
   curl http://localhost:8000/api/citizens/count/
   curl http://localhost:8000/api/authorities/count/
   ```

### Frontend Integration Guide

For your frontend application, follow this workflow:

1. **Load Categories on Page Load**
   ```javascript
   // GET /api/categories/
   // Display: "Hazard" and "Infrastructure" options
   ```

2. **When User Selects Category**
   ```javascript
   // If category is "Hazard" (id=1):
   //   - Make sub_category field REQUIRED
   //   - GET /api/subcategories/?category=1
   //   - Show dropdown with Hazard sub_categories
   
   // If category is "Infrastructure" (id=2):
   //   - Make sub_category field OPTIONAL
   //   - GET /api/subcategories/?category=2
   //   - Show dropdown with Infrastructure sub_categories (or allow empty)
   ```

3. **Submit Report**
   ```javascript
   // POST /api/reports/
   // Include sub_category in payload if selected
   // Handle validation errors (400 Bad Request)
   ```

### Sub Category IDs Reference

**Hazard Sub Categories (category_id=1):**
- 1: Flooding/Water Overflow
- 2: Landslide/Soil Erosion
- 3: Fire Hazard
- 4: Electrical Hazard
- 5: Fallen Trees/Debris Blocking Road
- 6: Road accident
- 7: Blocked Drainage/Clogged Gutter
- 8: Earthquake Damage
- 9: Sinkhole
- 10: Public Health Hazard
- 11: Other Hazard (specify)

**Infrastructure Sub Categories (category_id=2):**
- 12: Road damage/Potholes
- 13: Streetlights/Electrical Issues
- 14: Sidewalks/Pedestrian Paths
- 15: Building/Structural Concerns
- 16: Bridge/Overpass Issues
- 17: Structural Collapses/Weak infrastructure
- 18: Safety and Security Concerns
- 19: Other (specify)

---

## Notes

- All POST/PUT/PATCH requests require `Content-Type: application/json` header
- **Passwords are securely hashed** using Django's PBKDF2 algorithm with SHA256
- Password hashing is automatic - you send plain text, it's stored hashed
- Categories and SubCategories are read-only (seeded via migrations)
- Pagination is enabled with 10 items per page by default
- All endpoints support the browsable API at `http://localhost:8000/api/` in a web browser

---

## Troubleshooting

### Connection Refused
- Ensure Docker container is running: `docker compose ps`
- Check logs: `docker compose logs django-web`

### 400 Bad Request
- Verify JSON syntax
- Check required fields are provided
- Ensure email uniqueness for citizens/authorities

### 404 Not Found
- Verify the ID exists
- Check the endpoint URL is correct

### 500 Internal Server Error
- Check server logs: `docker compose logs django-web`
- Verify database connection
