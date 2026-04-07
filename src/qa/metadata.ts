/**
 * Tier 1: Metadata Validation (Free — zero tokens)
 * Uses ffprobe to verify video/image metadata matches expectations.
 */

import { execa } from "execa";

export interface VideoMetadata {
  width: number;
  height: number;
  duration: number;
  codec: string;
  bitrate: number;
  hasAudio: boolean;
  fps: number;
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  fileSize: number;
}

export interface ValidationResult {
  pass: boolean;
  issues: string[];
}

export async function getVideoMetadata(
  videoPath: string,
): Promise<VideoMetadata> {
  const { stdout } = await execa("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height,duration,codec_name,bit_rate,r_frame_rate",
    "-show_entries",
    "format=duration",
    "-of",
    "json",
    videoPath,
  ]);

  const data = JSON.parse(stdout);
  const stream = data.streams?.[0] ?? {};
  const format = data.format ?? {};

  // Parse frame rate from "30/1" format
  const fpsRaw = stream.r_frame_rate ?? "30/1";
  const [num, den] = fpsRaw.split("/").map(Number);
  const fps = den ? num / den : 30;

  // Check for audio stream
  const audioResult = await execa("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "a:0",
    "-show_entries",
    "stream=codec_name",
    "-of",
    "csv=p=0",
    videoPath,
  ]);

  return {
    width: stream.width ?? 0,
    height: stream.height ?? 0,
    duration: parseFloat(format.duration ?? stream.duration ?? "0"),
    codec: stream.codec_name ?? "unknown",
    bitrate: parseInt(stream.bit_rate ?? "0", 10),
    hasAudio: audioResult.stdout.trim().length > 0,
    fps,
  };
}

export async function getImageMetadata(
  imagePath: string,
): Promise<ImageMetadata> {
  const { stdout } = await execa("magick", [
    "identify",
    "-format",
    "%w %h %m %b",
    imagePath,
  ]);

  const parts = stdout.trim().split(" ");
  return {
    width: parseInt(parts[0], 10),
    height: parseInt(parts[1], 10),
    format: parts[2] ?? "unknown",
    fileSize: parseInt(parts[3], 10),
  };
}

export function validateVideoMetadata(
  metadata: VideoMetadata,
  expected: {
    width?: number;
    height?: number;
    minDuration?: number;
    maxDuration?: number;
    codec?: string;
    requireAudio?: boolean;
  },
): ValidationResult {
  const issues: string[] = [];

  if (expected.width && metadata.width !== expected.width) {
    issues.push(
      `Width mismatch: got ${metadata.width}, expected ${expected.width}`,
    );
  }
  if (expected.height && metadata.height !== expected.height) {
    issues.push(
      `Height mismatch: got ${metadata.height}, expected ${expected.height}`,
    );
  }
  if (expected.minDuration && metadata.duration < expected.minDuration) {
    issues.push(
      `Too short: ${metadata.duration}s < ${expected.minDuration}s minimum`,
    );
  }
  if (expected.maxDuration && metadata.duration > expected.maxDuration) {
    issues.push(
      `Too long: ${metadata.duration}s > ${expected.maxDuration}s maximum`,
    );
  }
  if (expected.codec && metadata.codec !== expected.codec) {
    issues.push(
      `Codec mismatch: got ${metadata.codec}, expected ${expected.codec}`,
    );
  }
  if (expected.requireAudio && !metadata.hasAudio) {
    issues.push("Missing audio track");
  }

  return { pass: issues.length === 0, issues };
}

export function validateImageMetadata(
  metadata: ImageMetadata,
  expected: {
    width?: number;
    height?: number;
    maxFileSize?: number;
    format?: string;
  },
): ValidationResult {
  const issues: string[] = [];

  if (expected.width && metadata.width !== expected.width) {
    issues.push(
      `Width mismatch: got ${metadata.width}, expected ${expected.width}`,
    );
  }
  if (expected.height && metadata.height !== expected.height) {
    issues.push(
      `Height mismatch: got ${metadata.height}, expected ${expected.height}`,
    );
  }
  if (expected.maxFileSize && metadata.fileSize > expected.maxFileSize) {
    issues.push(
      `File too large: ${metadata.fileSize} > ${expected.maxFileSize} bytes`,
    );
  }
  if (
    expected.format &&
    metadata.format.toLowerCase() !== expected.format.toLowerCase()
  ) {
    issues.push(
      `Format mismatch: got ${metadata.format}, expected ${expected.format}`,
    );
  }

  return { pass: issues.length === 0, issues };
}
