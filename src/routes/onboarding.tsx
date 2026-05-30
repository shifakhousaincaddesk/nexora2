import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, type Category } from "@/lib/categories";
import { SiteNav } from "@/components/site-nav";
import { toast } from "sonner";
import { ArrowRight, Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

function Onboarding() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [category, setCategory] = useState<Category | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "",
    city: "",
    target_audience: "",
    description: "",
    services: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    tone: "",
    goals: "",
    brand_story: "",
    usp: "",
  });

  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (!isMounted) return;

        if (error || !data.user) {
          setUser(null);
          return;
        }

        setUser({ id: data.user.id });
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  const update =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !user) return;
    setBusy(true);
    const { data, error } = await supabase
      .from("businesses")
      .insert({
        user_id: user.id,
        category,
        name: form.name,
        city: form.city || null,
        target_audience: form.target_audience || null,
        description: form.description || null,
        services: form.services || null,
        tone: form.tone || null,
        goals: form.goals || null,
        brand_story: form.brand_story || null,
        usp: form.usp || null,
        social_links: {
          instagram: form.instagram || null,
          facebook: form.facebook || null,
          linkedin: form.linkedin || null,
        },
      } as any)
      .select()
      .single();
    setBusy(false);
    if (error || !data) return toast.error(error?.message ?? "Could not save");
    toast.success("Welcome to Nexora!");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/20 text-primary shadow-inner">
              <Sparkles className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Nexora Onboarding</h1>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium">
            <StepDot active={step >= 1} done={step > 1} label="Category" />
            <div className="h-px w-8 bg-border" />
            <StepDot active={step >= 2} label="Profile" />
          </div>
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold tracking-tight">What's your domain?</h2>
            <p className="mt-2 text-muted-foreground text-lg">
              Our AI engines are specialized. Choose the one that fits your business.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`glass-card group flex flex-col items-start gap-4 rounded-3xl p-6 text-left transition-all duration-300 ${
                    category === c.id
                      ? "ring-2 ring-primary bg-primary/5 border-primary/50 shadow-lg shadow-primary/10"
                      : "hover:border-primary/40 hover:bg-muted/30"
                  }`}
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform">
                    {c.emoji}
                  </span>
                  <div>
                    <div className="font-bold text-lg">{c.label}</div>
                    <div className="text-sm text-muted-foreground mt-1">{c.tagline}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-10 flex justify-end">
              <Button
                disabled={!category}
                onClick={() => setStep(2)}
                size="lg"
                className="rounded-full px-8 shadow-xl"
              >
                Continue to profile <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && category && (
          <form
            onSubmit={submit}
            className="glass-card rounded-3xl p-8 border border-border/50 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <h2 className="text-3xl font-bold tracking-tight">Your Business Profile</h2>
            <p className="mt-2 text-muted-foreground">
              This data feeds our "Personalization Engine" to create storytelling-based creatives.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Business name" required>
                <Input
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Nexora Cafe"
                  required
                />
              </Field>
              <Field label="Location / City">
                <Input value={form.city} onChange={update("city")} placeholder="New York, NY" />
              </Field>
              <Field label="Who is your target audience?" full>
                <Input
                  value={form.target_audience}
                  onChange={update("target_audience")}
                  placeholder="Young professionals looking for healthy lunch options"
                />
              </Field>

              <div className="md:col-span-2 h-px bg-border/50 my-2" />

              <Field label="Unique Selling Point (USP)" full>
                <Input
                  value={form.usp}
                  onChange={update("usp")}
                  placeholder="What makes you different? e.g., 'Only farm-to-table cafe in the area'"
                />
              </Field>
              <Field label="Brand Story" full>
                <Textarea
                  rows={3}
                  value={form.brand_story}
                  onChange={update("brand_story")}
                  placeholder="Tell us how you started or your mission..."
                />
              </Field>
              <Field label="Services / Products" full>
                <Textarea
                  rows={2}
                  value={form.services}
                  onChange={update("services")}
                  placeholder="List your key offerings..."
                />
              </Field>

              <div className="md:col-span-2 h-px bg-border/50 my-2" />

              <Field label="Instagram URL">
                <Input
                  value={form.instagram}
                  onChange={update("instagram")}
                  placeholder="https://instagram.com/..."
                />
              </Field>
              <Field label="Brand Tone Preference">
                <Input
                  value={form.tone}
                  onChange={update("tone")}
                  placeholder="witty, minimal, premium, friendly..."
                />
              </Field>
            </div>

            <div className="mt-10 flex justify-between items-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(1)}
                className="rounded-full"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={busy}
                size="lg"
                className="rounded-full px-10 shadow-xl"
              >
                {busy ? "Setting up..." : "Launch Dashboard"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function StepDot({ active, done, label }: { active?: boolean; done?: boolean; label: string }) {
  return (
    <div
      className={`flex items-center gap-2 ${active ? "text-foreground" : "text-muted-foreground"}`}
    >
      <span
        className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold transition-all ${done ? "bg-primary text-primary-foreground scale-110" : active ? "bg-primary/20 text-primary ring-2 ring-primary/20" : "bg-muted"}`}
      >
        {done ? <Check className="h-4 w-4" strokeWidth={3} /> : "•"}
      </span>
      <span className={active ? "font-bold" : ""}>{label}</span>
    </div>
  );
}

function Field({
  label,
  children,
  required,
  full,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <Label className="mb-2 block text-sm font-semibold">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
    </div>
  );
}
