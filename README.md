# 🛒 ShoppingMart - Secure E-Commerce Platform

A full-stack e-commerce application with **DLL-protected admin operations**, built with Node.js, Express, PostgreSQL, React, and Tailwind CSS.

## 🎯 Project Overview

ShoppingMart is a production-ready online shopping platform featuring:

- **Unique DLL Architecture**: Product CRUD operations protected by password-authenticated library module
- **Double Authentication**: Admin operations require both DLL password AND user JWT validation
- **Complete Security**: Helmet, CORS, rate limiting, XSS prevention, SQL injection protection
- **Modern UI**: React with Tailwind CSS using "Emerald Spring Whisper" color palette
- **Full E-Commerce Flow**: Browse → Cart → Checkout → Order Management

---

## 🏗️ Project Structure

```
ShoppingMart/
├── backend/              # Express.js API server
│   ├── config/           # Database & JWT configuration
│   ├── middleware/       # Auth, validation, rate limiting, error handling
│   ├── models/           # Database query functions
│   ├── controllers/      # Business logic
│   ├── routes/           # API endpoints
│   ├── utils/            # Logger, sanitizer, validator
│   └── server.js         # Main Express server
│
├── libs/                 # DLL-equivalent secure module
│   ├── productDLL.js     # CRUD operations with double auth
│   ├── dllAuth.js        # DLL password + JWT validation
│   ├── dllValidator.js   # Input validation
│   ├── orderCalculator.js # Order total calculations
│   └── index.js          # Module exports
│
├── database/
│   ├── migrations/       # 7 SQL migration files
│   ├── seeds/            # Sample data (users, categories, 35 products)
│   └── schema.sql        # Complete schema reference
│
└── frontend/             # React + Vite application
    ├── src/
    │   ├── components/   # React components (to be completed)
    │   ├── context/      # Auth & Cart contexts (to be completed)
    │   ├── services/     # API service layer (partial)
    │   └── pages/        # Page components (to be completed)
    └── index.html
```

---

## ✅ What's Already Built

### Backend (100% Complete)
- ✅ Express server with all security middleware
- ✅ PostgreSQL database schema (6 tables with indexes)
- ✅ JWT authentication system
- ✅ Role-based access control (customer/admin)
- ✅ Complete API endpoints (auth, products, cart, orders, admin)
- ✅ DLL library module with double authentication
- ✅ Input validation, XSS prevention, SQL injection protection
- ✅ Rate limiting (general, login, register, admin)
- ✅ Comprehensive logging system
- ✅ Error handling

### Database (100% Complete)
- ✅ Users table with bcrypt hashed passwords
- ✅ Categories and Products tables
- ✅ Cart table (supports guest sessions)
- ✅ Orders and OrderItems tables
- ✅ All indexes for performance
- ✅ Seed data (admin, customers, 35 products across 8 categories)

### DLL Module (100% Complete)
- ✅ InsertProduct (admin only)
- ✅ UpdateProduct (admin only)
- ✅ DeleteProduct (soft delete, admin only)
- ✅ GetProduct (authenticated users)
- ✅ GetAllProducts with filters (authenticated users)
- ✅ CalculateOrderTotal with tax & shipping logic

### Frontend (30% Complete)
- ✅ Vite + React setup
- ✅ Tailwind CSS with custom color palette
- ✅ Axios API client with interceptors
- ✅ Auth service layer
- ⏳ Context providers (need to complete)
- ⏳ Components (need to create)
- ⏳ Routing (need to create)

---

## 🚀 Quick Start Guide

### Prerequisites

- Node.js (v18+ LTS)
- PostgreSQL (v14+)
- npm (v9+)
- pgAdmin4 (optional, for database management)

### 1. Database Setup

```bash
# Start PostgreSQL service
# Windows: Check Services app
# Mac: brew services start postgresql
# Linux: sudo service postgresql start

# Create database
psql -U postgres
CREATE DATABASE shoppingmart;
\q

# Run migrations and seeds
cd database
psql -U postgres -d shoppingmart -f migrations/001_create_users_table.sql
psql -U postgres -d shoppingmart -f migrations/002_create_categories_table.sql
psql -U postgres -d shoppingmart -f migrations/003_create_products_table.sql
psql -U postgres -d shoppingmart -f migrations/004_create_cart_table.sql
psql -U postgres -d shoppingmart -f migrations/005_create_orders_table.sql
psql -U postgres -d shoppingmart -f migrations/006_create_order_items_table.sql
psql -U postgres -d shoppingmart -f migrations/007_create_indexes.sql

# Seed data
psql -U postgres -d shoppingmart -f seeds/seed_users.sql
psql -U postgres -d shoppingmart -f seeds/seed_categories.sql
psql -U postgres -d shoppingmart -f seeds/seed_products.sql

# Verify
psql -U postgres -d shoppingmart -c "SELECT COUNT(*) FROM Products;"
```

### 2. Backend Setup

```bash
# Install backend dependencies
cd backend
npm install

# Configure environment (update DB_PASSWORD)
cp .env.example .env
# Edit .env and set your PostgreSQL password

# Start server
npm run dev
```

Backend will run on **http://localhost:5000**

### 3. DLL Module Setup

```bash
# Install DLL dependencies
cd ../libs
npm install
```

### 4. Frontend Setup

```bash
# Install frontend dependencies
cd ../frontend
npm install

# Start development server
npm run dev
```

Frontend will run on **http://localhost:5173**

---

## 🧪 Testing the Backend

### Test with cURL

```bash
# Health Check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test1234","first_name":"Test"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'

# Get Products (save token from login)
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Default Test Accounts

**Admin Account:**
- Email: `admin@shoppingmart.com`
- Password: `Admin1234`

**Customer Account:**
- Email: `customer@shoppingmart.com`
- Password: `Customer1234`

---

## 📋 API Endpoints

### Public Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/categories` - Get all categories

### Authenticated Endpoints
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove from cart
- `POST /api/orders/checkout` - Place order
- `GET /api/orders` - Get user orders

### Admin Endpoints (DLL-Protected)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/statistics` - Get order statistics

---

## 🔒 Security Features

1. **Helmet**: Security HTTP headers
2. **CORS**: Cross-origin protection
3. **Rate Limiting**:
   - General API: 100 req/15min
   - Login: 5 attempts/15min
   - Register: 3 accounts/hour
   - Admin: 50 req/15min
4. **JWT Authentication**: httpOnly cookies + Bearer tokens
5. **Bcrypt**: Password hashing (12 rounds)
6. **DLL Protection**: Double authentication for admin operations
7. **Input Validation**: express-validator on all routes
8. **XSS Prevention**: HTML escaping and sanitization
9. **SQL Injection Prevention**: Parameterized queries only
10. **Audit Logging**: All actions logged with user ID and timestamp

---

## 🎨 Design System

### Color Palette: "Emerald Spring Whisper"

```javascript
primary (Emerald):
  - 400: #4ade80 (buttons, accents)
  - 500: #22c55e (hover states)
  - 600: #16a34a (navbar)

spring (Yellow-Green):
  - 400: #facc15 (secondary buttons, badges)

whisper (Gray):
  - 50: #fafafa (backgrounds)
  - 100: #f5f5f5 (cards)
  - 300: #d4d4d4 (borders)
```

### Component Classes

```css
.btn-primary      /* Primary green button */
.btn-secondary    /* Yellow secondary button */
.btn-outline      /* Outlined button */
.input-field      /* Form inputs */
.card             /* Product/info cards */
.badge-*          /* Status badges */
```

---

## 📝 Next Steps to Complete the Project

### To finish the frontend, you need to create:

1. **Context Providers** (`src/context/`)
   - `AuthContext.jsx` - Auth state management
   - `CartContext.jsx` - Cart state management

2. **Service Layer** (`src/services/`)
   - `productService.js` - Product API calls
   - `cartService.js` - Cart API calls
   - `orderService.js` - Order API calls

3. **Components** (`src/components/`)
   - **Auth**: Login.jsx, Register.jsx, ProtectedRoute.jsx
   - **Products**: ProductCard.jsx, ProductGrid.jsx, ProductSearch.jsx, CategoryFilter.jsx
   - **Cart**: CartPage.jsx, CartItem.jsx, CartSummary.jsx
   - **Admin**: AdminDashboard.jsx, ProductForm.jsx, ProductTable.jsx, AdminRoute.jsx
   - **Layout**: Navbar.jsx, Footer.jsx, Layout.jsx
   - **Common**: Button.jsx, Input.jsx, Modal.jsx, LoadingSpinner.jsx

4. **Pages** (`src/pages/`)
   - Home.jsx
   - ProductsPage.jsx
   - CartPage.jsx
   - CheckoutPage.jsx
   - AdminPage.jsx
   - OrdersPage.jsx

5. **Main Files**
   - `App.jsx` - Routing and main component
   - `main.jsx` - React entry point

---

## 🐛 Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify `.env` file has correct DB_PASSWORD
- Run `npm install` in backend directory

### Database connection fails
- Ensure PostgreSQL service is running
- Check database name is `shoppingmart`
- Verify user credentials in `.env`

### Frontend API calls fail
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify VITE_API_URL in frontend/.env

### DLL authentication fails
- Check DLL_PASSWORD in backend/.env
- Verify JWT_SECRET is set
- Ensure admin user has correct role

---

## 📚 Documentation

- [Backend README](backend/README.md) - API documentation
- [DLL README](libs/README.md) - DLL module documentation
- Database schema: `database/schema.sql`

---

## 🎯 Project Requirements Met

✅ Complete project structure
✅ PostgreSQL database with migrations
✅ Express.js backend with security
✅ JWT authentication
✅ DLL module with double authentication
✅ Password-protected CRUD operations
✅ Order calculation with tax & shipping
✅ Rate limiting and input validation
✅ Logging system
✅ Tailwind CSS with custom palette
✅ API service layer

⏳ Frontend components (in progress)
⏳ React routing (in progress)
⏳ Complete checkout flow UI (in progress)

---

## 👥 Contributors

ShoppingMart Development Team

## 📄 License

ISC

---

**Ready to launch! Backend is fully functional. Complete the frontend components to have a working e-commerce platform.**
