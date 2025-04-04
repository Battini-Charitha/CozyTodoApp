const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 8080;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set("view engine", "ejs");

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB (even though we're not using it yet)
//mongoose
//.connect(
//`mongodb+srv://parushapradhan78:${process.env.DB_password}@cluster0webdev.ot1x2pr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0webdev`,
//{
//useNewUrlParser: true,
//useUnifiedTopology: true,
// }
// )
//.then(() => console.log("✅ MongoDB connected"))
//.catch((err) => console.error(err));

// Routes
app.get("/", (req, res) => {
  res.render("pages/index");
});

app.get("/signup", (req, res) => {
  res.render("pages/signup");
});

app.get("/login", (req, res) => {
  res.render("pages/login");
});

app.get("/forgotPassword", (req, res) => {
  res.render("pages/forgotPassword");
});

// Simulated form post handlers
// SIGNUP: Save to users.json
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  const usersPath = path.join(__dirname, "data", "users.json");
  const users = JSON.parse(fs.readFileSync(usersPath));

  // Check for duplicate email
  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.send("❌ User already exists! <a href='/signup'>Try again</a>");
  }

  users.push({ username, email, password }); // no hash for now
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  res.redirect("/");
});

// LOGIN: Match email and password
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const usersPath = path.join(__dirname, "data", "users.json");
  const users = JSON.parse(fs.readFileSync(usersPath));

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.send("❌ Invalid credentials. <a href='/login'>Try again</a>");
  }

  res.redirect("/"); // redirect to main game page
});

app.post("/forgotPassword", (req, res) => {
  console.log("✅ Forgot password form submitted:", req.body);
  res.redirect("/login");
});
app
  .listen(8080, () => {
    console.log("🚀 Server is running at http://localhost:8080");
  })
  .on("error", (err) => {
    console.error("❌ Server failed to start:", err);
  });
