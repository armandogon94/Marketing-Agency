import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import type { BeforeAfterProps } from "./schemas";

export const BeforeAfter: React.FC<BeforeAfterProps> = ({
  beforeLabel,
  afterLabel,
  beforeText,
  afterText,
  beforeColor,
  afterColor,
  backgroundColor,
  textColor,
  dividerColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, durationInFrames } = useVideoConfig();

  // Wipe reveal: starts from left, reveals right
  const wipeProgress = interpolate(frame, [30, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const splitX = interpolate(wipeProgress, [0, 1], [width, width / 2]);

  // Label fade-ins
  const beforeLabelOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const afterLabelOpacity = interpolate(frame, [60, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text fade-ins
  const beforeTextOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const afterTextSlide = spring({
    frame: frame - 70,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  const afterTextY = interpolate(afterTextSlide, [0, 1], [40, 0]);

  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor, opacity: fadeOut }}>
      {/* Before side (full background initially) */}
      <AbsoluteFill style={{ backgroundColor: beforeColor }}>
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            width: width / 2,
            textAlign: "center",
            opacity: beforeLabelOpacity,
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: `${textColor}99`,
              fontFamily,
              textTransform: "uppercase",
              letterSpacing: 4,
            }}
          >
            {beforeLabel}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: width / 2,
            transform: "translateY(-50%)",
            textAlign: "center",
            padding: "0 60px",
            opacity: beforeTextOpacity,
          }}
        >
          <div
            style={{
              fontSize: 36,
              color: textColor,
              fontFamily,
              lineHeight: 1.5,
            }}
          >
            {beforeText}
          </div>
        </div>
      </AbsoluteFill>

      {/* After side (clips in from right) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: splitX,
          right: 0,
          bottom: 0,
          backgroundColor: afterColor,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: afterLabelOpacity,
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: `${textColor}99`,
              fontFamily,
              textTransform: "uppercase",
              letterSpacing: 4,
            }}
          >
            {afterLabel}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            transform: `translateY(calc(-50% + ${afterTextY}px))`,
            textAlign: "center",
            padding: "0 60px",
            opacity: afterLabelOpacity,
          }}
        >
          <div
            style={{
              fontSize: 36,
              color: textColor,
              fontFamily,
              lineHeight: 1.5,
              fontWeight: 700,
            }}
          >
            {afterText}
          </div>
        </div>
      </div>

      {/* Divider line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: splitX - 2,
          width: 4,
          backgroundColor: dividerColor,
          boxShadow: `0 0 20px ${dividerColor}`,
        }}
      />
    </AbsoluteFill>
  );
};
