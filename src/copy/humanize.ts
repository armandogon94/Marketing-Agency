/**
 * Humanization Pipeline — Removes AI writing patterns from generated copy.
 * Based on the humanizer skill (29 patterns from Wikipedia's AI writing guide).
 *
 * This module provides the pattern detection layer.
 * Full humanization is handled by the humanizer skill invoked by Claude.
 */

export interface HumanizeCheck {
  pattern: string;
  category: string;
  found: boolean;
  examples: string[];
}

/**
 * Common AI vocabulary that should be replaced.
 */
const AI_VOCABULARY = [
  "additionally",
  "furthermore",
  "moreover",
  "notably",
  "importantly",
  "significantly",
  "transformative",
  "testament",
  "landscape",
  "paradigm",
  "leverage",
  "utilize",
  "facilitate",
  "comprehensive",
  "robust",
  "seamless",
  "cutting-edge",
  "game-changer",
  "innovative",
  "streamline",
  "empower",
  "holistic",
  "synergy",
  "ecosystem",
  "delve",
  "realm",
  "pivotal",
  "cornerstone",
  "spearhead",
  "underscore",
];

/**
 * Chatbot artifacts that should never appear in published copy.
 */
const CHATBOT_ARTIFACTS = [
  "I hope this helps",
  "Let me know if",
  "Feel free to",
  "As an AI",
  "I'd be happy to",
  "Great question",
  "Here's a",
  "I'll help you",
  "Sure thing",
  "Absolutely!",
];

/**
 * Quick scan for common AI writing patterns in text.
 * Returns a list of detected patterns with examples.
 */
export function scanForAIPatterns(text: string): HumanizeCheck[] {
  const checks: HumanizeCheck[] = [];

  // Check AI vocabulary
  const foundVocab = AI_VOCABULARY.filter((word) =>
    text.toLowerCase().includes(word.toLowerCase()),
  );
  checks.push({
    pattern: "AI Vocabulary",
    category: "language",
    found: foundVocab.length > 0,
    examples: foundVocab.slice(0, 5),
  });

  // Check chatbot artifacts
  const foundArtifacts = CHATBOT_ARTIFACTS.filter((phrase) =>
    text.toLowerCase().includes(phrase.toLowerCase()),
  );
  checks.push({
    pattern: "Chatbot Artifacts",
    category: "communication",
    found: foundArtifacts.length > 0,
    examples: foundArtifacts,
  });

  // Check rule of three
  const ruleOfThree =
    /\b\w+,\s+\w+,\s+and\s+\w+\b/gi;
  const threeMatches = text.match(ruleOfThree) ?? [];
  checks.push({
    pattern: "Rule of Three",
    category: "style",
    found: threeMatches.length > 2,
    examples: threeMatches.slice(0, 3),
  });

  // Check em dash overuse
  const emDashes = (text.match(/—/g) ?? []).length;
  checks.push({
    pattern: "Em Dash Overuse",
    category: "style",
    found: emDashes > 3,
    examples: [`${emDashes} em dashes found`],
  });

  // Check excessive boldface
  const boldMatches = text.match(/\*\*[^*]+\*\*/g) ?? [];
  checks.push({
    pattern: "Boldface Overuse",
    category: "style",
    found: boldMatches.length > 5,
    examples: boldMatches.slice(0, 3),
  });

  // Check emoji usage
  const emojiPattern =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  const emojis = text.match(emojiPattern) ?? [];
  checks.push({
    pattern: "Emoji Usage",
    category: "style",
    found: emojis.length > 0,
    examples: emojis.slice(0, 5),
  });

  return checks;
}

/**
 * Get a summary of AI pattern detection results.
 */
export function getHumanizeReport(
  checks: HumanizeCheck[],
): { score: number; issues: string[]; needsHumanization: boolean } {
  const issues = checks
    .filter((c) => c.found)
    .map((c) => `${c.pattern}: ${c.examples.join(", ")}`);

  const score = Math.max(
    0,
    100 - issues.length * 15,
  );

  return {
    score,
    issues,
    needsHumanization: score < 70,
  };
}
