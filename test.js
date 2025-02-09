import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables from your .env file
dotenv.config();

// Create the transporter using the same EMAIL_SERVER env variable
const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER, {
  logger: true, // Enable logging
  debug: true, // Enable debug output
});

// Test email details
const mailOptions = {
  from: "HackKU <auth@hackku.org>", // Same 'from' address as in your NextAuth
  to: "iamthewill4@gmail.com", // Replace with your email to receive the test
  subject: "✅ Test Email from HackKU",
  text: "This is a test email sent using Nodemailer with your current environment settings.",
};

async function sendTestEmail() {
  console.log("📤 Attempting to send test email...");

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Test email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
  } catch (error) {
    console.error("❌ Error sending test email:");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Response:", error.response);
    console.error("Stack:", error.stack);
  }
}

sendTestEmail();
