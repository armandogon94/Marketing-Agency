/**
 * Tier 3: Contact Sheet Vision Review (~690 tokens per video)
 * Generates a single 3x3 contact sheet and provides a structured review prompt.
 */

import { execa } from "execa";
import { join, dirname } from "path";

export interface ContactSheetOptions {
  rows?: number;
  cols?: number;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  useSceneDetection?: boolean;
  sceneThreshold?: number;
}

/**
 * Generate a contact sheet (thumbnail grid) from a video.
 * Returns the path to the generated JPEG.
 */
export async function generateContactSheet(
  videoPath: string,
  outputPath: string,
  options: ContactSheetOptions = {},
): Promise<string> {
  const {
    rows = 3,
    cols = 3,
    thumbnailWidth = 320,
    thumbnailHeight = 180,
    useSceneDetection = false,
    sceneThreshold = 10,
  } = options;

  const totalFrames = rows * cols;

  let filterChain: string;

  if (useSceneDetection) {
    // Scene detection: extract only frames at scene transitions
    filterChain = [
      `scdet=t=${sceneThreshold}:s=1`,
      `select='eq(scd,1)'`,
      `scale=${thumbnailWidth}:${thumbnailHeight}`,
      `tile=${cols}x${rows}`,
    ].join(",");
  } else {
    // Fixed interval: evenly spaced frames
    // Get duration first to calculate interval
    const { stdout } = await execa("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "csv=p=0",
      videoPath,
    ]);
    const duration = parseFloat(stdout.trim());
    const fps = duration > 0 ? totalFrames / duration : 1;

    filterChain = [
      `fps=${fps}`,
      `scale=${thumbnailWidth}:${thumbnailHeight}`,
      `tile=${cols}x${rows}`,
    ].join(",");
  }

  await execa("ffmpeg", [
    "-y",
    "-i",
    videoPath,
    "-vf",
    filterChain,
    "-frames:v",
    "1",
    "-q:v",
    "2",
    outputPath,
  ]);

  return outputPath;
}

/**
 * Generate a contact sheet and return the QA review prompt
 * to send alongside the image to Claude Vision.
 */
export async function prepareVisionReview(
  videoPath: string,
  outputDir: string,
  context?: string,
): Promise<{ imagePath: string; prompt: string }> {
  const imagePath = join(outputDir, "qa_contact_sheet.jpg");

  await generateContactSheet(videoPath, imagePath, {
    rows: 3,
    cols: 3,
    thumbnailWidth: 320,
    thumbnailHeight: 180,
  });

  const prompt = `You are a video QA specialist reviewing a 3x3 contact sheet from a generated marketing video.
${context ? `\nVideo context: ${context}` : ""}

For each visible frame, assess:
1. **Visual artifacts** — glitches, rendering errors, misaligned elements
2. **Color consistency** — brand colors maintained, no unexpected shifts
3. **Text readability** — all text/captions legible, properly positioned
4. **Composition** — elements properly aligned, no overflow/clipping
5. **Scene transitions** — smooth flow between frames, logical progression
6. **Brand compliance** — logo visible where expected, correct colors

Respond in this exact format:
- If all frames look good: "PASS: Video quality acceptable. [brief positive note]"
- If issues found: "FAIL: [specific issues with frame numbers if possible]"`;

  return { imagePath, prompt };
}

/**
 * Generate the default output path for a contact sheet
 */
export function getContactSheetPath(videoPath: string): string {
  return join(dirname(videoPath), "qa_contact_sheet.jpg");
}
