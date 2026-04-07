import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import type { StatsCounterProps } from "./schemas";
import { GradientBackground } from "../components/Background";
import { CounterNumber } from "../components/CounterNumber";

export const StatsCounter: React.FC<StatsCounterProps> = ({
  title,
  stats,
  backgroundColor,
  gradientTo,
  textColor,
  accentColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Title animation
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const columns = stats.length <= 2 ? stats.length : stats.length <= 4 ? 2 : 3;

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <GradientBackground from={backgroundColor} to={gradientTo} />

      {/* Title */}
      {title && (
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: textColor,
              fontFamily,
            }}
          >
            {title}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div
        style={{
          position: "absolute",
          top: title ? 220 : 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: 60,
            padding: "0 80px",
            maxWidth: 1400,
            width: "100%",
          }}
        >
          {stats.map((stat, index) => {
            const delay = 15 + index * 10;

            const labelOpacity = interpolate(frame - delay, [20, 35], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={index}
                style={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <CounterNumber
                  targetValue={stat.value}
                  suffix={stat.suffix}
                  delay={delay}
                  color={accentColor}
                  fontSize={80}
                  fontFamily={fontFamily}
                />
                <div
                  style={{
                    fontSize: 22,
                    color: `${textColor}cc`,
                    fontFamily,
                    fontWeight: 500,
                    marginTop: 12,
                    opacity: labelOpacity,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
