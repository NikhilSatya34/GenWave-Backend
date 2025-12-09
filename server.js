const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// ------------------ MONGO DB CONNECTION ------------------ //
const mongoURI = process.env.MONGO_URI;   // Read from Render Environment Variable

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// ------------------ CONTACT SCHEMA ------------------ //
const contactSchema = new mongoose.Schema({
  name: String,
  roll: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});

const Contact = mongoose.model("Contact", contactSchema);

// ------------------ POST API ------------------ //
app.post("/api/contact", async (req, res) => {
  try {
    const { name, roll, email, message } = req.body;

    const newMessage = new Contact({
      name,
      roll,
      email,
      message
    });

    await newMessage.save();
    res.json({ success: true, message: "Message stored successfully!" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to store message" });
  }
});

// ------------------ GET API ------------------ //
app.get("/api/contact/messages", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ date: -1 });
    res.json({ success: true, data: messages });

  } catch (error) {
    res.json({ success: false, message: "Unable to fetch messages" });
  }
});

// ------------------ START SERVER ------------------ //
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
