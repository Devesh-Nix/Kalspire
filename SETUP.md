# Kalspire Setup Guide

## Project Overview
Kalspire is a single-brand e-commerce marketplace built with React + TypeScript frontend and Node.js + Express backend.

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Installation

### 1. Frontend Setup
```bash
cd kalspire
npm install
```

### 2. Backend Setup
```bash
cd kalspire-backend
npm install
```

## Configuration

### Backend Environment Variables
Create `.env` file in `kalspire-backend/` with:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/kalspire
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=30d
```

**Important:** Update `MONGODB_URI` with your MongoDB connection string:
- Local: `mongodb://localhost:27017/kalspire`
- Atlas: `mongodb+srv://<username>:<password>@cluster.mongodb.net/kalspire`

### Frontend Environment Variables
Create `.env` file in `kalspire/` with:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Running the Application

### 1. Start MongoDB (if using local installation)
```bash
# Windows (if MongoDB installed as service)
net start MongoDB

# Or run mongod directly
mongod --dbpath C:\data\db
```

### 2. Seed Database (First Time Only)
```bash
cd kalspire-backend
npm run seed
```

This creates:
- Admin user: `admin@kalspire.com` / `admin123`
- Customer user: `john@example.com` / `password123`
- 4 product categories
- 8 sample products

### 3. Start Backend Server
```bash
cd kalspire-backend
npm run dev
```
Backend runs on: http://localhost:3000

### 4. Start Frontend Development Server
```bash
cd kalspire
npm run dev
```
Frontend runs on: http://localhost:5173

## Testing the Application

1. **Customer Flow:**
   - Register new account at http://localhost:5173/register
   - Browse products
   - Add items to cart
   - Complete checkout

2. **Admin Flow:**
   - Login with admin@kalspire.com / admin123
   - Access admin panel at http://localhost:5173/admin
   - Manage products, categories, and orders

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user
- POST `/api/auth/logout` - Logout user

### Products
- GET `/api/products` - Get all products (supports filtering)
- GET `/api/products/:id` - Get single product
- POST `/api/products` - Create product (Admin only)
- PUT `/api/products/:id` - Update product (Admin only)
- DELETE `/api/products/:id` - Delete product (Admin only)
- PUT `/api/products/:id/stock` - Update stock (Admin only)

### Categories
- GET `/api/categories` - Get all categories
- GET `/api/categories/:id` - Get single category
- POST `/api/categories` - Create category (Admin only)
- PUT `/api/categories/:id` - Update category (Admin only)
- DELETE `/api/categories/:id` - Delete category (Admin only)
- PUT `/api/categories/:id/toggle` - Toggle active status (Admin only)

### Orders
- GET `/api/orders` - Get orders (Admin: all, User: own orders)
- GET `/api/orders/:id` - Get single order
- POST `/api/orders` - Create order
- PUT `/api/orders/:id/status` - Update order status (Admin only)
- GET `/api/orders/user/:userId` - Get user's orders

## Troubleshooting

### MongoDB Connection Issues
1. **Check if MongoDB is running:**
   ```bash
   # Windows
   net start MongoDB
   ```

2. **Verify connection string in `.env`**

3. **Use MongoDB Atlas (cloud):**
   - Create free account at https://www.mongodb.com/cloud/atlas
   - Create cluster and get connection string
   - Update `MONGODB_URI` in `.env`

### CORS Issues
- Ensure backend CORS allows frontend origin (http://localhost:5173)
- Check `server.js` CORS configuration

### Port Already in Use
```bash
# Backend (port 3000)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Frontend (port 5173)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

## Tech Stack

### Frontend
- React 19.2.0
- TypeScript 5.9.3
- Vite 7.2.4
- Tailwind CSS
- React Router v6
- Zustand (state management)
- TanStack Query
- React Hook Form + Zod
- Axios

### Backend
- Node.js
- Express 5.1.0
- MongoDB + Mongoose 9.0.0
- JWT Authentication
- bcryptjs
- express-validator

## Project Structure

```
kalspire/                 # Frontend
├── src/
│   ├── api/             # API client & endpoints
│   ├── assets/          # Static assets
│   ├── components/      # UI components
│   ├── lib/             # Utilities
│   ├── pages/           # Route pages
│   ├── store/           # Zustand stores
│   └── types/           # TypeScript types
├── .env                 # Frontend env vars
└── vite.config.ts

kalspire-backend/        # Backend
├── config/              # Database config
├── controllers/         # Route controllers
├── middleware/          # Auth & error middleware
├── models/              # Mongoose models
├── routes/              # API routes
├── utils/               # Helper functions
├── .env                 # Backend env vars
├── seed.js              # Database seeder
└── server.js            # Express app
```

## Next Steps

1. Customize branding and colors in `tailwind.config.js`
2. Add product images (currently uses Unsplash placeholders)
3. Implement payment gateway integration
4. Add email notifications for orders
5. Deploy to production (Vercel for frontend, Railway/Render for backend)
