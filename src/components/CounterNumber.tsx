import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface CounterNumberProps {
  targetValue: number;
  suffix?: string;
  duration?: number;
  color?: string;
  fontSize?: number;
  delay?: number;
  fontFamily?: string;
}

export const CounterNumber: React.FC<CounterNumberProps> = ({
  targetValue,
  suffix = "",
  duration = 60,
  color = "#ffffff",
  fontSize = 72,
  delay = 0,
  fontFamily = "Inter, sans-serif",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 30, stiffness: 40, mass: 1 },
    durationInFrames: duration,
  });

  const currentValue = Math.round(interpolate(progress, [0, 1], [0, targetValue]));

  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        fontSize,
        fontWeight: 800,
        color,
        fontFamily,
        opacity,
        textAlign: "center",
        lineHeight: 1,
      }}
    >
      {currentValue.toLocaleString()}
      {suffix}
    </div>
  );
};
