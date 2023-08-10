//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));
const encrypt = require("mongoose-encryption");
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/userDB");
}
const userSchema = new mongoose.Schema({ email: String, password: String });

const secret = process.env.SECRET;

userSchema.plugin(encrypt, { secret, secret, encryptedFields: ["password"] });
const User = new mongoose.model("user", userSchema);
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  const user = new User({
    email,
    password,
  });
  await user
    .save()
    .then(() => {
      res.render("secrets");
    })
    .catch((err) => {
      console.log(err);
    });
});
app.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const userpassword = req.body.password;
    await User.findOne({ email: username }).then((foundItem) => {
      if (userpassword === foundItem.password) {
        console.log(foundItem.password);
        res.render("secrets");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, (req, res) => {
  console.log("Server is runing on port 3000");
});
