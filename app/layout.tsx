import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alexio Gessa | Personal Trainer & Artist — New York City",
  description:
    "NYC-based personal trainer and visual artist. Expert in natural bodybuilding, strength, and physique development. Available for independent training sessions and art commissions.",
  authors: [{ name: "Alexio Gessa" }],
  keywords: [
    "Alexio Gessa",
    "NYC personal trainer",
    "personal trainer Manhattan",
    "natural bodybuilding",
    "art commissions NYC",
    "fitness trainer artist",
    "independent personal trainer New York",
  ],
  creator: "Alexio Gessa",
  robots: "index, follow",
  openGraph: {
    title: "Alexio Gessa | Personal Trainer & Artist",
    description:
      "NYC-based personal trainer and visual artist. Independent training sessions and art commissions.",
    url: "https://alexiogessa.com",
    siteName: "Alexio Gessa",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alexio Gessa | Personal Trainer & Artist",
    description:
      "NYC-based personal trainer and visual artist. Independent training sessions and art commissions.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=IBM+Plex+Mono:wght@400;500&family=Lora:ital,wght@0,400;0,500;1,400&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Alexio Gessa",
              jobTitle: "Personal Trainer & Visual Artist",
              url: "https://alexiogessa.com",
              email: "alexio@alexiogessa.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "New York City",
                addressRegion: "NY",
                addressCountry: "US",
              },
              knowsAbout: [
                "Personal Training",
                "Natural Bodybuilding",
                "Strength Training",
                "Physique Development",
                "Visual Art",
                "Character Illustration",
                "Comic Art",
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
