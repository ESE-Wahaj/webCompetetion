# ShoppingMart Backend API

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

### 3. Set Up Database

Make sure PostgreSQL is running, then execute:

```bash
# Navigate to database directory
cd ../database

# Run all migrations and seeds
psql -U postgres -d shoppingmart -f setup.sql
```

### 4. Install DLL Dependencies

```bash
cd ../libs
npm install
```

### 5. Start Server

```bash
cd ../backend

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on http://localhost:5000

## API Endpoints

### Public Endpoints

- `GET /api/health` - Health check
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

## Testing with cURL

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test1234",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

### Get Products

```bash
curl http://localhost:5000/api/products
```

## Security Features

- ✅ Helmet security headers
- ✅ CORS protection
- ✅ Rate limiting (100 req/15min general, 5 req/15min login)
- ✅ JWT authentication with httpOnly cookies
- ✅ Bcrypt password hashing (12 rounds)
- ✅ DLL-protected admin operations (double authentication)
- ✅ Input validation with express-validator
- ✅ XSS prevention
- ✅ SQL injection prevention (parameterized queries)
- ✅ Audit logging

## Default Test Accounts

**Admin:**
- Email: admin@shoppingmart.com
- Password: Admin1234

**Customer:**
- Email: customer@shoppingmart.com
- Password: Customer1234
