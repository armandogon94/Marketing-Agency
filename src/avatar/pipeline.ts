/**
 * Avatar Video Pipeline — Unified interface for HeyGen, Higgsfield, and Remotion.
 *
 * Selects the right backend based on content type:
 * - HeyGen: talking-head with digital twin, video translations
 * - Higgsfield: cinematic AI video, product animations, lipsync
 * - Remotion: data-driven videos (stats, listicles, explainers)
 */

export type VideoBackend = "heygen" | "hedra" | "remotion";

export interface AvatarVideoRequest {
  script: string;
  backend: VideoBackend;
  outputDir?: string;

  // HeyGen-specific
  avatarId?: string;
  voiceId?: string;

  // Higgsfield-specific
  model?: string;
  duration?: 4 | 8 | 16;
  imageUrl?: string;

  // Remotion-specific
  template?: string;
  ttsVoice?: string;
}

export interface AvatarVideoResult {
  backend: VideoBackend;
  localPath: string;
  id: string;
  duration?: number;
  creditsUsed?: number;
}

/**
 * Suggest the best backend based on content type.
 */
export function suggestBackend(contentType: string): VideoBackend {
  const type = contentType.toLowerCase();

  // HeyGen: anything with digital twin, talking head, or translation
  if (
    type.includes("digital twin") ||
    type.includes("talking head") ||
    type.includes("avatar") ||
    type.includes("translate") ||
    type.includes("presenter")
  ) {
    return "heygen";
  }

  // Hedra: lip-synced avatar, character animation, AI-generated talking head
  if (
    type.includes("lipsync") ||
    type.includes("ai video") ||
    type.includes("character") ||
    type.includes("cheap avatar") ||
    type.includes("budget")
  ) {
    return "hedra";
  }

  // Default: Remotion for data-driven content
  return "remotion";
}

/**
 * Cost estimate for a video request.
 */
export function estimateCost(
  backend: VideoBackend,
  durationSeconds: number,
): { credits: number; estimatedUSD: number; notes: string } {
  switch (backend) {
    case "heygen":
      // HeyGen: 1 credit per 30-second increment
      return {
        credits: Math.ceil(durationSeconds / 30),
        estimatedUSD: Math.ceil(durationSeconds / 30) * 0.99,
        notes: "HeyGen Pro plan: ~$0.99/credit",
      };

    case "hedra": {
      // Hedra: 6 credits/second at 720p, 3 at 540p
      const creditsPerSec = 6;
      const credits = durationSeconds * creditsPerSec;
      return {
        credits,
        estimatedUSD: credits * 0.006, // Creator plan: $24/4000 credits
        notes: "Hedra Creator plan ($24/mo): 4,000 credits. Free plan: 300 credits/mo (watermarked)",
      };
    }

    case "remotion":
      return {
        credits: 0,
        estimatedUSD: 0,
        notes: "Local rendering — free (uses CPU/GPU time only)",
      };
  }
}
