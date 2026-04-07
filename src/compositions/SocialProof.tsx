import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
} from "remotion";
import type { SocialProofProps } from "./schemas";
import { GradientBackground } from "../components/Background";

const StarRating: React.FC<{
  rating: number;
  frame: number;
  fps: number;
  delay: number;
  starColor: string;
}> = ({ rating, frame, fps, delay, starColor }) => {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fillProgress = spring({
          frame: frame - delay - star * 3,
          fps,
          config: { damping: 15, stiffness: 120 },
        });

        const scale = interpolate(fillProgress, [0, 1], [0, 1]);

        return (
          <div
            key={star}
            style={{
              fontSize: 32,
              transform: `scale(${scale})`,
              color: star <= rating ? starColor : "#555555",
            }}
          >
            ★
          </div>
        );
      })}
    </div>
  );
};

const TestimonialCard: React.FC<{
  testimonial: {
    quote: string;
    name: string;
    role: string;
    photoUrl: string;
    rating: number;
  };
  textColor: string;
  starColor: string;
  accentColor: string;
}> = ({ testimonial, textColor, starColor, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideUp = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 80 },
  });

  const translateY = interpolate(slideUp, [0, 1], [80, 0]);
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 900,
          padding: 40,
        }}
      >
        {/* Photo */}
        {testimonial.photoUrl && (
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              overflow: "hidden",
              border: `4px solid ${accentColor}`,
              marginBottom: 24,
            }}
          >
            <Img
              src={testimonial.photoUrl}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}

        {/* Stars */}
        <StarRating
          rating={testimonial.rating}
          frame={frame}
          fps={fps}
          delay={10}
          starColor={starColor}
        />

        {/* Quote */}
        <div
          style={{
            fontSize: 36,
            color: textColor,
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            textAlign: "center",
            lineHeight: 1.5,
            marginTop: 24,
            marginBottom: 24,
          }}
        >
          &ldquo;{testimonial.quote}&rdquo;
        </div>

        {/* Name & Role */}
        <div
          style={{
            fontSize: 24,
            color: accentColor,
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {testimonial.name}
        </div>
        <div
          style={{
            fontSize: 18,
            color: `${textColor}aa`,
            fontFamily: "Inter, sans-serif",
            marginTop: 4,
          }}
        >
          {testimonial.role}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SocialProof: React.FC<SocialProofProps> = ({
  testimonials,
  backgroundColor,
  gradientTo,
  textColor,
  starColor,
  accentColor,
  secondsPerTestimonial,
}) => {
  const { fps } = useVideoConfig();
  const framesPerTestimonial = secondsPerTestimonial * fps;

  return (
    <AbsoluteFill>
      <GradientBackground from={backgroundColor} to={gradientTo} />

      {testimonials.map((testimonial, index) => (
        <Sequence
          key={index}
          from={index * framesPerTestimonial}
          durationInFrames={framesPerTestimonial}
        >
          <TestimonialCard
            testimonial={testimonial}
            textColor={textColor}
            starColor={starColor}
            accentColor={accentColor}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
