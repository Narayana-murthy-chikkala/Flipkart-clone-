# Quick Reference Guide

## Project Structure Overview

### Backend Routes Map
```
            /api
           /    \
        /products \
       /  |  \     \
      /   |   \packages
    /:id /category\
   search category-list
   

            /api/cart
           /    |    \
         /GET  POST  PUT
        /      /add  /update
       /
   DELETE /remove/:id
        \
         \clear
```

### Redux State Structure
```javascript
{
  cart: {
    items: [],
    totalPrice: 0,
    cartId: null
  },
  products: {
    products: [],
    filteredProducts: [],
    searchQuery: '',
    selectedCategory: null,
    categories: [],
    loading: false
  }
}
```

## Frontend Components Hierarchy

```
App
├── Navbar
│   ├── Logo
│   ├── SearchBar
│   └── Cart Link
├── Main Routes
│   ├── Home
│   │   ├── SearchBar
│   │   └── ProductCard (grid)
│   ├── ProductDetail
│   │   ├── Carousel
│   │   └── Info Panel
│   ├── Cart
│   │   └── CartItem (list)
│   ├── Checkout
│   │   ├── AddressForm
│   │   └── OrderSummary
│   └── OrderSuccess
│       ├── OrderDetails
│       └── ShippingInfo
└── Footer
```

## API Endpoint Quick Reference

### Products - GET
```bash
# All products
http://localhost:5000/api/products

# Search
http://localhost:5000/api/products?search=iphone

# Filter by category
http://localhost:5000/api/products?category=Electronics

# Combine search + category
http://localhost:5000/api/products?search=phone&category=Electronics

# Get single product
http://localhost:5000/api/products/1

# Get all categories
http://localhost:5000/api/products/category/list
```

### Cart Operations
```bash
# Get cart
curl http://localhost:5000/api/cart?cartId=abc-123

# Add to cart - POST request
Request Body:
{
  "cartId": "abc-123",
  "productId": 1,
  "quantity": 2
}

# Update quantity - PUT request
Request Body:
{
  "cartId": "abc-123",
  "productId": 1,
  "quantity": 5
}

# Remove item - DELETE request
http://localhost:5000/api/cart/remove/1?cartId=abc-123

# Clear cart - DELETE request
http://localhost:5000/api/cart/clear?cartId=abc-123
```

### Order Operations
```bash
# Create order - POST request
Request Body:
{
  "cartId": "abc-123",
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "email": "john@example.com",
  "phone": "9876543210"
}

# Get order details
http://localhost:5000/api/orders/ORD-ABC-12345

# Get all orders
http://localhost:5000/api/orders
```

## Redux Actions Quick Reference

```javascript
// Cart Actions
dispatch(setCartId(cartId))
dispatch(setCartItems({ items, totalPrice }))
dispatch(addItem(item))
dispatch(updateItem({ productId, quantity }))
dispatch(removeItem(productId))
dispatch(clearCart())

// Product Actions
dispatch(setLoading(true/false))
dispatch(setProducts(products))
dispatch(setCategories(categories))
dispatch(setSearchQuery('query'))
dispatch(setSelectedCategory('category'))
dispatch(filterProducts())
dispatch(setError(error))
```

## Service Functions

```javascript
// Product Service
getProducts(search, category)
getProductById(id)
getCategories()

// Cart Service
getCart(cartId)
addToCart(cartId, productId, quantity)
updateCartItem(cartId, productId, quantity)
removeFromCart(cartId, productId)
clearCart(cartId)

// Order Service
createOrder(cartId, shippingAddress, email, phone)
getOrderById(orderId)
```

## Database Queries Examples

```sql
-- Get all products
SELECT * FROM products LIMIT 100;

-- Search products
SELECT * FROM products 
WHERE name LIKE '%iphone%' OR description LIKE '%iphone%';

-- Filter by category
SELECT * FROM products WHERE category = 'Electronics';

-- Get cart with items
SELECT ci.*, p.name, p.price 
FROM cart_items ci
JOIN products p ON ci.product_id = p.id
WHERE ci.cart_id = 'abc-123';

-- Get order with items
SELECT oi.*, p.name 
FROM order_items oi
JOIN products p ON oi.product_id = p.id
WHERE oi.order_id = 'ORD-ABC-12345';

-- Products by price range
SELECT * FROM products 
WHERE price BETWEEN 5000 AND 15000;

-- Top 10 products by stock
SELECT * FROM products 
ORDER BY stock DESC LIMIT 10;
```

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost          # MySQL hostname
DB_PORT=3306              # MySQL port
DB_USER=root              # MySQL username
DB_PASSWORD=password      # MySQL password
DB_NAME=flipkart_ecommerce # Database name
SERVER_PORT=5000          # Backend port
NODE_ENV=development      # Environment
CLIENT_URL=http://localhost:5173  # Frontend URL
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api  # Backend API URL
```

## Common npm Commands

```bash
# Backend
npm install              # Install dependencies
npm run dev             # Start with auto-reload
npm run start           # Start production
npm run seed            # Seed database

# Frontend
npm install             # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview build
```

## File Naming Conventions

```
Components:        PascalCase.jsx      (Navbar.jsx)
Pages:             PascalCase.jsx      (Home.jsx)
Services:          camelCase.js        (productService.js)
Redux:             descriptive.js      (cartSlice.js)
CSS files:         match-component.css (Navbar.css)
Routes:            as components.jsx   (AppRoutes.jsx)
Utils:             descriptive.js      (formatPrice.js)
```

## Useful Debugging Tips

```javascript
// Log Redux state
console.log(useSelector(state => state));

// Check cart items
console.log(useSelector(state => state.cart.items));

// Check API response
apiClient.interceptors.response.use(response => {
  console.log('API Response:', response.data);
  return response;
});

// Check component render
console.log('Component mounted');
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "cartId is null" | Generate new cart before adding items |
| "Product not found" | Verify product ID exists in database |
| "CORS error" | Ensure backend CORS is enabled |
| "Image 404" | External URLs might be blocked, use placeholder |
| "Cart not persisting" | Store cartId in localStorage |
| "Order shows 0 items" | Verify cart_items table before checkout |

## Performance Tips

1. **Frontend**
   - Use React.memo() for static components
   - Lazy load images with onError handler
   - Minimize re-renders with Redux selectors

2. **Backend**
   - Index frequently searched columns
   - Use connection pooling (already configured)
   - Cache category list

3. **Database**
   - Use LIMIT clause on large queries
   - Index created_at for sorting
   - Archive old orders periodically

## Testing Workflow

```
1. Start MySQL
2. Create database
3. Import schema
4. Start backend (npm run dev)
5. Seed database (npm run seed)
6. Start frontend (npm run dev)
7. Open http://localhost:5173
8. Test features in order:
   - Browse products
   - Search/filter
   - View product detail
   - Add to cart
   - View cart
   - Checkout
   - Order success
```

## Deployment Checklist

- [ ] Change NODE_ENV to 'production'
- [ ] Update DB_PASSWORD in .env
- [ ] Set CLIENT_URL to production frontend URL
- [ ] Build frontend (npm run build)
- [ ] Deploy backend to server
- [ ] Deploy frontend to CDN/static host
- [ ] Update VITE_API_URL to production backend URL
- [ ] Test all features in production
- [ ] Set up monitoring/logging
- [ ] Configure SSL certificates

## File Sizes Reference

```
Frontend bundle: ~250KB (minified)
Backend: ~12 files, ~20KB total code
Database: ~1MB (with sample data)
```

## Support & Resources

- Backend errors: Check `server.js` console output
- Frontend errors: Open browser DevTools (F12)
- Database errors: Check MySQL error log
- API debugging: Use tools like Postman or cURL

---

**Quick Reference for developers working on this project. For detailed info, see SETUP_GUIDE.md**
