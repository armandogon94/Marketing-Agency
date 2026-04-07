/**
 * Image Template Definitions — Pre-configured image types for marketing.
 */

import type { AspectRatio } from "./generate";

export interface ImageTemplate {
  name: string;
  description: string;
  aspectRatio: AspectRatio;
  width: number;
  height: number;
  promptSuffix: string;
  platform: string;
}

export const IMAGE_TEMPLATES: Record<string, ImageTemplate> = {
  "social-card": {
    name: "Social Card",
    description: "Quote or stat on branded background",
    aspectRatio: "1:1",
    width: 1080,
    height: 1080,
    promptSuffix:
      "minimal design, centered text, solid or gradient background, bold typography",
    platform: "instagram",
  },

  "youtube-thumbnail": {
    name: "YouTube Thumbnail",
    description: "Eye-catching thumbnail with face and text",
    aspectRatio: "16:9",
    width: 1280,
    height: 720,
    promptSuffix:
      "high contrast, bold text overlay, expressive face, bright colors, YouTube thumbnail style",
    platform: "youtube",
  },

  "instagram-carousel": {
    name: "Instagram Carousel Slide",
    description: "Educational carousel slide",
    aspectRatio: "1:1",
    width: 1080,
    height: 1080,
    promptSuffix:
      "clean slide design, numbered heading, bullet points, consistent branding, educational carousel",
    platform: "instagram",
  },

  "linkedin-banner": {
    name: "LinkedIn Banner",
    description: "Professional banner image",
    aspectRatio: "1.91:1",
    width: 1584,
    height: 396,
    promptSuffix:
      "professional banner, subtle gradient, minimal text area, corporate aesthetic",
    platform: "linkedin",
  },

  "ad-creative": {
    name: "Ad Creative",
    description: "Paid ad image with headline and CTA",
    aspectRatio: "1:1",
    width: 1080,
    height: 1080,
    promptSuffix:
      "advertising creative, clear headline area, call-to-action button space, product-focused, high conversion design",
    platform: "facebook",
  },

  "story-slide": {
    name: "Story Slide",
    description: "Vertical story for Instagram/TikTok",
    aspectRatio: "9:16",
    width: 1080,
    height: 1920,
    promptSuffix:
      "vertical mobile-first design, bold text, eye-catching, story format, full screen",
    platform: "instagram",
  },

  "blog-header": {
    name: "Blog Header",
    description: "Wide header image for blog posts",
    aspectRatio: "16:9",
    width: 1200,
    height: 675,
    promptSuffix:
      "wide landscape, atmospheric, editorial photography style, space for text overlay",
    platform: "web",
  },

  "product-shot": {
    name: "Product Shot",
    description: "Clean product photography style",
    aspectRatio: "1:1",
    width: 1080,
    height: 1080,
    promptSuffix:
      "clean product photography, white or neutral background, studio lighting, sharp focus, ecommerce style",
    platform: "ecommerce",
  },
};

/**
 * Get a template by name.
 */
export function getImageTemplate(name: string): ImageTemplate | undefined {
  return IMAGE_TEMPLATES[name];
}

/**
 * List all available image templates.
 */
export function listImageTemplates(): ImageTemplate[] {
  return Object.values(IMAGE_TEMPLATES);
}
