import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import type { CallToActionProps } from "./schemas";
import { GradientBackground } from "../components/Background";
import { SlideTransition } from "../components/SlideTransition";

export const CallToAction: React.FC<CallToActionProps> = ({
  headline,
  subheadline,
  buttonText,
  urgencyText,
  backgroundColor,
  gradientTo,
  textColor,
  buttonColor,
  buttonTextColor,
  accentColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Headline animation
  const headlineScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 70 },
  });

  // Button pulse effect
  const pulsePhase = Math.sin(frame * 0.15) * 0.5 + 0.5;
  const buttonGlow = interpolate(pulsePhase, [0, 1], [10, 30]);
  const buttonScale = interpolate(pulsePhase, [0, 1], [1, 1.03]);

  // Button entrance
  const buttonEntrance = spring({
    frame: frame - 30,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const buttonOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Urgency text
  const urgencyOpacity = interpolate(frame, [50, 65], [0, 1], {
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

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <GradientBackground from={backgroundColor} to={gradientTo} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Headline */}
        <SlideTransition direction="up" delay={0}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: textColor,
              fontFamily,
              textAlign: "center",
              lineHeight: 1.2,
              maxWidth: 1200,
              padding: "0 60px",
              transform: `scale(${headlineScale})`,
            }}
          >
            {headline}
          </div>
        </SlideTransition>

        {/* Subheadline */}
        <SlideTransition direction="up" delay={12}>
          <div
            style={{
              fontSize: 28,
              color: `${textColor}cc`,
              fontFamily,
              textAlign: "center",
              marginTop: 20,
              maxWidth: 800,
              lineHeight: 1.5,
            }}
          >
            {subheadline}
          </div>
        </SlideTransition>

        {/* CTA Button */}
        <div
          style={{
            marginTop: 50,
            opacity: buttonOpacity,
            transform: `scale(${buttonScale * buttonEntrance})`,
          }}
        >
          <div
            style={{
              backgroundColor: buttonColor,
              color: buttonTextColor,
              fontSize: 28,
              fontWeight: 700,
              fontFamily,
              padding: "20px 60px",
              borderRadius: 50,
              boxShadow: `0 0 ${buttonGlow}px ${buttonColor}`,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            {buttonText}
          </div>
        </div>

        {/* Urgency Text */}
        {urgencyText && (
          <div
            style={{
              marginTop: 24,
              opacity: urgencyOpacity,
              fontSize: 20,
              color: accentColor,
              fontFamily,
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            {urgencyText}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
