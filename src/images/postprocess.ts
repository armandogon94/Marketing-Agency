/**
 * Image Post-Processing — ImageMagick wrapper for resize, watermark, optimize.
 */

import { execa } from "execa";
import { join } from "path";

export interface ResizeOptions {
  width: number;
  height: number;
  fit?: "fill" | "contain" | "cover";
  quality?: number;
}

/**
 * Resize an image to exact dimensions.
 */
export async function resizeImage(
  inputPath: string,
  outputPath: string,
  options: ResizeOptions,
): Promise<string> {
  const { width, height, fit = "cover", quality = 90 } = options;

  const resizeFlag =
    fit === "fill"
      ? `${width}x${height}!`
      : fit === "contain"
        ? `${width}x${height}`
        : `${width}x${height}^`;

  const args = [inputPath, "-resize", resizeFlag, "-quality", String(quality)];

  if (fit === "cover") {
    args.push("-gravity", "center", "-extent", `${width}x${height}`);
  }

  args.push(outputPath);
  await execa("magick", args);
  return outputPath;
}

/**
 * Add a watermark/logo overlay to an image.
 */
export async function addWatermark(
  inputPath: string,
  watermarkPath: string,
  outputPath: string,
  options?: {
    position?: "southeast" | "southwest" | "northeast" | "northwest" | "center";
    opacity?: number;
    size?: number;
    margin?: number;
  },
): Promise<string> {
  const {
    position = "southeast",
    opacity = 30,
    size = 120,
    margin = 20,
  } = options ?? {};

  await execa("magick", [
    "composite",
    "-dissolve",
    String(opacity),
    "-gravity",
    position,
    "-geometry",
    `${size}x${size}+${margin}+${margin}`,
    watermarkPath,
    inputPath,
    outputPath,
  ]);

  return outputPath;
}

/**
 * Optimize image file size while maintaining quality.
 */
export async function optimizeImage(
  inputPath: string,
  outputPath: string,
  quality = 85,
): Promise<string> {
  await execa("magick", [
    inputPath,
    "-strip",
    "-interlace",
    "Plane",
    "-quality",
    String(quality),
    outputPath,
  ]);
  return outputPath;
}

/**
 * Convert image format.
 */
export async function convertFormat(
  inputPath: string,
  outputPath: string,
): Promise<string> {
  await execa("magick", [inputPath, outputPath]);
  return outputPath;
}

/**
 * Resize image for a specific social media platform.
 */
export async function resizeForPlatform(
  inputPath: string,
  outputDir: string,
  platform: string,
): Promise<string> {
  const specs: Record<string, { width: number; height: number }> = {
    instagram_square: { width: 1080, height: 1080 },
    instagram_story: { width: 1080, height: 1920 },
    youtube_thumbnail: { width: 1280, height: 720 },
    linkedin_post: { width: 1200, height: 627 },
    twitter_post: { width: 1200, height: 675 },
    facebook_post: { width: 1200, height: 630 },
  };

  const spec = specs[platform];
  if (!spec) {
    throw new Error(
      `Unknown platform: ${platform}. Available: ${Object.keys(specs).join(", ")}`,
    );
  }

  const outputPath = join(outputDir, `${platform}.jpg`);
  return resizeImage(inputPath, outputPath, {
    width: spec.width,
    height: spec.height,
    fit: "cover",
    quality: 90,
  });
}
