// const { configDotenv } = require("dotenv");
const nodemailer = require("nodemailer");
require("dotenv").config(); // ✅ This loads .env variables


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD

    }
});
// console.log(process.env.EMAIL_PASSWORD)

const sendOtp = async (email, otp) => {
    await transporter.sendMail({
        from: `"Super Admin Login" <${process.env.EMAIL_USERNAME}>`,
        to: email,
        subject: "Your OTP for Login",
        html: `<h2>Your OTP is: ${otp}</h2><p>This OTP is valid for 5 minutes.</p>`
    });
};

module.exports = sendOtp;
