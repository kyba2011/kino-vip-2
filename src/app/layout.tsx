import type { Metadata } from "next";
import { Suspense } from "react";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import NavigationPanel from "@/components/NavigationPanel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KINO.VIP",
  description: "KINO.VIP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-full`}
      >
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <Suspense
              fallback={<div className="h-16 bg-background border-b" />}
            >
              <Header />
            </Suspense>
            <Suspense
              fallback={
                <div className="fixed left-0 top-16 bottom-0 z-30 w-16 bg-background/95 border-r border-border/40" />
              }
            >
              <NavigationPanel />
            </Suspense>
            <main className="md:ml-16 pb-10 md:pb-0 min-h-screen">
              {children}
            </main>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
