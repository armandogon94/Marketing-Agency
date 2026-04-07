import React from "react";
import { AbsoluteFill } from "remotion";

interface SplitScreenProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  splitRatio?: number;
  gap?: number;
  direction?: "horizontal" | "vertical";
}

export const SplitScreen: React.FC<SplitScreenProps> = ({
  leftContent,
  rightContent,
  splitRatio = 0.5,
  gap = 0,
  direction = "horizontal",
}) => {
  const isHorizontal = direction === "horizontal";
  const leftPercent = `${splitRatio * 100}%`;
  const rightPercent = `${(1 - splitRatio) * 100}%`;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: isHorizontal ? "row" : "column",
        gap,
      }}
    >
      <div
        style={{
          width: isHorizontal ? leftPercent : "100%",
          height: isHorizontal ? "100%" : leftPercent,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {leftContent}
      </div>
      <div
        style={{
          width: isHorizontal ? rightPercent : "100%",
          height: isHorizontal ? "100%" : rightPercent,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {rightContent}
      </div>
    </AbsoluteFill>
  );
};
