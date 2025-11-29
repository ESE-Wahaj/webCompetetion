# 🚀 START HERE - Quick Setup Guide

## ⚡ Fast Track to Running ShoppingMart

Follow these steps to get your app running in **10 minutes**!

---

## ✅ Step 1: Prerequisites Check (2 minutes)

Open Command Prompt and verify:

```bash
node --version
# Need: v18 or higher

npm --version
# Need: v9 or higher

psql --version
# Need: PostgreSQL 14 or higher
```

❌ **Missing something?** Install from:
- Node.js: https://nodejs.org/ (LTS version)
- PostgreSQL: https://www.postgresql.org/download/

---

## ✅ Step 2: Database Setup (3 minutes)

### A. Start PostgreSQL
- Windows: Open Services → Find "postgresql-x64-14" → Start
- Or search "Services" in Start menu

### B. Create Database

```bash
# Open Command Prompt
psql -U postgres

# In PostgreSQL console:
CREATE DATABASE shoppingmart;
\q
```

### C. Run Migrations (one by one)

```bash
cd database

psql -U postgres -d shoppingmart -f migrations/001_create_users_table.sql
psql -U postgres -d shoppingmart -f migrations/002_create_categories_table.sql
psql -U postgres -d shoppingmart -f migrations/003_create_products_table.sql
psql -U postgres -d shoppingmart -f migrations/004_create_cart_table.sql
psql -U postgres -d shoppingmart -f migrations/005_create_orders_table.sql
psql -U postgres -d shoppingmart -f migrations/006_create_order_items_table.sql
psql -U postgres -d shoppingmart -f migrations/007_create_indexes.sql
```

### D. Add Sample Data

```bash
psql -U postgres -d shoppingmart -f seeds/seed_users.sql
psql -U postgres -d shoppingmart -f seeds/seed_categories.sql
psql -U postgres -d shoppingmart -f seeds/seed_products.sql
```

---

## ✅ Step 3: Backend Setup (2 minutes)

```bash
# Open NEW Command Prompt
cd backend

# Install dependencies
npm install

# IMPORTANT: Edit .env file
# Open backend/.env in Notepad
# Change this line: DB_PASSWORD=postgres
# To your actual PostgreSQL password

# Start backend
npm run dev
```

✅ **Success:** You should see:
```
🚀 ShoppingMart Backend Server
Server running on port: 5000
```

**Keep this window open!**

---

## ✅ Step 4: DLL Module Setup (1 minute)

```bash
# Open NEW Command Prompt
cd libs

# Install dependencies
npm install
```

---

## ✅ Step 5: Frontend Setup (2 minutes)

```bash
# Open NEW Command Prompt
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

✅ **Success:** You should see:
```
Local: http://localhost:5173/
```

**Keep this window open!**

---

## ✅ Step 6: Open App! 🎉

**Open your browser:** http://localhost:5173

You should see the ShoppingMart homepage!

---

## 🧪 Test the App

### Quick Test Flow:

1. **Homepage** → Click "Browse Products"

2. **Login** → Use test account:
   - Email: `admin@shoppingmart.com`
   - Password: `Admin1234`

3. **Browse Products** → Should see 35 products

4. **Add to Cart** → Click "Add to Cart" on any product

5. **Admin** → Click "Admin" in navbar (you're logged in as admin!)

---

## 🆘 Troubleshooting

### Backend won't start?

**Error: "connect ECONNREFUSED"**
```bash
# Fix: Start PostgreSQL service
# Windows: Services → postgresql-x64-14 → Start
```

**Error: "password authentication failed"**
```bash
# Fix: Update backend/.env
# Set correct PostgreSQL password
```

### Frontend shows blank page?

```bash
# Fix: Check if backend is running
# Visit: http://localhost:5000/api/health
# Should see: {"success":true,...}
```

### Can't see products?

```bash
# Fix: Verify database has products
psql -U postgres -d shoppingmart -c "SELECT COUNT(*) FROM Products;"
# Should show: 35
```

---

## 📝 Important Notes

**You need 3 things running:**

1. ✅ PostgreSQL Service (Windows Services)
2. ✅ Backend (Terminal: `cd backend && npm run dev`)
3. ✅ Frontend (Terminal: `cd frontend && npm run dev`)

**Test Accounts:**

- **Admin:** admin@shoppingmart.com / Admin1234
- **Customer:** customer@shoppingmart.com / Customer1234

**Ports:**

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 📚 Need More Help?

Read the detailed guides:

1. **IMPLEMENTATION_README.md** - Complete setup guide
2. **README.md** - Project overview
3. **PROJECT_SUMMARY.md** - What was built
4. **backend/README.md** - API documentation

---

## 🎯 What You Get

- ✅ 35 Sample Products
- ✅ 8 Categories
- ✅ User Authentication
- ✅ Shopping Cart
- ✅ Admin Panel
- ✅ Secure API
- ✅ Beautiful UI

---

**🎉 You're all set! Start shopping at http://localhost:5173**
