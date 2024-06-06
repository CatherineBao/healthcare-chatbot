import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from 'openai';
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post("/chat", async (req, res) => {
    try {
      const { prompt } = req.body;
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 512,
        temperature: 0,
      });
      res.send(response.data.choices[0].text);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("An error occurred");
    }
  });

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

app.get("/", (req, res) => {
    res.send("Server is running. Use /chat to POST prompts.");
  });