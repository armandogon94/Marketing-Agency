/**
 * Composition Generator — Translates animation scripts into Remotion TSX code.
 *
 * Takes the structured JSON "animation script" from analyze-motion.ts
 * and generates a complete, renderable Remotion composition.
 */

import { writeFile, mkdir } from "fs/promises";
import { dirname } from "path";
import type { AnimationScript, AnimationElement } from "./analyze-motion";

/**
 * Map animation types to Remotion code patterns.
 */
function generateElementCode(
  element: AnimationElement,
  segmentStart: number,
  fps: number,
): string {
  const startFrame = segmentStart;
  const durationFrames = Math.round((element.properties.duration ?? 0.5) * fps);
  const { position, color, fontSize, text, opacity } = element.properties;

  const x = position?.x ?? 960;
  const y = position?.y ?? 540;
  const startOpacity = opacity?.start ?? 0;
  const endOpacity = opacity?.end ?? 1;

  switch (element.animation) {
    case "fade-in":
      return `
      {/* ${element.type}: fade-in */}
      <div style={{
        position: 'absolute',
        left: ${x},
        top: ${y},
        opacity: interpolate(frame, [${startFrame}, ${startFrame + durationFrames}], [${startOpacity}, ${endOpacity}], { extrapolateRight: 'clamp' }),
        color: '${color ?? "#ffffff"}',
        fontSize: ${fontSize ?? 48},
      }}>
        ${text ? `{${JSON.stringify(text)}}` : ""}
      </div>`;

    case "slide-up":
      return `
      {/* ${element.type}: slide-up */}
      <div style={{
        position: 'absolute',
        left: ${x},
        top: interpolate(frame, [${startFrame}, ${startFrame + durationFrames}], [${y + 50}, ${y}], { extrapolateRight: 'clamp' }),
        opacity: interpolate(frame, [${startFrame}, ${startFrame + durationFrames}], [0, 1], { extrapolateRight: 'clamp' }),
        color: '${color ?? "#ffffff"}',
        fontSize: ${fontSize ?? 48},
      }}>
        ${text ? `{${JSON.stringify(text)}}` : ""}
      </div>`;

    case "scale-in": {
      return `
      {/* ${element.type}: scale-in */}
      <div style={{
        position: 'absolute',
        left: ${x},
        top: ${y},
        transform: \`scale(\${interpolate(frame, [${startFrame}, ${startFrame + durationFrames}], [0, 1], { extrapolateRight: 'clamp' })})\`,
        opacity: interpolate(frame, [${startFrame}, ${startFrame + durationFrames}], [0, 1], { extrapolateRight: 'clamp' }),
        color: '${color ?? "#ffffff"}',
        fontSize: ${fontSize ?? 48},
        transformOrigin: 'center',
      }}>
        ${text ? `{${JSON.stringify(text)}}` : ""}
      </div>`;
    }

    case "typewriter": {
      const chars = (text ?? "").length;
      return `
      {/* ${element.type}: typewriter */}
      <div style={{
        position: 'absolute',
        left: ${x},
        top: ${y},
        color: '${color ?? "#ffffff"}',
        fontSize: ${fontSize ?? 48},
        fontFamily: 'monospace',
      }}>
        {${JSON.stringify(text ?? "")}.slice(0, Math.floor(interpolate(frame, [${startFrame}, ${startFrame + durationFrames}], [0, ${chars}], { extrapolateRight: 'clamp' })))}
      </div>`;
    }

    default:
      return `
      {/* ${element.type}: ${element.animation} */}
      <div style={{
        position: 'absolute',
        left: ${x},
        top: ${y},
        color: '${color ?? "#ffffff"}',
        fontSize: ${fontSize ?? 48},
      }}>
        ${text ? `{${JSON.stringify(text)}}` : ""}
      </div>`;
  }
}

/**
 * Generate a complete Remotion composition TSX file from an animation script.
 */
export function generateCompositionCode(script: AnimationScript): string {
  const segments = script.segments
    .map((seg) => {
      const elements = seg.elements
        .map((el) => generateElementCode(el, seg.startFrame, script.fps))
        .join("\n");

      return `
      {/* Segment: ${seg.description} (${seg.startTime}s - ${seg.endTime}s) */}
      <Sequence from={${seg.startFrame}} durationInFrames={${seg.endFrame - seg.startFrame}}>
        <AbsoluteFill>${elements}
        </AbsoluteFill>
      </Sequence>`;
    })
    .join("\n");

  return `import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Auto-generated composition from animation analysis.
 * Source: ${script.name}
 * Duration: ${script.totalDuration}s at ${script.fps}fps
 */

export const ReplicatedAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{
      backgroundColor: '${script.globalStyle.backgroundColor}',
      fontFamily: '${script.globalStyle.fontFamily}',
    }}>
      ${segments}
    </AbsoluteFill>
  );
};
`;
}

/**
 * Write the generated composition to a file.
 */
export async function writeComposition(
  script: AnimationScript,
  outputPath: string,
): Promise<string> {
  const code = generateCompositionCode(script);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, code, "utf-8");
  return outputPath;
}
