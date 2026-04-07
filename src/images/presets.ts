/**
 * Brand Presets — Load brand configuration and apply to image generation.
 */

import { readFile, readdir } from "fs/promises";
import { join, extname } from "path";

export interface BrandConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
    custom: string[];
  };
  logo: {
    primary: string;
    icon: string;
    watermark: string;
  };
  voice: {
    tts_voice: string;
    tone: string;
    language: string;
  };
  broll: {
    intro: string;
    outro: string;
    transitions: string[];
  };
  social: {
    handle: string;
    hashtags: string[];
  };
  style: {
    mood: string;
    colorGrading: string;
    captionPosition: string;
  };
}

/**
 * Load a brand configuration from brand/<name>.json
 */
export async function loadBrand(
  brandName = "default",
  brandDir = "brand",
): Promise<BrandConfig> {
  const filePath = join(brandDir, `${brandName}.json`);
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as BrandConfig;
}

/**
 * List available brand assets by category.
 */
export async function listBrandAssets(
  brandDir = "brand/assets",
): Promise<Record<string, string[]>> {
  const categories = [
    "logos",
    "fonts",
    "colors",
    "images",
    "videos",
    "audio",
    "templates",
  ];

  const assets: Record<string, string[]> = {};

  for (const category of categories) {
    try {
      const dir = join(brandDir, category);
      const files = await readdir(dir);
      assets[category] = files.filter(
        (f) => !f.startsWith(".") && f !== ".gitkeep",
      );
    } catch {
      assets[category] = [];
    }
  }

  return assets;
}

/**
 * Get available logo files for a brand.
 */
export async function getBrandLogos(
  brandDir = "brand/assets/logos",
): Promise<string[]> {
  try {
    const files = await readdir(brandDir);
    return files
      .filter((f) => {
        const ext = extname(f).toLowerCase();
        return [".svg", ".png", ".jpg", ".jpeg", ".webp"].includes(ext);
      })
      .map((f) => join(brandDir, f));
  } catch {
    return [];
  }
}

/**
 * Get available B-roll videos for a brand.
 */
export async function getBrandBRoll(
  brandDir = "brand/assets/videos",
): Promise<string[]> {
  try {
    const files = await readdir(brandDir);
    return files
      .filter((f) => {
        const ext = extname(f).toLowerCase();
        return [".mp4", ".mov", ".webm", ".avi"].includes(ext);
      })
      .map((f) => join(brandDir, f));
  } catch {
    return [];
  }
}

/**
 * Build a brand-aware image prompt by injecting brand colors and style.
 */
export function applyBrandToPrompt(
  prompt: string,
  brand: BrandConfig,
): string {
  const colorList = [
    brand.colors.primary,
    brand.colors.secondary,
    brand.colors.accent,
  ].join(", ");

  return `${prompt}. Brand color palette: ${colorList}. Mood: ${brand.style.mood}. Style: clean, professional marketing aesthetic.`;
}
