const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); // Direct mongoose usage or via config
const connectDB = require('./config/db');
const colors = require('colors'); // Optional but mentioned in plan
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/error.middleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth.routes');
const users = require('./routes/user.routes');
const games = require('./routes/game.routes');
const join = require('./routes/join.routes');

const app = express();

// Simple request logger
app.use((req, res, next) => {
    console.log(`[Backend Request] ${req.method} ${req.url}`);
    next();
});

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware (optional)
// if (process.env.NODE_ENV === 'development') { app.use(morgan('dev')); }

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/games', games);
app.use('/api/join', join);

// Error Handler Middleware (must be after routers)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
