require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');

const authRouter = require('./routes/auth');
const uploadRouter = require('./routes/upload');
const bannersRouter = require('./routes/banners');
const servicesRouter = require('./routes/services');
const toolsRouter = require('./routes/tools');
const clientsRouter = require('./routes/clients');
const partnersRouter = require('./routes/partners');
const teamRouter = require('./routes/team');
const reviewsRouter = require('./routes/reviews');
const portfolioRouter = require('./routes/portfolio');
const projectsRouter = require('./routes/projects');
const settingsRouter = require('./routes/settings');



const app = express();
app.set('trust proxy', 1);

// Middleware - Enable CORS first (Permissive for Vercel)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const corsOptions = {
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));



app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginEmbedderPolicy: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Performance Logger Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(`[PERF WARNING] ${req.method} ${req.originalUrl} took ${duration}ms`);
    } else {
      console.log(`${req.method} ${req.originalUrl} - ${duration}ms`);
    }
  });
  next();
});

// Database connection logic
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/alhady';

// Global cache for connection to handle Vercel's serverless environment
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  // Set global mongoose options
  mongoose.set('bufferCommands', false); // Disable buffering for faster failure and better debugging

  const options = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 1, // Reduced for serverless to avoid connection spikes
    minPoolSize: 1,
    connectTimeoutMS: 10000,
  };

  try {
    console.log('Connecting to MongoDB...');
    cachedConnection = mongoose.connect(MONGO_URI, options);
    await cachedConnection;
    console.log('Connected to MongoDB');
    return cachedConnection;
  } catch (err) {
    cachedConnection = null;
    console.error('Database connection error:', err.message);
    throw err;
  }
};

// Initial connection attempt (background)
connectDB().catch(err => console.error('Initial DB connect failed:', err.message));

// Middleware to ensure DB connection for every request
app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    next();
  } catch (err) {
    return res.status(503).json({ 
      success: false, 
      message: 'Database connection currently unavailable',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// API Welcome route
app.get('/api', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Welcome to Alhady API',
    version: '1.0.0',
    status: 'Running'
  });
});

// Serve static uploads
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(path.join(__dirname, uploadDir)));

// Rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { success: false, message: 'Too many login attempts, please try again after 15 minutes' }
});

// Route stubs (filled in per user story)
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/banners', bannersRouter);
app.use('/api/services', servicesRouter);
app.use('/api/tools', toolsRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/partners', partnersRouter);
app.use('/api/team', teamRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/settings', settingsRouter);

// Root route for health check
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Welcome to Alhady Backend Service',
    api_status: 'Online',
    documentation: '/api'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Internal Server Error' 
  });
});


// Server start (only for local development)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
