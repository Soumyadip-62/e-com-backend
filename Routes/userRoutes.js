require("dotenv").config();
const express = require("express");
const User = require("../Models/userModel");
const api = express.Router();
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

const { register, login, forgotPassword } = require("../Controllers/authController");

api.post(
  "/register",
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),
  body("password")
    .isLength({
      min: 6,
    })
    .withMessage("Password must be at least 6 characters long."),
  register
);

api.post('/login',body('email').isEmail().normalizeEmail(), login),
api.post('/forgotpassword', body('email').isEmail().normalizeEmail(), forgotPassword)

module.exports = api;
