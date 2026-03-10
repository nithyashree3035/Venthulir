# 🌿 Venthulir - Full-Stack E-Commerce System Directory

This document provides a comprehensive overview of the features, functions, and UI structure of the Venthulir production-ready website.

## 📂 Project Architecture
The system is divided into three main modules following a scalable production architecture:
*   **`/server`**: Node.js & Express backend with MongoDB integration.
*   **`/client`**: React & Vite frontend for customers.
*   **`/client/admin`**: Dedicated administrative dashboard module.

---

## 🎨 Design System & UI
*   **Theme**: "Royal Organic" — focusing on deep greens (`#0b3d2e`), golds (`#d4af37`), and premium beiges.
*   **Typography**: Inter (Modern sans-serif) - Heavy weights for headlines (800-950) for a premium "bold" look.
*   **Visual Effects**:
    *   **Falling Leaves**: Dynamic SVG animation on the landing page.
    *   **Electric Glow**: Product cards feature a subtle "thunder" pulse for best-sellers.
    *   **Ticker Bar**: Infinite marquee for announcements.
    *   **Glassmorphism**: Subtle usage in overlays and modals.

---

## 🛡️ Backend Features (`/server`)
*   **Database**: MongoDB (Mongoose ODM).
*   **Authentication**:
    *   JWT (JSON Web Tokens) for secure session management.
    *   Bcrypt mapping for secure password hashing.
*   **Endpoints**:
    *   `POST /api/auth/register`: User registration with identity validation.
    *   `POST /api/auth/login`: Identity verification and token issuance.
    *   `POST /api/payment/order`: Razorpay integration placeholder (Ready for Step 3).
*   **Production Serving**: Automatically detects `process.env.NODE_ENV` to serve built frontend files.

---

## 🛒 Client Features (`/client`)
### 1. Header & Navigation
*   **Mobile-First Navbar**: High-performance drawer for mobile users.
*   **Staged Header**: Absolute positioning on Home for hero visibility; sticky on subpages.
*   **Active States**: Visual indicators for current page navigation.

### 2. Product Ecosystem
*   **ShopGrid**: Multi-category filtering system (Oils, Honey, Ghee, Grains, Spices).
*   **Product Cards**: High-res display with specialized badges (Best Seller, Authentic, Organic).
*   **Image Previewer**: Specialized modal for detailed image inspection without leaving the page.
*   **Load More**: Intelligent navigation between Home (Top 4) and Full Catalog.

### 3. Shopping Experience
*   **Cart System (Context API)**:
    *   Persistent storage (Local Storage).
    *   Real-time quantity tracking and count badges.
*   **Wishlist System**:
    *   Visual heart-toggle on cards.
    *   Separate wishlist page for personalized curation.
*   **Notification Engine**: custom-built "Organic Toast" system for user feedback (success/errors).

### 4. Responsiveness
*   **1 Column**: Standard mobile.
*   **2 Columns**: Large phones/Tablets.
*   **4 Columns**: Desktop/Large screens.

---

## 👑 Admin Features (`/client/admin`) [Initialized]
*   **Inventory Management**: Placeholder for CRUD operations on products.
*   **Dashboard**: Placeholder for sales analytics and user management.
*   **Layout**: Dedicated admin layout separate from the customer experience.

---

## 🛠️ Functionality Directory
| Function | Location | Description |
| :--- | :--- | :--- |
| `login(email, pass)` | `AuthContext.jsx` | Communicates with Backend API to authenticate users. |
| `register(name, email, pass)` | `AuthContext.jsx` | Creates new user records in the MongoDB database. |
| `addToCart(product)` | `CartContext.jsx` | Manages persistent shopping cart state. |
| `toggleWishlist(id)` | `WishlistContext.jsx` | Adds/Removes items from persistent wishlist. |
| `scrollToSection(id)` | `Navbar.jsx` | Smooth scrolling and page transition logic. |
| `serveFrontend` | `server/index.js` | Express middleware for production deployment. |

---

## 🚀 Production Notes
*   The system uses **Mobile-First CSS** to ensure 100% SEO and accessibility compliance.
*   Deployment-ready via `npm run build` and `npm start`.
