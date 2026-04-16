# 🛒 Flipkart Clone - Full-Stack E-commerce Platform

[![Vercel Deployment](https://img.shields.io/badge/Frontend-Vercel-black?style=flat-square&logo=vercel)](https://flipkart-clone-sigma-six.vercel.app)
[![Render Deployment](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render)](https://flipkart-clone-0mut.onrender.com)
[![Railway Database](https://img.shields.io/badge/Database-Railway-0B0D0E?style=flat-square&logo=railway)](https://railway.app)

A pixel-perfect, high-performance Flipkart clone built with the modern MERN (MySQL, Express, React, Node) architecture. This application replicates the authentic user experience of India's leading e-commerce giant, focusing on visual fidelity and robust functional logic.

---

## ⚠️ Important Database Notice

> [!IMPORTANT]
> The remote **MySQL Database** is currently hosted on **Railway**. 
> - **Trial Status:** The current instance is part of a **30-day trial period**.
> - **Availability:** After the 30-day window, the database will transition to a **paid tier**. If not upgraded, the database instance will be suspended, and the app will require a new database connection.
> - **Action:** For long-term availability, consider migrating to a permanent hosting solution or upgrading the Railway plan.

---

## 📁 Project Structure

```text
flipkart_clone/
├── client/                          # React + Vite Frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components (Navbar, Footer, etc.)
│   │   ├── pages/                   # Application pages (Home, ProductDetail, Cart)
│   │   ├── redux/                   # Redux Toolkit state management
│   │   ├── routes/                  # React Router configuration
│   │   ├── services/                # Axios API services
│   │   ├── utils/                   # Helper functions
│   │   ├── App.jsx                  # Main application entry
│   │   └── main.jsx                 # Vite entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Express.js Backend
│   ├── src/
│   │   ├── config/                  # Database connection (Sequelize/MySQL2)
│   │   ├── controllers/             # Business logic for Auth, Products, Orders
│   │   ├── middleware/              # Auth guards & error handlers
│   │   ├── models/                  # MySQL schema definitions
│   │   ├── routes/                  # Express API route definitions
│   │   ├── utils/                   # Utilities (Token, Mailer)
│   │   └── seed/                    # Database seeder scripts
│   ├── app.js                       # Express app configuration
│   ├── server.js                    # Server entry point
│   └── package.json
│
└── README.md
```

---

## ✨ Features

### 🏠 Homepage
- **Hero Banner Carousel** — Auto-rotating promotional banners.
- **Category Navigation Bar** — Top-level category strip (Mobiles, Electronics, Fashion, etc.).
- **Deals of the Day** — Countdown timer with discounted products.
- **Featured Products** — Curated product carousels.
- **Multi-section Layout** — Matches Flipkart's real homepage structure.

### 🔍 Product Browsing & Search
- **Global Search Bar** — Search by product name, brand, or category.
- **Product Listing Page** — Grid view with detailed product cards.
- **Advanced Filters** — Filter by Price range, Brand, Rating, and Category.
- **Sorting Options** — Price low-to-high, high-to-low, and rating.

### 📦 Product Detail Page
- **Image Carousel** — Main image with interactive thumbnail strip.
- **Stock Availability** — Real-time stock display with urgency messaging.
- **Price Display** — MRP with strikethrough, selling price, and discount percentage.
- **Specifications Table** — Key-value specification table from product data.
- **Similar Products** — Related items from the same category.
- **Add to Cart / Buy Now** — Sticky action buttons for quick conversion.

### 🛒 Shopping Cart
- **Cart Item List** — Product details with quantity management.
- **Dynamic Pricing** — Real-time updates for totals, discounts, and delivery charges.
- **Savings Display** — Highlights total amount saved on the order.

### 💳 Checkout
- **Step Indicator** — Login → Delivery Address → Payment selection.
- **Inline Address Form** — Add or select shipping addresses directly on the checkout page.
- **Saved Address Selection** — Quick toggle between previously used addresses.
- **Place Order Button** — Single-click secure order placement.

### 📧 Email Notifications
- **Order Confirmation Email** — Automated HTML email sent via **Nodemailer**.
- **Responsive Template** — Mobile-friendly design with branding and order summaries.

### 👤 User Account
- **Profile Management** — View and edit personal information.
- **Address Book** — Full CRUD (Create, Read, Update, Delete) for shipping addresses.
- **My Orders** — Track past purchases and current order status.

---

## 🎨 UI/UX Design
- **Pixel-Perfect Flipkart UI** — Matches actual design language (colors: #2874f0, #fb641b).
- **Responsive Design** — Fully adaptive across desktop, tablet, and mobile.
- **Loading States** — Smooth transitions and loading indicators.
- **Sticky Elements** — Consistent accessibility via sticky headers and action bars.

---

## 🚀 Setup Instructions

### Prerequisites
| Requirement | Version |
| :--- | :--- |
| **Node.js** | 18.x or higher |
| **MySQL** | 8.x |
| **npm** | 9.x or higher |
| **Git** | Latest |

### Step 1: Clone the Repository
```bash
git clone https://github.com/Narayana-murthy-chikkala/Flipkart-clone-.git
cd Flipkart-clone-
```

### Step 2: Setup the Backend
```bash
cd server
npm install
```
Create a `.env` file in the `server/` directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecommerce
DB_USER=root
DB_PASSWORD="your_password"

# JWT Secret
JWT_SECRET=your_secret_key

# Email Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS="your_app_password"
```
Initialize and seed the database:
```bash
npm run seed
npm run dev
# Server runs on http://localhost:5000
```

### Step 3: Setup the Frontend
```bash
cd ../client
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## 🗄️ Database Design
- **Relational Modeling** — Normalised schema with Users, Products, Orders, and Addresses.
- **100+ Seeded Products** — Pre-populated data across multiple categories with real images.
- **Category Tree** — Multi-level hierarchy (Category → Subcategory).

---

## 🔌 API Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/login` | User login & JWT generation |
| **GET** | `/api/products` | Filtered & paginated product list |
| **GET** | `/api/cart` | Fetch user's shopping cart |
| **POST** | `/api/orders` | Place a new order |
| **DELETE** | `/api/account/addresses/:id` | Remove a shipping address |

---

## 📌 Assumptions & Design Decisions
- **REST API** — Chose REST architecture for simplicity and scalability.
- **JWT Authentication** — Stateless token-based security for user sessions.
- **MySQL Integrity** — Used relational constraints to ensure data consistency.
- **Image Handling** — Utilizes Unsplash CDN for reliable demo product visuals.

---

## 👨‍💻 Author
**Narayana Murthy** — GitHub: [@Narayana-murthy-chikkala](https://github.com/Narayana-murthy-chikkala)

---

## 📄 License
This project is built for educational purposes. It is not affiliated with or endorsed by Flipkart.
