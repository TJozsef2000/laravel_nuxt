# Laravel-Nuxt Full-Stack Application

A modern full-stack web application built with Laravel 12 (backend API) and Nuxt 3 (frontend), featuring authentication, comprehensive testing, and modern development tools.

## 📋 Table of Contents

- [System Requirements](#system-requirements)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Development Commands](#development-commands)
- [Testing](#testing)
- [Available Features](#available-features)
- [Troubleshooting](#troubleshooting)

## 🔧 System Requirements

### Essential Requirements

- **PHP**: `^8.2` (PHP 8.2 or higher)
- **Node.js**: `^18.0` (Node.js 18 or higher)
- **npm**: `^9.0` (npm 9 or higher) 
- **Composer**: `^2.0` (Composer 2.0 or higher)

### Database Options
- **SQLite** (default - recommended for development)
- **MySQL** `^8.0`
- **PostgreSQL** `^13.0`

### Optional but Recommended
- **Git**: For version control
- **VS Code** or similar IDE with PHP/Vue.js extensions

## 📁 Project Structure

```
laravel-nuxt/
├── app/                    # Laravel application logic
├── client/                 # Nuxt.js frontend application
│   ├── components/        # Vue.js components
│   ├── layouts/          # Layout components
│   ├── pages/            # Application pages
│   ├── composables/      # Vue.js composables
│   ├── services/         # API service layer
│   ├── types/            # TypeScript type definitions
│   └── tests/            # Frontend tests
├── config/                # Laravel configuration files
├── database/             # Database migrations & seeders
├── routes/               # Laravel API routes
├── storage/              # File storage & logs
├── tests/                # Backend tests
└── vendor/               # PHP dependencies (auto-generated)
```

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd laravel-nuxt
```

### Step 2: Install Backend Dependencies

```bash
# Install PHP dependencies
composer install
```

### Step 3: Install Frontend Dependencies

```bash
# Navigate to client directory and install Node.js dependencies
cd client
npm install
cd ..
```

### Step 4: Environment Configuration

#### Backend Environment (.env)

```bash
# Copy Laravel environment file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
APP_NAME="Laravel Nuxt App"
APP_ENV=local
APP_KEY=base64:your-app-key-here
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database (SQLite - Default)
DB_CONNECTION=sqlite

# For MySQL (uncomment and configure if needed)
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel_nuxt
# DB_USERNAME=root
# DB_PASSWORD=

# Session & Authentication
SESSION_DRIVER=database
SESSION_LIFETIME=120

# Queue & Cache
QUEUE_CONNECTION=database
CACHE_STORE=database

# Mail (for development)
MAIL_MAILER=log

# CORS Configuration (if needed)
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
```

#### Frontend Environment (client/.env)

```bash
# Navigate to client directory
cd client
cp .env.example .env
```

Edit the `client/.env` file:

```env
# Nuxt.js Environment Variables

# API Base URL (Laravel backend)
NUXT_PUBLIC_API_BASE=http://localhost:8000

# Application URL
NUXT_PUBLIC_APP_URL=http://localhost:3000

# Sanctum Configuration (for authentication)
NUXT_PUBLIC_SANCTUM_BASE_URL=http://localhost:8000
NUXT_PUBLIC_SANCTUM_ORIGIN=http://localhost:3000
```

### Step 5: Generate Laravel Application Key

```bash
# From the root directory
php artisan key:generate
```

### Step 6: Set Up Database

```bash
# Create SQLite database file (if using SQLite)
touch database/database.sqlite

# Run database migrations
php artisan migrate

# (Optional) Seed the database with sample data
php artisan db:seed
```

### Step 7: Install Passport Keys (if using API authentication)

```bash
# Generate encryption keys for Laravel Sanctum
php artisan install:api --passport
```

## ⚙️ Environment Configuration

### Laravel Configuration

Key configuration files:
- `config/cors.php` - CORS settings for frontend communication
- `config/sanctum.php` - Authentication configuration
- `config/database.php` - Database connections

### Nuxt Configuration

Key configuration in `client/nuxt.config.ts`:
- API base URL configuration
- Authentication settings (Sanctum)
- Tailwind CSS integration
- TypeScript support
- Testing configuration

## 🏃‍♂️ Running the Application

### Option 1: Run Both Services Separately

**Terminal 1 - Laravel Backend:**
```bash
# From root directory
php artisan serve
# Backend will run on http://localhost:8000
```

**Terminal 2 - Nuxt Frontend:**
```bash
# From client directory
cd client
npm run dev
# Frontend will run on http://localhost:3000
```

### Option 2: Run Concurrently (Recommended)

```bash
# From root directory - runs both backend and frontend
composer dev
# This runs: Laravel server + Queue worker + Logs + Frontend dev server
```

### Production Build

```bash
# Build frontend for production
cd client
npm run build

# Generate static files (if needed)
npm run generate
```

## 🛠️ Development Commands

### Backend Commands

```bash
# Laravel Artisan commands
php artisan migrate              # Run database migrations
php artisan migrate:fresh        # Fresh migration (drops all tables)
php artisan db:seed             # Seed database with sample data
php artisan route:list          # List all API routes
php artisan queue:work          # Process background jobs
php artisan test               # Run PHP tests

# Code quality
./vendor/bin/pint              # PHP code formatting
php artisan ide-helper:generate # Generate IDE helper files
```
