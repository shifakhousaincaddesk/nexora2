import { AIService } from "../services/aiService";
import { createClient } from "@supabase/supabase-js";

export class GenerationController {
  static async handleGenerate(req: Request) {
    try {
      const auth = req.headers.get("authorization");
      if (!auth?.startsWith("Bearer "))
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
      const token = auth.replace("Bearer ", "");

      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_PUBLISHABLE_KEY!,
        {
          global: { headers: { Authorization: `Bearer ${token}` } },
        },
      );

      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();
      if (authErr || !user)
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

      const { kind, businessId, instruction } = await req.json();

      const { data: biz } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", businessId)
        .maybeSingle();
      if (!biz)
        return new Response(JSON.stringify({ error: "Business not found" }), { status: 404 });

      const result = await AIService.generateContent(user.id, kind, biz, instruction);

      const { data: saved, error: insErr } = await supabase
        .from("generated_content")
        .insert({
          user_id: user.id,
          business_id: businessId,
          kind,
          title: this.getTitle(kind),
          prompt: instruction ?? null,
          content: result as any,
        })
        .select()
        .single();

      if (insErr) return new Response(JSON.stringify({ error: insErr.message }), { status: 500 });

      return new Response(JSON.stringify({ item: saved }), { status: 200 });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  private static getTitle(kind: string) {
    const titleMap: Record<string, string> = {
      caption: "Captions",
      hashtags: "Hashtag sets",
      calendar: "7-day content calendar",
      campaign: "Campaign ideas",
      cta: "CTAs",
      post_idea: "Post ideas",
      seasonal: "Seasonal moments",
    };
    return titleMap[kind] || "Generated content";
  }
}
