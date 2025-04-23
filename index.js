const express = require("express");
const app = express();
const mongoose = require('mongoose');
const User = require("./Models/userModel");

mongoose.connect('mongodb://localhost:27017/myapp').then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

app.use(express.json());
app.get("/", (req, res) => res.send("Hello World"));
app.post('/users', async (req, res) => {
    const newUser = new User(req.body);
    console.log(req.body);
    
    await newUser.save();
    res.send(newUser);
  });
  app.get('/users', async (req, res) => {
    const users = await User.find();
    res.send(users);
  });
  
app.listen(1337, () => console.log("Server running on http://localhost:1337"));
