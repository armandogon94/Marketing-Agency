/**
 * Comparison — Side-by-side comparison of original vs replicated animation.
 */

import { execa } from "execa";
import { mkdir } from "fs/promises";
import { join, dirname } from "path";

/**
 * Create a side-by-side comparison video of original and replicated animations.
 */
export async function createComparisonVideo(
  originalPath: string,
  replicatedPath: string,
  outputPath: string,
  options?: {
    width?: number;
    height?: number;
    label?: boolean;
  },
): Promise<string> {
  const { width = 1920, height = 540, label = true } = options ?? {};
  const halfWidth = Math.floor(width / 2);

  await mkdir(dirname(outputPath), { recursive: true });

  let filterComplex = [
    `[0:v]scale=${halfWidth}:${height}:force_original_aspect_ratio=decrease,pad=${halfWidth}:${height}:(ow-iw)/2:(oh-ih)/2[left]`,
    `[1:v]scale=${halfWidth}:${height}:force_original_aspect_ratio=decrease,pad=${halfWidth}:${height}:(ow-iw)/2:(oh-ih)/2[right]`,
    `[left][right]hstack=inputs=2[out]`,
  ];

  if (label) {
    filterComplex = [
      `[0:v]scale=${halfWidth}:${height}:force_original_aspect_ratio=decrease,pad=${halfWidth}:${height}:(ow-iw)/2:(oh-ih)/2,drawtext=text='ORIGINAL':fontsize=24:fontcolor=white:x=10:y=10:box=1:boxcolor=black@0.5:boxborderw=5[left]`,
      `[1:v]scale=${halfWidth}:${height}:force_original_aspect_ratio=decrease,pad=${halfWidth}:${height}:(ow-iw)/2:(oh-ih)/2,drawtext=text='REPLICATED':fontsize=24:fontcolor=white:x=10:y=10:box=1:boxcolor=black@0.5:boxborderw=5[right]`,
      `[left][right]hstack=inputs=2[out]`,
    ];
  }

  await execa("ffmpeg", [
    "-y",
    "-i",
    originalPath,
    "-i",
    replicatedPath,
    "-filter_complex",
    filterComplex.join(";"),
    "-map",
    "[out]",
    "-c:v",
    "libx264",
    "-crf",
    "18",
    "-preset",
    "medium",
    "-movflags",
    "+faststart",
    outputPath,
  ]);

  return outputPath;
}

/**
 * Create a contact sheet comparison (original frames on top, replicated on bottom).
 */
export async function createComparisonSheet(
  originalPath: string,
  replicatedPath: string,
  outputPath: string,
  cols = 5,
): Promise<string> {
  await mkdir(dirname(outputPath), { recursive: true });

  // Extract frames from both videos and create a comparison grid
  const filterComplex = [
    `[0:v]fps=1,scale=256:144,tile=${cols}x1[top]`,
    `[1:v]fps=1,scale=256:144,tile=${cols}x1[bottom]`,
    `[top][bottom]vstack=inputs=2[out]`,
  ];

  await execa("ffmpeg", [
    "-y",
    "-i",
    originalPath,
    "-i",
    replicatedPath,
    "-filter_complex",
    filterComplex.join(";"),
    "-map",
    "[out]",
    "-frames:v",
    "1",
    "-q:v",
    "2",
    outputPath,
  ]);

  return outputPath;
}
