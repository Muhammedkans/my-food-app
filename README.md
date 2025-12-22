# 🚀 FoodBey - Premium Food Delivery Platform

<div align="center">

  ![FoodBey Banner](https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=2000)
  
  **A production-grade, full-stack food delivery ecosystem built with the MERN Stack.**
  
  [Features](#-key-features) • [Tech Stack](#-technology-stack) • [API Reference](#-api-endpoints) • [Screenshots](#-screenshots) • [Roadmap](#-future-roadmap)

</div>

---

## 📖 Overview

**FoodBey** is a high-performance food delivery application engineered for scale. Inspired by industry giants like Swiggy and Zomato, it delivers a seamless experience across three distinct user roles: **Customer**, **Restaurant Partner**, and **Delivery Agent**.

The platform features a sleek neon-themed UI, real-time order tracking via WebSocket, AI-powered recommendations, and secure payment processing, making it a complete solution for modern food delivery needs.

---

## 🌟 Key Features

### 👤 Customer App
- **Interactive Discovery:** Browse restaurants with smart filtering, search, and high-quality imagery.
- **Smart Cart & Checkout:** Real-time billing, surge pricing logic, and seamless Razorpay integration.
- **Live Order Tracking:** Real-time status updates (Preparing -> Out for Delivery) powered by Socket.IO.
- **AI Concierge:** Integrated AI Chat Support for instant recommendations and support.

### 🍱 Restaurant Partner Portal
- **Business Dashboard:** Visual analytics for daily sales, order volume, and customer ratings.
- **Menu Management:** Full control over menu items with Cloudinary image hosting and rich text descriptions.
- **Order Command Center:** Real-time order acceptance workflow with status toggles.
- **Profile Management:** Update restaurant branding, cover images, and operational status instantly.

### 🛵 Delivery Partner App
- **Opportunity Feed:** Live stream of available delivery requests in the vicinity.
- **Smart Navigation:** Optimized route details with pickup and drop-off coordination.
- **Earnings Tracker:** Real-time visibility into completed deliveries and payouts.

---

## 🛠 Technology Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 18 (TypeScript), Redux Toolkit, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express.js, JWT Auth, Multer |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Real-time** | Socket.IO (Bi-directional communication) |
| **Cloud Services** | Cloudinary (Image CDN), Razorpay (Payments) |

---

## 🔌 API Endpoints

A glimpse of the robust RESTful API powering FoodBey:

### 🔐 Authentication
- `POST /api/auth/register` - User registration (Customer/Partner)
- `POST /api/auth/login` - Secure login & token generation

### 🍽 Restaurants
- `GET /api/restaurants` - Fetch restaurant feed with filters
- `POST /api/restaurants` - Onboard new restaurant (Partner)
- `PUT /api/restaurants/:id` - Update profile & settings
- `POST /api/restaurants/:id/menu` - Add menu items

### 📦 Orders
- `POST /api/orders` - Place new order
- `GET /api/orders/track/:id` - Track order status
- `PUT /api/orders/:id/status` - Update workflow status (Partner/Delivery)

---

## 📸 Screenshots

*(Add your application screenshots here to showcase the UI)*

| Customer Home | Restaurant Menu | Partner Dashboard |
|:---:|:---:|:---:|
| ![Home](https://placehold.co/600x400/101010/FFFFFF?text=Home+Feed) | ![Menu](https://placehold.co/600x400/101010/FFFFFF?text=Menu+Page) | ![Dashboard](https://placehold.co/600x400/101010/FFFFFF?text=Partner+Portal) |

---

## 🗺️ Future Roadmap

- [x] **Core Ecosystem:** Customer, Partner, and Delivery flows complete.
- [x] **Real-time Engine:** Socket.IO integration for live tracking.
- [x] **Cloud Integration:** Cloudinary for optimized media delivery.
- [ ] **Voice Search:** Finding dishes using voice commands.
- [ ] **Multi-language Support:** Localized experience for diverse regions.
- [ ] **Data Analytics:** Advanced machine learning for personalized food recommendations.

---

## 🚀 Getting Started

To run this project locally:

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/yourusername/foodbey.git
    ```
2.  **Setup Backend:**
    ```bash
    cd server
    npm install
    # Create .env file with DB & Cloudinary credentials
    npm run dev
    ```
3.  **Setup Frontend:**
    ```bash
    cd client
    npm install
    npm run dev
    ```

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <sub>Developed with ❤️ by the FoodBey Engineering Team</sub>
</div>
