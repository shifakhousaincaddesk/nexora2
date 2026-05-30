import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({ component: FAQ });

const FAQS = [
  { q: "What does Marketly AI do?", a: "It's an AI marketing manager that generates captions, hashtags, content calendars, campaigns, and CTAs tailored to your specific business category." },
  { q: "Which businesses is it built for?", a: "Clinics, salons, coaching institutes, cafes & restaurants, real estate, and gyms. Each category uses its own AI engine and content strategy." },
  { q: "Do I need marketing experience?", a: "No. Pick your category, fill a short form, and start generating production-ready content immediately." },
  { q: "Is my data safe?", a: "Yes. All your data is private to your account, secured at rest, and never shared with other users." },
  { q: "Can I cancel anytime?", a: "Absolutely. Plans are month-to-month and you can cancel from your account settings." },
  { q: "Does it post for me?", a: "Today we focus on world-class content generation. Direct social publishing is on our roadmap." },
];

function FAQ() {
  return (
    <div className="min-h-screen"><SiteNav />
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">Frequently asked questions</h1>
        <Accordion type="single" collapsible className="mt-8">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`i${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <SiteFooter />
    </div>
  );
}
