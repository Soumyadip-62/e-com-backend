    
require('dotenv').config();
const express = require('express');
const User = require('../Models/userModel');
const api = express.Router();
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");


const {register}= require("../Controllers/authController")

api.post('/register',body('email').isEmail().withMessage('Please provide a valid email address.').normalizeEmail(), body("password").isLength({
    min: 6,
  }).withMessage('Password must be at least 6 characters long.'),register)


module.exports = api;