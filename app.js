import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/secretDB");

const userSchema = await mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: process.env.KEY_SECRET,
  encryptedFields: ["password"],
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });
  try {
    await newUser.save();
    res.render("secrets.ejs");
  } catch (error) {
    console.error(error.message);
  }
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const foundUser = await User.findOne({ email: username });
    if (foundUser.password === password) {
      res.render("secrets.ejs");
    } else {
      throw new error();
    }
  } catch (error) {
    console.error(error.message);
  }
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
