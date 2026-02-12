const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use SMTP settings from .env
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

/**
 * Send an email notification
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 */
const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't throw error to prevent blocking the main request
        return null;
    }
};

/**
 * Send a notification to admin about a new contact form submission
 * @param {Object} data - Contact form data
 */
const sendContactNotification = async (data) => {
    const adminEmail = process.env.ADMIN_EMAIL; // Admin email to receive notifications
    if (!adminEmail) return;

    const subject = `New Contact Form Submission: ${data.subject}`;
    const html = `
    <h2>New Message from your Portfolio Website</h2>
    <p><strong>Name:</strong> ${data.fullName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Subject:</strong> ${data.subject}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message}</p>
  `;

    await sendEmail(adminEmail, subject, html);
};

/**
 * Send a notification to admin about a new career application
 * @param {Object} data - Application data
 */
const sendApplicationNotification = async (data) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) return;

    const subject = `New Job Application: ${data.careerTitle} - ${data.fullName}`;
    const html = `
      <h2>New Job Application Received</h2>
      <p><strong>Applicant:</strong> ${data.fullName}</p>
      <p><strong>Position:</strong> ${data.careerTitle}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>CV Link:</strong> <a href="${data.cvUrl}">View CV</a></p>
    `;

    await sendEmail(adminEmail, subject, html);
};

module.exports = {
    sendEmail,
    sendContactNotification,
    sendApplicationNotification
};
