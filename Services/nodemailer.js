import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.PASSMAIL,
    pass: process.env.PASSKEY,
  },
});

export const resetpasswordmail = async (user, token, res) => {
  const mailOptions = {
    from: process.env.PASSMAIL, // sender address
    to: user.email, // list of receivers
    subject: "Password Reset", // Subject line
    text:
      "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
      "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
      `http://localhost:3000/reset-password/${user._id}/${token}`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Internal server error in sending the mail" });
    } else {
      res.status(200).json({ message: "Email sent successfully" });
    }
  });
};

export const activateAccountNodemailer = async (newUser, res) => {
  const sendActivateUser = {
    from: process.env.PASSMAIL, // sender address
    to: newUser.email, // list of receivers
    subject: "Activate your Account", // Subject line
    text:
      "You are receiving this because you (or someone else) have requested the activate your account.\n\n" +
      "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
      `http://localhost:3000/activate-account/${newUser._id}`,
  };
  transporter.sendMail(sendActivateUser, function (error, info) {
    if (error) {
      console.log(error);
      res
        .status(500)
        .json({
          message:
            "Internal server error in sending the mail to activate your account",
        });
    } else {
      res
        .status(200)
        .json({ message: "Email sent successfully to activate your account" });
    }
  });
};
