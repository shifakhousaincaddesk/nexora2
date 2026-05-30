import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/categories";
import { Sparkles, CalendarDays, Hash, Megaphone, MessageSquareQuote, Library, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteNav />

      {/* Hero */}
      <section className="container mx-auto px-4 pt-20 pb-24 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
          <Sparkles className="h-3 w-3" /> Domain-tuned AI for 6 small-business categories
        </div>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          Your <span className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">AI Marketing Manager</span>,
          built for small businesses.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          One platform. Six domain-specific AI engines. Generate captions, hashtags, content calendars,
          campaigns, and CTAs — optimized for your exact business.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/auth">Start free <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/pricing">See pricing</Link>
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 pb-20">
        <h2 className="mb-8 text-center text-2xl font-semibold">Built for your business — not a generic chatbot</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <div key={c.id} className="glass-card rounded-2xl p-6">
              <div className="text-3xl">{c.emoji}</div>
              <h3 className="mt-3 text-lg font-semibold">{c.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.tagline}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-24">
        <h2 className="mb-8 text-center text-2xl font-semibold">Everything you need to market — in one click</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: MessageSquareQuote, title: "AI Caption Generator", desc: "Hook + body + CTA, tuned to your domain." },
            { icon: Hash, title: "Hashtag Generator", desc: "Branded, high-reach, and niche sets." },
            { icon: CalendarDays, title: "7-day Content Calendar", desc: "Platform, format, hook, best time." },
            { icon: Megaphone, title: "Campaign Engine", desc: "Full campaign ideas with KPIs and budget bands." },
            { icon: Sparkles, title: "Festival & Seasonal", desc: "Never miss a moment your customers care about." },
            { icon: Library, title: "Saved Content Library", desc: "Every generation, organized and searchable." },
          ].map((f) => (
            <div key={f.title} className="glass-card rounded-2xl p-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-24 text-center">
        <div className="glass-card mx-auto max-w-3xl rounded-3xl p-10">
          <h2 className="text-3xl font-semibold">Stop staring at a blank caption box.</h2>
          <p className="mt-3 text-muted-foreground">Set up your business in 60 seconds and ship a week of content today.</p>
          <Button asChild size="lg" className="mt-6">
            <Link to="/auth">Get started free</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
