import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  Image as ImageIcon,
  Loader2,
  Send,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categoryLabel, type Category } from "@/lib/categories";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

type Business = {
  id: string;
  name: string;
  category: Category;
  city: string | null;
  target_audience: string | null;
  description: string | null;
  services: string | null;
  tone: string | null;
  goals: string | null;
};

type PostIdea = {
  title?: string;
  format?: string;
  hook?: string;
  value?: string;
  caption?: string;
  image_prompt?: string;
  image_style?: string;
  negative_prompt?: string;
  aspect_ratio?: string;
};

type GeneratedItem = {
  id: string;
  title: string | null;
  content: unknown;
};

type GeneratedImage = {
  id?: string;
  image_url: string;
  prompt: string;
  aspect_ratio: string;
};

type ScheduledPost = {
  id: string;
  title: string;
  platform: string;
  scheduledFor: string;
  caption: string;
  imageUrl?: string;
};

const platformOptions = ["Instagram", "Facebook", "LinkedIn", "Story"];
const aspectOptions = ["1:1", "4:5", "9:16", "16:9"];
const scheduleStorageKey = "nexoraScheduledPosts";

function DashboardPage() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState("");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [instruction, setInstruction] = useState(
    "Create this week's highest-converting post ideas for my business. Focus on practical, ready-to-post content.",
  );
  const [generated, setGenerated] = useState<GeneratedItem | null>(null);
  const [selectedIdeaIndex, setSelectedIdeaIndex] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [platform, setPlatform] = useState("Instagram");
  const [scheduleDate, setScheduleDate] = useState(() => toDateInput(new Date()));
  const [scheduleTime, setScheduleTime] = useState("10:00");
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedBusiness =
    businesses.find((business) => business.id === selectedBusinessId) ?? null;
  const ideas = useMemo(() => extractIdeas(generated?.content), [generated]);
  const selectedIdea = ideas[selectedIdeaIndex] ?? ideas[0] ?? null;
  const selectedPrompt = selectedIdea?.image_prompt ?? selectedIdea?.hook ?? instruction;
  const selectedAspectRatio = selectedIdea?.aspect_ratio ?? "4:5";

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        navigate({ to: "/auth" });
        return;
      }

      const { data: businessRows, error: businessError } = await supabase
        .from("businesses")
        .select("id,name,category,city,target_audience,description,services,tone,goals")
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (businessError) {
        setError(businessError.message);
      } else {
        setBusinesses((businessRows ?? []) as Business[]);
        setSelectedBusinessId(businessRows?.[0]?.id ?? "");
      }

      setAccessToken(session.access_token);
      setScheduledPosts(readScheduledPosts());
      setIsLoading(false);
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const generateContent = async () => {
    if (!selectedBusinessId || !accessToken) return;

    setError(null);
    setGeneratedImage(null);
    setIsGeneratingContent(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kind: "post_idea",
          businessId: selectedBusinessId,
          instruction,
        }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not generate content");

      setGenerated(payload.item as GeneratedItem);
      setSelectedIdeaIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate content");
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const generateImage = async () => {
    if (!selectedBusinessId || !accessToken || !selectedPrompt) return;

    setError(null);
    setIsGeneratingImage(true);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessId: selectedBusinessId,
          prompt: selectedPrompt,
          aspect_ratio: aspectOptions.includes(selectedAspectRatio) ? selectedAspectRatio : "4:5",
          contentId: generated?.id,
        }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not generate image");

      setGeneratedImage(payload.image as GeneratedImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate image");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const scheduleSelectedPost = () => {
    if (!selectedIdea) return;

    const post: ScheduledPost = {
      id: crypto.randomUUID(),
      title: selectedIdea.title ?? "Scheduled post",
      platform,
      scheduledFor: new Date(`${scheduleDate}T${scheduleTime}`).toISOString(),
      caption: selectedIdea.caption ?? selectedIdea.hook ?? selectedIdea.value ?? "",
      imageUrl: generatedImage?.image_url,
    };

    const nextPosts = [...scheduledPosts, post].sort(
      (a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime(),
    );

    setScheduledPosts(nextPosts);
    window.localStorage.setItem(scheduleStorageKey, JSON.stringify(nextPosts));
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <SiteNav />
        <div className="grid min-h-[70vh] place-items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <div className="mx-auto max-w-7xl px-4 py-6">
        <header className="flex flex-col justify-between gap-4 border-b border-border/70 pb-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Nexora command center
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">AI campaign workspace</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Generate post ideas, turn selected prompts into OpenAI images, preview the asset, and
              schedule it into your publishing calendar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              className="h-10 min-w-64 rounded-md border border-input bg-background px-3 text-sm"
              value={selectedBusinessId}
              onChange={(event) => setSelectedBusinessId(event.target.value)}
            >
              {businesses.map((business) => (
                <option key={business.id} value={business.id}>
                  {business.name} - {categoryLabel(business.category)}
                </option>
              ))}
            </select>
            <Button asChild variant="outline">
              <Link to="/onboarding">Business setup</Link>
            </Button>
          </div>
        </header>

        {!selectedBusiness ? (
          <section className="mt-8 rounded-lg border border-border/70 bg-card p-8">
            <h2 className="text-xl font-semibold">Complete onboarding first</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              The generator needs a business profile before it can create domain-specific prompts
              and images.
            </p>
            <Button asChild className="mt-5">
              <Link to="/onboarding">Create business profile</Link>
            </Button>
          </section>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[0.95fr_1.05fr]">
            <section className="space-y-5">
              <Panel title="Prompt Lab" icon={<WandSparkles className="h-5 w-5" />}>
                <div className="grid gap-4">
                  <div className="rounded-md border border-border/70 bg-muted/30 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{selectedBusiness.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {categoryLabel(selectedBusiness.category)}
                          {selectedBusiness.city ? ` - ${selectedBusiness.city}` : ""}
                        </p>
                      </div>
                      <span className="rounded-md bg-primary/15 px-2 py-1 text-xs font-semibold text-primary">
                        Post ideas + image prompts
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instruction">Campaign instruction</Label>
                    <Textarea
                      id="instruction"
                      rows={5}
                      value={instruction}
                      onChange={(event) => setInstruction(event.target.value)}
                    />
                  </div>

                  {error && (
                    <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
                      {error}
                    </div>
                  )}

                  <Button
                    onClick={generateContent}
                    disabled={isGeneratingContent}
                    className="justify-center gap-2"
                  >
                    {isGeneratingContent ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    Generate prompts
                  </Button>
                </div>
              </Panel>

              <Panel title="Generated Prompts" icon={<Sparkles className="h-5 w-5" />}>
                {ideas.length === 0 ? (
                  <EmptyState text="Generate prompts to see ready-to-use post ideas here." />
                ) : (
                  <div className="space-y-3">
                    {ideas.map((idea, index) => (
                      <button
                        key={`${idea.title}-${index}`}
                        onClick={() => setSelectedIdeaIndex(index)}
                        className={`w-full rounded-md border p-4 text-left transition ${
                          selectedIdeaIndex === index
                            ? "border-primary bg-primary/10"
                            : "border-border/70 bg-card hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold">{idea.title ?? `Idea ${index + 1}`}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {idea.hook ?? idea.value}
                            </p>
                          </div>
                          <span className="rounded-md bg-muted px-2 py-1 text-xs">
                            {idea.format ?? "Post"}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </Panel>
            </section>

            <section className="space-y-5">
              <Panel title="Image Preview" icon={<ImageIcon className="h-5 w-5" />}>
                <div className="grid gap-4 lg:grid-cols-[1fr_0.75fr]">
                  <div className="grid aspect-[4/5] place-items-center overflow-hidden rounded-md border border-border/70 bg-muted/30">
                    {generatedImage?.image_url ? (
                      <img
                        src={generatedImage.image_url}
                        alt="Generated campaign visual"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="px-8 text-center text-sm text-muted-foreground">
                        Select a generated prompt and create an image to preview it here.
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold">
                        {selectedIdea?.title ?? "No prompt selected"}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {selectedIdea?.image_prompt ??
                          "Generated image prompts will appear after prompt generation."}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="aspectRatio">Aspect ratio</Label>
                      <select
                        id="aspectRatio"
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                        value={
                          aspectOptions.includes(selectedAspectRatio) ? selectedAspectRatio : "4:5"
                        }
                        onChange={() => undefined}
                        disabled
                      >
                        <option>
                          {aspectOptions.includes(selectedAspectRatio)
                            ? selectedAspectRatio
                            : "4:5"}
                        </option>
                      </select>
                    </div>

                    <Button
                      onClick={generateImage}
                      disabled={!selectedIdea || isGeneratingImage}
                      className="w-full justify-center gap-2"
                    >
                      {isGeneratingImage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ImageIcon className="h-4 w-4" />
                      )}
                      Generate image
                    </Button>
                  </div>
                </div>
              </Panel>

              <Panel title="Schedule" icon={<CalendarDays className="h-5 w-5" />}>
                <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <select
                      id="platform"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={platform}
                      onChange={(event) => setPlatform(event.target.value)}
                    >
                      {platformOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduleDate">Date</Label>
                    <Input
                      id="scheduleDate"
                      type="date"
                      value={scheduleDate}
                      onChange={(event) => setScheduleDate(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduleTime">Time</Label>
                    <Input
                      id="scheduleTime"
                      type="time"
                      value={scheduleTime}
                      onChange={(event) => setScheduleTime(event.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={scheduleSelectedPost}
                      disabled={!selectedIdea}
                      className="w-full gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Schedule
                    </Button>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-7">
                  {nextSevenDays().map((day) => {
                    const posts = scheduledPosts.filter(
                      (post) => toDateInput(new Date(post.scheduledFor)) === day.key,
                    );
                    return (
                      <div
                        key={day.key}
                        className="min-h-36 rounded-md border border-border/70 bg-muted/20 p-3"
                      >
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {day.label}
                        </div>
                        <div className="mt-3 space-y-2">
                          {posts.length === 0 ? (
                            <p className="text-xs text-muted-foreground">No posts</p>
                          ) : (
                            posts.map((post) => (
                              <div key={post.id} className="rounded-md bg-card p-2 text-xs">
                                <div className="font-semibold">{post.title}</div>
                                <div className="mt-1 text-muted-foreground">
                                  {post.platform} - {formatTime(post.scheduledFor)}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border/70 bg-card/80 p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}

function extractIdeas(content: unknown): PostIdea[] {
  if (!content || typeof content !== "object") return [];
  const data = content as { ideas?: PostIdea[]; items?: PostIdea[]; days?: PostIdea[] };
  if (Array.isArray(data.ideas)) return data.ideas;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.days)) return data.days;
  return [];
}

function readScheduledPosts(): ScheduledPost[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(scheduleStorageKey) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function nextSevenDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return {
      key: toDateInput(date),
      label: new Intl.DateTimeFormat(undefined, { weekday: "short", day: "numeric" }).format(date),
    };
  });
}
