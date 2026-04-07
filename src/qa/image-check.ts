/**
 * Image QA: Validate generated images before delivery.
 * Tier 1 (free): metadata validation
 * Tier 2 (free): histogram analysis for generation failures
 * Tier 3 (~228 tokens): thumbnail vision review
 */

import { execa } from "execa";
import { join, dirname } from "path";
import {
  getImageMetadata,
  validateImageMetadata,
  type ValidationResult,
} from "./metadata";

export interface ImageQAResult {
  tier1: ValidationResult;
  tier2: { pass: boolean; issues: string[] };
  thumbnailPath?: string;
  reviewPrompt?: string;
}

/**
 * Platform dimension specs for image validation.
 */
export const PLATFORM_IMAGE_SPECS = {
  instagram_square: { width: 1080, height: 1080 },
  instagram_story: { width: 1080, height: 1920 },
  youtube_thumbnail: { width: 1280, height: 720 },
  linkedin_post: { width: 1200, height: 627 },
  linkedin_banner: { width: 1584, height: 396 },
  twitter_post: { width: 1200, height: 675 },
  facebook_post: { width: 1200, height: 630 },
  tiktok_cover: { width: 1080, height: 1920 },
} as const;

/**
 * Tier 2: Histogram analysis to detect generation failures.
 * Checks for mostly-black or mostly-white images.
 */
async function checkHistogram(
  imagePath: string,
): Promise<{ pass: boolean; issues: string[] }> {
  const issues: string[] = [];

  try {
    // Get mean brightness (0-255)
    const { stdout } = await execa("magick", [
      imagePath,
      "-colorspace",
      "Gray",
      "-format",
      "%[fx:mean*255]",
      "info:",
    ]);

    const meanBrightness = parseFloat(stdout.trim());

    if (meanBrightness < 5) {
      issues.push(
        `Image appears all-black (mean brightness: ${meanBrightness.toFixed(1)})`,
      );
    }
    if (meanBrightness > 250) {
      issues.push(
        `Image appears all-white (mean brightness: ${meanBrightness.toFixed(1)})`,
      );
    }

    // Check standard deviation (low = uniform/failed generation)
    const { stdout: stdOut } = await execa("magick", [
      imagePath,
      "-colorspace",
      "Gray",
      "-format",
      "%[fx:standard_deviation*255]",
      "info:",
    ]);

    const stdDev = parseFloat(stdOut.trim());
    if (stdDev < 2) {
      issues.push(
        `Image has almost no variation (std dev: ${stdDev.toFixed(1)}) — possible generation failure`,
      );
    }
  } catch {
    issues.push("Could not analyze histogram (ImageMagick error)");
  }

  return { pass: issues.length === 0, issues };
}

/**
 * Generate a small thumbnail for vision review.
 */
async function generateThumbnail(
  imagePath: string,
  outputPath: string,
  width = 320,
  height = 180,
): Promise<string> {
  await execa("magick", [
    imagePath,
    "-resize",
    `${width}x${height}`,
    "-quality",
    "85",
    outputPath,
  ]);
  return outputPath;
}

/**
 * Run full image QA pipeline.
 */
export async function checkImage(
  imagePath: string,
  expected?: {
    width?: number;
    height?: number;
    maxFileSize?: number;
    format?: string;
    platform?: keyof typeof PLATFORM_IMAGE_SPECS;
  },
): Promise<ImageQAResult> {
  // Resolve platform specs if provided
  const specs = expected?.platform
    ? { ...PLATFORM_IMAGE_SPECS[expected.platform], ...expected }
    : expected;

  // Tier 1: Metadata validation
  const metadata = await getImageMetadata(imagePath);
  const tier1 = validateImageMetadata(metadata, specs ?? {});

  // Tier 2: Histogram analysis
  const tier2 = await checkHistogram(imagePath);

  // Prepare Tier 3 thumbnail for vision review
  const thumbnailPath = join(dirname(imagePath), "qa_thumbnail.jpg");
  await generateThumbnail(imagePath, thumbnailPath);

  const reviewPrompt = `Review this generated marketing image for quality:
1. Visual quality — sharp, no artifacts, no distortion
2. Text readability — all text legible and properly positioned
3. Color quality — vibrant, appropriate for marketing use
4. Composition — well-balanced, professional appearance
5. Brand alignment — consistent with marketing aesthetic

Respond: "PASS: [brief note]" or "FAIL: [specific issues]"`;

  return { tier1, tier2, thumbnailPath, reviewPrompt };
}
