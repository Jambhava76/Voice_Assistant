import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Jarvis Enterprise Voice Assistant",
  description: "Production-grade AI voice assistant command center."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
