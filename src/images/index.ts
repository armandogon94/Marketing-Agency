export {
  generateImage,
  buildMarketingPrompt,
  ASPECT_RATIO_MAP,
} from "./generate";
export type { GenerateImageOptions, GeneratedImage, AspectRatio } from "./generate";

export {
  loadBrand,
  listBrandAssets,
  getBrandLogos,
  getBrandBRoll,
  applyBrandToPrompt,
} from "./presets";
export type { BrandConfig } from "./presets";

export {
  resizeImage,
  addWatermark,
  optimizeImage,
  convertFormat,
  resizeForPlatform,
} from "./postprocess";

export {
  IMAGE_TEMPLATES,
  getImageTemplate,
  listImageTemplates,
} from "./templates";
export type { ImageTemplate } from "./templates";
