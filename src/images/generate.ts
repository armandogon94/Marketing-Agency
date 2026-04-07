/**
 * Image Generation — Wraps Google Generative AI (Gemini) for marketing images.
 * Uses the 5-component prompt formula: Subject + Action + Context + Composition + Style.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";

export type AspectRatio =
  | "1:1"
  | "16:9"
  | "9:16"
  | "4:3"
  | "3:4"
  | "1.91:1";

export interface GenerateImageOptions {
  prompt: string;
  aspectRatio?: AspectRatio;
  model?: string;
  outputPath?: string;
  numberOfImages?: number;
}

export interface GeneratedImage {
  path: string;
  mimeType: string;
  prompt: string;
  aspectRatio: AspectRatio;
}

const ASPECT_RATIO_MAP: Record<AspectRatio, { width: number; height: number }> =
  {
    "1:1": { width: 1024, height: 1024 },
    "16:9": { width: 1536, height: 864 },
    "9:16": { width: 864, height: 1536 },
    "4:3": { width: 1024, height: 768 },
    "3:4": { width: 768, height: 1024 },
    "1.91:1": { width: 1200, height: 628 },
  };

/**
 * Build a marketing-optimized prompt using the 5-component formula.
 */
export function buildMarketingPrompt(components: {
  subject: string;
  action?: string;
  context?: string;
  composition?: string;
  style?: string;
  brandColors?: string[];
}): string {
  const parts = [components.subject];

  if (components.action) parts.push(components.action);
  if (components.context) parts.push(`in ${components.context}`);
  if (components.composition) parts.push(components.composition);
  if (components.style) parts.push(`${components.style} style`);
  if (components.brandColors?.length) {
    parts.push(
      `using brand colors: ${components.brandColors.join(", ")}`,
    );
  }

  return parts.join(", ");
}

/**
 * Generate an image using Google Gemini.
 */
export async function generateImage(
  options: GenerateImageOptions,
): Promise<GeneratedImage> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GOOGLE_AI_API_KEY not set. Get one at https://aistudio.google.com/apikey",
    );
  }

  const {
    prompt,
    aspectRatio = "16:9",
    model = "gemini-2.5-flash-image",
    outputPath = join("output", `image_${Date.now()}.png`),
    numberOfImages = 1,
  } = options;

  const genAI = new GoogleGenerativeAI(apiKey);
  const genModel = genAI.getGenerativeModel({
    model,
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
    } as Record<string, unknown>,
  });

  const dimensions = ASPECT_RATIO_MAP[aspectRatio];
  const fullPrompt = `${prompt}. Resolution: ${dimensions.width}x${dimensions.height}. Aspect ratio: ${aspectRatio}. Professional marketing quality, clean composition, vibrant colors.`;

  const result = await genModel.generateContent(fullPrompt);
  const response = result.response;

  // Extract image data from response
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find(
    (p: Record<string, unknown>) => p.inlineData,
  ) as
    | { inlineData: { data: string; mimeType: string } }
    | undefined;

  if (!imagePart?.inlineData) {
    throw new Error("No image data in Gemini response");
  }

  // Write image to file
  await mkdir(dirname(outputPath), { recursive: true });
  const buffer = Buffer.from(imagePart.inlineData.data, "base64");
  await writeFile(outputPath, buffer);

  return {
    path: outputPath,
    mimeType: imagePart.inlineData.mimeType,
    prompt: fullPrompt,
    aspectRatio,
  };
}

export { ASPECT_RATIO_MAP };
