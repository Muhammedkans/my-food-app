# 💻 FoodBey Frontend - Premium Client Experience

The frontend of FoodBey is a modern, responsive React application designed with a **Neon Luxury** aesthetic. It provides a seamless interface for customers, restaurant owners, and delivery partners.

---

## ✨ Features

- **⚡ Blazing Fast Navigation:** Powered by Vite and React-Router.
- **🎨 Framer Motion Animations:** Smooth transitions, floating cards, and interactive UI elements.
- **🛍️ Cart System:** Persistence-ready cart logic using Redux Toolkit.
- **💳 Razorpay Integration:** Secure, managed payment flow with instant redirection.
- **📍 Location & Addresses:** Interactive address management with labels (Home, Work, etc.).
- **💬 AI Chat Support:** Floating AI assistant for instant user help (available after login).
- **🎉 Order Success:** Celebratory success page with confetti and live progress indicators.

---

## 🛠 Tech Stack

- **Core:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, CSS Variables for Dynamic Themes
- **State:** Redux Toolkit (Slices: Auth, Cart, UI)
- **Real-time:** Socket.io-client
- **Visuals:** Lucide React, Framer Motion, Canvas-Confetti

---

## 🚀 Installation & Setup

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root of the `client` folder:
   ```env
   VITE_API_URL=http://localhost:5001/api
   VITE_RAZORPAY_KEY_ID=your_razorpay_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## 📦 Key Pages & Components

- **Consumer:**
  - `Home.tsx`: Hero section with premium value propositions.
  - `RestaurantFeed.tsx`: Scrollable list of verified restaurants with AI-sorted stats.
  - `Checkout.tsx`: Detailed billing breakdown and payment gateway integration.
  - `OrderSuccess.tsx`: Professional post-payment tracking interface.

- **Partner:**
  - `LiveOrders.tsx`: Real-time order management for restaurant owners.
  - `MenuManagement.tsx`: Professional CRUD for food items with Cloudinary integration.

- **Delivery:**
  - `DeliveryDashboard.tsx`: Opportunity hub for pilots.
  - `DeliveryOrderDetail.tsx`: Route navigation and order checklist.

---

## 💅 Styling Philosophy

FoodBey uses a custom design system defined in `tailwind.config.js` and `src/index.css`.
- **Primary Color:** Cyan Neon (`#00f3ff`)
- **Secondary Color:** Purple Neon (`#7000ff`)
- **Dark Mode Solids:** Deep Charcoal (`#0a0a0d`)

---

Developed for **FoodBey Premium**.
