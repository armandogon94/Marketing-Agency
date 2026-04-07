/**
 * Hedra Integration — AI avatar video generation at $0.05/min.
 *
 * Character-3: omnimodal model processing image + text + audio simultaneously.
 * 140+ languages, industry-leading lip-sync accuracy.
 *
 * SDK: hedra-node (npm install hedra-node)
 * Auth: HEDRA_API_KEY environment variable
 * Free plan: 300 credits/month (~50s @ 720p), watermarked
 * Creator plan: $24/mo, 4,000 credits, voice cloning, no watermark
 */

import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";

const HEDRA_API_BASE = "https://api.hedra.com";

export interface HedraVideoOptions {
  imageUrl: string;
  text?: string;
  audioUrl?: string;
  voiceId?: string;
  resolution?: "540p" | "720p";
  duration?: number;
}

export interface HedraVideoResult {
  jobId: string;
  status: "queued" | "processing" | "completed" | "failed";
  videoUrl?: string;
  creditsUsed?: number;
}

function getApiKey(): string {
  const key = process.env.HEDRA_API_KEY;
  if (!key) {
    throw new Error(
      "HEDRA_API_KEY not set. Sign up free at https://www.hedra.com/ → Profile → Generate API key",
    );
  }
  return key;
}

async function hedraFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const apiKey = getApiKey();
  return fetch(`${HEDRA_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

/**
 * List available models.
 */
export async function listModels(): Promise<unknown[]> {
  const res = await hedraFetch("/web-app/public/models");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

/**
 * Create an avatar video with Character-3.
 * Provide an image + text (for TTS) or image + audio file.
 */
export async function createVideo(
  options: HedraVideoOptions,
): Promise<HedraVideoResult> {
  const body: Record<string, unknown> = {
    image_url: options.imageUrl,
    resolution: options.resolution ?? "720p",
  };

  if (options.text) {
    body.text = options.text;
    if (options.voiceId) body.voice_id = options.voiceId;
  }
  if (options.audioUrl) {
    body.audio_url = options.audioUrl;
  }
  if (options.duration) {
    body.duration = options.duration;
  }

  const res = await hedraFetch("/web-app/public/characters", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as { job_id?: string; error?: string };

  if (!res.ok || data.error) {
    throw new Error(`Hedra error: ${data.error ?? res.statusText}`);
  }

  return {
    jobId: data.job_id ?? "",
    status: "queued",
  };
}

/**
 * Check video generation status.
 */
export async function getStatus(
  jobId: string,
): Promise<HedraVideoResult> {
  const res = await hedraFetch(`/web-app/public/characters/${jobId}`);
  const data = (await res.json()) as {
    job_id: string;
    status: string;
    video_url?: string;
    credits_used?: number;
  };

  return {
    jobId: data.job_id,
    status: data.status as HedraVideoResult["status"],
    videoUrl: data.video_url,
    creditsUsed: data.credits_used,
  };
}

/**
 * Poll until video is ready.
 */
export async function waitForVideo(
  jobId: string,
  maxWaitMs = 300_000,
  pollIntervalMs = 3_000,
): Promise<HedraVideoResult> {
  const start = Date.now();

  while (Date.now() - start < maxWaitMs) {
    const result = await getStatus(jobId);

    if (result.status === "completed") return result;
    if (result.status === "failed") {
      throw new Error(`Hedra video ${jobId} failed`);
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error(`Hedra video ${jobId} timed out after ${maxWaitMs}ms`);
}

/**
 * Download a completed video to a local file.
 */
export async function downloadVideo(
  videoUrl: string,
  outputPath: string,
): Promise<string> {
  await mkdir(dirname(outputPath), { recursive: true });
  const res = await fetch(videoUrl);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(outputPath, buffer);
  return outputPath;
}

/**
 * Full pipeline: create video → wait → download.
 */
export async function generateVideo(
  options: HedraVideoOptions & { outputDir?: string },
): Promise<{ jobId: string; localPath: string; creditsUsed?: number }> {
  const result = await createVideo(options);
  const completed = await waitForVideo(result.jobId);

  if (!completed.videoUrl) {
    throw new Error("Video completed but no URL available");
  }

  const outputDir = options.outputDir ?? "output";
  const localPath = join(outputDir, `hedra_${result.jobId}.mp4`);
  await downloadVideo(completed.videoUrl, localPath);

  return {
    jobId: result.jobId,
    localPath,
    creditsUsed: completed.creditsUsed,
  };
}

/**
 * Credit cost estimates.
 * Free: 300 credits/month. Creator ($24/mo): 4,000 credits.
 */
export const CREDIT_COSTS = {
  "540p-per-second": 3,
  "720p-per-second": 6,
  "540p-per-minute": 180,
  "720p-per-minute": 360,
  "premium-voice-per-1k-chars": 15,
  "live-avatar-per-minute": 0.05, // USD not credits
} as const;
