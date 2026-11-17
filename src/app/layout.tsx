import type { Metadata } from "next";
import { Geist, Archivo } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/data";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

// Display face: Archivo at heavy weights as a free, license-clean stand-in for
// Urca — a geometric grotesque with the flat, sharp corners requested. Swap in
// a licensed Urca webfont here if/when one is available.
const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WhosView — watch together",
  description:
    "See what your friends are watching in real time, sync up for watch parties, and share your favourite shows and films.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const me = await getCurrentUser();
  const currentUser = me ? { username: me.username, displayName: me.displayName } : null;

  return (
    <html lang="en">
      <body className={`${geist.variable} ${display.variable} font-sans`}>
        <AppShell currentUser={currentUser}>{children}</AppShell>
      </body>
    </html>
  );
}
