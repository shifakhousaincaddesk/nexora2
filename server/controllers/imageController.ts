import { ImageService } from "../services/imageService";
import { createClient } from "@supabase/supabase-js";

export class ImageController {
  static async handleGenerateImage(req: Request) {
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

      const { businessId, prompt, aspect_ratio, contentId } = await req.json();

      const image = await ImageService.generateImage(
        user.id,
        token,
        businessId,
        prompt,
        aspect_ratio,
        contentId,
      );

      return new Response(JSON.stringify({ image }), { status: 200 });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }
}
