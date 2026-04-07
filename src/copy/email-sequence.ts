/**
 * Email Sequence Generator — Structured email campaign templates.
 */

export interface Email {
  day: number;
  subject: string;
  preheader: string;
  bodyPrompt: string;
  cta: string;
  goal: string;
}

export interface EmailSequence {
  name: string;
  description: string;
  emails: Email[];
}

export const SEQUENCES: Record<string, EmailSequence> = {
  welcome: {
    name: "Welcome Sequence",
    description: "Onboard new subscribers and build trust",
    emails: [
      {
        day: 0,
        subject: "Bienvenido — esto es lo que viene",
        preheader: "Tu primer paso con nosotros",
        bodyPrompt:
          "Welcome email. Introduce yourself/brand. Set expectations for what they'll receive. Deliver any promised lead magnet. Keep it warm and personal.",
        cta: "Download / Access the resource",
        goal: "Deliver value, set expectations",
      },
      {
        day: 1,
        subject: "La historia detrás de [Brand]",
        preheader: "Por qué empezamos esto",
        bodyPrompt:
          "Origin story. Why you started. What problem you saw. Make it relatable. Build emotional connection.",
        cta: "Learn more about our mission",
        goal: "Build trust through story",
      },
      {
        day: 3,
        subject: "El error #1 que comete la mayoría",
        preheader: "Y cómo evitarlo",
        bodyPrompt:
          "Educational content. Share a common mistake in your niche. Provide actionable advice. Position yourself as expert.",
        cta: "Read the full guide",
        goal: "Establish authority",
      },
      {
        day: 5,
        subject: "Lo que dicen nuestros clientes",
        preheader: "Resultados reales",
        bodyPrompt:
          "Social proof email. Share 2-3 customer testimonials or results. Include specific numbers. Show transformation.",
        cta: "See more success stories",
        goal: "Build credibility with proof",
      },
      {
        day: 7,
        subject: "Tu siguiente paso",
        preheader: "Listo para empezar?",
        bodyPrompt:
          "Soft pitch. Summarize the value delivered so far. Present your product/service as the logical next step. No hard sell.",
        cta: "Start now / Book a call",
        goal: "Convert to customer",
      },
    ],
  },

  launch: {
    name: "Launch Sequence",
    description: "Build anticipation and drive sales for a product launch",
    emails: [
      {
        day: -7,
        subject: "Algo grande viene la próxima semana",
        preheader: "No te lo pierdas",
        bodyPrompt: "Tease announcement. Create curiosity without revealing details. Hint at the transformation it enables.",
        cta: "Stay tuned",
        goal: "Build anticipation",
      },
      {
        day: -3,
        subject: "El problema que nadie habla",
        preheader: "Y por qué importa ahora",
        bodyPrompt: "Problem awareness. Deep dive into the pain point your product solves. Make it urgent.",
        cta: "Join the waitlist",
        goal: "Amplify the problem",
      },
      {
        day: -1,
        subject: "Mañana cambia todo",
        preheader: "Prepárate",
        bodyPrompt: "Eve of launch. Share a behind-the-scenes story. Build final anticipation. Preview what's coming.",
        cta: "Set a reminder",
        goal: "Peak anticipation",
      },
      {
        day: 0,
        subject: "YA ESTÁ AQUÍ — [Product Name]",
        preheader: "Disponible ahora",
        bodyPrompt: "Launch email. Full reveal. Features, benefits, price. Early bird offer if applicable. Clear CTA.",
        cta: "Get it now",
        goal: "Drive sales",
      },
      {
        day: 1,
        subject: "¿Viste lo de ayer?",
        preheader: "Lo que te estás perdiendo",
        bodyPrompt: "Follow-up for non-openers. Recap the launch. Share early results or testimonials. FOMO.",
        cta: "Don't miss out",
        goal: "Catch non-openers",
      },
      {
        day: 3,
        subject: "Preguntas frecuentes sobre [Product]",
        preheader: "Todo lo que necesitas saber",
        bodyPrompt: "FAQ email. Address common objections. Remove friction. Include a testimonial.",
        cta: "Get your questions answered",
        goal: "Overcome objections",
      },
      {
        day: 5,
        subject: "Última oportunidad — cierra en 48 horas",
        preheader: "El precio sube pronto",
        bodyPrompt: "Urgency email. Remind of deadline. Recap the value. Final testimonial. Strong CTA.",
        cta: "Last chance to join",
        goal: "Final push",
      },
    ],
  },

  nurture: {
    name: "Nurture Sequence",
    description: "Ongoing value delivery to keep subscribers engaged",
    emails: [
      {
        day: 0,
        subject: "3 cosas que aprendí esta semana sobre [Topic]",
        preheader: "Tips rápidos y accionables",
        bodyPrompt: "Weekly value email. Share 3 actionable insights. Keep it concise and practical.",
        cta: "Try this today",
        goal: "Deliver consistent value",
      },
      {
        day: 7,
        subject: "Mi herramienta favorita para [Task]",
        preheader: "La uso todos los días",
        bodyPrompt: "Tool/resource recommendation. Share something genuinely useful. Include your experience with it.",
        cta: "Check it out",
        goal: "Build trust through recommendations",
      },
      {
        day: 14,
        subject: "Caso de estudio: cómo [Client] logró [Result]",
        preheader: "De X a Y en Z meses",
        bodyPrompt: "Case study email. Tell a client success story with specific numbers and timeline.",
        cta: "Want similar results?",
        goal: "Social proof + soft pitch",
      },
    ],
  },
};

/**
 * Get an email sequence by name.
 */
export function getSequence(name: string): EmailSequence | undefined {
  return SEQUENCES[name.toLowerCase()];
}

/**
 * List all available email sequences.
 */
export function listSequences(): EmailSequence[] {
  return Object.values(SEQUENCES);
}
