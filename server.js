const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// CONNECT TO MONGODB (Render uses environment variable)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected Successfully"))
.catch(err => console.log("Mongo Error:", err));


// ===================== CONTACT FORM =====================

// CONTACT SCHEMA
const contactSchema = new mongoose.Schema({
    name: String,
    roll: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
});

// MODEL
const Contact = mongoose.model("Contact", contactSchema);

// POST API — STORE CONTACT MESSAGE
app.post("/api/contact", async (req, res) => {
    try {
        const { name, rollNumber, email, message } = req.body;

        const newMessage = new Contact({
            name,
            roll: rollNumber,   // FIXED
            email,
            message
        });

        await newMessage.save();

        res.json({ success: true, message: "Message stored successfully!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to store message." });
    }
});


// GET API — FETCH ALL CONTACT MESSAGES
app.get("/api/contact/messages", async (req, res) => {
    try {
        const messages = await Contact.find().sort({ date: -1 });
        res.json({ success: true, data: messages });

    } catch (error) {
        res.json({ success: false, message: "Unable to fetch messages" });
    }
});


// ===================== START SERVER =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("API Running on port " + PORT);
});
