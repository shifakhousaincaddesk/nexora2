import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { Mail, MessageCircle, BookOpen } from "lucide-react";

export const Route = createFileRoute("/support")({ component: Support });

function Support() {
  return (
    <div className="min-h-screen"><SiteNav />
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">Support</h1>
        <p className="mt-2 text-muted-foreground">We typically respond within one business day.</p>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="glass-card p-5"><Mail className="h-5 w-5 text-primary" /><h3 className="mt-3 font-semibold">Email us</h3><p className="mt-1 text-sm text-muted-foreground">support@marketly.ai</p></Card>
          <Card className="glass-card p-5"><MessageCircle className="h-5 w-5 text-primary" /><h3 className="mt-3 font-semibold">Live chat</h3><p className="mt-1 text-sm text-muted-foreground">Mon–Fri, 9am–6pm IST</p></Card>
          <Card className="glass-card p-5"><BookOpen className="h-5 w-5 text-primary" /><h3 className="mt-3 font-semibold">Help center</h3><p className="mt-1 text-sm text-muted-foreground">Guides and tutorials for every feature.</p></Card>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
