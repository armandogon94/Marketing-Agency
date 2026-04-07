/**
 * Frame Extraction — Extract frames from reference videos for animation analysis.
 */

import { execa } from "execa";
import { mkdir, readdir } from "fs/promises";
import { join } from "path";

export interface ExtractionOptions {
  interval?: number; // Seconds between frames (default: 0.5)
  maxFrames?: number; // Maximum frames to extract
  width?: number; // Thumbnail width (default: 640)
  height?: number; // Thumbnail height (default: 360)
  useSceneDetection?: boolean;
  sceneThreshold?: number;
}

export interface ExtractionResult {
  frames: string[];
  outputDir: string;
  videoMetadata: {
    duration: number;
    fps: number;
    width: number;
    height: number;
  };
}

/**
 * Get video metadata using ffprobe.
 */
async function getVideoInfo(
  videoPath: string,
): Promise<{ duration: number; fps: number; width: number; height: number }> {
  const { stdout } = await execa("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height,r_frame_rate",
    "-show_entries",
    "format=duration",
    "-of",
    "json",
    videoPath,
  ]);

  const data = JSON.parse(stdout);
  const stream = data.streams?.[0] ?? {};
  const format = data.format ?? {};

  const fpsRaw = stream.r_frame_rate ?? "30/1";
  const [num, den] = fpsRaw.split("/").map(Number);

  return {
    duration: parseFloat(format.duration ?? "0"),
    fps: den ? num / den : 30,
    width: stream.width ?? 0,
    height: stream.height ?? 0,
  };
}

/**
 * Extract frames at fixed intervals.
 */
export async function extractFrames(
  videoPath: string,
  outputDir: string,
  options: ExtractionOptions = {},
): Promise<ExtractionResult> {
  const {
    interval = 0.5,
    maxFrames = 50,
    width = 640,
    height = 360,
    useSceneDetection = false,
    sceneThreshold = 10,
  } = options;

  await mkdir(outputDir, { recursive: true });

  const videoInfo = await getVideoInfo(videoPath);
  const outputPattern = join(outputDir, "frame_%04d.jpg");

  let filterChain: string;

  if (useSceneDetection) {
    filterChain = [
      `scdet=t=${sceneThreshold}:s=1`,
      `select='eq(scd,1)'`,
      `scale=${width}:${height}`,
    ].join(",");
  } else {
    const fps = 1 / interval;
    filterChain = [`fps=${fps}`, `scale=${width}:${height}`].join(",");
  }

  await execa("ffmpeg", [
    "-y",
    "-i",
    videoPath,
    "-vf",
    filterChain,
    "-frames:v",
    String(maxFrames),
    "-q:v",
    "2",
    "-vsync",
    "vfr",
    outputPattern,
  ]);

  // List extracted frames
  const files = await readdir(outputDir);
  const frames = files
    .filter((f) => f.startsWith("frame_") && f.endsWith(".jpg"))
    .sort()
    .map((f) => join(outputDir, f));

  return {
    frames,
    outputDir,
    videoMetadata: videoInfo,
  };
}

/**
 * Extract a single frame at a specific timestamp.
 */
export async function extractFrameAt(
  videoPath: string,
  timestamp: number,
  outputPath: string,
  width = 640,
  height = 360,
): Promise<string> {
  await execa("ffmpeg", [
    "-y",
    "-ss",
    String(timestamp),
    "-i",
    videoPath,
    "-vf",
    `scale=${width}:${height}`,
    "-frames:v",
    "1",
    "-q:v",
    "2",
    outputPath,
  ]);
  return outputPath;
}

/**
 * Extract key frames using scene detection (smarter than fixed intervals).
 */
export async function extractKeyFrames(
  videoPath: string,
  outputDir: string,
  threshold = 10,
  maxFrames = 30,
): Promise<ExtractionResult> {
  return extractFrames(videoPath, outputDir, {
    useSceneDetection: true,
    sceneThreshold: threshold,
    maxFrames,
  });
}
