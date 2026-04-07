/**
 * Avatar Video Pipeline — Unified interface for HeyGen, Higgsfield, and Remotion.
 *
 * Selects the right backend based on content type:
 * - HeyGen: talking-head with digital twin, video translations
 * - Higgsfield: cinematic AI video, product animations, lipsync
 * - Remotion: data-driven videos (stats, listicles, explainers)
 */

export type VideoBackend = "heygen" | "higgsfield" | "remotion";

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

  // Higgsfield: cinematic, product animation, lipsync, AI-generated footage
  if (
    type.includes("cinematic") ||
    type.includes("product animation") ||
    type.includes("lipsync") ||
    type.includes("ai video") ||
    type.includes("b-roll") ||
    type.includes("character")
  ) {
    return "higgsfield";
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

    case "higgsfield": {
      // Higgsfield: varies by duration tier
      let credits = 15; // default 8s
      if (durationSeconds <= 4) credits = 5;
      else if (durationSeconds <= 8) credits = 15;
      else credits = 30;
      return {
        credits,
        estimatedUSD: credits * 0.06,
        notes: "Higgsfield Studio plan: ~$0.06/credit",
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
