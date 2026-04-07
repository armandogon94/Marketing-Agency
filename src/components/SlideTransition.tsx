import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface SlideTransitionProps {
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  children: React.ReactNode;
  fade?: boolean;
  scale?: boolean;
  distance?: number;
}

export const SlideTransition: React.FC<SlideTransitionProps> = ({
  direction = "up",
  delay = 0,
  children,
  fade = true,
  scale = false,
  distance = 60,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const slideValue = interpolate(progress, [0, 1], [distance, 0]);

  let transform = "";
  switch (direction) {
    case "left":
      transform = `translateX(${-slideValue}px)`;
      break;
    case "right":
      transform = `translateX(${slideValue}px)`;
      break;
    case "up":
      transform = `translateY(${slideValue}px)`;
      break;
    case "down":
      transform = `translateY(${-slideValue}px)`;
      break;
  }

  if (scale) {
    const scaleValue = interpolate(progress, [0, 1], [0.8, 1]);
    transform += ` scale(${scaleValue})`;
  }

  const opacity = fade
    ? interpolate(frame - delay, [0, 12], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <div style={{ transform, opacity }}>
      {children}
    </div>
  );
};
