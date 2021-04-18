require("dotenv").config();
const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.post("/contact", (req, res) => {
  const output = `
  <p>You have a new contact request</p>
  <h3>Contact Details</h3>
  <ul>
    <li>Name: ${req.body.fname} ${req.body.lname}</li>
    <li>Email: ${req.body.email}</li>
  </ul>
  <h3>Message</h3>
  <p>${req.body.message}</p>
  `;
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Arsh Contacts" arshmail@arsh.com',
    to: "arshkarpoor497@gmail.com",
    subject: "Contact",
    text: "Hello world?",
    html: output,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(400).json({ status: "error" });
    } else {
      res.status(200).json({ status: "success" });
    }
  });
});

app.listen(PORT);
