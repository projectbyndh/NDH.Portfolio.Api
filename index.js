require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Connect to MongoDB
connectDB();

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
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/careers', require('./routes/careerRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/contact-info', require('./routes/contactInfoRoutes'));
app.use('/api/faqs', require('./routes/faqRoutes'));
app.use('/api/partners', require('./routes/partnerRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/team', require('./routes/teamRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Error handling middleware (good to have at the end)
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Payload Too Large',
      message: `Maximum allowed size is ${err.limit} bytes. Your request was ${err.length} bytes.`
    });
  }

  res.status(500).json({ error: 'Something went wrong!' });
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});