import { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../../stack/client";
import Header from "@/components/Header";
import NavigationPanel from "@/components/NavigationPanel";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    console.error("Error loading messages:", error);
    messages = {};
  }

  return (
    <NextIntlClientProvider messages={messages || {}}>
      <StackProvider app={stackClientApp}>
        <StackTheme>
          <Suspense
            fallback={
              <header className="fixed top-0 w-full z-50 pt-2">
                <div className="w-full mx-auto px-2 sm:px-4">
                  <div className="flex items-center justify-between h-16 gap-2">
                    <div className="hidden md:flex items-center shrink-0">
                      <div className="flex items-center space-x-1 sm:space-x-2 px-3 py-2 rounded-2xl bg-black/40 backdrop-blur-[0.0px] backdrop-saturate-150 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] w-40 h-12 animate-pulse" />
                    </div>
                    <div className="flex-1 max-w-md mx-2 sm:mx-8">
                      <div className="rounded-full bg-black/40 backdrop-blur-[0.0px] backdrop-saturate-150 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] h-10 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-black/40 backdrop-blur-[0.0px] backdrop-saturate-150 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] w-20 h-10 animate-pulse" />
                      <div className="rounded-full bg-black/40 backdrop-blur-[0.0px] backdrop-saturate-150 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] w-10 h-10 animate-pulse" />
                    </div>
                  </div>
                </div>
              </header>
            }
          >
            <Header />
          </Suspense>
          <Suspense
            fallback={
              <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
                <div className="relative flex items-center justify-center gap-3 px-4 py-3 rounded-[2rem] bg-black/40 backdrop-blur-[0.0px] backdrop-saturate-150 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] animate-pulse">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-12 h-12 rounded-2xl bg-white/5" />
                  ))}
                </div>
              </nav>
            }
          >
            <NavigationPanel />
          </Suspense>
          <main className="min-h-screen">{children}</main>
        </StackTheme>
      </StackProvider>
    </NextIntlClientProvider>
  );
}
