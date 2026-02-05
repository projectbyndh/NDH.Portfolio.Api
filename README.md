# Portfolio Backend API

A comprehensive backend API for managing portfolio website data including blogs, careers, contacts, FAQs, partners, projects, services, team members, and testimonials.

## 🚀 Now Using PostgreSQL!

This backend has been **migrated from MongoDB to PostgreSQL** for better performance, reliability, and scalability.

---

## Features

- ✅ RESTful API architecture
- ✅ PostgreSQL database with Sequelize ORM
- ✅ Complete CRUD operations for all modules
- ✅ Input validation and error handling
- ✅ CORS enabled
- ✅ Environment variable configuration
- ✅ Swagger API documentation
- ✅ File upload support (Multer)

---

## Modules

1. **Blogs** - Manage blog posts with title, author, date, image, and description
2. **Careers** - Job postings with requirements, responsibilities, and application links
3. **Contacts** - Contact form submissions
4. **Contact Info** - Company contact information with location coordinates
5. **FAQs** - Frequently asked questions
6. **Partners** - Partner/client information
7. **Projects** - Portfolio projects with tech stack and categories
8. **Services** - Services offered
9. **Team** - Team member profiles
10. **Testimonials** - Client testimonials with ratings

---

## Quick Start

### Prerequisites
- PostgreSQL (v12+)
- Node.js (v14+)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create PostgreSQL database
# Using psql or pgAdmin, run:
CREATE DATABASE ndh_portfolio;

# 3. Configure environment
# Edit .env and set your PostgreSQL password

# 4. Initialize database tables
npm run init-db

# 5. Start server
npm start
```

Server runs on: **http://localhost:5000**

📖 **For detailed setup instructions, see [QUICK_START.md](QUICK_START.md)**

---

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ndh_portfolio
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_DIALECT=postgres

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME="NDH"
CLOUDINARY_API_KEY="your_key"
CLOUDINARY_API_SECRET="your_secret"
```

---

## NPM Scripts

```bash
npm start       # Start the server
npm run dev     # Start with nodemon (auto-reload)
npm run init-db # Initialize database tables
```

---

## API Endpoints

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog

### Careers
- `GET /api/careers` - Get all careers
- `GET /api/careers/:id` - Get single career
- `POST /api/careers` - Create career
- `PUT /api/careers/:id` - Update career
- `DELETE /api/careers/:id` - Delete career

### Contacts
- `GET /api/contacts` - Get all contact submissions
- `GET /api/contacts/:id` - Get single contact
- `POST /api/contacts` - Create contact submission
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Contact Info
- `GET /api/contact-info` - Get all contact info
- `GET /api/contact-info/:id` - Get single contact info
- `POST /api/contact-info` - Create contact info
- `PUT /api/contact-info/:id` - Update contact info
- `DELETE /api/contact-info/:id` - Delete contact info

### FAQs
- `GET /api/faqs` - Get all FAQs
- `GET /api/faqs/:id` - Get single FAQ
- `POST /api/faqs` - Create FAQ
- `PUT /api/faqs/:id` - Update FAQ
- `DELETE /api/faqs/:id` - Delete FAQ

### Partners
- `GET /api/partners` - Get all partners
- `GET /api/partners/:id` - Get single partner
- `POST /api/partners` - Create partner
- `PUT /api/partners/:id` - Update partner
- `DELETE /api/partners/:id` - Delete partner

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `GET /api/projects/category/:category` - Get projects by category
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Team
- `GET /api/team` - Get all team members
- `GET /api/team/:id` - Get single team member
- `POST /api/team` - Create team member
- `PUT /api/team/:id` - Update team member
- `DELETE /api/team/:id` - Delete team member

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `GET /api/testimonials?featured=true` - Get featured testimonials
- `GET /api/testimonials/:id` - Get single testimonial
- `POST /api/testimonials` - Create testimonial
- `PUT /api/testimonials/:id` - Update testimonial
- `DELETE /api/testimonials/:id` - Delete testimonial
- `PATCH /api/testimonials/:id/toggle-featured` - Toggle featured status

---

## API Documentation

Interactive Swagger documentation available at:
```
http://localhost:5000/api-docs
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

---

## Project Structure

```
Portfolio-Backend/
├── config/
│   ├── database.js           # PostgreSQL connection
│   ├── initDatabase.js       # Database initialization
│   └── schema.sql            # SQL schema reference
├── controllers/              # Request handlers
│   ├── blogController.js
│   ├── careerController.js
│   ├── contactController.js
│   ├── contactInfoController.js
│   ├── faqController.js
│   ├── partnerController.js
│   ├── projectController.js
│   ├── serviceController.js
│   ├── teamController.js
│   └── testimonialController.js
├── models/                   # Sequelize models
│   ├── Blog.js
│   ├── Career.js
│   ├── Contact.js
│   ├── ContactInfo.js
│   ├── FAQ.js
│   ├── Partner.js
│   ├── Project.js
│   ├── Service.js
│   ├── Team.js
│   ├── Testimonial.js
│   └── index.js
├── routes/                   # API routes
│   ├── blogRoutes.js
│   ├── careerRoutes.js
│   ├── contactRoutes.js
│   ├── contactInfoRoutes.js
│   ├── faqRoutes.js
│   ├── partnerRoutes.js
│   ├── projectRoutes.js
│   ├── serviceRoutes.js
│   ├── teamRoutes.js
│   └── testimonialRoutes.js
├── uploads/                  # Uploaded files
├── .env                      # Environment variables
├── index.js                  # Application entry point
├── package.json              # Dependencies
├── QUICK_START.md            # Quick setup guide
├── POSTGRESQL_SETUP.md       # Detailed setup instructions
├── MIGRATION_COMPLETE.md     # Migration summary
└── CONTROLLER_MIGRATION.md   # Code migration guide
```

---

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **Sequelize** - ORM for PostgreSQL
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing
- **multer** - File upload handling
- **swagger-jsdoc** - API documentation
- **swagger-ui-express** - Swagger UI

---

## Database Schema

### Key Features
- Auto-incrementing integer IDs
- Timestamps (createdAt, updatedAt) on all tables
- Array support for tech stacks, links, requirements
- JSONB support for nested objects (location)
- Proper data types and constraints

---

## Documentation

- 📖 **[QUICK_START.md](QUICK_START.md)** - Get started in 5 steps
- 📖 **[POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md)** - Complete setup guide
- 📖 **[MIGRATION_COMPLETE.md](MIGRATION_COMPLETE.md)** - Migration summary
- 📖 **[CONTROLLER_MIGRATION.md](CONTROLLER_MIGRATION.md)** - Code examples

---

## Troubleshooting

### Database Connection Error
```
Error: password authentication failed
```
**Solution:** Update `DB_PASSWORD` in `.env` file

### Tables Don't Exist
```
Error: relation "blogs" does not exist
```
**Solution:** Run `npm run init-db`

### Port Already in Use
```
Error: Port 5432 is already in use
```
**Solution:** PostgreSQL is running, or change port in `.env`

---

## License

ISC

---

## Repository

GitHub: [NDH.Portfolio.Api](https://github.com/Bibek1604/Backend-NDH)

---

**Built with ❤️ by Nepal Digital Heights**
