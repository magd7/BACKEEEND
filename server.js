const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

// Middlewares
app.use(bodyParser.json({ limit: '10mb' })); // To parse large base64 images
app.use(express.static('public')); // Serve static files from 'public' folder

// OCR API route
app.post('/perform-ocr', async (req, res) => {
    const { base64Image, language } = req.body;

    const apiKey = 'K88018353088957'; // Securely stored API key
    try {
        const response = await fetch('https://api.ocr.space/parse/image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                apikey: apiKey,
                base64Image: base64Image,
                language: language,
            }),
        });

        const data = await response.json();

        if (data.IsErroredOnProcessing) {
            return res.status(400).json({ error: data.ErrorMessage });
        }

        res.json({ parsedText: data.ParsedResults[0].ParsedText });
    } catch (error) {
        console.error('Error during OCR:', error);
        res.status(500).json({ error: 'Server error during OCR.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
