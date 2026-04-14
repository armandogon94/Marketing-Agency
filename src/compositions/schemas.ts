import { z } from "zod";

const captionStyleSchema = z.object({
  enabled: z.boolean().default(true),
  fontSize: z.number().min(12).max(120).default(36),
  color: z.string().default("#ffffff"),
  highlightColor: z.string().default("#ffd700"),
  position: z.enum(["top", "center", "bottom"]).default("bottom"),
  backgroundColor: z.string().default("rgba(0,0,0,0.7)"),
});

export type CaptionStyle = z.infer<typeof captionStyleSchema>;

const wordTimingSchema = z.object({
  text: z.string(),
  startFrame: z.number(),
  endFrame: z.number(),
  startSeconds: z.number(),
  endSeconds: z.number(),
});

export type WordTiming = z.infer<typeof wordTimingSchema>;

// --- Explainer Video ---
export const explainerSchema = z.object({
  title: z.string().default(""),
  script: z.string().default(""),
  audioUrl: z.string().default(""),
  wordTimings: z.array(wordTimingSchema).default([]),
  backgroundColor: z.string().default("#1a1a2e"),
  gradientTo: z.string().default("#16213e"),
  accentColor: z.string().default("#ffd700"),
  textColor: z.string().default("#ffffff"),
  fontFamily: z.string().default("Inter, sans-serif"),
  captions: captionStyleSchema.default({
    enabled: true,
    fontSize: 36,
    color: "#ffffff",
    highlightColor: "#ffd700",
    position: "bottom",
    backgroundColor: "rgba(0,0,0,0.7)",
  }),
});
export type ExplainerProps = z.infer<typeof explainerSchema>;

// --- Talking Head ---
export const talkingHeadSchema = z.object({
  title: z.string().default(""),
  script: z.string().default(""),
  audioUrl: z.string().default(""),
  speakerImageUrl: z.string().default(""),
  wordTimings: z.array(wordTimingSchema).default([]),
  backgroundColor: z.string().default("#0a0a0a"),
  nameTag: z.string().default(""),
  nameTagColor: z.string().default("#ffd700"),
  captions: captionStyleSchema.default({
    enabled: true,
    fontSize: 36,
    color: "#ffffff",
    highlightColor: "#ffd700",
    position: "bottom",
    backgroundColor: "rgba(0,0,0,0.7)",
  }),
});
export type TalkingHeadProps = z.infer<typeof talkingHeadSchema>;

// --- Listicle ---
const listItemSchema = z.object({
  number: z.number(),
  title: z.string(),
  description: z.string().default(""),
});

export const listicleSchema = z.object({
  title: z.string().default(""),
  items: z.array(listItemSchema).default([]),
  audioUrl: z.string().default(""),
  wordTimings: z.array(wordTimingSchema).default([]),
  backgroundColor: z.string().default("#0f0c29"),
  gradientTo: z.string().default("#302b63"),
  accentColor: z.string().default("#ffd700"),
  textColor: z.string().default("#ffffff"),
  secondsPerItem: z.number().default(5),
  captions: captionStyleSchema.default({
    enabled: true,
    fontSize: 36,
    color: "#ffffff",
    highlightColor: "#ffd700",
    position: "bottom",
    backgroundColor: "rgba(0,0,0,0.7)",
  }),
});
export type ListicleProps = z.infer<typeof listicleSchema>;

// --- Quote Card ---
export const quoteCardSchema = z.object({
  quote: z.string().default(""),
  author: z.string().default(""),
  audioUrl: z.string().default(""),
  wordTimings: z.array(wordTimingSchema).default([]),
  backgroundColor: z.string().default("#1a1a2e"),
  quoteColor: z.string().default("#ffffff"),
  authorColor: z.string().default("#ffd700"),
  fontFamily: z.string().default("Georgia, serif"),
  captions: captionStyleSchema.default({
    enabled: true,
    fontSize: 36,
    color: "#ffffff",
    highlightColor: "#ffd700",
    position: "bottom",
    backgroundColor: "rgba(0,0,0,0.7)",
  }),
});
export type QuoteCardProps = z.infer<typeof quoteCardSchema>;

// --- Social Proof ---
const testimonialSchema = z.object({
  quote: z.string(),
  name: z.string(),
  role: z.string(),
  photoUrl: z.string().default(""),
  rating: z.number().min(1).max(5).default(5),
});

export const socialProofSchema = z.object({
  testimonials: z.array(testimonialSchema).default([]),
  backgroundColor: z.string().default("#1a1a2e"),
  gradientTo: z.string().default("#16213e"),
  textColor: z.string().default("#ffffff"),
  starColor: z.string().default("#ffd700"),
  accentColor: z.string().default("#ffd700"),
  secondsPerTestimonial: z.number().default(5),
});
export type SocialProofProps = z.infer<typeof socialProofSchema>;

// --- Product Showcase ---
const featureSchema = z.object({
  icon: z.string().default("✨"),
  title: z.string(),
  description: z.string().default(""),
});

export const productShowcaseSchema = z.object({
  productName: z.string().default(""),
  features: z.array(featureSchema).default([]),
  backgroundColor: z.string().default("#0f0c29"),
  gradientTo: z.string().default("#302b63"),
  accentColor: z.string().default("#00d4ff"),
  textColor: z.string().default("#ffffff"),
  cardColor: z.string().default("rgba(255,255,255,0.08)"),
  secondsPerFeature: z.number().default(3),
});
export type ProductShowcaseProps = z.infer<typeof productShowcaseSchema>;

// --- Before After ---
export const beforeAfterSchema = z.object({
  beforeLabel: z.string().default("Before"),
  afterLabel: z.string().default("After"),
  beforeText: z.string().default(""),
  afterText: z.string().default(""),
  beforeColor: z.string().default("#1a1a2e"),
  afterColor: z.string().default("#0d3b2e"),
  backgroundColor: z.string().default("#111111"),
  textColor: z.string().default("#ffffff"),
  dividerColor: z.string().default("#ffd700"),
  fontFamily: z.string().default("Inter, sans-serif"),
});
export type BeforeAfterProps = z.infer<typeof beforeAfterSchema>;

// --- Stats Counter ---
const statItemSchema = z.object({
  value: z.number(),
  label: z.string(),
  suffix: z.string().default(""),
});

export const statsCounterSchema = z.object({
  title: z.string().default(""),
  stats: z.array(statItemSchema).default([]),
  backgroundColor: z.string().default("#0a0a1a"),
  gradientTo: z.string().default("#1a1a3e"),
  textColor: z.string().default("#ffffff"),
  accentColor: z.string().default("#00d4ff"),
  fontFamily: z.string().default("Inter, sans-serif"),
});
export type StatsCounterProps = z.infer<typeof statsCounterSchema>;

// --- Brand Intro ---
export const brandIntroSchema = z.object({
  logoUrl: z.string().default(""),
  logoWidth: z.number().default(250),
  tagline: z.string().default(""),
  backgroundColor: z.string().default("#0a0a0a"),
  gradientTo: z.string().default("#1a1a2e"),
  textColor: z.string().default("#ffffff"),
  accentColor: z.string().default("#ffd700"),
  fontFamily: z.string().default("Inter, sans-serif"),
});
export type BrandIntroProps = z.infer<typeof brandIntroSchema>;

// --- Call To Action ---
export const callToActionSchema = z.object({
  headline: z.string().default(""),
  subheadline: z.string().default(""),
  buttonText: z.string().default("Get Started"),
  urgencyText: z.string().default(""),
  backgroundColor: z.string().default("#1a0a2e"),
  gradientTo: z.string().default("#2e1a4e"),
  textColor: z.string().default("#ffffff"),
  buttonColor: z.string().default("#ff4d4d"),
  buttonTextColor: z.string().default("#ffffff"),
  accentColor: z.string().default("#ffd700"),
  fontFamily: z.string().default("Inter, sans-serif"),
});
export type CallToActionProps = z.infer<typeof callToActionSchema>;
