const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");
const User = require("./Models/userModel");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const userRoutes = require('./Routes/userRoutes')

const uri =
  `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@e-com-db.htzco1t.mongodb.net/?retryWrites=true&w=majority&appName=E-com-db`;

mongoose
  .connect(uri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());


app.get("/", (req, res) => res.send("Hello World"));
// app.post("/users", async (req, res) => {
//   const newUser = new User(req.body);
//   console.log(req.body);
//   await newUser.save();
//   res.send(newUser);
// });
app.use("/users", userRoutes);

app.listen(1337, () => console.log("Server running on http://localhost:1337"));
