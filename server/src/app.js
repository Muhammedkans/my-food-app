const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

// Trust proxy for Render/Vercel (fixes rate limit error)
app.set('trust proxy', 1);

// Middlewares
app.use(helmet());
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/delivery', require('./routes/deliveryRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

app.get('/', (req, res) => {
  res.status(200).json({ status: 'active', message: 'FoodBey API is running' });
});

const path = require('path');
// Serve static files with correct headers
app.use('/uploads', (req, res, next) => {
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(path.join(__dirname, '../uploads')));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

module.exports = app;
