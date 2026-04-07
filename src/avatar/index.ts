export {
  listAvatars,
  listVoices,
  createVideoAgent,
  createAvatarVideo,
  waitForVideo as waitForHeygenVideo,
  downloadVideo as downloadHeygenVideo,
  generateAvatarVideo,
} from "./heygen";
export type { HeyGenVideoOptions, HeyGenVideoResult } from "./heygen";

export {
  createVideo as createHedraVideo,
  listModels as listHedraModels,
  waitForVideo as waitForHedraVideo,
  downloadVideo as downloadHedraVideo,
  generateVideo as generateHedraVideo,
  CREDIT_COSTS as HEDRA_CREDIT_COSTS,
} from "./hedra";
export type { HedraVideoOptions, HedraVideoResult } from "./hedra";

export { suggestBackend, estimateCost } from "./pipeline";
export type {
  VideoBackend,
  AvatarVideoRequest,
  AvatarVideoResult,
} from "./pipeline";
