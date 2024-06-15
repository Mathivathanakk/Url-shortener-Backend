import User from "../Models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  resetpasswordmail,
  activateAccountNodemailer,
} from "../Services/nodemailer.js";
dotenv.config();
//sign up

export const signupUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const hashPassword = await bcryptjs.hash(password, 10);
    const user=await User.findOne({email})
    if (user) {
      return res.status(401).json({ message: "signup failed" });
    }
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashPassword,
    });
    await newUser.save();
    await activateAccountNodemailer(newUser);
    res
      .status(200)
      .json({ message: "User SignUp successfully ! Please check your email to activate your account", result: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Signup Failure Internal server Error" });
  }
};

export const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginUser = await User.findOne({ email });
    if (loginUser.verified === false) {
      res.status(400).json({
        message: "Your account is not activated,please activate your account",
      });
    }
    if (!loginUser) {
      res.status(401).json({ message: "User Not Found" });
    }
    const passwordMatch = await bcryptjs.compare(password, loginUser.password);
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid Password" });
    }
    //jwt part token creation after signin
    const token = jwt.sign({ _id: loginUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "2h",
    });
    loginUser.token = token;
    await loginUser.save();

    res.status(200).json({ message: "User SignIn successfully", token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Signin Failure Internal server Error" });
  }
};

//forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "User Not Found" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    await resetpasswordmail(user, token, res);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server Error in the forgot password" });
  }
};
//reset password
export const resetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    const hashed = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!hashed) {
      return res.status(400).json({ message: "Invalid Token" });
    }

    const passwordhash = await bcryptjs.hash(password, 10);
    const user = await User.findById({ _id: id });
    user.password = passwordhash;
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }
    await user.save();
    res.status(200).json({ message: "password updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server Error in the reset password" });
  }
};
//activating the account
export const activateAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }
    user.verified = true;
    await user.save();
    res
      .status(200)
      .json({ message: "Activated your account successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server Error in the activating the account" });
  }
};
//getting the user by token
export const getUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    res.status(200).json({ message: "Authorized User", data: [user] });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server Error Failed to get the user" });
  }
};
