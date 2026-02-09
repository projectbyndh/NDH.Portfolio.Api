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

// Connect to PostgreSQL
connectDB();

// Security enhancements
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow loading resources across origins (needed for images/PDFs from Cloudinary)
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
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

// API Routes
try {
  app.use('/api/auth', require('./routes/authRoutes'));
  console.log('✅ Auth routes loaded');
} catch (err) {
  console.error('❌ Error loading auth routes:', err.message);
}

try {
  app.use('/api/blogs', require('./routes/blogRoutes'));
  console.log('✅ Blog routes loaded');
} catch (err) {
  console.error('❌ Error loading blog routes:', err.message);
}

try {
  app.use('/api/careers', require('./routes/careerRoutes'));
  console.log('✅ Career routes loaded');
} catch (err) {
  console.error('❌ Error loading career routes:', err.message);
}

try {
  app.use('/api/career-applications', require('./routes/careerApplicationRoutes'));
  console.log('✅ Career application routes loaded');
} catch (err) {
  console.error('❌ Error loading career application routes:', err.message);
}

try {
  app.use('/api/contacts', require('./routes/contactRoutes'));
  console.log('✅ Contact routes loaded');
} catch (err) {
  console.error('❌ Error loading contact routes:', err.message);
}

try {
  app.use('/api/contact-info', require('./routes/contactInfoRoutes'));
  console.log('✅ Contact info routes loaded');
} catch (err) {
  console.error('❌ Error loading contact info routes:', err.message);
}

try {
  app.use('/api/faqs', require('./routes/faqRoutes'));
  console.log('✅ FAQ routes loaded');
} catch (err) {
  console.error('❌ Error loading FAQ routes:', err.message);
}

try {
  app.use('/api/partners', require('./routes/partnerRoutes'));
  console.log('✅ Partner routes loaded');
} catch (err) {
  console.error('❌ Error loading partner routes:', err.message);
}

try {
  app.use('/api/projects', require('./routes/projectRoutes'));
  console.log('✅ Project routes loaded');
} catch (err) {
  console.error('❌ Error loading project routes:', err.message);
}

try {
  app.use('/api/services', require('./routes/serviceRoutes'));
  console.log('✅ Service routes loaded');
} catch (err) {
  console.error('❌ Error loading service routes:', err.message);
}

try {
  app.use('/api/team', require('./routes/teamRoutes'));
  console.log('✅ Team routes loaded');
} catch (err) {
  console.error('❌ Error loading team routes:', err.message);
}

try {
  app.use('/api/testimonials', require('./routes/testimonialRoutes'));
  console.log('✅ Testimonial routes loaded');
} catch (err) {
  console.error('❌ Error loading testimonial routes:', err.message);
}

try {
  app.use('/api/upload', require('./routes/uploadRoutes'));
  console.log('✅ Upload routes loaded');
} catch (err) {
  console.error('❌ Error loading upload routes:', err.message);
}

// Error handling middleware (good to have at the end)
app.use((err, req, res, next) => {
  console.error(err.stack);

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