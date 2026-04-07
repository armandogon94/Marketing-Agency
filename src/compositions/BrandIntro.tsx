import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import type { BrandIntroProps } from "./schemas";
import { GradientBackground } from "../components/Background";
import { Logo } from "../components/Logo";

export const BrandIntro: React.FC<BrandIntroProps> = ({
  logoUrl,
  logoWidth,
  tagline,
  backgroundColor,
  gradientTo,
  textColor,
  accentColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Logo scale + fade in
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  const logoOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Tagline characters for typewriter effect
  const taglineChars = tagline.split("");
  const typewriterStart = 30; // frames before starting typewriter
  const framesPerChar = 2;

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <GradientBackground from={backgroundColor} to={gradientTo} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            marginBottom: 30,
          }}
        >
          {logoUrl ? (
            <Logo src={logoUrl} width={logoWidth} />
          ) : (
            <div
              style={{
                width: logoWidth,
                height: logoWidth * 0.6,
                backgroundColor: `${accentColor}33`,
                borderRadius: 16,
                border: `3px dashed ${accentColor}`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 24,
                color: `${textColor}88`,
                fontFamily,
              }}
            >
              Your Logo
            </div>
          )}
        </div>

        {/* Tagline with typewriter effect */}
        <div
          style={{
            fontSize: 36,
            color: textColor,
            fontFamily,
            fontWeight: 500,
            letterSpacing: 1,
            display: "flex",
          }}
        >
          {taglineChars.map((char, index) => {
            const charFrame = typewriterStart + index * framesPerChar;
            const visible = frame >= charFrame;

            return (
              <Sequence key={index} from={charFrame}>
                <span
                  style={{
                    opacity: visible ? 1 : 0,
                    color: textColor,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              </Sequence>
            );
          })}

          {/* Blinking cursor */}
          {frame >= typewriterStart && (
            <span
              style={{
                opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0,
                color: accentColor,
                fontWeight: 300,
                marginLeft: 2,
              }}
            >
              |
            </span>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
