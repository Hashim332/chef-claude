import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// GET endpoint
app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello, TypeScript with Express!" });
});

import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`;

// 🚨👉 ALERT: Read message below! You've been warned! 👈🚨
// If you're following along on your local machine instead of
// here on Scrimba, make sure you don't commit your API keys
// to any repositories and don't deploy your project anywhere
// live online. Otherwise, anyone could inspect your source
// and find your API keys/tokens. If you want to deploy
// this project, you'll need to create a backend of some kind,
// either your own or using some serverless architecture where
// your API calls can be made. Doing so will keep your
// API keys private.

const anthropic = new Anthropic({
  // Make sure you set an environment variable in Scrimba
  // for ANTHROPIC_API_KEY
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function getRecipeFromChefClaude(ingredientsArr: string[]) {
  const ingredientsString = ingredientsArr.join(", ");

  const msg = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
      },
    ],
  });
  const x = msg.content[0];
  if (x.type === "text") {
    return x.text;
  }
  //   else {

  //   }
}

app.get("/api/get-recipe", async (req: Request, res: Response) => {
  console.log("my env variable", process.env.ANTHROPIC_API_KEY);
  const result = await getRecipeFromChefClaude(["apple", "banana", "milk"]);
  res.json({ message: result });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
