/**
 * Tier 2: Error Pattern Detection (Free — zero tokens)
 * Uses FFmpeg analysis filters to detect rendering failures.
 */

import { execa } from "execa";

export interface DetectionResult {
  pass: boolean;
  blackFrames: { start: number; end: number; duration: number }[];
  freezeFrames: { start: number; duration: number }[];
  silentSegments: { start: number; end: number; duration: number }[];
}

export async function detectBlackFrames(
  videoPath: string,
  minDuration = 1,
  pixelThreshold = 0.0,
): Promise<{ start: number; end: number; duration: number }[]> {
  const { stderr } = await execa(
    "ffmpeg",
    [
      "-i",
      videoPath,
      "-vf",
      `blackdetect=d=${minDuration}:pix_th=${pixelThreshold}`,
      "-f",
      "null",
      "-",
    ],
    { reject: false },
  );

  const frames: { start: number; end: number; duration: number }[] = [];
  const regex =
    /black_start:(\d+\.?\d*)\s+black_end:(\d+\.?\d*)\s+black_duration:(\d+\.?\d*)/g;
  let match;
  while ((match = regex.exec(stderr)) !== null) {
    frames.push({
      start: parseFloat(match[1]),
      end: parseFloat(match[2]),
      duration: parseFloat(match[3]),
    });
  }
  return frames;
}

export async function detectFreezeFrames(
  videoPath: string,
  minDuration = 1,
  noiseThreshold = 0.001,
): Promise<{ start: number; duration: number }[]> {
  const { stderr } = await execa(
    "ffmpeg",
    [
      "-i",
      videoPath,
      "-vf",
      `freezedetect=d=${minDuration}:noise=${noiseThreshold}`,
      "-f",
      "null",
      "-",
    ],
    { reject: false },
  );

  const frames: { start: number; duration: number }[] = [];
  const regex = /freeze_start:\s*(\d+\.?\d*)[\s\S]*?freeze_duration:\s*(\d+\.?\d*)/g;
  let match;
  while ((match = regex.exec(stderr)) !== null) {
    frames.push({
      start: parseFloat(match[1]),
      duration: parseFloat(match[2]),
    });
  }
  return frames;
}

export async function detectSilence(
  videoPath: string,
  noiseDb = -50,
  minDuration = 3,
): Promise<{ start: number; end: number; duration: number }[]> {
  const { stderr } = await execa(
    "ffmpeg",
    [
      "-i",
      videoPath,
      "-af",
      `silencedetect=n=${noiseDb}dB:d=${minDuration}`,
      "-f",
      "null",
      "-",
    ],
    { reject: false },
  );

  const segments: { start: number; end: number; duration: number }[] = [];
  const regex =
    /silence_start:\s*(\d+\.?\d*)[\s\S]*?silence_end:\s*(\d+\.?\d*)\s*\|\s*silence_duration:\s*(\d+\.?\d*)/g;
  let match;
  while ((match = regex.exec(stderr)) !== null) {
    segments.push({
      start: parseFloat(match[1]),
      end: parseFloat(match[2]),
      duration: parseFloat(match[3]),
    });
  }
  return segments;
}

export async function runAllDetections(
  videoPath: string,
): Promise<DetectionResult> {
  const [blackFrames, freezeFrames, silentSegments] = await Promise.all([
    detectBlackFrames(videoPath),
    detectFreezeFrames(videoPath),
    detectSilence(videoPath),
  ]);

  const pass =
    blackFrames.length === 0 &&
    freezeFrames.length === 0 &&
    silentSegments.length === 0;

  return { pass, blackFrames, freezeFrames, silentSegments };
}
