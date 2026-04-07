/**
 * HeyGen Integration — Digital twin avatar video generation.
 *
 * Preferred method: HeyGen MCP server (OAuth, no API key needed)
 * Fallback: Direct API calls with HEYGEN_API_KEY
 *
 * MCP setup: claude mcp add --transport http heygen https://mcp.heygen.com/mcp/v1/
 */

import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";

const HEYGEN_API_BASE = "https://api.heygen.com";

export interface HeyGenVideoOptions {
  script: string;
  avatarId?: string;
  voiceId?: string;
  background?: string;
  title?: string;
}

export interface HeyGenVideoResult {
  videoId: string;
  status: "pending" | "processing" | "completed" | "failed";
  videoUrl?: string;
  duration?: number;
}

function getApiKey(): string {
  const key = process.env.HEYGEN_API_KEY;
  if (!key) {
    throw new Error(
      "HEYGEN_API_KEY not set. Get one at https://app.heygen.com/settings?nav=API\n" +
        "Or use the MCP server instead: claude mcp add --transport http heygen https://mcp.heygen.com/mcp/v1/",
    );
  }
  return key;
}

async function heygenFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const apiKey = getApiKey();
  return fetch(`${HEYGEN_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

/**
 * List available avatars (including digital twins).
 */
export async function listAvatars(): Promise<
  { avatarId: string; avatarName: string; type: string }[]
> {
  const res = await heygenFetch("/v1/avatars");
  const data = (await res.json()) as {
    data: { avatars: { avatar_id: string; avatar_name: string; type: string }[] };
  };
  return data.data.avatars.map((a) => ({
    avatarId: a.avatar_id,
    avatarName: a.avatar_name,
    type: a.type,
  }));
}

/**
 * List available voices.
 */
export async function listVoices(): Promise<
  { voiceId: string; name: string; language: string; gender: string }[]
> {
  const res = await heygenFetch("/v1/voices");
  const data = (await res.json()) as {
    data: { voices: { voice_id: string; name: string; language: string; gender: string }[] };
  };
  return data.data.voices.map((v) => ({
    voiceId: v.voice_id,
    name: v.name,
    language: v.language,
    gender: v.gender,
  }));
}

/**
 * Create an avatar video using the Video Agent (fastest method).
 */
export async function createVideoAgent(
  prompt: string,
): Promise<HeyGenVideoResult> {
  const res = await heygenFetch("/v1/video_agent/generate", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });

  const data = (await res.json()) as {
    data: { video_id: string };
    error?: string;
  };

  if (data.error) throw new Error(`HeyGen error: ${data.error}`);

  return {
    videoId: data.data.video_id,
    status: "pending",
  };
}

/**
 * Create an avatar video with full control (avatar, voice, script).
 */
export async function createAvatarVideo(
  options: HeyGenVideoOptions,
): Promise<HeyGenVideoResult> {
  const body = {
    video_inputs: [
      {
        character: {
          type: "avatar",
          avatar_id: options.avatarId ?? "default",
          avatar_style: "normal",
        },
        voice: {
          type: "text",
          input_text: options.script,
          voice_id: options.voiceId,
        },
        background: options.background
          ? { type: "image", url: options.background }
          : { type: "color", value: "#ffffff" },
      },
    ],
    title: options.title ?? `Video ${Date.now()}`,
  };

  const res = await heygenFetch("/v2/video/generate", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as {
    data: { video_id: string };
    error?: string;
  };

  if (data.error) throw new Error(`HeyGen error: ${data.error}`);

  return {
    videoId: data.data.video_id,
    status: "pending",
  };
}

/**
 * Poll video status until completion.
 */
export async function waitForVideo(
  videoId: string,
  maxWaitMs = 300_000,
  pollIntervalMs = 5_000,
): Promise<HeyGenVideoResult> {
  const start = Date.now();

  while (Date.now() - start < maxWaitMs) {
    const res = await heygenFetch(`/v2/videos/${videoId}`);
    const data = (await res.json()) as {
      data: {
        status: string;
        video_url?: string;
        duration?: number;
      };
    };

    const status = data.data.status as HeyGenVideoResult["status"];

    if (status === "completed") {
      return {
        videoId,
        status,
        videoUrl: data.data.video_url,
        duration: data.data.duration,
      };
    }

    if (status === "failed") {
      throw new Error(`HeyGen video ${videoId} failed`);
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error(`HeyGen video ${videoId} timed out after ${maxWaitMs}ms`);
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
 * Full pipeline: create avatar video → wait → download.
 */
export async function generateAvatarVideo(
  options: HeyGenVideoOptions & { outputDir?: string },
): Promise<{ videoId: string; localPath: string; duration?: number }> {
  const result = await createAvatarVideo(options);
  const completed = await waitForVideo(result.videoId);

  if (!completed.videoUrl) {
    throw new Error("Video completed but no URL available");
  }

  const outputDir = options.outputDir ?? "output";
  const localPath = join(
    outputDir,
    `heygen_${result.videoId}.mp4`,
  );
  await downloadVideo(completed.videoUrl, localPath);

  return {
    videoId: result.videoId,
    localPath,
    duration: completed.duration,
  };
}
