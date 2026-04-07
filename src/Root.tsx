import React from "react";
import { Composition, Folder } from "remotion";
import { ExplainerVideo } from "./compositions/ExplainerVideo";
import { TalkingHead } from "./compositions/TalkingHead";
import { Listicle } from "./compositions/Listicle";
import { QuoteCard } from "./compositions/QuoteCard";
import { SocialProof } from "./compositions/SocialProof";
import { ProductShowcase } from "./compositions/ProductShowcase";
import { BeforeAfter } from "./compositions/BeforeAfter";
import { StatsCounter } from "./compositions/StatsCounter";
import { BrandIntro } from "./compositions/BrandIntro";
import { CallToAction } from "./compositions/CallToAction";
import {
  explainerSchema,
  talkingHeadSchema,
  listicleSchema,
  quoteCardSchema,
  socialProofSchema,
  productShowcaseSchema,
  beforeAfterSchema,
  statsCounterSchema,
  brandIntroSchema,
  callToActionSchema,
} from "./compositions/schemas";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Landscape-16x9">
        <Composition
          id="ExplainerVideo"
          component={ExplainerVideo}
          schema={explainerSchema}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: "5 Claves para Implementar IA",
            script: "La inteligencia artificial está transformando los negocios.",
            audioUrl: "",
            wordTimings: [],
            backgroundColor: "#1a1a2e",
            gradientTo: "#16213e",
            accentColor: "#ffd700",
            textColor: "#ffffff",
            fontFamily: "Inter, sans-serif",
            captions: {
              enabled: true,
              fontSize: 36,
              color: "#ffffff",
              highlightColor: "#ffd700",
              position: "bottom",
              backgroundColor: "rgba(0,0,0,0.7)",
            },
          }}
        />

        <Composition
          id="TalkingHead"
          component={TalkingHead}
          schema={talkingHeadSchema}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: "Hablemos de IA",
            script: "",
            audioUrl: "",
            speakerImageUrl: "",
            wordTimings: [],
            backgroundColor: "#0a0a0a",
            nameTag: "Tu Nombre",
            nameTagColor: "#ffd700",
            captions: {
              enabled: true,
              fontSize: 36,
              color: "#ffffff",
              highlightColor: "#ffd700",
              position: "bottom",
              backgroundColor: "rgba(0,0,0,0.7)",
            },
          }}
        />

        <Composition
          id="Listicle"
          component={Listicle}
          schema={listicleSchema}
          durationInFrames={600}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: "Top 5 Tendencias de IA",
            items: [
              { number: 1, title: "Automatización Inteligente", description: "Los procesos se optimizan solos" },
              { number: 2, title: "IA Generativa", description: "Creación de contenido con IA" },
              { number: 3, title: "Machine Learning", description: "Aprendizaje continuo de datos" },
            ],
            audioUrl: "",
            wordTimings: [],
            backgroundColor: "#0f0c29",
            gradientTo: "#302b63",
            accentColor: "#ffd700",
            textColor: "#ffffff",
            secondsPerItem: 5,
            captions: {
              enabled: true,
              fontSize: 36,
              color: "#ffffff",
              highlightColor: "#ffd700",
              position: "bottom",
              backgroundColor: "rgba(0,0,0,0.7)",
            },
          }}
        />

        <Composition
          id="QuoteCard"
          component={QuoteCard}
          schema={quoteCardSchema}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            quote: "La mejor manera de predecir el futuro es crearlo.",
            author: "Peter Drucker",
            audioUrl: "",
            wordTimings: [],
            backgroundColor: "#1a1a2e",
            quoteColor: "#ffffff",
            authorColor: "#ffd700",
            fontFamily: "Georgia, serif",
            captions: {
              enabled: false,
              fontSize: 36,
              color: "#ffffff",
              highlightColor: "#ffd700",
              position: "bottom",
              backgroundColor: "rgba(0,0,0,0.7)",
            },
          }}
        />
      </Folder>

      <Folder name="Marketing">
        <Composition
          id="SocialProof"
          component={SocialProof}
          schema={socialProofSchema}
          durationInFrames={450}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            testimonials: [
              {
                quote: "This product completely transformed our workflow.",
                name: "Sarah Johnson",
                role: "CEO, TechCorp",
                photoUrl: "",
                rating: 5,
              },
              {
                quote: "We saw a 300% increase in productivity within weeks.",
                name: "Michael Chen",
                role: "CTO, StartupX",
                photoUrl: "",
                rating: 5,
              },
              {
                quote: "The best investment we made this year, hands down.",
                name: "Emily Rodriguez",
                role: "VP Marketing, GrowthCo",
                photoUrl: "",
                rating: 4,
              },
            ],
            backgroundColor: "#1a1a2e",
            gradientTo: "#16213e",
            textColor: "#ffffff",
            starColor: "#ffd700",
            accentColor: "#ffd700",
            secondsPerTestimonial: 5,
          }}
        />

        <Composition
          id="ProductShowcase"
          component={ProductShowcase}
          schema={productShowcaseSchema}
          durationInFrames={450}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            productName: "SuperApp Pro",
            features: [
              { icon: "⚡", title: "Lightning Fast", description: "10x faster than the competition" },
              { icon: "🔒", title: "Enterprise Security", description: "Bank-grade encryption built in" },
              { icon: "📊", title: "Real-Time Analytics", description: "Insights at your fingertips" },
              { icon: "🔗", title: "Seamless Integrations", description: "Connect with 500+ tools" },
            ],
            backgroundColor: "#0f0c29",
            gradientTo: "#302b63",
            accentColor: "#00d4ff",
            textColor: "#ffffff",
            cardColor: "rgba(255,255,255,0.08)",
            secondsPerFeature: 3,
          }}
        />

        <Composition
          id="BeforeAfter"
          component={BeforeAfter}
          schema={beforeAfterSchema}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            beforeLabel: "Before",
            afterLabel: "After",
            beforeText: "Manual processes, scattered data, slow decisions",
            afterText: "Automated workflows, unified dashboard, instant insights",
            beforeColor: "#1a1a2e",
            afterColor: "#0d3b2e",
            backgroundColor: "#111111",
            textColor: "#ffffff",
            dividerColor: "#ffd700",
            fontFamily: "Inter, sans-serif",
          }}
        />

        <Composition
          id="StatsCounter"
          component={StatsCounter}
          schema={statsCounterSchema}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: "Results That Speak",
            stats: [
              { value: 250, label: "Revenue Growth", suffix: "%" },
              { value: 50, label: "Active Users", suffix: "K" },
              { value: 99, label: "Uptime", suffix: "%" },
              { value: 4, label: "Time Saved", suffix: "x" },
            ],
            backgroundColor: "#0a0a1a",
            gradientTo: "#1a1a3e",
            textColor: "#ffffff",
            accentColor: "#00d4ff",
            fontFamily: "Inter, sans-serif",
          }}
        />

        <Composition
          id="BrandIntro"
          component={BrandIntro}
          schema={brandIntroSchema}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            logoUrl: "",
            logoWidth: 250,
            tagline: "Innovation starts here.",
            backgroundColor: "#0a0a0a",
            gradientTo: "#1a1a2e",
            textColor: "#ffffff",
            accentColor: "#ffd700",
            fontFamily: "Inter, sans-serif",
          }}
        />

        <Composition
          id="CallToAction"
          component={CallToAction}
          schema={callToActionSchema}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            headline: "Ready to Transform Your Business?",
            subheadline: "Join thousands of companies already seeing results.",
            buttonText: "Start Free Trial",
            urgencyText: "Limited time — 50% off for early adopters",
            backgroundColor: "#1a0a2e",
            gradientTo: "#2e1a4e",
            textColor: "#ffffff",
            buttonColor: "#ff4d4d",
            buttonTextColor: "#ffffff",
            accentColor: "#ffd700",
            fontFamily: "Inter, sans-serif",
          }}
        />
      </Folder>

      <Folder name="Vertical-9x16">
        <Composition
          id="ExplainerVideoVertical"
          component={ExplainerVideo}
          schema={explainerSchema}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            title: "5 Claves de IA",
            script: "",
            audioUrl: "",
            wordTimings: [],
            backgroundColor: "#1a1a2e",
            gradientTo: "#16213e",
            accentColor: "#ffd700",
            textColor: "#ffffff",
            fontFamily: "Inter, sans-serif",
            captions: {
              enabled: true,
              fontSize: 42,
              color: "#ffffff",
              highlightColor: "#ffd700",
              position: "center",
              backgroundColor: "rgba(0,0,0,0.7)",
            },
          }}
        />
      </Folder>
    </>
  );
};
