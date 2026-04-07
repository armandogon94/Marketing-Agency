/**
 * Higgsfield Integration — AI video generation with multiple models.
 *
 * Requires Studio plan ($199/mo) for API access.
 * SDK: @higgsfield/client (Node.js) or higgsfield-client (Python)
 *
 * Capabilities:
 * - Text-to-video (Kling 3.0, Sora 2, Veo 3.1, WAN 2.6)
 * - Image-to-video animation
 * - Lipsync Studio (speech-to-video)
 * - Director Mode (structured scene control)
 * - Nano Banana Pro (4K image generation)
 */

import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";

const HF_API_BASE = "https://api.higgsfield.ai/v1";

export type HiggsModel =
  | "kling-3.0"
  | "sora-2"
  | "veo-3.1"
  | "wan-2.6"
  | "cinema-studio-3.0";

export type HiggsResolution = "720p" | "1080p";

export interface HiggsVideoOptions {
  prompt: string;
  model?: HiggsModel;
  resolution?: HiggsResolution;
  duration?: 4 | 8 | 16;
  imageUrl?: string; // For image-to-video
  aspectRatio?: "16:9" | "9:16" | "1:1";
}

export interface HiggsVideoResult {
  requestId: string;
  status: "queued" | "processing" | "completed" | "failed";
  videoUrl?: string;
  creditsUsed?: number;
}

function getCredentials(): { keyId: string; keySecret: string } {
  const keyId = process.env.HF_API_KEY;
  const keySecret = process.env.HF_API_SECRET;
  if (!keyId || !keySecret) {
    throw new Error(
      "HF_API_KEY and HF_API_SECRET not set. " +
        "Get credentials at https://higgsfield.ai/settings/api (requires Studio plan)",
    );
  }
  return { keyId, keySecret };
}

async function higgsFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const { keyId, keySecret } = getCredentials();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  return fetch(`${HF_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

/**
 * Generate a text-to-video.
 */
export async function createVideo(
  options: HiggsVideoOptions,
): Promise<HiggsVideoResult> {
  const {
    prompt,
    model = "kling-3.0",
    resolution = "1080p",
    duration = 8,
    aspectRatio = "16:9",
    imageUrl,
  } = options;

  const body: Record<string, unknown> = {
    prompt,
    model,
    resolution,
    duration,
    aspect_ratio: aspectRatio,
  };

  if (imageUrl) {
    body.image_url = imageUrl;
    body.type = "image-to-video";
  }

  const res = await higgsFetch("/generations", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as {
    id: string;
    status: string;
    error?: string;
  };

  if (data.error) throw new Error(`Higgsfield error: ${data.error}`);

  return {
    requestId: data.id,
    status: "queued",
  };
}

/**
 * Create a lipsync video from audio/text + character.
 */
export async function createLipsyncVideo(options: {
  text: string;
  characterId?: string;
  voiceId?: string;
  resolution?: HiggsResolution;
}): Promise<HiggsVideoResult> {
  const res = await higgsFetch("/lipsync", {
    method: "POST",
    body: JSON.stringify({
      text: options.text,
      character_id: options.characterId,
      voice_id: options.voiceId,
      resolution: options.resolution ?? "1080p",
    }),
  });

  const data = (await res.json()) as {
    id: string;
    status: string;
    error?: string;
  };

  if (data.error) throw new Error(`Higgsfield lipsync error: ${data.error}`);

  return { requestId: data.id, status: "queued" };
}

/**
 * Generate a 4K image with Nano Banana Pro.
 */
export async function generateImage(options: {
  prompt: string;
  aspectRatio?: "1:1" | "16:9" | "9:16";
  style?: string;
}): Promise<{ requestId: string; imageUrl?: string }> {
  const res = await higgsFetch("/images", {
    method: "POST",
    body: JSON.stringify({
      prompt: options.prompt,
      model: "nano-banana-pro",
      aspect_ratio: options.aspectRatio ?? "1:1",
      style: options.style,
    }),
  });

  const data = (await res.json()) as {
    id: string;
    image_url?: string;
    error?: string;
  };

  if (data.error) throw new Error(`Higgsfield image error: ${data.error}`);

  return { requestId: data.id, imageUrl: data.image_url };
}

/**
 * Poll generation status until completion.
 */
export async function waitForGeneration(
  requestId: string,
  maxWaitMs = 300_000,
  pollIntervalMs = 5_000,
): Promise<HiggsVideoResult> {
  const start = Date.now();

  while (Date.now() - start < maxWaitMs) {
    const res = await higgsFetch(`/generations/${requestId}`);
    const data = (await res.json()) as {
      id: string;
      status: string;
      video_url?: string;
      credits_used?: number;
    };

    if (data.status === "completed") {
      return {
        requestId,
        status: "completed",
        videoUrl: data.video_url,
        creditsUsed: data.credits_used,
      };
    }

    if (data.status === "failed") {
      throw new Error(`Higgsfield generation ${requestId} failed`);
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error(
    `Higgsfield generation ${requestId} timed out after ${maxWaitMs}ms`,
  );
}

/**
 * Download a completed video/image to a local file.
 */
export async function downloadAsset(
  url: string,
  outputPath: string,
): Promise<string> {
  await mkdir(dirname(outputPath), { recursive: true });
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(outputPath, buffer);
  return outputPath;
}

/**
 * Full pipeline: create video → wait → download.
 */
export async function generateHiggsVideo(
  options: HiggsVideoOptions & { outputDir?: string },
): Promise<{ requestId: string; localPath: string; creditsUsed?: number }> {
  const result = await createVideo(options);
  const completed = await waitForGeneration(result.requestId);

  if (!completed.videoUrl) {
    throw new Error("Generation completed but no URL available");
  }

  const outputDir = options.outputDir ?? "output";
  const localPath = join(
    outputDir,
    `higgsfield_${result.requestId}.mp4`,
  );
  await downloadAsset(completed.videoUrl, localPath);

  return {
    requestId: result.requestId,
    localPath,
    creditsUsed: completed.creditsUsed,
  };
}

/**
 * Credit cost estimates by content type and duration.
 */
export const CREDIT_COSTS = {
  "standard-4s": 5,
  "standard-8s": 15,
  "standard-16s": 30,
  "director-8s": 20,
  "director-16s": 40,
  "image-to-video-8s": 15,
  "lipsync-overlay": 5,
  "character-anchor": 10,
  "garment-upload": 5,
  "nano-banana-pro-image": 3,
} as const;
