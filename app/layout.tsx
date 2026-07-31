import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import MusicParticles from "@/components/layout/MusicParticles";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-custom",
  subsets: ["latin"],
  display: "swap",
});

// Using Plus Jakarta Sans as our premium heading font acting as Satoshi fallback
const satoshiFallback = Plus_Jakarta_Sans({
  variable: "--font-satoshi",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "SVARA STUDIO | Premium Music Studio Booking",
    template: "%s | SVARA STUDIO",
  },
  description: "Create. Rehearse. Record. Repeat. Book professional rehearsal rooms equipped with premium instruments and acoustic treatment.",
  metadataBase: new URL("https://faulshousestudio.com"),
  openGraph: {
    title: "SVARA STUDIO",
    description: "Premium Music Rehearsal & Recording Studio Booking Platform.",
    url: "https://faulshousestudio.com",
    siteName: "SVARA STUDIO",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SVARA STUDIO",
    description: "Premium Music Rehearsal & Recording Studio Booking Platform.",
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
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${satoshiFallback.variable} relative antialiased`}
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(108, 99, 255, 0.14), transparent 38%), radial-gradient(circle at 82% 16%, rgba(0, 212, 255, 0.08), transparent 26%), linear-gradient(180deg, #090b16 0%, #070914 45%, #06070f 100%)",
          minHeight: "100vh",
        }}
      >
        <MusicParticles />
        <div className="relative z-10 flex min-h-screen flex-col justify-between">
          {children}
        </div>
      </body>
    </html>
  );
}
