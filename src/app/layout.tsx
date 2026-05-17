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
    "Megarama Marrakech - The ultimate cinematic experience. IMAX, 4DX, premium comfort, and the latest movies in Marrakech, Morocco.",
  keywords: ["Megarama", "Marrakech", "Cinema", "IMAX", "4DX", "Movies", "Morocco", "Film"],
  authors: [{ name: "Megarama Marrakech" }],
  openGraph: {
    title: "MEGARAMA Marrakech | Experience Cinema Like Never Before",
    description:
      "The ultimate cinematic experience. IMAX, 4DX, premium comfort, and the latest movies in Marrakech.",
    url: "https://marrakech.megarama.ma",
    siteName: "Megarama Marrakech",
    images: [
      {
        url: "/images/branding/cinema-hall.jpg",
        width: 1200,
        height: 630,
        alt: "Megarama Marrakech Cinema Hall",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MEGARAMA Marrakech | Experience Cinema Like Never Before",
    description:
      "The ultimate cinematic experience. IMAX, 4DX, premium comfort in Marrakech.",
    images: ["/images/branding/cinema-hall.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MovieTheater",
              name: "Megarama Marrakech",
              description:
                "The ultimate cinematic experience with IMAX, 4DX, and premium comfort in Marrakech, Morocco.",
              url: "https://marrakech.megarama.ma",
              telephone: "+212-524-000000",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Avenue Mohammed VI",
                addressLocality: "Marrakech",
                addressCountry: "MA",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 31.6295,
                longitude: -7.9811,
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                opens: "10:00",
                closes: "00:00",
              },
              image: "/images/branding/cinema-hall.jpg",
              priceRange: "$$",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.6",
                reviewCount: "2847",
              },
            }),
          }}
        />
      </head>
      <body className="bg-mega-dark text-foreground overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
