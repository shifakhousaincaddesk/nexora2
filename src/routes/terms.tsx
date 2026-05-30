import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/terms")({ component: Terms });

function Terms() {
  return (
    <div className="min-h-screen"><SiteNav />
      <div className="container mx-auto max-w-3xl px-4 py-16 prose prose-invert">
        <h1>Terms &amp; Conditions</h1>
        <p>By using Marketly AI you agree to use the service for lawful business marketing purposes. AI-generated content is provided as a starting point — you are responsible for reviewing and complying with platform policies and local regulations before publishing.</p>
        <h2>Account</h2><p>Keep your credentials secure. You're responsible for activity on your account.</p>
        <h2>Acceptable use</h2><p>No spam, misleading health claims, hateful content, or copyright infringement.</p>
        <h2>Billing</h2><p>Paid plans are billed monthly and can be cancelled at any time.</p>
        <h2>Liability</h2><p>The service is provided as-is. To the maximum extent permitted by law, we are not liable for indirect or consequential damages.</p>
      </div>
      <SiteFooter />
    </div>
  );
}
