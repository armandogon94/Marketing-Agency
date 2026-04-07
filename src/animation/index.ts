export {
  extractFrames,
  extractFrameAt,
  extractKeyFrames,
} from "./extract-frames";
export type { ExtractionOptions, ExtractionResult } from "./extract-frames";

export {
  buildAnalysisPrompt,
  validateScript,
} from "./analyze-motion";
export type {
  AnimationScript,
  AnimationSegment,
  AnimationElement,
} from "./analyze-motion";

export {
  generateCompositionCode,
  writeComposition,
} from "./generate-composition";

export {
  createComparisonVideo,
  createComparisonSheet,
} from "./compare";
