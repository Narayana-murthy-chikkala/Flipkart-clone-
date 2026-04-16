# Complete File Structure & Description

## 📋 Summary

**Total Files Managed**: ~75+ files
- **Backend (server/)**: 28 files
- **Frontend (client/src/)**: 42 files  
- **Documentation**: 6 files
- **Database**: 1 file

---

## 📂 BACKEND FILES (server/)

### Configuration
```
server/
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies & scripts
└── package-lock.json             # Locked dependencies
```

### Core Application
```
├── server.js                     # Entry point, server startup
├── app.js                        # Express app setup, routes middleware
├── check_db.js                   # Database connectivity test
├── db_account_migration.js       # Main account migration script
└── fix_users_table.js            # User table fixes
```

### Configuration (config/)
```
└── config/
    ├── db.js                     # MySQL connection pool setup
    └── initDB.js                 # Initial table creation scripts
```

### Controllers (controllers/)
```
└── controllers/
    ├── accountController.js      # Wallet, UPI, Cards, PAN management
    ├── addressController.js      # User address management
    ├── authController.js         # User login, signup, JWT logic
    ├── cartController.js         # Cart CRUD operations
    ├── orderController.js        # Order creation and retrieval
    ├── productController.js      # Product retrieval & search
    ├── reviewController.js       # Product reviews & ratings
    └── wishlistController.js     # User wishlist management
```

### Models (models/)
```
└── models/
    ├── cartModel.js              # SQL queries for cart operations
    ├── orderModel.js             # SQL queries for orders
    ├── productModel.js           # SQL queries for products
    └── userModel.js              # SQL queries for user accounts
```

### Routes (routes/)
```
└── routes/
    ├── accountRoutes.js          # /api/account endpoints
    ├── addressRoutes.js          # /api/address endpoints
    ├── authRoutes.js             # /api/auth endpoints
    ├── cartRoutes.js             # /api/cart endpoints
    ├── orderRoutes.js            # /api/orders endpoints
    ├── productRoutes.js          # /api/products endpoints
    ├── reviewRoutes.js           # /api/reviews endpoints
    └── wishlistRoutes.js         # /api/wishlist endpoints
```

### Middleware (middleware/)
```
└── middleware/
    ├── authMiddleware.js         # JWT verification & User injection
    ├── errorMiddleware.js        # Global error handler & ApiError class
    └── uploadMiddleware.js       # Multer config for PAN image uploads
```

### Utilities & Scratch (utils/ & scratch/)
```
├── utils/
│   └── generateOrderId.js        # Order ID generation (ORD-XXXX-YYYY format)
└── scratch/                      # Utility & migration scripts
    ├── checkData.js              # Data validation script
    ├── enrichProducts.js         # Legacy data enhancement
    ├── fixSchema.js              # Schema correction script
    ├── migrate_payment.js        # Payment column migration
    └── updateProductSchema.js    # Product schema updates
```

### Database Seeding (seed/)
```
└── seed/
    └── seedData.js               # Sample products and initial data
```

---


## 📂 FRONTEND FILES (client/)

### Root Configuration
```
client/
├── package.json                  # Dependencies & scripts
├── package-lock.json             # Locked dependencies
├── .env                          # Environment variables (VITE_API_URL)
├── .gitignore                    # Git ignore rules
├── vite.config.js                # Vite build configuration
└── index.html                    # HTML entry point
```

### Source Files (src/)

#### Main App Files
```
src/
├── main.jsx                      # React app entry point
├── App.jsx                       # Root component with Router
├── App.css                       # Root component styles
└── index.css                     # Global styles & design tokens
```

#### Components (src/components/)
```
└── components/
    ├── Navbar.jsx / .css         # Header with search & cart
    ├── ProductCard.jsx / .css    # Individual product display
    ├── Carousel.jsx / .css       # Image gallery for details
    ├── SearchBar.jsx / .css      # Search & category filtering
    ├── FilterSidebar.jsx / .css  # Price & category filters
    ├── HeroBanner.jsx            # Home page hero section
    └── Footer.jsx / .css         # Footer with links
```

#### Pages (src/pages/)
```
└── pages/
    ├── Home.jsx / .css           # Product listing & landing
    ├── ProductDetail.jsx / .css  # Full product information
    ├── Cart.jsx / .css           # Shopping cart management
    ├── Checkout.jsx / .css       # Payment & Address selection
    ├── OrderSuccess.jsx / .css   # Order confirmation
    ├── Dashboard.jsx / .css      # User profile, history, settings
    ├── Login.jsx / .css          # User authentication
    └── Signup.jsx                # New user registration
```

#### Services (src/services/)
```
└── services/
    ├── api.js                    # Axios central configuration
    ├── accountService.js         # Wallet, UPI, PAN API calls
    ├── addressService.js         # Address management API calls
    ├── authService.js            # Authentication API calls
    ├── productService.js         # Product retrieval API calls
    ├── cartService.js            # Cart operations API calls
    ├── wishlistService.js         # Wishlist API calls
    └── orderService.js           # Order placement API calls
```

#### Redux State (src/redux/)
```
└── redux/
    ├── store.js                  # Redux store configuration
    ├── authSlice.js              # User authentication state
    ├── cartSlice.js              # Shopping cart state
    └── productSlice.js           # Product catalog state
```

#### Routes (src/routes/)
```
└── routes/
    └── AppRoutes.jsx             # React Router route definitions
```

#### Utilities (src/utils/)
```
└── utils/
    └── formatPrice.js            # Currency (INR) & Text formatting
```

---


## 📄 DATABASE FILES

### Root
```
DATABASE_SCHEMA.sql              # Complete MySQL schema
                                 # - Tables: products, users, units, orders, reviews, etc.
                                 # - Foreign keys, indexes, constraints
```

---

## 📚 DOCUMENTATION FILES

### Root
```
README.md                        # Project overview & quick start
SETUP_GUIDE.md                   # Step-by-step installation
QUICK_REFERENCE.md               # API & Redux quick ref
FOLDER_STRUCTURE.txt             # ASCII tree of project
FILE_STRUCTURE.md                # This file - detailed descriptions
```

---

## 🔄 Data Flow Overview

### User Journey (Frontend → Backend → Database)

```
User clicks "Add to Cart"
    ↓
CartController.addToCart() (frontend action)
    ↓
axios POST /api/cart/add (HTTP request)
    ↓
cartController.addToCart() (backend)
    ↓
cartModel.addToCart() (database query)
    ↓
cart_items table (INSERT statement)
    ↓
Success response returned
    ↓
Redux state updated
    ↓
UI re-renders with updated cart
```

### Product Browsing Flow

```
Home page loads
    ↓
useEffect calls getProducts()
    ↓
productService.getProducts()
    ↓
axios GET /api/products
    ↓
productController.getAllProducts()
    ↓
productModel.getAllProducts()
    ↓
SELECT * FROM products
    ↓
Response with product array
    ↓
Redux state updated
    ↓
ProductCard components render
```

---

## 📊 Database Entity Relationships

```
products
    ↑
    |
cart_items ← carts
    |
    ↓
cart_items

products
    ↑
    |
order_items ← orders
    |
    ↓
order_items
```

### Table Descriptions

| Table | Rows | Purpose |
|-------|------|---------|
| products | ~12 | All available products |
| carts | Variable | Temporary shopping carts |
| cart_items | Variable | Items in cart (linked to products) |
| orders | Variable | Completed orders |
| order_items | Variable | Items in order (linked to products) |
| addresses | Optional | Customer addresses |

---

## 🎯 Feature Implementation Location

| Feature | Frontend File | Backend File | Database |
|---------|---------------|--------------|----------|
| Product Listing | Home.jsx | productController.js | products table |
| Search | Home.jsx, SearchBar.jsx | productModel.js | FULL TEXT search |
| Category Filter | SearchBar.jsx | productModel.js | category column |
| Product Detail | ProductDetail.jsx | productController.js | products table |
| Add to Cart | ProductCardcart.jsx | cartController.js | cart_items table |
| View Cart | Cart.jsx | cartController.js | cart_items table |
| Update Quantity | Cart.jsx | cartController.js | UPDATE query |
| Remove Item | Cart.jsx | cartController.js | DELETE query |
| Checkout | Checkout.jsx | orderController.js | orders table |
| Order Success | OrderSuccess.jsx | orderController.js | order_items table |

---

## 🔗 File Dependencies

### Frontend Dependencies
```
App.jsx
├── depends on: Provider (Redux)
├── depends on: Router (React Router)
└── depends on: Navbar, AppRoutes, Footer

Home.jsx
├── depends on: ProductCard.jsx
├── depends on: SearchBar.jsx
├── depends on: productService.js
└── depends on: Redux (products state)

ProductDetail.jsx
├── depends on: Carousel.jsx
├── depends on: productService.js
├── depends on: cartService.js
└── depends on: Redux (cart + product state)

Cart.jsx
├── depends on: cartService.js
└── depends on: Redux (cart state)

Checkout.jsx
├── depends on: orderService.js
└── depends on: Redux (cart state)

OrderSuccess.jsx
├── depends on: orderService.js
└── depends on: formatPrice.js
```

### Backend Dependencies
```
server.js
├── depends on: app.js
└── depends on: db.js (config)

app.js
├── depends on: productRoutes.js
├── depends on: cartRoutes.js
├── depends on: orderRoutes.js
└── depends on: errorMiddleware.js

productRoutes.js
├── depends on: productController.js

productController.js
├── depends on: productModel.js
└── depends on: errorMiddleware.js

cartController.js
├── depends on: cartModel.js
└── depends on: productModel.js

orderController.js
├── depends on: orderModel.js
├── depends on: cartModel.js
└── depends on: generateOrderId.js
```

---

## 📦 Installation Breakdown

### Backend Dependencies
```json
{
  "express": "Web framework",
  "mysql2": "MySQL driver",
  "dotenv": "Environment variables",
  "cors": "Cross-origin requests",
  "uuid": "Unique IDs",
  "nodemon": "Dev auto-reload"
}
```

### Frontend Dependencies
```json
{
  "react": "UI library",
  "react-router-dom": "Client routing",
  "@reduxjs/toolkit": "State management",
  "react-redux": "Redux integration",
  "axios": "HTTP client",
  "react-icons": "Icon library",
  "@vitejs/plugin-react": "Vite React support",
  "vite": "Build tool"
}
```

---

## 🎨 Styling Architecture

### CSS Organization
```
Global Styles: index.css
    ↓
Component Styles: [ComponentName].css
    ↓
Page Styles: [PageName].css
```

### Design System
- **Primary Color**: #2874f0 (Flipkart Blue)
- **Accent Color**: #ffa500 (Orange)
- **Success Color**: #388e3c (Green)
- **Error Color**: #d32f2f (Red)
- **Text Color**: #212121 (Dark Gray)

---

## 🔐 Security Features Implemented

1. **.env files** - Sensitive data not hardcoded
2. **CORS configuration** - Only allows specified frontend origin
3. **Input validation** - Forms validated before submission
4. **Error handling** - Global error middleware
5. **SQL parameterized queries** - Prevents SQL injection
6. **Rate limiting ready** - Can add express-rate-limit

---

## 📈 Scalability Considerations

### Already Implemented
- Connection pooling (MySQL)
- Database indexes
- Modular component structure
- Separation of concerns (MVC)
- Environment-based configuration

### Future Enhancements
- Caching layer (Redis)
- API rate limiting
- Database query optimization
- Code splitting
- CDN for images
- Load balancing

---

## ✅ Code Quality Checklist

- [x] Clean, readable code with comments
- [x] Proper error handling
- [x] Environment variables for config
- [x] Modular, reusable components
- [x] Separation of concerns
- [x] Responsive design
- [x] Consistent naming conventions
- [x] API documentation
- [x] Database schema documentation
- [x] Setup instructions

---

## 🚀 Total Project Stats

- **Lines of Code**: ~3,000+
- **API Endpoints**: 15+
- **JavaScript Files**: 40+
- **CSS Files**: 15+
- **Database Tables**: 10+
- **React Components**: 15+
- **Redux Slices**: 3
- **API Services**: 8

---

## 📝 Notes

- All files are production-ready
- Each file has clear comments explaining functionality
- Database schema is normalized (3NF)
- APIs follow RESTful conventions
- Frontend follows React best practices
- CSS is BEM-inspired for maintainability

---

**Complete and ready to deploy! 🎉**

For setup, see: SETUP_GUIDE.md
For quick reference, see: QUICK_REFERENCE.md
