import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MEGARAMA Marrakech | Experience Cinema Like Never Before",
  description:
    "Megarama Marrakech - The ultimate cinematic experience. IMAX, 4DX, premium comfort, and the latest movies in Marrakech.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="bg-mega-dark text-foreground overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
