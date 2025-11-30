# Kalspire Marketplace

A modern, full-featured e-commerce marketplace built with React, TypeScript, and Tailwind CSS. Kalspire is a single-brand marketplace where customers can browse products, add them to cart, and place orders, while administrators can manage products, categories, and inventory through a powerful admin panel.

## 🚀 Features

### Customer Features
- **Product Catalog**: Browse all products with category filtering and search
- **Product Details**: View detailed product information with images
- **Shopping Cart**: Add/remove items, adjust quantities, view total
- **Checkout**: Place orders with shipping address
- **Wishlist**: Save favorite products for later
- **User Authentication**: Register and login with email/phone and password
- **Order History**: View past orders and their status

### Admin Features
- **Dashboard**: Overview of products, orders, and store statistics
- **Product Management**: Create, update, delete products, manage stock levels
- **Category Management**: Create, update, delete, and toggle category availability
- **Order Management**: View and update order status
- **Inventory Control**: Track stock levels and low-stock alerts

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite 7** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management
- **React Hook Form** - Performant form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications

## 📁 Project Structure

```
kalspire/
├── src/
│   ├── api/            # API client and endpoints
│   ├── components/
│   │   ├── layout/     # Layout components
│   │   └── ui/         # Reusable UI components
│   ├── config/         # Configuration files
│   ├── lib/            # Utility functions
│   ├── pages/          # Page components
│   │   ├── admin/      # Admin panel pages
│   │   └── ...         # Customer pages
│   ├── routes/         # Route protection
│   ├── store/          # Zustand stores
│   ├── types/          # TypeScript types
│   └── App.tsx         # Main app with routing
├── .env                # Environment variables
└── package.json
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment variables**
   Update `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Building for Production

```bash
npm run build
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication

JWT-based authentication with two user roles:
- **Customer**: Browse products, manage cart, place orders
- **Admin**: Full admin panel access

### Routes
- `/` - Home page (public)
- `/products` - Product listing (public)
- `/cart` - Shopping cart (protected)
- `/checkout` - Checkout (protected)
- `/login` - Login page
- `/register` - Registration
- `/admin` - Admin dashboard (admin only)
- `/admin/products` - Product management (admin only)
- `/admin/categories` - Category management (admin only)

## 🌐 API Integration

Configure backend URL in `.env`. Expected endpoints:

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/products
POST   /api/products (admin)
GET    /api/categories
POST   /api/categories (admin)
GET    /api/orders
POST   /api/orders
```

## 🚧 Next Steps

- [ ] Implement backend API
- [ ] Add product detail page
- [ ] Integrate payment gateway
- [ ] Add product reviews
- [ ] Implement image upload
- [ ] Add order tracking
- [ ] Performance optimization
- [ ] Unit tests
- [ ] Deployment setup

## 📄 License

MIT License

---

**Note**: This is a frontend application. You'll need to implement a backend API for full functionality.
