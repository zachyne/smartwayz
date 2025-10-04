# SmartWayz

A full-stack web application built with Django REST Framework and React.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## 🎯 Overview

SmartWayz is a modern web application featuring a Django backend API and a React frontend interface.

## 🛠 Tech Stack

### Backend
- **Django 5.2.7** - High-level Python web framework
- **Django REST Framework 3.16.1** - Powerful toolkit for building Web APIs
- **Django CORS Headers 4.9.0** - Handle Cross-Origin Resource Sharing
- **Python Decouple 3.8** - Environment variable management
- **SQLite** - Default database (development)

### Frontend
- **React 19.2.0** - JavaScript library for building user interfaces
- **React Router DOM 7.9.3** - Declarative routing for React
- **Axios 1.12.2** - Promise-based HTTP client
- **React Scripts 5.0.1** - Configuration and scripts for Create React App

## 📁 Project Structure

```
smartwayz/
├── backend/
│   ├── api/                    # Django API app
│   │   ├── migrations/         # Database migrations
│   │   ├── models.py          # Data models
│   │   ├── views.py           # API views
│   │   ├── admin.py           # Admin configuration
│   │   └── ...
│   ├── smartwayz_backend/     # Django project settings
│   │   ├── settings.py        # Project settings
│   │   ├── urls.py            # URL configuration
│   │   ├── wsgi.py            # WSGI configuration
│   │   └── asgi.py            # ASGI configuration
│   ├── venv/                  # Python virtual environment
│   ├── manage.py              # Django management script
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
└── frontend/
    ├── public/                # Static files
    ├── src/                   # React source code
    │   ├── App.js            # Main App component
    │   ├── App.css           # App styles
    │   ├── index.js          # Entry point
    │   └── ...
    ├── package.json          # Node dependencies
    └── README.md             # Frontend-specific README
```

## ✅ Prerequisites

Before you begin, ensure you have the following installed:
- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 14+** and **npm** - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/downloads/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd smartwayz
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

## 🏃 Running the Application

### Start the Backend Server

```bash
# From backend directory with virtual environment activated
cd backend
source venv/bin/activate  # On Linux/Mac
python manage.py runserver
```

The Django backend will be available at `http://localhost:8000`

### Start the Frontend Development Server

```bash
# From frontend directory (in a new terminal)
cd frontend
npm start
```

The React frontend will be available at `http://localhost:3000`

## 💻 Development

### Backend Development

- **Admin Panel**: Access at `http://localhost:8000/admin`
- **API Endpoints**: Define in `backend/api/views.py` and `backend/api/urls.py`
- **Models**: Define in `backend/api/models.py`
- **Migrations**: Run `python manage.py makemigrations` and `python manage.py migrate`

### Frontend Development

- **Components**: Create in `frontend/src/`
- **Routing**: Configure in `frontend/src/App.js`
- **API Calls**: Use Axios for HTTP requests
- **Build**: Run `npm run build` for production build

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

## 📚 API Documentation

API endpoints will be documented here as they are developed.

### Base URL
```
http://localhost:8000/api/
```

### Available Endpoints
- `/admin/` - Django admin interface

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Django Documentation
- React Documentation
- Create React App
