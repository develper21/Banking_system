export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import NotificationProvider from "@/components/NotificationProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { SWRProvider } from "@/components/SWRProvider";
import { logStartup } from "@/lib/startup-logger";

if (typeof window === 'undefined') {
  logStartup();
}

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ibm-plex-serif",
});

export const metadata: Metadata = {
  title: "CashFlow",
  description: "CashFlow is a modern banking platform for everyone.",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSerif.variable}`}>
        <ErrorBoundary>
          <SWRProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </SWRProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
