/**
 * QA Pipeline — Tiered quality assurance for generated content.
 *
 * Tier 1 (free): ffprobe/ImageMagick metadata validation
 * Tier 2 (free): FFmpeg error detection (black, freeze, silence)
 * Tier 3 (~690 tokens): Contact sheet → Claude Vision review
 * Tier 4 (expensive): Targeted deep review (only if Tier 3 fails)
 */

export {
  getVideoMetadata,
  getImageMetadata,
  validateVideoMetadata,
  validateImageMetadata,
} from "./metadata";

export {
  detectBlackFrames,
  detectFreezeFrames,
  detectSilence,
  runAllDetections,
} from "./detect-errors";

export {
  generateContactSheet,
  prepareVisionReview,
  getContactSheetPath,
} from "./contact-sheet";

export { checkImage, PLATFORM_IMAGE_SPECS } from "./image-check";

import { getVideoMetadata, validateVideoMetadata } from "./metadata";
import { runAllDetections } from "./detect-errors";
import { prepareVisionReview } from "./contact-sheet";

export interface FullQAResult {
  tier1: { pass: boolean; issues: string[] };
  tier2: { pass: boolean; issues: string[] };
  tier3?: { imagePath: string; prompt: string };
  overallPass: boolean;
}

/**
 * Run the full tiered QA pipeline on a video.
 * Tiers 1-2 are free. Tier 3 prepares a contact sheet for Claude Vision
 * (the caller decides whether to actually send it for review).
 */
export async function runVideoQA(
  videoPath: string,
  expected?: {
    width?: number;
    height?: number;
    minDuration?: number;
    maxDuration?: number;
    codec?: string;
    requireAudio?: boolean;
  },
  options?: {
    outputDir?: string;
    context?: string;
    skipTier3?: boolean;
  },
): Promise<FullQAResult> {
  // Tier 1: Metadata validation
  const metadata = await getVideoMetadata(videoPath);
  const tier1 = validateVideoMetadata(metadata, expected ?? {});

  // Tier 2: Error detection
  const detections = await runAllDetections(videoPath);
  const tier2Issues: string[] = [];
  if (detections.blackFrames.length > 0) {
    tier2Issues.push(
      `${detections.blackFrames.length} black frame segment(s) detected`,
    );
  }
  if (detections.freezeFrames.length > 0) {
    tier2Issues.push(
      `${detections.freezeFrames.length} freeze frame segment(s) detected`,
    );
  }
  if (detections.silentSegments.length > 0) {
    tier2Issues.push(
      `${detections.silentSegments.length} silent segment(s) detected`,
    );
  }
  const tier2 = { pass: tier2Issues.length === 0, issues: tier2Issues };

  // Tier 3: Contact sheet (prepared but not sent to vision — caller decides)
  let tier3: { imagePath: string; prompt: string } | undefined;
  if (!options?.skipTier3 && tier1.pass && tier2.pass) {
    const outputDir = options?.outputDir ?? ".";
    tier3 = await prepareVisionReview(videoPath, outputDir, options?.context);
  }

  return {
    tier1,
    tier2,
    tier3,
    overallPass: tier1.pass && tier2.pass,
  };
}
