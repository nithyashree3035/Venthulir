const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS (Port 587)
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    family: 4, // Force IPv4
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Helps in cloud environments
    }
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error('Core SMTP Connection Error:', error);
    } else {
        console.log('Royal Mail Server is ready to take messages');
    }
});

module.exports = transporter;
