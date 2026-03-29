import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import ProvidersWrapper from "@/components/ProvidersWrapper";
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
    <ProvidersWrapper messages={messages} locale={locale}>
      <GlobalLayout />
      <main className="relative z-10">{children}</main>
    </ProvidersWrapper>
  );
}
