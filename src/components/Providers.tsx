"use client";

import { BookingProvider } from "@/context/BookingContext";
import { LanguageProvider } from "@/i18n";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <BookingProvider>
        {children}
      </BookingProvider>
    </LanguageProvider>
  );
}
