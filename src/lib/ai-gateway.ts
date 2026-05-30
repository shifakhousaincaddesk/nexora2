// Lightweight Lovable AI Gateway call for one-shot JSON generation (server-side only).
const ENDPOINT = "https://ai.gateway.lovable.dev/v1/chat/completions";

export async function callLovableAIJson(opts: {
  apiKey: string;
  model?: string;
  system: string;
  user: string;
}): Promise<unknown> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": opts.apiKey,
    },
    body: JSON.stringify({
      model: opts.model ?? "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: opts.user },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`AI gateway ${res.status}: ${text}`) as Error & { status: number };
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  const content: string = data?.choices?.[0]?.message?.content ?? "";
  try {
    return JSON.parse(content);
  } catch {
    // Strip code fences if present
    const cleaned = content.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
    return JSON.parse(cleaned);
  }
}
