const nodemailer = require('nodemailer');

const emailConfig = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
}

const transporter = nodemailer.createTransport(emailConfig);

const sendConfirmationEmail = async (email, token) => {
    const mailOptions={
        from : process.env.EMAIL_USER ,
        to : email,
        subject : 'Confirm your address email',
        html : `<h1>Click on the link below to confirm your email</h1>
               <a href="http://localhost:3000/api/auth/email-confirmation/${token}"}>Confirme Your Address Email</a>`
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    }catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending email');
      }
    }

module.exports = sendConfirmationEmail ;