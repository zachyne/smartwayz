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
| `/api/citizens/` | GET, POST | List/Create citizens |
| `/api/citizens/{id}/` | GET, PUT, PATCH, DELETE | Retrieve/Update/Delete citizen |
| `/api/authorities/` | GET, POST | List/Create authorities |
| `/api/authorities/{id}/` | GET, PUT, PATCH, DELETE | Retrieve/Update/Delete authority |
| `/api/categories/` | GET | List all categories |
| `/api/categories/{id}/` | GET | Retrieve specific category |
| `/api/categories/{id}/subcategories/` | GET | Get subcategories for a category |
| `/api/subcategories/` | GET | List all subcategories |
| `/api/subcategories/{id}/` | GET | Retrieve specific subcategory |
| `/api/subcategories/by_category/?category={id}` | GET | Filter subcategories by category |
| `/api/reports/` | GET, POST | List/Create reports |
| `/api/reports/{id}/` | GET, PUT, PATCH, DELETE | Retrieve/Update/Delete report |
| `/api/reports/stats/` | GET | Get report statistics |

---

## 1. Citizen Endpoints

### 1.1 Create Citizen

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

**Request Body:**
```json
{
  "report_type": 1
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Report created successfully",
  "data": {
    "id": 1,
    "report_type": 1,
    "category_name": "Hazard"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/reports/ \
  -H "Content-Type: application/json" \
  -d '{"report_type": 1}'
```

### 5.2 List All Reports

**Endpoint:** `GET /api/reports/`

**Query Parameters:**
- `category` (optional): Filter by category ID

**Response (200 OK):**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "report_type": 1,
      "category_name": "Hazard"
    },
    {
      "id": 2,
      "report_type": 2,
      "category_name": "Infrastructure"
    }
  ]
}
```

**cURL Example:**
```bash
curl http://localhost:8000/api/reports/
```

### 5.3 Get Report Statistics

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

### 5.4 Update Report

**Endpoint:** `PUT /api/reports/{id}/` or `PATCH /api/reports/{id}/`

**Request Body:**
```json
{
  "report_type": 2
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Report updated successfully",
  "data": {
    "id": 1,
    "report_type": 2,
    "category_name": "Infrastructure"
  }
}
```

### 5.5 Delete Report

**Endpoint:** `DELETE /api/reports/{id}/`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Report deleted successfully"
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

2. **Test Categories (Read-only)**
   ```bash
   curl http://localhost:8000/api/categories/
   curl http://localhost:8000/api/subcategories/
   ```

3. **Create Citizen**
   ```bash
   curl -X POST http://localhost:8000/api/citizens/ \
     -H "Content-Type: application/json" \
     -d '{"name": "Test User", "email": "test@example.com", "password": "password123"}'
   ```

4. **Create Authority**
   ```bash
   curl -X POST http://localhost:8000/api/authorities/ \
     -H "Content-Type: application/json" \
     -d '{"authority_name": "Test Authority", "email": "authority@example.com", "password": "password123"}'
   ```

5. **Create Report**
   ```bash
   curl -X POST http://localhost:8000/api/reports/ \
     -H "Content-Type: application/json" \
     -d '{"report_type": 1}'
   ```

6. **Get Statistics**
   ```bash
   curl http://localhost:8000/api/reports/stats/
   curl http://localhost:8000/api/citizens/count/
   curl http://localhost:8000/api/authorities/count/
   ```

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
