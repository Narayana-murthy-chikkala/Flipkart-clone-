# Flipkart Clone - E-commerce Platform

A comprehensive, full-stack, responsive e-commerce platform built heavily mirroring the **Flipkart** visual identity and functionality. This project involves a fully-featured Node.js/Express.js backend utilizing MySQL, and a React.js client interface with Redux Toolkit for global state management.

## 🚀 Tech Stack Used

### Frontend
- **React.js** (Vite build setup)
- **Redux Toolkit** (Global state management: cart, auth, products)
- **CSS / Tailwind** (Custom CSS modeling the unique Flipkart theme along with Tailwind utilities)
- **Axios** (Service-based API requests)
- **React Router v6** (Dynamic routing)
- **Lucide React** (Vector icons)

### Backend
- **Node.js & Express.js**
- **MySQL2** (Relational Database)
- **Bcrypt.js** (Password hashing)
- **JWT (JSON Web Tokens)** (Authentication and authorization)
- **Nodemailer** (Sending Ethereal/SMTP email notifications upon order creation)
- **Multer** (For handling form-data and document uploads e.g. PAN cards)

---

## 🛠️ Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/en/) installed on your local machine (v16.0+ recommended)
- [MySQL](https://www.mysql.com/) database server installed and running

### 2. Environment Configurations
In the `server` directory, create a `.env` file (or adjust the existing one) with the following structure:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce
SERVER_PORT=5000
NODE_ENV=development
JWT_SECRET=super_secret_for_flipkart_clone
JWT_EXPIRES_IN=30d
```

### 3. Backend Setup
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. **Database Seeding:** Automatically generate the required MySQL tables and seed it with realistic mock data:
   ```bash
   npm run seed
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *(Server should now be running on `http://localhost:5000`)*

### 4. Frontend Setup
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(The application will be accessible at `http://localhost:5173`)*

---

## 🏗️ Core Features & Functionality
- **Product Listing:** Grid-based product presentation precisely matched with Flipkart's card dimensions, hovering semantics, image fallbacks, and active deal status.
- **Dynamic Search & Filtration:** Built-in category routing logic. 
- **Product Detail View:** Complex state carousel, zoomed perspectives, real-item metadata mappings, and accurate pricing offset logic. 
- **Shopping Cart Mechanics:** Full validation across max purchase bounds (e.g. max 10 per user object limit), dynamic total pricing offsets, delivery thresholds (e.g. Free shipping above ₹500 rule applies organically).
- **Checkout Process & Order Placements:** Complete validation across addresses before finalizing the internal MySQL representation. 
- **Order Success Architecture:** Accurate tracking page visually generating the exact checkmark banner and structured timelines found historically inside the authentic Flipkart post-order view.
- **Global Toast Engine:** Custom-written notification hierarchy avoiding native `alert()` commands.
- **Wishlist Integration:** Persisted MySQL state mapping user IDs into product arrays, synced directly into the user’s personal `Dashboard`.
- **E-Receipt Distribution:** Hooked explicitly into an automated backend `nodemailer` service that dynamically issues order summaries at runtime (Testing credentials automatically set up using `Ethereal.email`).

---

## 💡 Assumptions Made
- **Local Sandbox Execution:** It is assumed this will primarily run on localhost with a direct root access `MySQL` DB (as modeled in `server/config/db.js`). 
- **Image Accessibility:** The local seeder maps to raw `Unsplash.js` strings. Given the fragile nature of third-party public images, robust `onError` boundary rules trigger strict generic fallback proxies instantly mapping out broken thumbnails organically.
- **Authentication Bypass on Guest Additions:** The platform assumes users can securely build arrays of cart items offline utilizing local Redux stores implicitly merging into standard Auth headers once `[Authorize / Check Out]` thresholds trigger successfully matching standard SaaS approaches.
- **Email Dispatching:** It is assumed you are tracking test emails utilizing the dynamically printed Preview URL in the backend console (via `Ethereal.email`) as standard deployment keys (`EMAIL_HOST`/`EMAIL_PASS`) are left generically blank allowing Node.js to spin up mock environments.
