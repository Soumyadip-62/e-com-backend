require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");
const nodemailer = require("nodemailer");
const { body, validationResult } = require("express-validator");
const Whitelist = require("../Models/WhiteListModel");

const login = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    try {
      const user = await User.find({ email });
      console.log(user, req.body);

      if (user.length === 0) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const isMatch = await bcrypt.compare(password, user[0].password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user[0]._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      await Whitelist.create({
        token: token,
      }).then((res) => console.log(res));
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user[0]._id,
          username: user[0].username,
          email: user[0].email,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    console.log(errors.array().map((error) => error.msg));
    res.status(403).send(errors.array().map((error) => error.msg));
  }
};

const register = async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    try {
      const { username, email, password } = req.body;
      const ifUserExists = await User.findOne({ email });
      if (ifUserExists) {
        return res.status(400).json({ message: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        email,
        password: hashedPassword,
      });
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    console.log(errors.array().map((error) => error.msg));
    res.status(403).send(errors.array().map((error) => error.msg));
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    try {
      const user = await User.find({ email });
      if (user.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const token  = user[0].id.toString() + Date.now().toString();

      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_PORT === "465", // true for 465, false for 587
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Password Reset",
        text: `OTP to reset your password is 123455.`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({ message: "Internal server error in nodemailer" });
        } else {
          return res.status(200).json({
            message: "Password reset link sent to your email",
          });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error in request" });
    }
  } else {
    console.log(errors.array().map((error) => error.msg));
    res.status(403).send(errors.array().map((error) => error.msg));
  }
};

const profile = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } 
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  register,
  login,
  forgotPassword,
  profile
};
