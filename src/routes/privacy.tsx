import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/privacy")({ component: Privacy });

function Privacy() {
  return (
    <div className="min-h-screen"><SiteNav />
      <div className="container mx-auto max-w-3xl px-4 py-16 prose prose-invert">
        <h1>Privacy Policy</h1>
        <p>We collect only the data needed to provide the service: your account info, the business details you enter, and content you generate.</p>
        <h2>How we use data</h2><p>To generate marketing content, save your library, and improve the product. We do not sell your data.</p>
        <h2>AI processing</h2><p>Your prompts are sent to our AI provider strictly to generate the requested output. They are not used to train third-party models.</p>
        <h2>Your rights</h2><p>You can delete your account and all associated data at any time from your settings.</p>
        <h2>Contact</h2><p>privacy@marketly.ai</p>
      </div>
      <SiteFooter />
    </div>
  );
}
