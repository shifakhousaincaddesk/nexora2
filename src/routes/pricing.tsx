import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/pricing")({ component: Pricing });


const PLANS = [
  { name: "Starter", price: "Free", desc: "Try Marketly AI", features: ["1 business", "20 AI generations / month", "Caption + hashtag generators", "Saved library"] },
  { name: "Growth", price: "₹999/mo", desc: "For active small businesses", features: ["3 businesses", "500 AI generations / month", "All generators", "Content calendar", "Priority support"], featured: true },
  { name: "Agency", price: "₹2,999/mo", desc: "For marketers managing many brands", features: ["Unlimited businesses", "Unlimited generations", "All generators", "Team seats", "Dedicated support"] },
  
];

function Pricing() {
    const navigate = useNavigate();

  return (
    <div className="min-h-screen"><SiteNav />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Simple pricing. Cancel anytime.</h1>
          <p className="mt-3 text-muted-foreground">Start free. Upgrade when you're ready to scale.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {PLANS.map((p) => (
            <Card key={p.name} className={`glass-card p-6 ${p.featured ? "ring-2 ring-primary" : ""}`}>
              <div className="text-sm text-muted-foreground">{p.name}</div>
              <div className="mt-1 text-3xl font-semibold">{p.price}</div>
              <div className="mt-1 text-sm text-muted-foreground">{p.desc}</div>
              <ul className="mt-5 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-primary" /> {f}</li>
                ))}
              </ul>
<Button
  onClick={() =>
    navigate({
      to: "/checkout",
    })
  }
>
  Get started
</Button>
            </Card>
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
