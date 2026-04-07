/**
 * Quick test: Generate an image with Google Gemini.
 * Usage: npx tsx src/images/test-gemini.ts
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { writeFile, mkdir } from "fs/promises";
import { config } from "dotenv";

config();

async function testGeminiImageGeneration() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    console.error("GOOGLE_AI_API_KEY not set in .env");
    process.exit(1);
  }

  console.log(`API Key: ${apiKey.slice(0, 8)}... (${apiKey.length} chars)`);
  console.log("Testing Gemini image generation...\n");

  const genAI = new GoogleGenerativeAI(apiKey);

  // Available image-capable models (from ListModels)
  const models = [
    "gemini-2.0-flash",
    "gemini-2.5-flash-image",
  ];

  for (const modelName of models) {
    console.log(`--- Trying model: ${modelName} ---`);
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
        } as any,
      });

      const result = await model.generateContent(
        "Generate an image of a professional marketing banner with bold white typography saying 'AI MARKETING' on a dark gradient background with gold accent lines, modern minimalist style, 16:9 aspect ratio"
      );
      const response = result.response;
      console.log("Response received!");

      const parts = response.candidates?.[0]?.content?.parts ?? [];
      let savedImage = false;

      for (const part of parts) {
        if ((part as any).inlineData) {
          await mkdir("output", { recursive: true });
          const imgData = (part as any).inlineData;
          const ext = imgData.mimeType?.includes("png") ? "png" : "jpg";
          const buffer = Buffer.from(imgData.data, "base64");
          const path = `output/test_${modelName.replace(/[^a-z0-9]/g, "_")}.${ext}`;
          await writeFile(path, buffer);
          console.log(`Image saved to: ${path} (${(buffer.length / 1024).toFixed(1)} KB)`);
          savedImage = true;
        }
        if ((part as any).text) {
          console.log("Text:", (part as any).text?.slice(0, 200));
        }
      }

      if (savedImage) {
        console.log("\nImage generation successful!");
        return;
      } else {
        console.log("No image data in response.");
      }
    } catch (err: any) {
      const msg = err.message ?? String(err);
      if (msg.includes("429")) {
        console.error(`Rate limited (429). Free tier quota exceeded — wait a few minutes or check billing at https://aistudio.google.com/`);
      } else {
        console.error(`Error: ${msg.slice(0, 300)}`);
      }
    }
    console.log();
  }
}

testGeminiImageGeneration();
