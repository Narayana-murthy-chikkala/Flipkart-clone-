# Flipkart-Like E-Commerce Application Setup Guide

## Project Overview

Complete full-stack e-commerce application with React + Node.js backend, featuring:
- Product catalog with search and filtering
- Shopping cart with quantity management
- Checkout with address form
- Order management
- Responsive Flipkart-style UI

---

## Prerequisites

Before starting, ensure you have installed:

1. **Node.js** (v14 or higher): https://nodejs.org/
2. **MySQL Server** (v5.7 or higher): https://dev.mysql.com/downloads/mysql/
3. **Git**: https://git-scm.com/

Verify installation:
```bash
node --version
npm --version
mysql --version
```

---

## PROJECT STRUCTURE

```
scaler-ai/
├── server/                 # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js          # Database configuration
│   ├── controllers/        # Request handlers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── seed/              # Database seeding
│   ├── app.js             # Express app setup
│   ├── server.js          # Server entry point
│   ├── package.json
│   ├── .env
│   └── .gitignore
│
├── client/                # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service calls
│   │   ├── redux/         # Redux store setup
│   │   ├── routes/        # Route configuration
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env
│   └── .gitignore
│
├── DATABASE_SCHEMA.sql    # SQL schema file
└── SETUP_GUIDE.md        # This file
```

---

## STEP 1: DATABASE SETUP

### 1.1 Create Database

Open MySQL Command Line or MySQL Workbench and run:

```sql
CREATE DATABASE flipkart_ecommerce;
USE flipkart_ecommerce;
```

### 1.2 Import Schema

Import the provided schema file:

**Option A: Command Line**
```bash
mysql -u root -p flipkart_ecommerce < DATABASE_SCHEMA.sql
```

**Option B: MySQL Workbench**
- Open MySQL Workbench
- Go to File → Open SQL Script
- Select `DATABASE_SCHEMA.sql`
- Click Execute (⚡ icon)

**Option C: Manual**
- Copy contents of `DATABASE_SCHEMA.sql`
- Paste in MySQL Command Line or Workbench
- Execute

---

## STEP 2: BACKEND SETUP

### 2.1 Navigate to Server Directory

```bash
cd server
```

### 2.2 Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web framework
- `mysql2` - MySQL driver
- `dotenv` - Environment variables
- `cors` - Cross-origin resource sharing
- `uuid` - Unique ID generation
- `nodemon` - Development auto-reload

### 2.3 Configure Environment Variables

Edit the `.env` file in the `server` folder:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=flipkart_ecommerce
SERVER_PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Important**: Replace `your_mysql_password` with your actual MySQL password

### 2.4 Seed Database with Sample Data

```bash
npm run seed
```

This populates the database with 12 sample products.

### 2.5 Start Backend Server

```bash
npm run dev
```

Expected output:
```
✅ Database connected successfully
🚀 Server running on http://localhost:5000
📝 Environment: development
```

**Keep this terminal open** for the backend to keep running.

---

## STEP 3: FRONTEND SETUP

### 3.1 Open New Terminal Window

Open a new terminal/command prompt (keep the backend terminal open)

### 3.2 Navigate to Client Directory

```bash
cd client
```

### 3.3 Install Dependencies

```bash
npm install
```

This installs:
- `react` - UI library
- `react-router-dom` - Client-side routing
- `@reduxjs/toolkit` - State management
- `react-redux` - Redux integration
- `axios` - HTTP client
- `vite` - Build tool

### 3.4 Configure Environment Variables (Optional)

The `.env` file is already configured:

```env
VITE_API_URL=http://localhost:5000/api
```

If your backend runs on a different port, update this.

### 3.5 Start Frontend Development Server

```bash
npm run dev
```

Expected output:
```
VITE v5.0.0  ready in 1234 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

The application automatically opens at `http://localhost:5173/`

---

## STEP 4: TESTING THE APPLICATION

### 4.1 Verify Both Servers Running

- **Backend**: http://localhost:5000/api/health (should show `{"success":true,"message":"Server is running"}`)
- **Frontend**: http://localhost:5173/ (should load the application)

### 4.2 Test Workflow

1. **Home Page**
   - View all products
   - Products are displayed in a grid
   - Search bar is visible

2. **Search & Filter**
   - Use search bar to search products
   - Click categories to filter
   - Products update dynamically

3. **Product Detail**
   - Click on any product card
   - View product details, images, price
   - Quantity selector works
   - Add to Cart / Buy Now buttons available

4. **Add to Cart**
   - Click "Add to Cart"
   - Success message appears
   - Cart icon shows count

5. **View Cart**
   - Click cart icon in navbar
   - View all cart items
   - Update quantities
   - Remove items
   - See order summary

6. **Checkout**
   - Click "Proceed to Checkout"
   - Fill in shipping address form
   - Click "Place Order"

7. **Order Success**
   - Order ID, date, and items displayed
   - Shipping address shown
   - "Continue Shopping" button navigates back

---

## API ENDPOINTS

### Products
- `GET /api/products` - Get all products
- `GET /api/products?search=phone` - Search products
- `GET /api/products?category=Electronics` - Filter by category
- `GET /api/products/:id` - Get product details
- `GET /api/products/category/list` - Get all categories

### Cart
- `GET /api/cart?cartId=xxx` - Get cart items
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update item quantity
- `DELETE /api/cart/remove/:productId?cartId=xxx` - Remove item
- `DELETE /api/cart/clear?cartId=xxx` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `GET /api/orders` - Get all orders (admin)

---

## TROUBLESHOOTING

### Issue: "Cannot connect to database"
**Solution:**
- Verify MySQL is running
- Check credentials in `.env` file
- Ensure database `flipkart_ecommerce` exists
- Verify schema was imported correctly

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Change SERVER_PORT in server/.env to 5001
# Or kill process using port 5000
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

### Issue: "Frontend cannot reach backend"
**Solution:**
- Verify both servers are running
- Check `VITE_API_URL` in client/.env
- Ensure backend is on `http://localhost:5000`

### Issue: "Images not loading"
**Solution:**  
- Sample product images use external URLs
- If URLs are blocked, they show placeholder images
- No action needed, app still functions

### Issue: npm command not found
**Solution:**
- Install Node.js from https://nodejs.org/
- Restart terminal/command prompt after installation

---

## BUILDING FOR PRODUCTION

### Frontend Build
```bash
cd client
npm run build
```

Creates optimized build in `client/dist/` folder.

### Backend Deployment
1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "flipkart-api"
   pm2 save
   ```

---

## DATABASE TABLES EXPLANATION

| Table | Purpose |
|-------|---------|
| `products` | Stores all products with name, price, stock, images |
| `carts` | Temporary shopping carts |
| `cart_items` | Items in each cart |
| `orders` | Completed orders |
| `order_items` | Items in each order |
| `addresses` | Shipping addresses (optional) |

---

## KEY FEATURES IMPLEMENTED

✅ Product listing with grid layout
✅ Search functionality
✅ Category filtering
✅ Product detail page with image carousel
✅ Shopping cart with quantity management
✅ Checkout with shipping form
✅ Order success page
✅ Redux state management
✅ Responsive design (mobile + desktop)
✅ Flipkart-style UI with blue navbar
✅ Error handling
✅ Professional code structure

---

## COMMONLY USED COMMANDS

```bash
# Backend
npm run dev      # Start development server with auto-reload
npm run start    # Start production server
npm run seed     # Seed database with sample data

# Frontend  
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## ENVIRONMENT SETUP SUMMARY

| Component | Local URL | Requirements |
|-----------|-----------|--------------|
| Backend | http://localhost:5000 | Node.js, MySQL |
| Frontend | http://localhost:5173 | Node.js, npm |
| Database | localhost:3306 | MySQL Server |

---

## NEXT STEPS FOR ENHANCEMENT

1. **Authentication**: Add user login/signup
2. **Payment Gateway**: Integrate Razorpay/Stripe
3. **Admin Panel**: Manage products and orders
4. **Reviews & Ratings**: Add product reviews
5. **Wishlist**: Save favorite products
6. **Order Tracking**: Track delivery status
7. **Email Notifications**: Send order confirmations
8. **Analytics**: Track sales data

---

## SUPPORT & DEBUGGING

For detailed server logs, check the backend terminal.
For frontend console errors, open browser DevTools (F12).

---

## License

This is a learning/demo project. Feel free to use and modify.

**Happy Coding! 🚀**
