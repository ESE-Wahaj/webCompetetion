@echo off
echo ================================================
echo ShoppingMart Database Setup
echo ================================================
echo.

echo Step 1: Creating database...
psql -U postgres -c "DROP DATABASE IF EXISTS shoppingmart;"
psql -U postgres -c "CREATE DATABASE shoppingmart;"
echo Database created!
echo.

echo Step 2: Running migrations...
psql -U postgres -d shoppingmart -f migrations/001_create_users_table.sql
psql -U postgres -d shoppingmart -f migrations/002_create_categories_table.sql
psql -U postgres -d shoppingmart -f migrations/003_create_products_table.sql
psql -U postgres -d shoppingmart -f migrations/004_create_cart_table.sql
psql -U postgres -d shoppingmart -f migrations/005_create_orders_table.sql
psql -U postgres -d shoppingmart -f migrations/006_create_order_items_table.sql
psql -U postgres -d shoppingmart -f migrations/007_create_indexes.sql
echo Migrations completed!
echo.

echo Step 3: Seeding data...
psql -U postgres -d shoppingmart -f seeds/seed_users.sql
psql -U postgres -d shoppingmart -f seeds/seed_categories.sql
psql -U postgres -d shoppingmart -f seeds/seed_products.sql
echo Data seeded!
echo.

echo Step 4: Verifying setup...
psql -U postgres -d shoppingmart -c "SELECT COUNT(*) as total_products FROM Products;"
psql -U postgres -d shoppingmart -c "SELECT COUNT(*) as total_categories FROM Categories;"
psql -U postgres -d shoppingmart -c "SELECT COUNT(*) as total_users FROM Users;"
echo.

echo ================================================
echo Database setup complete!
echo ================================================
echo.
echo You can now:
echo 1. Open pgAdmin4
echo 2. Refresh databases
echo 3. Find 'shoppingmart' database
echo 4. Explore tables under Schemas > public > Tables
echo.
pause
