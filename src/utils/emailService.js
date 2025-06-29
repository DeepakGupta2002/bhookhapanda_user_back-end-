const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: "Your Bhookha Panda OTP Code",
        html: `<h3>Your OTP is: <b>${otp}</b></h3><p>Use this to login or confirm your action. Do not share with anyone.</p>`,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendOtpEmail;
