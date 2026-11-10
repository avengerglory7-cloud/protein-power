
const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const multer = require("multer");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
    path: path.join(__dirname, "../.env")
});

const app = express();
const PORT = 3000;

// Check API key
if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing from .env");
    process.exit(1);
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(cors());
app.use(express.json());

// Original image is preserved. Maximum upload: 8 MB.
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 8 * 1024 * 1024
    },
    fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith("image/")) {
            callback(null, true);
        } else {
            callback(new Error("Please upload an image file."));
        }
    }
});

// Backend health check
app.get("/", (req, res) => {
    res.send("Protein Power Gemini AI Scanner is running!");
});

// AI food image analysis
app.post("/analyze", upload.single("foodImage"), async (req, res) => {

    const startTime = Date.now();

    try {
        if (!req.file) {
            return res.status(400).json({
                error: "Please upload a food image."
            });
        }

        // Convert original image without resizing
        const base64Image = req.file.buffer.toString("base64");

        // Shorter prompt for faster processing
        const prompt = `
Identify the food in this image and estimate nutrition
for the entire visible serving.

Return one complete JSON object with these fields:

{
  "food_name": "Food name",
  "serving_size": "Estimated serving size",
  "calories": 0,
  "protein": 0,
  "carbs": 0,
  "fat": 0,
  "sugar": 0,
  "fiber": 0,
  "confidence": "Low, Medium, or High",
  "notes": "One short sentence"
}

Rules:
- Nutrition values must be numbers.
- Estimate realistic values for the visible portion.
- Do not invent hidden ingredients.
- Mention uncertainty if portion size is unclear.
- Return complete valid JSON only.
`;

        // Gemini request
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",

            contents: [
                {
                    inlineData: {
                        mimeType: req.file.mimetype,
                        data: base64Image
                    }
                },
                {
                    text: prompt
                }
            ],

            config: {
                responseMimeType: "application/json",

                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        food_name: { type: "STRING" },
                        serving_size: { type: "STRING" },
                        calories: { type: "NUMBER" },
                        protein: { type: "NUMBER" },
                        carbs: { type: "NUMBER" },
                        fat: { type: "NUMBER" },
                        sugar: { type: "NUMBER" },
                        fiber: { type: "NUMBER" },
                        confidence: {
                            type: "STRING",
                            enum: ["Low", "Medium", "High"]
                        },
                        notes: { type: "STRING" }
                    },
                    required: [
                        "food_name",
                        "serving_size",
                        "calories",
                        "protein",
                        "carbs",
                        "fat",
                        "sugar",
                        "fiber",
                        "confidence",
                        "notes"
                    ]
                },

                thinkingConfig: {
                    thinkingLevel: "LOW"
                },

                maxOutputTokens: 1024,
                temperature: 0.1
            }
        });

        // Check Gemini response
        const candidate = response.candidates?.[0];

        console.log(
            "Gemini finish reason:",
            candidate?.finishReason
        );

        if (!response.text || !response.text.trim()) {
            throw new Error(
                "Gemini returned an empty response. Please try again."
            );
        }

        // Clean response
        let responseText = response.text.trim();

        responseText = responseText
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/, "")
            .trim();

        // Parse JSON
        let result;

        try {
            result = JSON.parse(responseText);
        } catch (error) {
            console.error("Invalid Gemini JSON:", responseText);

            throw new Error(
                "Gemini returned an incomplete result. Please try again."
            );
        }

        // Validate nutrition values
        const numericFields = [
            "calories",
            "protein",
            "carbs",
            "fat",
            "sugar",
            "fiber"
        ];

        for (const field of numericFields) {
            if (
                typeof result[field] !== "number" ||
                !Number.isFinite(result[field])
            ) {
                throw new Error(
                    `Invalid nutrition value: ${field}`
                );
            }
        }

        // Calculate processing time
        const elapsed = (
            (Date.now() - startTime) / 1000
        ).toFixed(1);

        console.log(
            `Food analysis completed in ${elapsed} seconds`
        );

        // Return results to website
        res.json(result);

    } catch (error) {

        console.error("Gemini scanner error:", error);

        res.status(500).json({
            error: "Food analysis failed. " +
                (error.message || "Please try again.")
        });
    }
});

// Upload error handling
app.use((error, req, res, next) => {
    console.error("Server error:", error);

    res.status(400).json({
        error: error.message || "Something went wrong."
    });
});

// Start backend
app.listen(PORT, () => {
    console.log(
        `Protein Power Gemini backend running at http://localhost:${PORT}`
    );
});

