/**
 * Motion Analysis — Describe animations from extracted frame sequences.
 *
 * This module produces a structured "animation script" that can be translated
 * into Remotion code. The actual visual analysis is done by Claude's vision
 * capabilities — this module provides the data structures and prompts.
 */

export interface AnimationSegment {
  startFrame: number;
  endFrame: number;
  startTime: number;
  endTime: number;
  description: string;
  elements: AnimationElement[];
  transition?: string;
}

export interface AnimationElement {
  type:
    | "text"
    | "image"
    | "shape"
    | "background"
    | "logo"
    | "icon"
    | "particle";
  animation:
    | "fade-in"
    | "fade-out"
    | "slide-left"
    | "slide-right"
    | "slide-up"
    | "slide-down"
    | "scale-in"
    | "scale-out"
    | "typewriter"
    | "bounce"
    | "rotate"
    | "wipe"
    | "blur"
    | "none";
  properties: {
    text?: string;
    color?: string;
    fontSize?: number;
    position?: { x: number; y: number };
    size?: { width: number; height: number };
    opacity?: { start: number; end: number };
    duration?: number;
  };
}

export interface AnimationScript {
  name: string;
  totalDuration: number;
  fps: number;
  width: number;
  height: number;
  segments: AnimationSegment[];
  globalStyle: {
    backgroundColor: string;
    fontFamily: string;
    colorPalette: string[];
  };
}

/**
 * Build the analysis prompt to send alongside extracted frames to Claude Vision.
 */
export function buildAnalysisPrompt(
  frameCount: number,
  fps: number,
  duration: number,
): string {
  return `You are analyzing ${frameCount} frames extracted from a ${duration.toFixed(1)}s video at ${fps}fps.

Describe the animation as a structured JSON "animation script" with this format:

{
  "name": "descriptive name",
  "totalDuration": ${duration},
  "fps": ${fps},
  "width": 1920,
  "height": 1080,
  "segments": [
    {
      "startFrame": 0,
      "endFrame": 30,
      "startTime": 0,
      "endTime": 1,
      "description": "what happens in this segment",
      "elements": [
        {
          "type": "text|image|shape|background|logo|icon",
          "animation": "fade-in|slide-left|scale-in|typewriter|bounce|rotate|wipe|none",
          "properties": {
            "text": "visible text if any",
            "color": "#hex color",
            "fontSize": 48,
            "position": {"x": 960, "y": 540},
            "opacity": {"start": 0, "end": 1},
            "duration": 0.5
          }
        }
      ],
      "transition": "cut|fade|wipe-left|slide-up|none"
    }
  ],
  "globalStyle": {
    "backgroundColor": "#hex",
    "fontFamily": "detected font family",
    "colorPalette": ["#hex1", "#hex2", "#hex3"]
  }
}

For each frame sequence, identify:
1. What elements appear (text, images, shapes, backgrounds)
2. How they animate (fade, slide, scale, typewriter, bounce, etc.)
3. Timing of each animation
4. Color palette and typography
5. Transitions between scenes (cut, fade, wipe, slide)
6. Overall motion design style

Be as precise as possible about positions, colors, and timing.
Return ONLY the JSON — no explanatory text.`;
}

/**
 * Validate an animation script structure.
 */
export function validateScript(
  script: unknown,
): script is AnimationScript {
  if (!script || typeof script !== "object") return false;
  const s = script as Record<string, unknown>;
  return (
    typeof s.name === "string" &&
    typeof s.totalDuration === "number" &&
    typeof s.fps === "number" &&
    Array.isArray(s.segments)
  );
}
