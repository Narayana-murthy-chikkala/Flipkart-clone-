import nodemailer from 'nodemailer';

export const sendEmail = async ({ email, subject, text, html }) => {
  try {
    // Using Ethereal Email for testing purposes (provides a mock SMTP)
    // In production, configure these via .env (e.g., EMAIL_HOST=smtp.gmail.com)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: process.env.EMAIL_PORT || 587,
      auth: {
        user: process.env.EMAIL_USER || 'z2o77pwnlpsw6r5c@ethereal.email',
        pass: process.env.EMAIL_PASS || 'd8JqQJ14vCWW2D6uKp'
      }
    });

    const mailOptions = {
      from: '"Flipkart Clone" <no-reply@flipkart-clone.com>',
      to: email,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent: %s", info.messageId);
    console.log("📧 Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
  }
};
