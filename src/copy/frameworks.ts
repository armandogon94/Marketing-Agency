/**
 * Copywriting Frameworks — Structured templates for marketing copy.
 * Used by the Copywriter agent alongside Formula 100K skills.
 */

export interface CopyFramework {
  name: string;
  acronym: string;
  description: string;
  sections: { name: string; prompt: string }[];
  bestFor: string[];
}

export const FRAMEWORKS: Record<string, CopyFramework> = {
  aida: {
    name: "AIDA",
    acronym: "Attention, Interest, Desire, Action",
    description: "Classic conversion framework for ads, landing pages, and emails",
    sections: [
      {
        name: "Attention",
        prompt: "Write a hook that stops the reader. Use a bold claim, surprising stat, or provocative question.",
      },
      {
        name: "Interest",
        prompt: "Build interest by explaining the problem and why the reader should care. Use specific details.",
      },
      {
        name: "Desire",
        prompt: "Create desire by showing the transformation. Paint a vivid picture of life after the solution.",
      },
      {
        name: "Action",
        prompt: "Clear call-to-action. Tell them exactly what to do next. Add urgency if appropriate.",
      },
    ],
    bestFor: ["ads", "landing pages", "email", "social posts"],
  },

  pas: {
    name: "PAS",
    acronym: "Problem, Agitate, Solution",
    description: "Emotional framework that amplifies pain before offering relief",
    sections: [
      {
        name: "Problem",
        prompt: "Identify the specific problem the reader faces. Be concrete and relatable.",
      },
      {
        name: "Agitate",
        prompt: "Amplify the pain. What happens if they don't solve it? What are they missing out on?",
      },
      {
        name: "Solution",
        prompt: "Present the solution as the natural answer. Show how it eliminates the pain.",
      },
    ],
    bestFor: ["sales emails", "ads", "product descriptions", "VSLs"],
  },

  bab: {
    name: "BAB",
    acronym: "Before, After, Bridge",
    description: "Transformation-focused framework showing the journey",
    sections: [
      {
        name: "Before",
        prompt: "Describe the reader's current painful state. Use sensory language.",
      },
      {
        name: "After",
        prompt: "Paint the desired future state. Make it specific and aspirational.",
      },
      {
        name: "Bridge",
        prompt: "Show how your product/service bridges the gap from Before to After.",
      },
    ],
    bestFor: ["case studies", "testimonials", "social posts", "email"],
  },

  fourps: {
    name: "4Ps",
    acronym: "Promise, Picture, Proof, Push",
    description: "Evidence-based persuasion framework",
    sections: [
      {
        name: "Promise",
        prompt: "Make a bold, specific promise about what the reader will get.",
      },
      {
        name: "Picture",
        prompt: "Help the reader visualize achieving the promise. Use vivid imagery.",
      },
      {
        name: "Proof",
        prompt: "Provide evidence: numbers, testimonials, case studies, credentials.",
      },
      {
        name: "Push",
        prompt: "Push them to act now. Add urgency, scarcity, or a compelling reason to act today.",
      },
    ],
    bestFor: ["sales pages", "webinar pitches", "launch emails"],
  },

  star: {
    name: "STAR",
    acronym: "Situation, Task, Action, Result",
    description: "Story-driven framework for case studies and proof",
    sections: [
      {
        name: "Situation",
        prompt: "Set the scene. What was the context? Who is the protagonist?",
      },
      {
        name: "Task",
        prompt: "What challenge or goal did they face?",
      },
      {
        name: "Action",
        prompt: "What specific actions were taken? What was the process?",
      },
      {
        name: "Result",
        prompt: "What measurable outcome was achieved? Include specific numbers.",
      },
    ],
    bestFor: ["case studies", "testimonials", "portfolio pieces", "LinkedIn posts"],
  },
};

/**
 * Get a framework by name.
 */
export function getFramework(name: string): CopyFramework | undefined {
  return FRAMEWORKS[name.toLowerCase()];
}

/**
 * List all available frameworks.
 */
export function listFrameworks(): CopyFramework[] {
  return Object.values(FRAMEWORKS);
}

/**
 * Suggest the best framework for a given content type.
 */
export function suggestFramework(contentType: string): string {
  const type = contentType.toLowerCase();
  if (type.includes("ad") || type.includes("landing")) return "aida";
  if (type.includes("email") || type.includes("sales")) return "pas";
  if (type.includes("case study") || type.includes("testimonial")) return "bab";
  if (type.includes("launch") || type.includes("webinar")) return "fourps";
  if (type.includes("portfolio") || type.includes("linkedin")) return "star";
  return "aida"; // default
}
