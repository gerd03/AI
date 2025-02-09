const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());
"
const GEMINI_API_KEY = "12414;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

app.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Invalid messages format." });
        }

        // Format messages correctly for Gemini API
        const formattedMessages = messages.map(msg => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }]
        }));

        const response = await axios.post(GEMINI_API_URL, {
            contents: formattedMessages
        });

        if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
            return res.status(500).json({ error: "Invalid response from AI." });
        }

        const aiResponse = response.data.candidates[0]?.content?.parts[0]?.text || "I'm sorry, I couldn't generate a response.";

        messages.push({ role: "assistant", content: aiResponse });

        res.json({ response: aiResponse, messages });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Something went wrong.', details: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
