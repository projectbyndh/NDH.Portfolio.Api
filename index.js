require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/database');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Initialize Model Associations
const initAssociations = require('./models/initAssociations');
initAssociations();

// Connect to PostgreSQL
connectDB();

// Security enhancements
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow loading resources across origins (needed for images/PDFs from Cloudinary)
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // limit each IP to 100 requests per windowMs (1000 for dev)
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1'
});
app.use('/api', limiter);

// ← VERY IMPORTANT: Body parsers FIRST, with increased limit
app.use(express.json({ limit: '10mb' }));          // ← JSON bodies (most common cause)
app.use(express.urlencoded({ limit: '10mb', extended: true }));  // ← form data

// CORS after body parsers is fine
app.use(cors());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Portfolio Backend API',
      version: '1.0.0',
      description: 'API documentation for Portfolio Backend',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Portfolio Backend API' });
});

// API Routes - Explicitly defined for reliability
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/careers', require('./routes/careerRoutes'));
app.use('/api/career-applications', require('./routes/careerApplicationRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/contact-info', require('./routes/contactInfoRoutes'));
app.use('/api/faqs', require('./routes/faqRoutes'));
app.use('/api/partners', require('./routes/partnerRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/team-structure', require('./routes/teamStructureRoutesSimplified'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Connectivity & Health Check
app.get('/api/health', (req, res) => res.json({
  status: 'online',
  timestamp: new Date(),
  version: '1.2.0'
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err.message);
  if (err.stack) console.error(err.stack);

  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Payload Too Large',
      message: `Maximum allowed size is ${err.limit} bytes. Your request was ${err.length} bytes.`
    });
  }

  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`📄 Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
