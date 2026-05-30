
-- Table for generated images
CREATE TABLE public.post_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  business_id UUID NOT NULL,
  content_id UUID NULL,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  storage_path TEXT NULL,
  aspect_ratio TEXT NOT NULL DEFAULT '1:1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.post_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pi_select_own" ON public.post_images FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "pi_insert_own" ON public.post_images FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pi_delete_own" ON public.post_images FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_post_images_business ON public.post_images(business_id, created_at DESC);

-- Public storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "post_images_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'post-images');

CREATE POLICY "post_images_user_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "post_images_user_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);
