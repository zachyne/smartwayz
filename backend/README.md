# Smartwayz Backend

Django REST API for the Smartwayz reporting system.

## Prerequisites

- Docker and Docker Compose
- `.env` file with required environment variables (see `.env.example`)

## Getting Started

### 1. Build the Docker Image

```bash
docker compose build
```

### 2. Run Database Migrations

This will create all database tables:

```bash
docker compose run --rm django-web python manage.py migrate
```

**Note:** The migration automatically seeds the database with:
- 2 Categories (Hazard, Infrastructure)
- 19 SubCategories (mapped to their respective categories)

### 3. Start the Application

```bash
docker compose up
```

Or run in detached mode:

```bash
docker compose up -d
```

The API will be available at `http://localhost:8000`

### 4. View Logs (if running in detached mode)

```bash
docker compose logs -f django-web
```

## Development Commands

### Create Migrations

```bash
docker compose run --rm django-web python manage.py makemigrations
```

### Access Django Shell

```bash
docker compose run --rm django-web python manage.py shell
```

### Create Superuser

```bash
docker compose run --rm django-web python manage.py createsuperuser
```

### Stop the Application

```bash
docker compose down
```

## Database Access

If you have a PostgreSQL database service, access it with:

```bash
docker compose exec db psql -U postgres -d smartwayzdb
```

## Verify Seeded Data

Check that categories and subcategories were seeded correctly:

```bash
docker compose run --rm django-web python manage.py shell -c "from api.models import Category, SubCategory; print(f'Categories: {Category.objects.count()}'); print(f'SubCategories: {SubCategory.objects.count()}')"
```

Expected output:
- Categories: 2
- SubCategories: 19

## API Documentation

- **API Endpoints:** [API_TESTING.md](./API_TESTING.md) - Complete API documentation
- **Authentication:** [AUTH_API.md](./AUTH_API.md) - Login, JWT tokens, and authentication guide

### Quick API Test

Test that the API is working:

```bash
curl http://localhost:8000/api/
```

Expected response:
```json
{
    "citizens": "http://localhost:8000/api/citizens/",
    "authorities": "http://localhost:8000/api/authorities/",
    "categories": "http://localhost:8000/api/categories/",
    "subcategories": "http://localhost:8000/api/subcategories/",
    "reports": "http://localhost:8000/api/reports/"
}
```

### Browse API in Browser

Visit `http://localhost:8000/api/` in your web browser to access the Django REST Framework browsable API interface.

## Security

### Password Security ✅

Passwords are automatically hashed using Django's PBKDF2-SHA256 algorithm with 1,000,000 iterations. Passwords are never stored in plain text.

### Password Confirmation ✅

User registration requires password confirmation to prevent typos:
- `password` and `confirm_password` fields required
- Validation ensures both passwords match
- Clear error message if passwords don't match

For complete security documentation, see [SECURITY.md](./SECURITY.md)

**Note:** This application is configured for development. Additional security measures (authentication, authorization, HTTPS) are required before production deployment.


