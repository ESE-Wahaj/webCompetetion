# 🚀 ShoppingMart Implementation Guide

## Complete Setup Instructions for Running the Application

---

## Table of Contents
1. [Prerequisites Check](#prerequisites-check)
2. [Database Setup](#database-setup)
3. [Backend Setup](#backend-setup)
4. [DLL Module Setup](#dll-module-setup)
5. [Frontend Setup](#frontend-setup)
6. [Running the Application](#running-the-application)
7. [Testing the Application](#testing-the-application)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites Check

Before starting, verify you have all required software installed:

### 1. Node.js (v18+ LTS)

```bash
node --version
# Should output: v18.x.x or higher

npm --version
# Should output: 9.x.x or higher
```

If not installed:
- Download from: https://nodejs.org/
- Install the LTS version

### 2. PostgreSQL (v14+)

```bash
psql --version
# Should output: psql (PostgreSQL) 14.x or higher
```

If not installed:
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **Mac**: `brew install postgresql@14`
- **Linux**: `sudo apt-get install postgresql-14`

### 3. pgAdmin4 (Optional but Recommended)

Download from: https://www.pgadmin.org/download/

---

## Database Setup

### Step 1: Start PostgreSQL Service

**Windows:**
1. Open Services (Win + R, type `services.msc`)
2. Find "postgresql-x64-14" (or similar)
3. Right-click → Start

**Mac:**
```bash
brew services start postgresql@14
```

**Linux:**
```bash
sudo service postgresql start
```

### Step 2: Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Inside PostgreSQL console:
CREATE DATABASE shoppingmart;

# Verify database creation
\l

# Exit PostgreSQL
\q
```

### Step 3: Run All Migrations

Open your terminal and navigate to the database folder:

```bash
cd database

# Run migrations in order
psql -U postgres -d shoppingmart -f migrations/001_create_users_table.sql
psql -U postgres -d shoppingmart -f migrations/002_create_categories_table.sql
psql -U postgres -d shoppingmart -f migrations/003_create_products_table.sql
psql -U postgres -d shoppingmart -f migrations/004_create_cart_table.sql
psql -U postgres -d shoppingmart -f migrations/005_create_orders_table.sql
psql -U postgres -d shoppingmart -f migrations/006_create_order_items_table.sql
psql -U postgres -d shoppingmart -f migrations/007_create_indexes.sql
```

### Step 4: Seed Sample Data

```bash
# Still in database folder
psql -U postgres -d shoppingmart -f seeds/seed_users.sql
psql -U postgres -d shoppingmart -f seeds/seed_categories.sql
psql -U postgres -d shoppingmart -f seeds/seed_products.sql
```

### Step 5: Verify Database Setup

```bash
# Check tables were created
psql -U postgres -d shoppingmart -c "\dt"

# Check product count (should be 35)
psql -U postgres -d shoppingmart -c "SELECT COUNT(*) FROM Products;"

# Check categories (should be 8)
psql -U postgres -d shoppingmart -c "SELECT * FROM Categories;"

# Check users (should be 4)
psql -U postgres -d shoppingmart -c "SELECT username, email, role FROM Users;"
```

**Expected Output:**
- 35 products
- 8 categories
- 4 users (1 admin, 3 customers)

---

## Backend Setup

### Step 1: Navigate to Backend Folder

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- express
- pg (PostgreSQL client)
- bcrypt
- jsonwebtoken
- helmet
- cors
- express-validator
- express-rate-limit
- cookie-parser
- dotenv
- nodemon (dev dependency)

### Step 3: Configure Environment Variables

The `.env` file is already created. **Update the DB_PASSWORD**:

```bash
# Open backend/.env in your editor
# Update this line with your PostgreSQL password:
DB_PASSWORD=your_actual_postgres_password_here
```

Full `.env` file should look like:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=shoppingmart
DB_PASSWORD=your_actual_postgres_password_here
DB_PORT=5432

# JWT Configuration
JWT_SECRET=shoppingmart_jwt_secret_key_2024_very_secure_minimum_32_chars
JWT_EXPIRES_IN=24h

# DLL Security
DLL_PASSWORD=secure_dll_password_2024_change_in_production

# Bcrypt
BCRYPT_ROUNDS=12

# CORS
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 4: Test Backend

```bash
npm run dev
```

**Expected Output:**
```
================================================
🚀 ShoppingMart Backend Server
================================================
Environment: development
Server running on port: 5000
API URL: http://localhost:5000/api
Health Check: http://localhost:5000/api/health
================================================
```

**Leave this terminal running!**

### Step 5: Verify Backend is Working

Open a new terminal and test:

```bash
# Health check
curl http://localhost:5000/api/health

# Should return:
# {"success":true,"message":"ShoppingMart API is running","version":"1.0.0","timestamp":"..."}
```

---

## DLL Module Setup

### Step 1: Navigate to libs Folder

```bash
cd ../libs
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- pg
- dotenv
- jsonwebtoken

---

## Frontend Setup

### Step 1: Navigate to Frontend Folder

```bash
cd ../frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- react
- react-dom
- react-router-dom
- axios
- vite
- tailwindcss
- autoprefixer
- postcss

### Step 3: Start Frontend Development Server

```bash
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in XXX ms

➜ Local: http://localhost:5173/
➜ Network: use --host to expose
```

**Leave this terminal running!**

---

## Running the Application

You should now have **TWO terminals running:**

1. **Terminal 1 - Backend** (http://localhost:5000)
   ```bash
   cd backend
   npm run dev
   ```

2. **Terminal 2 - Frontend** (http://localhost:5173)
   ```bash
   cd frontend
   npm run dev
   ```

### Open Your Browser

Navigate to: **http://localhost:5173**

You should see the ShoppingMart homepage!

---

## Testing the Application

### Test Account Credentials

**Admin Account:**
- Email: `admin@shoppingmart.com`
- Password: `Admin1234`

**Customer Account:**
- Email: `customer@shoppingmart.com`
- Password: `Customer1234`

### Complete Test Flow

1. **Homepage**
   - ✅ Visit http://localhost:5173
   - ✅ Should see welcome page with features

2. **Registration**
   - ✅ Click "Sign Up" or visit `/register`
   - ✅ Fill in registration form
   - ✅ Password must be 8+ chars with uppercase, lowercase, number
   - ✅ Should redirect to products page after registration

3. **Login**
   - ✅ Click "Login" or visit `/login`
   - ✅ Use admin@shoppingmart.com / Admin1234
   - ✅ Should redirect to products page
   - ✅ Navbar should show "Hi, Admin" and cart icon

4. **Browse Products**
   - ✅ Visit `/products`
   - ✅ Should see 35 products in grid layout
   - ✅ Test search functionality
   - ✅ Test category filter dropdown
   - ✅ Products should have images, prices, stock counts

5. **Add to Cart**
   - ✅ Click "Add to Cart" on any product
   - ✅ Should see success message
   - ✅ Cart badge in navbar should increment
   - ✅ Only works when logged in

6. **Admin Features** (Login as admin)
   - ✅ Click "Admin" in navbar
   - ✅ Should see admin dashboard
   - ✅ (Note: Full admin UI coming soon, but backend is ready!)

### Test Backend APIs with cURL

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@test.com",
    "password": "Test1234",
    "first_name": "New",
    "last_name": "User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shoppingmart.com","password":"Admin1234"}'

# Copy the token from response and use it:
TOKEN="your_token_here"

# Get products (no auth required)
curl http://localhost:5000/api/products

# Get cart (auth required)
curl http://localhost:5000/api/cart \
  -H "Authorization: Bearer $TOKEN"
```

---

## Troubleshooting

### Issue: Backend won't start

**Error: "connect ECONNREFUSED"**
- PostgreSQL is not running
- Solution: Start PostgreSQL service

**Error: "password authentication failed"**
- Wrong password in `.env`
- Solution: Update `DB_PASSWORD` in `backend/.env`

**Error: "database does not exist"**
- Database not created
- Solution: Run `CREATE DATABASE shoppingmart;` in psql

### Issue: Frontend shows blank page

**Check Browser Console:**
- F12 to open developer tools
- Look for errors in Console tab

**Common fixes:**
- Clear browser cache
- Run `npm install` again in frontend folder
- Make sure backend is running

### Issue: "Failed to fetch products"

**Check:**
1. Backend is running on port 5000
2. No CORS errors in browser console
3. Test backend directly: `curl http://localhost:5000/api/products`

### Issue: Login redirects to login page

**Check:**
1. Browser console for errors
2. Network tab in developer tools
3. Backend logs for authentication errors

### Issue: Admin features not accessible

**Verify:**
- Logged in as admin user (admin@shoppingmart.com)
- Check user role in JWT token (can decode at jwt.io)
- Backend logs should show "ADMIN_ACCESS_GRANTED"

---

## Application URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health
- **API Docs**: See [backend/README.md](backend/README.md)

---

## File Structure Overview

```
ShoppingMart/
├── backend/               ✅ Complete Express API
│   ├── config/           ✅ DB & JWT config
│   ├── middleware/       ✅ Auth, validation, security
│   ├── models/           ✅ Database queries
│   ├── controllers/      ✅ Business logic
│   ├── routes/           ✅ API endpoints
│   └── server.js         ✅ Main server
│
├── libs/                 ✅ DLL Module (Complete)
│   ├── productDLL.js     ✅ CRUD with double auth
│   ├── dllAuth.js        ✅ DLL authentication
│   ├── orderCalculator.js ✅ Order totals
│   └── index.js          ✅ Exports
│
├── database/             ✅ Complete schema
│   ├── migrations/       ✅ 7 SQL files
│   └── seeds/            ✅ Sample data
│
└── frontend/             ✅ React App (Functional)
    ├── src/
    │   ├── components/   ✅ UI components
    │   ├── context/      ✅ State management
    │   ├── services/     ✅ API calls
    │   ├── pages/        ✅ Page components
    │   └── App.jsx       ✅ Main app
    └── index.html        ✅ Entry point
```

---

## Security Features Implemented

✅ Helmet - Security HTTP headers
✅ CORS - Cross-origin protection
✅ Rate Limiting - Brute force protection
✅ JWT Authentication - Secure token-based auth
✅ Bcrypt - Password hashing (12 rounds)
✅ DLL Protection - Double authentication for admin
✅ Input Validation - All routes validated
✅ XSS Prevention - HTML escaping
✅ SQL Injection Prevention - Parameterized queries
✅ Logging - Audit trail for all actions

---

## Next Steps

### Current Status: 90% Complete ✅

**What's Working:**
- ✅ Complete backend API
- ✅ Database with sample data
- ✅ DLL security module
- ✅ User authentication
- ✅ Product browsing
- ✅ Basic cart functionality
- ✅ Admin protection

**To Complete (Optional Enhancements):**
- ⏳ Full cart page UI
- ⏳ Checkout flow UI
- ⏳ Orders page UI
- ⏳ Full admin dashboard UI

**Note:** The backend APIs for all these features are fully implemented and ready to use!

---

## Getting Help

1. **Check Logs:**
   - Backend: Terminal running `npm run dev`
   - Frontend: Browser console (F12)
   - Database: pgAdmin4 query tool

2. **Common Commands:**
   ```bash
   # Restart backend
   cd backend && npm run dev

   # Restart frontend
   cd frontend && npm run dev

   # Check PostgreSQL status
   psql -U postgres -c "SELECT version();"

   # View all products
   psql -U postgres -d shoppingmart -c "SELECT id, name, price FROM Products LIMIT 10;"
   ```

3. **Documentation:**
   - Backend API: `backend/README.md`
   - DLL Module: `libs/README.md`
   - Main README: `README.md`

---

**🎉 Congratulations! Your ShoppingMart application is now running!**

Visit **http://localhost:5173** and start shopping!
