"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { SiteSettingsProvider } from "@/contexts/site-settings-context";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <SiteSettingsProvider>
        {children}
      </SiteSettingsProvider>
    </SessionProvider>
  );
}
