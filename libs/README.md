# ShoppingMart DLL Module

## Overview
This is a password-protected Node.js library that acts as a DLL-equivalent for secure product CRUD operations. It requires double authentication (DLL password + JWT token) before executing any function.

## Security Features

1. **Double Authentication**
   - DLL_PASSWORD must match environment variable
   - User JWT token must be valid
   - Both must pass for function execution

2. **Input Validation**
   - All inputs are validated before processing
   - SQL injection prevention via parameterized queries
   - Type checking and range validation

3. **Access Control**
   - Admin role required for write operations (Insert, Update, Delete)
   - Authenticated users can read products
   - All actions are logged with user ID and timestamp

4. **Audit Logging**
   - Every DLL function call is logged
   - Includes timestamp, user ID, and action
   - Authentication failures are tracked

## Installation

```bash
cd libs
npm install
```

## Configuration

Set the following environment variables in `backend/.env`:

```env
DLL_PASSWORD=your_secure_dll_password
DB_USER=postgres
DB_HOST=localhost
DB_NAME=shoppingmart
DB_PASSWORD=your_db_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

## Usage

### Import the Module

```javascript
const dll = require('./libs');
```

### Authentication Parameters

All functions require:
- `dllPassword`: String - Must match DLL_PASSWORD in environment
- `userToken`: String - Valid JWT token from login

### Product CRUD Operations

#### Insert Product (Admin Only)

```javascript
const result = await dll.InsertProduct(
  {
    name: 'Product Name',
    description: 'Product description',
    price: 29.99,
    stock: 100,
    sku: 'PROD-001',
    image_url: 'https://example.com/image.jpg',
    category_id: 1
  },
  DLL_PASSWORD,
  userJWT
);

// Returns: {success: true, productId: 123, message: '...'}
```

#### Update Product (Admin Only)

```javascript
const result = await dll.UpdateProduct(
  productId,
  {
    price: 39.99,
    stock: 150
  },
  DLL_PASSWORD,
  userJWT
);

// Returns: {success: true, message: '...'}
```

#### Delete Product (Admin Only)

```javascript
const result = await dll.DeleteProduct(
  productId,
  DLL_PASSWORD,
  userJWT
);

// Returns: {success: true, message: '...'}
// Note: This is a soft delete (sets is_active = false)
```

#### Get Product

```javascript
const result = await dll.GetProduct(
  productId,
  DLL_PASSWORD,
  userJWT
);

// Returns: {success: true, product: {...}}
```

#### Get All Products

```javascript
const result = await dll.GetAllProducts(
  {
    category_id: 1,
    search: 'wireless',
    minPrice: 10,
    maxPrice: 100
  },
  DLL_PASSWORD,
  userJWT
);

// Returns: {success: true, products: [...], count: 10}
```

### Order Calculation

#### Calculate Order Total

```javascript
const result = await dll.CalculateOrderTotal(
  [
    { productId: 1, quantity: 2 },
    { productId: 3, quantity: 1 }
  ],
  DLL_PASSWORD,
  userJWT
);

// Returns:
// {
//   success: true,
//   subtotal: '69.98',
//   tax: '6.99',
//   taxRate: '10%',
//   shipping: '0.00',
//   total: '76.97',
//   items: [...]
// }
```

## Response Format

All functions return a consistent response object:

```javascript
{
  success: boolean,      // true if operation succeeded
  message: string,       // Human-readable message
  data: any,            // Operation-specific data (optional)
  errors: array         // Validation errors (optional)
}
```

## Error Handling

The DLL handles the following error scenarios:
- Invalid DLL password
- Invalid or expired JWT token
- Insufficient privileges (non-admin trying write operations)
- Invalid input data
- Database errors (with sanitized messages)
- Unique constraint violations
- Foreign key violations

## Security Notes

1. **Never log or expose card details**
2. **Always use HTTPS in production**
3. **Rotate DLL_PASSWORD regularly**
4. **Monitor audit logs for suspicious activity**
5. **All queries use parameterized statements**

## Testing

```bash
# Create a test file
node libs/test.js
```

See implementation in `IMPLEMENTATION_README.md` for test examples.
