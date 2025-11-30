# Backend API Guide for Kalspire

This document outlines the backend API requirements for the Kalspire marketplace frontend.

## API Base URL
Configure in `.env`: `VITE_API_BASE_URL=http://localhost:3000/api`

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 1234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "customer",
    "createdAt": "2025-11-30T...",
    "updatedAt": "2025-11-30T..."
  },
  "token": "jwt-token-here"
}
```

#### POST /api/auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register

#### GET /api/auth/me
Get current user profile (requires authentication).

**Response:**
```json
{
  "id": "uuid",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "customer"
}
```

---

### Products

#### GET /api/products
Get all products with optional filtering.

**Query Parameters:**
- `categoryId` - Filter by category ID
- `search` - Search in product name/description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Product Name",
      "description": "Product description",
      "price": 999.99,
      "originalPrice": 1299.99,
      "images": ["url1", "url2"],
      "categoryId": "uuid",
      "category": {
        "id": "uuid",
        "name": "Category Name"
      },
      "stock": 50,
      "isAvailable": true,
      "tags": ["tag1", "tag2"],
      "createdAt": "2025-11-30T...",
      "updatedAt": "2025-11-30T..."
    }
  ],
  "total": 100
}
```

#### GET /api/products/:id
Get a single product by ID.

**Response:** Single product object (same structure as above)

#### POST /api/products (Admin only)
Create a new product.

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 999.99,
  "originalPrice": 1299.99,
  "images": ["url1", "url2"],
  "categoryId": "uuid",
  "stock": 50,
  "isAvailable": true,
  "tags": ["tag1"]
}
```

**Response:** Created product object

#### PUT /api/products/:id (Admin only)
Update an existing product.

**Request Body:** Same as POST (partial updates allowed)

**Response:** Updated product object

#### DELETE /api/products/:id (Admin only)
Delete a product.

**Response:** `204 No Content`

#### PATCH /api/products/:id/stock (Admin only)
Update product stock level.

**Request Body:**
```json
{
  "stock": 75
}
```

**Response:** Updated product object

---

### Categories

#### GET /api/categories
Get all categories.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Electronics",
    "description": "Electronic items",
    "image": "url",
    "isActive": true,
    "createdAt": "2025-11-30T...",
    "updatedAt": "2025-11-30T..."
  }
]
```

#### GET /api/categories/:id
Get a single category by ID.

#### POST /api/categories (Admin only)
Create a new category.

**Request Body:**
```json
{
  "name": "New Category",
  "description": "Category description",
  "image": "url",
  "isActive": true
}
```

#### PUT /api/categories/:id (Admin only)
Update a category.

#### DELETE /api/categories/:id (Admin only)
Delete a category.

#### PATCH /api/categories/:id/toggle (Admin only)
Toggle category active status.

**Request Body:**
```json
{
  "isActive": false
}
```

---

### Orders

#### GET /api/orders
Get all orders (admin gets all, customers get only their orders).

**Query Parameters:**
- `userId` - Filter by user (admin only)
- `status` - Filter by status
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "orders": [
    {
      "id": "uuid",
      "userId": "uuid",
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "items": [
        {
          "id": "uuid",
          "orderId": "uuid",
          "productId": "uuid",
          "product": { /* product object */ },
          "quantity": 2,
          "price": 999.99
        }
      ],
      "totalAmount": 1999.98,
      "status": "pending",
      "paymentStatus": "pending",
      "shippingAddress": {
        "fullName": "John Doe",
        "phone": "+91 1234567890",
        "addressLine1": "123 Main St",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001"
      },
      "createdAt": "2025-11-30T...",
      "updatedAt": "2025-11-30T..."
    }
  ],
  "total": 25
}
```

#### GET /api/orders/:id
Get a single order by ID.

#### POST /api/orders
Create a new order (place order).

**Request Body:**
```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "+91 1234567890",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }
}
```

**Response:** Created order object

#### PATCH /api/orders/:id/status (Admin only)
Update order status.

**Request Body:**
```json
{
  "status": "shipped"
}
```

**Response:** Updated order object

#### GET /api/users/:id/orders
Get all orders for a specific user.

---

## Error Responses

All errors should follow this format:

```json
{
  "message": "Error description",
  "statusCode": 400
}
```

Common status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Database Schema Suggestions

### Users
- id (UUID, Primary Key)
- email (String, Unique)
- phone (String, Optional)
- name (String)
- password (String, Hashed)
- role (Enum: 'admin', 'customer')
- createdAt (DateTime)
- updatedAt (DateTime)

### Categories
- id (UUID, Primary Key)
- name (String)
- description (Text, Optional)
- image (String, Optional)
- isActive (Boolean)
- createdAt (DateTime)
- updatedAt (DateTime)

### Products
- id (UUID, Primary Key)
- name (String)
- description (Text)
- price (Decimal)
- originalPrice (Decimal, Optional)
- images (JSON Array)
- categoryId (UUID, Foreign Key)
- stock (Integer)
- isAvailable (Boolean)
- tags (JSON Array, Optional)
- createdAt (DateTime)
- updatedAt (DateTime)

### Orders
- id (UUID, Primary Key)
- userId (UUID, Foreign Key)
- totalAmount (Decimal)
- status (Enum: 'pending', 'processing', 'shipped', 'delivered', 'cancelled')
- paymentStatus (Enum: 'pending', 'completed', 'failed')
- shippingAddress (JSON)
- createdAt (DateTime)
- updatedAt (DateTime)

### OrderItems
- id (UUID, Primary Key)
- orderId (UUID, Foreign Key)
- productId (UUID, Foreign Key)
- quantity (Integer)
- price (Decimal)

---

## Implementation Tips

1. **Use a modern Node.js framework**: Express.js, Fastify, or NestJS
2. **Database**: PostgreSQL, MongoDB, or MySQL
3. **Authentication**: Use bcrypt for password hashing and jsonwebtoken for JWT
4. **Validation**: Use libraries like Joi or Zod for request validation
5. **File Upload**: For product images, use Multer + Cloudinary or AWS S3
6. **CORS**: Enable CORS for your frontend URL
7. **Rate Limiting**: Implement rate limiting to prevent abuse
8. **Logging**: Use Winston or Pino for logging
9. **Error Handling**: Create a centralized error handler

## Quick Start with Express.js

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/orders', ordersRoutes);

// Error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message,
    statusCode: err.statusCode || 500
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```
