
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Business category enum
CREATE TYPE public.business_category AS ENUM ('clinic','salon','coaching','cafe_restaurant','real_estate','gym_fitness');

-- Businesses
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category public.business_category NOT NULL,
  name TEXT NOT NULL,
  city TEXT,
  target_audience TEXT,
  description TEXT,
  services TEXT,
  social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
  tone TEXT,
  goals TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
CREATE INDEX businesses_user_idx ON public.businesses(user_id);
CREATE POLICY "biz_select_own" ON public.businesses FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "biz_insert_own" ON public.businesses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "biz_update_own" ON public.businesses FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "biz_delete_own" ON public.businesses FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER businesses_updated_at BEFORE UPDATE ON public.businesses FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Generated content
CREATE TYPE public.content_kind AS ENUM ('caption','hashtags','calendar','campaign','cta','post_idea','seasonal');

CREATE TABLE public.generated_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  kind public.content_kind NOT NULL,
  title TEXT,
  prompt TEXT,
  content JSONB NOT NULL,
  saved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;
CREATE INDEX gc_user_idx ON public.generated_content(user_id, created_at DESC);
CREATE INDEX gc_biz_idx ON public.generated_content(business_id, created_at DESC);
CREATE POLICY "gc_select_own" ON public.generated_content FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "gc_insert_own" ON public.generated_content FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "gc_update_own" ON public.generated_content FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "gc_delete_own" ON public.generated_content FOR DELETE TO authenticated USING (auth.uid() = user_id);
