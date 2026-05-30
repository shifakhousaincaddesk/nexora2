import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { DOMAIN_CONFIG } from "../../src/lib/domain-prompts";
import type { Category } from "../../src/lib/categories";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const sizeByAspectRatio: Record<string, "1024x1024" | "1024x1536" | "1536x1024"> = {
  "1:1": "1024x1024",
  "4:5": "1024x1536",
  "9:16": "1024x1536",
  "16:9": "1536x1024",
};

export class ImageService {
  static async generateImage(
    userId: string,
    accessToken: string,
    businessId: string,
    prompt: string,
    aspectRatio: string,
    contentId?: string,
  ) {
    const SUPABASE_URL = process.env.SUPABASE_URL!;
    const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });

    const { data: biz } = await supabase
      .from("businesses")
      .select("id,name,category,city,description,target_audience")
      .eq("id", businessId)
      .maybeSingle();

    if (!biz) throw new Error("Business not found");

    const cfg = DOMAIN_CONFIG[biz.category as Category];
    const fullPrompt = [
      `Create a high-quality social media post image for a ${biz.category.replace("_", "/")} business named "${biz.name}".`,
      biz.city ? `Location vibe: ${biz.city}.` : "",
      biz.target_audience ? `Audience: ${biz.target_audience}.` : "",
      `Brand mood: ${cfg.tone}`,
      `Creative brief: ${prompt}`,
      "Use a polished commercial composition with natural lighting, strong focal point, and clean negative space for optional captions.",
      "Avoid watermarks, UI chrome, distorted hands, fake logos, and unreadable text overlays.",
      `Target aspect ratio: ${aspectRatio}.`,
    ]
      .filter(Boolean)
      .join(" ");

    const response = await openai.images.generate({
      model: process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1",
      prompt: fullPrompt,
      n: 1,
      size: sizeByAspectRatio[aspectRatio] ?? "1024x1024",
      quality: "medium",
    });

    const image = response.data?.[0] as { b64_json?: string; url?: string } | undefined;
    const b64 = image?.b64_json;
    if (!b64) {
      if (image?.url) return { image_url: image.url, prompt, aspect_ratio: aspectRatio };
      throw new Error("No image returned from OpenAI");
    }

    const bytes = Buffer.from(b64, "base64");
    const filename = `${userId}/${businessId}/${crypto.randomUUID()}.png`;
    const { error: uploadErr } = await supabase.storage
      .from("post-images")
      .upload(filename, bytes, { contentType: "image/png" });

    if (uploadErr) throw new Error(uploadErr.message);

    const { data: pub } = supabase.storage.from("post-images").getPublicUrl(filename);

    const { data: saved, error: insErr } = await supabase
      .from("post_images")
      .insert({
        user_id: userId,
        business_id: businessId,
        content_id: contentId ?? null,
        prompt,
        image_url: pub.publicUrl,
        storage_path: filename,
        aspect_ratio: aspectRatio,
      })
      .select()
      .single();

    if (insErr) throw new Error(insErr.message);
    return saved;
  }
}
