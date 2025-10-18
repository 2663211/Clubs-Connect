// server/index.js
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import eventsRouter from './routes/events.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Debug environment variables
console.log('🔧 Environment Variables Check:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Loaded' : '❌ Missing');
console.log(
  'SUPABASE_SERVICE_ROLE_KEY:',
  process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Loaded' : '❌ Missing'
);
console.log('PORT:', process.env.PORT || 'Using default');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

const app = express();

// Allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:5001',
  'http://localhost:5002',
  'http://127.0.0.1:5001',
  'http://127.0.0.1:5002',
  'https://2663211.github.io',
  'https://mango-sand-065fa6a03.1.azurestaticapps.net',
  'https://gentle-coast-05e458303.1.azurestaticapps.net',
];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    console.log('🌐 Request from origin:', origin || 'no-origin');

    // Allow requests with no origin (Postman, mobile apps, server-to-server)
    if (!origin) {
      console.log('✅ Allowing request with no origin');
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin allowed:', origin);
      return callback(null, true);
    }

    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Development mode - allowing origin:', origin);
      return callback(null, true);
    }

    // Reject in production
    console.log('❌ CORS blocked origin:', origin);
    callback(new Error(`CORS policy violation. Origin ${origin} not allowed.`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400, // Cache preflight for 24 hours
};

// Apply CORS middleware FIRST - this is critical
app.use(cors(corsOptions));

// Explicitly handle preflight requests for all routes
app.options('*', cors(corsOptions));

// Request logging (after CORS)
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url} from ${req.get('origin') || req.get('host')}`);
  next();
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Supabase client setup
let supabase;
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables!');
  if (process.env.NODE_ENV === 'production') process.exit(1);
  supabase = null;
} else {
  try {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { 'x-application': 'clubs-connect-api' } },
    });
    console.log('✅ Supabase client created successfully');
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error.message);
    if (process.env.NODE_ENV === 'production') process.exit(1);
    supabase = null;
  }
}

// Health check
app.get('/', (req, res) => {
  res.json({
    service: 'Clubs Connect API',
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    cors: {
      requestOrigin: req.get('origin') || 'no-origin',
      allowedOrigins,
    },
    version: '1.0.0',
  });
});

// API status
app.get('/api/status', (req, res) => {
  res.json({
    api: 'healthy',
    database: process.env.SUPABASE_URL ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// CORS test
app.get('/api/cors-test', (req, res) => {
  res.json({
    message: 'CORS is working!',
    origin: req.get('origin'),
    timestamp: new Date().toISOString(),
    headers: req.headers,
  });
});

// Routes
app.use('/api/events', eventsRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: ['GET /', 'GET /api/status', 'GET /api/cors-test', 'GET /api/events'],
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('💥 Error:', error.message);

  if (error.message.includes('CORS')) {
    return res.status(403).json({
      error: 'CORS Error',
      message: error.message,
      origin: req.get('origin'),
      allowedOrigins,
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message,
    timestamp: new Date().toISOString(),
  });
});

// Export app for testing
export default app;
export { supabase };

// Start server
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5001;
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/`);
    console.log(`🧪 CORS test: http://localhost:${PORT}/api/cors-test`);
    console.log(`📊 Events API: http://localhost:${PORT}/api/events`);
    console.log('🔐 Allowed origins:', allowedOrigins);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    server.close(() => console.log('✅ Process terminated'));
  });
}
