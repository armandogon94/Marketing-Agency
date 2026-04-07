export {
  listAvatars,
  listVoices,
  createVideoAgent,
  createAvatarVideo,
  waitForVideo,
  downloadVideo,
  generateAvatarVideo,
} from "./heygen";
export type { HeyGenVideoOptions, HeyGenVideoResult } from "./heygen";

export {
  createVideo,
  createLipsyncVideo,
  generateImage as generateHiggsImage,
  waitForGeneration,
  downloadAsset,
  generateHiggsVideo,
  CREDIT_COSTS,
} from "./higgsfield";
export type {
  HiggsVideoOptions,
  HiggsVideoResult,
  HiggsModel,
  HiggsResolution,
} from "./higgsfield";

export { suggestBackend, estimateCost } from "./pipeline";
export type {
  VideoBackend,
  AvatarVideoRequest,
  AvatarVideoResult,
} from "./pipeline";
