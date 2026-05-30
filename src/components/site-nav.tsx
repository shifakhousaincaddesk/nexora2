import { Link, useRouter } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function SiteNav() {
  const user = null;

const signOut = async () => {
  localStorage.removeItem("user");
  window.location.href = "/";
};
  const router = useRouter();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/20 text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          <span>Nexora by BCI</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
          <Link to="/faq" className="hover:text-foreground">FAQ</Link>
          <Link to="/support" className="hover:text-foreground">Support</Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  await signOut();
                  router.navigate({ to: "/" });
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
