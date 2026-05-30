import OpenAI from "openai";
import { checkSubscription } from "../middlewares/checkSubscription";
import { buildPrompt, type ContentKind } from "../../src/lib/domain-prompts";

type Business = Parameters<typeof buildPrompt>[1];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  static async generateContent(
    userId: string,
    kind: ContentKind,
    business: Business,
    instruction?: string,
  ) {
    const access = await checkSubscription(userId);

    if (access.expired) {
      throw new Error("Trial expired");
    }

    const prompt = buildPrompt(kind, business, instruction);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: prompt.system,
        },
        {
          role: "user",
          content: prompt.user,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content ?? "{}";

    try {
      return JSON.parse(content) as unknown;
    } catch {
      return { text: content };
    }
  }
}
