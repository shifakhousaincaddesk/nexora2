import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-10 text-sm text-muted-foreground">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p>© {new Date().getFullYear()} Nexora by BCI · The AI Marketing Manager for small businesses.</p>
        <nav className="flex flex-wrap items-center gap-4">
          <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
          <Link to="/faq" className="hover:text-foreground">FAQ</Link>
          <Link to="/support" className="hover:text-foreground">Support</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}
