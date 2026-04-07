/**
 * FFmpeg Analysis — Frame extraction, scene detection, metadata extraction.
 */

import { execa } from "execa";

export interface SceneChange {
  timestamp: number;
  frame: number;
  score: number;
}

/**
 * Detect scene changes in a video.
 */
export async function detectScenes(
  videoPath: string,
  threshold = 0.3,
): Promise<SceneChange[]> {
  const { stderr } = await execa(
    "ffmpeg",
    [
      "-i",
      videoPath,
      "-vf",
      `select='gt(scene,${threshold})',showinfo`,
      "-f",
      "null",
      "-",
    ],
    { reject: false },
  );

  const scenes: SceneChange[] = [];
  const regex = /pts_time:(\d+\.?\d*)\s.*n:\s*(\d+)/g;
  let match;
  while ((match = regex.exec(stderr)) !== null) {
    scenes.push({
      timestamp: parseFloat(match[1]),
      frame: parseInt(match[2], 10),
      score: threshold,
    });
  }
  return scenes;
}

/**
 * Get detailed video metadata.
 */
export async function getDetailedMetadata(videoPath: string): Promise<{
  format: string;
  duration: number;
  bitrate: number;
  videoCodec: string;
  audioCodec: string;
  width: number;
  height: number;
  fps: number;
  totalFrames: number;
}> {
  const { stdout } = await execa("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=format_name,duration,bit_rate",
    "-show_entries",
    "stream=codec_name,codec_type,width,height,r_frame_rate,nb_frames",
    "-of",
    "json",
    videoPath,
  ]);

  const data = JSON.parse(stdout);
  const video = data.streams?.find(
    (s: Record<string, string>) => s.codec_type === "video",
  ) ?? {};
  const audio = data.streams?.find(
    (s: Record<string, string>) => s.codec_type === "audio",
  ) ?? {};
  const format = data.format ?? {};

  const fpsRaw = video.r_frame_rate ?? "30/1";
  const [num, den] = fpsRaw.split("/").map(Number);
  const fps = den ? num / den : 30;

  return {
    format: format.format_name ?? "unknown",
    duration: parseFloat(format.duration ?? "0"),
    bitrate: parseInt(format.bit_rate ?? "0", 10),
    videoCodec: video.codec_name ?? "unknown",
    audioCodec: audio.codec_name ?? "none",
    width: video.width ?? 0,
    height: video.height ?? 0,
    fps,
    totalFrames: parseInt(video.nb_frames ?? "0", 10),
  };
}
