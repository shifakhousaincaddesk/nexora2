import "../styles.css";

import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";

import { useEffect, useState } from "react";

function SplashScreen({ exiting }: { exiting: boolean }) {
  return (
    <div
      aria-label="Nexora loading screen"
      className={`splash-screen${exiting ? " splash-screen--exit" : ""}`}
      role="status"
    >
      <div className="splash-screen__glow" />
      <img className="splash-screen__logo" src="/nexora-logo.png" alt="Nexora" />
      <h1 className="splash-screen__title">Nexora by BCI</h1>
      <p className="splash-screen__subtitle">AI MARKETING ENGINE</p>
    </div>
  );
}

function RootComponent() {
  const [showSplash, setShowSplash] = useState(true);
  const [isSplashExiting, setIsSplashExiting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hideSplash = () => {
      setIsSplashExiting(true);

      window.setTimeout(() => {
        setShowSplash(false);
      }, 360);
    };

    if (sessionStorage.getItem("nexoraSplashShown") === "true") {
      hideSplash();
      return;
    }

    const timer = window.setTimeout(() => {
      sessionStorage.setItem("nexoraSplashShown", "true");
      hideSplash();
    }, 1600);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <html>
      <head>
        <HeadContent />
      </head>

      <body>
        {showSplash && <SplashScreen exiting={isSplashExiting} />}

        <Outlet />

        <Scripts />
      </body>
    </html>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
