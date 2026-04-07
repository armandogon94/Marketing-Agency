/**
 * Social Post Generator — Platform-specific copy formatting.
 */

export interface SocialPost {
  platform: string;
  text: string;
  hashtags: string[];
  characterCount: number;
  withinLimit: boolean;
}

export const PLATFORM_LIMITS: Record<
  string,
  { maxChars: number; hashtagStyle: string; tone: string }
> = {
  twitter: {
    maxChars: 280,
    hashtagStyle: "2-3 relevant hashtags at end",
    tone: "Concise, punchy, conversational. Use line breaks for emphasis.",
  },
  linkedin: {
    maxChars: 3000,
    hashtagStyle: "3-5 industry hashtags at end, separated by line break",
    tone: "Professional but approachable. Use storytelling. Open with a hook. Short paragraphs.",
  },
  instagram: {
    maxChars: 2200,
    hashtagStyle: "15-20 hashtags in first comment or at end after line breaks",
    tone: "Visual, engaging, emoji-friendly. Open with a hook. Include CTA.",
  },
  tiktok: {
    maxChars: 2200,
    hashtagStyle: "3-5 trending hashtags mixed with niche ones",
    tone: "Casual, authentic, trend-aware. Use emojis. Direct address to viewer.",
  },
  facebook: {
    maxChars: 63206,
    hashtagStyle: "1-2 hashtags max, optional",
    tone: "Conversational, community-focused. Questions engage well. Share stories.",
  },
  threads: {
    maxChars: 500,
    hashtagStyle: "No hashtags needed (use topics instead)",
    tone: "Casual, conversational. Similar to Twitter but more relaxed.",
  },
};

/**
 * Get platform-specific formatting guidelines.
 */
export function getPlatformGuidelines(
  platform: string,
): (typeof PLATFORM_LIMITS)[string] | undefined {
  return PLATFORM_LIMITS[platform.toLowerCase()];
}

/**
 * Check if a post fits within platform character limits.
 */
export function checkPostLength(
  text: string,
  platform: string,
): { withinLimit: boolean; characterCount: number; maxChars: number } {
  const specs = PLATFORM_LIMITS[platform.toLowerCase()];
  if (!specs) {
    return { withinLimit: true, characterCount: text.length, maxChars: Infinity };
  }
  return {
    withinLimit: text.length <= specs.maxChars,
    characterCount: text.length,
    maxChars: specs.maxChars,
  };
}

/**
 * Format a post for a specific platform.
 */
export function formatPost(
  text: string,
  platform: string,
  hashtags: string[] = [],
): SocialPost {
  const specs = PLATFORM_LIMITS[platform.toLowerCase()];
  const hashtagString =
    hashtags.length > 0 ? "\n\n" + hashtags.map((h) => `#${h}`).join(" ") : "";
  const fullText = text + hashtagString;

  return {
    platform,
    text: fullText,
    hashtags,
    characterCount: fullText.length,
    withinLimit: specs ? fullText.length <= specs.maxChars : true,
  };
}

/**
 * List all supported platforms.
 */
export function listPlatforms(): string[] {
  return Object.keys(PLATFORM_LIMITS);
}
