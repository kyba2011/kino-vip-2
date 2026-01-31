import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../../stack/client";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import GlobalLayout from "@/components/GlobalLayout";

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
          <GlobalLayout />
          <main className="min-h-screen relative z-10">{children}</main>
        </StackTheme>
      </StackProvider>
    </NextIntlClientProvider>
  );
}
