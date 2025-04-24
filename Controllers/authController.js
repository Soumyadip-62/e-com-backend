require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");
// const Whitelist = require("../Models/Whitelist");
const nodemailer = require("nodemailer");
const { body, validationResult } = require("express-validator");

const register = async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);

  if (errors) {
    console.log(errors.array().map((error) => error.msg));

    res.send(errors.array().map((error) => error.msg));
  }
};

module.exports = {
  register,
};
