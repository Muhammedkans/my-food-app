# 🚀 FoodBey - Premium Food Delivery Ecosystem

FoodBey is a high-performance, full-stack food delivery application built for a premium user experience. Inspired by industry leaders like Swiggy and Zomato, it features a sleek neon-themed UI, real-time order tracking, AI-powered insights, and secure payment integrations.

---

## 🌟 Key Features

### 👤 Customer Experience
- **Interactive Menu:** Browse restaurants with high-quality images and category-wise filtering.
- **Smart Checkout:** Address management, real-time billing with surge pricing logic, and Razorpay integration.
- **Real-time Tracking:** Live order status updates via Socket.IO with a professional progress tracker.
- **AI Support:** Integrated AI Chat Support for instant customer assistance.
- **Celebratory UI:** Confetti and motion-rich success pages upon successful payment.

### 🍱 Partner (Restaurant) Portal
- **Dashboard Analytics:** Visualized stats for sales, orders, and ratings.
- **Menu Management:** Complete CRUD operations for menu items with Cloudinary image hosting.
- **Live Order Management:** Real-time notification of new orders and seamless status updates (Preparing → Food Ready).

### 🛵 Delivery Partner Flow
- **Opportunity Hub:** Live feed of nearby delivery requests.
- **Route Navigation:** Detailed pickup and drop-off information with customer contact options.
- **Earnings Tracker:** Real-time visibility into completed deliveries and pilot payouts.

---

## 🛠 Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS (Custom Neon Theme)
- **Animations:** Framer Motion & Canvas Confetti
- **Icons:** Lucide React
- **Real-time:** Socket.IO Client

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Payments:** Razorpay API
- **Real-time:** Socket.IO
- **Storage:** Cloudinary (via Multer)
- **Security:** JWT Authentication & Password Hashing (bcrypt)

---

## 📂 Project Structure

- [`/client`](./client): The React-based frontend application.
- [`/server`](./server): The Express-based API and real-time engine.

---

## 🚀 Getting Started

To get the project running locally, check the individual READMEs:
- [Frontend Setup Guide](./client/README.md)
- [Backend Setup Guide](./server/README.md)

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

Developed with ❤️ by **FoodBey Team**.
