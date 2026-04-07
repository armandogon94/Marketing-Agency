import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import type { ProductShowcaseProps } from "./schemas";
import { GradientBackground } from "../components/Background";
import { SlideTransition } from "../components/SlideTransition";

const FeatureCard: React.FC<{
  feature: { icon: string; title: string; description: string };
  accentColor: string;
  textColor: string;
  cardColor: string;
}> = ({ feature, accentColor, textColor, cardColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Glow effect
  const glowProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 25, stiffness: 60 },
  });

  const glowOpacity = interpolate(glowProgress, [0, 1], [0, 0.4]);
  const glowSpread = interpolate(glowProgress, [0, 1], [0, 20]);

  return (
    <SlideTransition direction="right" delay={0} fade scale>
      <div
        style={{
          backgroundColor: cardColor,
          borderRadius: 16,
          padding: "28px 36px",
          display: "flex",
          alignItems: "center",
          gap: 24,
          boxShadow: `0 0 ${glowSpread}px ${glowOpacity > 0 ? accentColor : "transparent"}`,
          border: `1px solid ${accentColor}33`,
          width: 600,
        }}
      >
        {/* Icon */}
        <div
          style={{
            fontSize: 48,
            width: 64,
            height: 64,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: `${accentColor}22`,
            borderRadius: 12,
            flexShrink: 0,
          }}
        >
          {feature.icon}
        </div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: textColor,
              fontFamily: "Inter, sans-serif",
              marginBottom: 6,
            }}
          >
            {feature.title}
          </div>
          <div
            style={{
              fontSize: 16,
              color: `${textColor}bb`,
              fontFamily: "Inter, sans-serif",
              lineHeight: 1.4,
            }}
          >
            {feature.description}
          </div>
        </div>
      </div>
    </SlideTransition>
  );
};

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  productName,
  features,
  backgroundColor,
  gradientTo,
  accentColor,
  textColor,
  cardColor,
  secondsPerFeature,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const framesPerFeature = secondsPerFeature * fps;

  // Title animation
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <GradientBackground from={backgroundColor} to={gradientTo} />

      {/* Product Name */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `scale(${titleScale})`,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: textColor,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {productName}
        </div>
        <div
          style={{
            width: 120,
            height: 4,
            backgroundColor: accentColor,
            borderRadius: 2,
            margin: "16px auto 0",
          }}
        />
      </div>

      {/* Feature Cards */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        {features.map((feature, index) => (
          <Sequence
            key={index}
            from={index * framesPerFeature}
            durationInFrames={durationInFrames - index * framesPerFeature}
          >
            <FeatureCard
              feature={feature}
              accentColor={accentColor}
              textColor={textColor}
              cardColor={cardColor}
            />
          </Sequence>
        ))}
      </div>
    </AbsoluteFill>
  );
};
