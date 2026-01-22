# Portfolio Backend API

A comprehensive backend API for managing portfolio website data including blogs, careers, contacts, FAQs, partners, projects, services, and team members.

## Features

- RESTful API architecture
- MongoDB database with Mongoose ODM
- Complete CRUD operations for all modules
- Input validation and error handling
- CORS enabled
- Environment variable configuration

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

## Installation

```bash
# Install dependencies
npm install

# Install required packages (if not already installed)
npm install mongoose dotenv cors
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/NDH-Portfolio
```

## Database Setup

Make sure MongoDB is installed and running on your system. The application will automatically connect to the database specified in your `.env` file.

## Running the Application

```bash
# Start server
npm start

# Start with nodemon (development)
npm run dev
```

The server will run on `http://localhost:5000`

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

## Project Structure

```
Portfolio-Backend/
├── config/
│   └── db.js              # Database connection
├── controllers/           # Request handlers
│   ├── blogController.js
│   ├── careerController.js
│   ├── contactController.js
│   ├── contactInfoController.js
│   ├── faqController.js
│   ├── partnerController.js
│   ├── projectController.js
│   ├── serviceController.js
│   └── teamController.js
├── models/               # Mongoose schemas
│   ├── Blog.js
│   ├── Career.js
│   ├── Contact.js
│   ├── ContactInfo.js
│   ├── FAQ.js
│   ├── Partner.js
│   ├── Project.js
│   ├── Service.js
│   └── Team.js
├── routes/              # API routes
│   ├── blogRoutes.js
│   ├── careerRoutes.js
│   ├── contactRoutes.js
│   ├── contactInfoRoutes.js
│   ├── faqRoutes.js
│   ├── partnerRoutes.js
│   ├── projectRoutes.js
│   ├── serviceRoutes.js
│   └── teamRoutes.js
├── .env                 # Environment variables
├── index.js            # Application entry point
└── package.json        # Dependencies
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing

## License

ISC
# NDH.Portfolio.Api
