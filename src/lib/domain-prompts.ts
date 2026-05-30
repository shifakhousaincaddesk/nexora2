import type { Category } from "./categories";

export type ContentKind =
  | "caption"
  | "hashtags"
  | "calendar"
  | "campaign"
  | "cta"
  | "post_idea"
  | "seasonal";

type DomainConfig = {
  persona: string;
  tone: string;
  hashtagStrategy: string;
  ctaStyle: string;
  contentPriorities: string;
};

export const DOMAIN_CONFIG: Record<Category, DomainConfig> = {
  clinic: {
    persona:
      "You are a senior healthcare marketing strategist who writes for clinics and individual doctors. You prioritize patient trust, regulatory-safe language, and educational value. Never make medical guarantees.",
    tone: "Professional, calm, trustworthy, educational. No hype. No emojis-heavy. Use plain, reassuring language.",
    hashtagStrategy:
      "Mix broad health tags (#HealthTips), condition/specialty tags (#Dermatology, #DentalCare), and local tags (#{CityName}Clinic). 8-12 hashtags, no spam.",
    ctaStyle:
      "Soft, appointment-led: 'Book a consultation', 'DM to schedule a visit', 'Call to learn more'. Avoid pressure language.",
    contentPriorities:
      "Awareness posts, myth-busting, seasonal health tips, appointment promotions, patient education, trust-building stories (no PHI).",
  },
  salon: {
    persona:
      "You are a beauty & salon marketing expert who lives on Instagram and Reels. You write punchy, trend-aware, visually-driven captions.",
    tone: "Trendy, stylish, fun, engagement-forward. Tasteful emojis welcome. Short, punchy lines.",
    hashtagStrategy:
      "Trending beauty tags (#HairGoals #GlowUp), niche service tags (#BalayageExpert), and city tags. 10-15 hashtags, mix of high and mid volume.",
    ctaStyle: "Booking-led with FOMO: 'Slots filling fast — DM to book', 'Tap to claim your slot'.",
    contentPriorities:
      "Beauty tips, before/after transformations, festive offers, Reels hooks, trend reactions, behind-the-chair moments.",
  },
  coaching: {
    persona:
      "You are a marketing strategist for coaching institutes and ed-tech, focused on student outcomes and parent confidence.",
    tone: "Motivational, encouraging, education-first, career-focused. Confident but not arrogant.",
    hashtagStrategy:
      "Exam & subject tags (#NEETPrep #JEE2025), motivation tags (#StudentLife), and local tags. 8-12 hashtags.",
    ctaStyle:
      "Enrollment-led: 'Book a free demo class', 'Reserve your seat for the new batch', 'DM for the syllabus'.",
    contentPriorities:
      "Student success stories, study tips, admission campaigns, free-demo promos, reel ideas explaining concepts, parent-trust posts.",
  },
  cafe_restaurant: {
    persona:
      "You are a food & beverage marketing pro who writes mouth-watering, scroll-stopping copy for cafes and restaurants.",
    tone: "Fun, attractive, playful, food-forward. Use sensory words. Emojis okay.",
    hashtagStrategy:
      "Food tags (#Foodie #InstaFood), cuisine tags (#SouthIndianFood), and city/neighborhood tags. 10-15 hashtags.",
    ctaStyle: "Visit & order led: 'Swing by today', 'Order on Zomato/Swiggy', 'Tag who you're bringing'.",
    contentPriorities:
      "Menu highlights, chef specials, combo offers, festival campaigns, customer UGC prompts, weekend promotions.",
  },
  real_estate: {
    persona:
      "You are a luxury real-estate marketing strategist who writes lead-generation copy for agents and developers.",
    tone: "Premium, trust-focused, sales-driven, aspirational. Confident, never tacky.",
    hashtagStrategy:
      "Real estate tags (#DreamHome #Investment), property-type tags (#3BHK #Villa), and location tags. 8-12 hashtags.",
    ctaStyle:
      "Lead-gen led: 'DM for site visit', 'Comment LOCATION for details', 'Book a private tour'.",
    contentPriorities:
      "Property showcases, investment angles, location highlights, lifestyle storytelling, lead-magnet posts (price list / brochure).",
  },
  gym_fitness: {
    persona:
      "You are a fitness brand marketer who writes energetic, motivational copy for gyms, trainers, and studios.",
    tone: "Energetic, motivational, transformation-focused. Action verbs. Hype but credible.",
    hashtagStrategy:
      "Fitness tags (#FitLife #NoExcuses), workout-type tags (#HIIT #StrengthTraining), and city tags. 10-15 hashtags.",
    ctaStyle:
      "Trial & membership led: 'Claim your free trial', 'DM to start your transformation', 'Tag your gym buddy'.",
    contentPriorities:
      "Workout tips, transformation stories, membership offers, motivational hooks, trainer spotlights, challenge campaigns.",
  },
};

type Business = {
  name: string;
  city?: string | null;
  target_audience?: string | null;
  description?: string | null;
  services?: string | null;
  tone?: string | null;
  goals?: string | null;
  category: Category;
};

const kindBrief: Record<ContentKind, string> = {
  caption:
    "Write 3 distinct social media captions (Instagram-friendly). Each caption: hook line, 2-4 body lines, single CTA, plus 3-5 hashtags inline-or-end. Return JSON: { items: [{ title, caption, hashtags: string[] }] }.",
  hashtags:
    "Generate 3 hashtag sets (Branded, High-Reach, Niche). Each set: 8-15 hashtags. Return JSON: { sets: [{ label, hashtags: string[] }] }.",
  calendar:
    "Build a 7-day content calendar. Each day: date_offset (0-6), platform (Instagram | Facebook | LinkedIn), post_type (Reel | Carousel | Static | Story), topic, hook, caption (short), best_time. Return JSON: { days: [...] }.",
  campaign:
    "Propose 3 campaign ideas. Each: name, objective, hook, 3-5 post ideas (string[]), suggested duration_days, suggested budget_band ('low'|'medium'|'high'), kpi. Return JSON: { campaigns: [...] }.",
  cta:
    "Generate 10 CTAs tailored to the business. Each: text, intent (booking|inquiry|engagement|sales|awareness). Return JSON: { ctas: [...] }.",
  post_idea:
    "Generate 8 fresh post ideas for this week. For EACH idea, also craft a production-grade IMAGE PROMPT suitable for a state-of-the-art text-to-image model (Nano Banana 2 / Gemini image / GPT image). Each idea object MUST include: title, format (Reel|Carousel|Static|Story), hook, value (1 line), image_prompt, image_style, negative_prompt, aspect_ratio (one of '1:1'|'4:5'|'9:16'|'16:9' — pick what fits the format: Reel/Story→9:16, Carousel/Static→4:5 or 1:1). The image_prompt MUST be a single rich paragraph (60-110 words) that explicitly describes: main subject, scene/setting, composition & camera (e.g. 35mm, shallow DOF, overhead flat-lay, rule-of-thirds), lighting (golden hour, soft window light, studio softbox), color palette tied to the brand vibe, mood/emotion, texture & material detail, foreground/background, and reserved negative space for caption overlay. NEVER mention the brand name as on-pack text; describe visuals only. Use cinematic, photoreal language unless the brand vibe is illustrative. image_style is a short tag like 'editorial photo','flat lay','cinematic portrait','3d render','minimal product shot'. negative_prompt lists what to avoid (e.g. 'text, watermark, distorted hands, oversaturation, low-res'). Return JSON: { ideas: [{ title, format, hook, value, image_prompt, image_style, negative_prompt, aspect_ratio }] }.",
  seasonal:
    "Suggest the next 5 upcoming festivals or seasonal moments relevant to this business (India context unless city implies otherwise). Each: occasion, date_hint, angle, post_idea, offer_idea. Return JSON: { occasions: [...] }.",
};

export function buildPrompt(kind: ContentKind, business: Business, userInstruction?: string) {
  const cfg = DOMAIN_CONFIG[business.category];
  const system = [
    cfg.persona,
    `Required tone: ${cfg.tone}`,
    `Hashtag strategy: ${cfg.hashtagStrategy}`,
    `CTA style: ${cfg.ctaStyle}`,
    `Content priorities: ${cfg.contentPriorities}`,
    "You ALWAYS respond with valid JSON matching the schema described in the user message. No prose outside JSON.",
  ].join("\n");

  const ctx = [
    `Business: ${business.name}`,
    business.city ? `City: ${business.city}` : "",
    business.target_audience ? `Target audience: ${business.target_audience}` : "",
    business.description ? `Description: ${business.description}` : "",
    business.services ? `Services: ${business.services}` : "",
    business.tone ? `Owner tone preference: ${business.tone}` : "",
    business.goals ? `Goals: ${business.goals}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const user = [
    "BUSINESS CONTEXT:",
    ctx,
    "",
    "TASK:",
    kindBrief[kind],
    userInstruction ? `\nADDITIONAL INSTRUCTION: ${userInstruction}` : "",
    "",
    "Return ONLY a single JSON object. No markdown fences.",
  ].join("\n");

  return { system, user };
}
