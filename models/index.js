// Central export file for all models
const Blog = require('./Blog');
const Career = require('./Career');
const Contact = require('./Contact');
const ContactInfo = require('./ContactInfo');
const FAQ = require('./FAQ');
const LeadershipLayer = require('./LeadershipLayer');
const Partner = require('./Partner');
const Project = require('./Project');
// const Role = require('./Role'); // Removed - using simplified team structure
const Service = require('./Service');
const Team = require('./Team');
const Testimonial = require('./Testimonial');
const Course = require('./Course');
const Batch = require('./Batch');
const Enrollment = require('./Enrollment');

module.exports = {
    Blog,
    Career,
    Contact,
    ContactInfo,
    FAQ,
    LeadershipLayer,
    Partner,
    Project,
    // Role, // Removed - using simplified team structure
    Service,
    Team,
    Testimonial,
    Course,
    Batch,
    Enrollment
};
