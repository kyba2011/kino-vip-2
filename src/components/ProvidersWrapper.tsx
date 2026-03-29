"use client";

import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";

interface ProvidersWrapperProps {
  children: ReactNode;
  messages: any;
  locale: string;
}

export default function ProvidersWrapper({
  children,
  messages,
  locale,
}: ProvidersWrapperProps) {
  return (
    <NextIntlClientProvider messages={messages || {}} locale={locale}>
      <StackProvider app={stackClientApp}>
        <StackTheme>{children}</StackTheme>
      </StackProvider>
    </NextIntlClientProvider>
  );
}
