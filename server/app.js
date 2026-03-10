const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const activityLogger = require('./middleware/activityLogger');

const app = express();

// Security Middlewares
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"], // Allow images from any secure source
            connectSrc: ["'self'", "https:", "http:"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    frameguard: { action: 'deny' }
}));


app.use(cors());
app.use(express.json());
app.use(activityLogger); // Log all state-changing actions

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Production setup — Serving Isolated Frontend Apps
if (process.env.NODE_ENV === 'production') {
    // 1. Customer Portal (served from dist) — must be registered first as /admin is a subfolder
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Router Handler: If path starts with /admin, give dist/admin/admin.html, else index.html
    app.get('*', (req, res) => {
        if (req.originalUrl.toLowerCase().startsWith('/admin')) {
            res.sendFile(path.resolve(__dirname, '../client', 'dist', 'admin', 'admin.html'));
        } else {
            res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
        }
    });
}

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        msg: 'Sovereign Server Error - Something went wrong.',
        error: process.env.NODE_ENV === 'production' ? err.message : err.stack
    });
});


module.exports = app;
