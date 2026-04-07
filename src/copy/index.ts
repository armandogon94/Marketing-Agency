export {
  FRAMEWORKS,
  getFramework,
  listFrameworks,
  suggestFramework,
} from "./frameworks";
export type { CopyFramework } from "./frameworks";

export { scanForAIPatterns, getHumanizeReport } from "./humanize";
export type { HumanizeCheck } from "./humanize";

export { SEQUENCES, getSequence, listSequences } from "./email-sequence";
export type { Email, EmailSequence } from "./email-sequence";

export {
  PLATFORM_LIMITS,
  getPlatformGuidelines,
  checkPostLength,
  formatPost,
  listPlatforms,
} from "./social-posts";
export type { SocialPost } from "./social-posts";
