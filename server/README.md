# ⚙️ FoodBey Backend - Robust API & Real-time Engine

The backend of FoodBey is a high-availability Express server that powers the entire ecosystem. It handles authentication, secure payments, image processing, AI-driven fee calculations, and real-time communication via WebSockets.

---

## 🚀 Core Functionalities

- **🔐 Secure Auth:** Robust JWT-based authentication with role-based access control (RBAC).
- **💸 Surge Pricing Engine:** AI logic to dynamically calculate delivery fees based on peak hours and demand.
- **💳 Payment Verification:** Server-side HMAC signature verification for Razorpay to prevent fraud.
- **📡 Real-time Updates:** Socket.IO integration to notify:
  - **Restaurants** of new incoming orders.
  - **Delivery Partners** of available nearby deliveries.
  - **Customers** of status changes (Confirmed → Preparing → Out for Delivery).
- **🖼 Image Management:** Automated upload and transformation using Cloudinary.
- **📊 Analytics Engine:** Aggregates data for restaurant earnings and performance metrics.

---

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Real-time:** Socket.IO
- **Payments:** Razorpay Node SDK
- **File Handling:** Multer & Cloudinary SDK
- **Security:** bcryptjs, jsonwebtoken, cors, helmet

---

## 📡 API Endpoints (Quick Overview)

### Auth
- `POST /api/auth/register` - Create new user (RBAC supported)
- `POST /api/auth/login` - Authenticate and receive JWT

### Restaurants
- `GET /api/restaurants` - List all verified restaurants
- `POST /api/restaurants` - Register a new restaurant (Owner only)
- `GET /api/restaurants/:id/menu` - Fetch menu for specific restaurant

### Orders & Payments
- `POST /api/orders` - Create a pending order
- `POST /api/payments/create` - Initiate a Razorpay payment order
- `POST /api/payments/verify` - Securely verify payment and place order

---

## 🚀 Installation & Setup

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `server` root:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```

4. **Seed Database (Optional):**
   ```bash
   node seed.js
   ```

5. **Start server:**
   ```bash
   npm run dev
   ```

---

## 🤖 AI Features
FoodBey uses an intelligent middleware to calculate surge fees:
- **Lunch Peak (12 PM - 2 PM):** Automatic surge detection.
- **Dinner Peak (7 PM - 10 PM):** High demand fee adjustment.
- **Loyalty Points:** Scalable point awarding system based on order value.

---

Developed for **FoodBey Premium Backend**.
