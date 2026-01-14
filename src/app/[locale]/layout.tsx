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

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <StackProvider app={stackClientApp}>
        <StackTheme>
          <Suspense fallback={<div className="h-16 bg-background border-b" />}>
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
    </NextIntlClientProvider>
  );
}
