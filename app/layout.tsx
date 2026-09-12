import type { Metadata } from "next";
import { EB_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZOOSH | Premium Custom Solid Wood Furniture | Kerala",
  description: "ZOOSH is a premium factory-direct custom furniture manufacturer based in Pattambi, Palakkad, Kerala. We craft bespoke, made-to-order solid wood sofas, dining tables, beds, and full home furniture solutions.",
  keywords: "custom furniture, solid wood furniture, factory direct furniture, teak wood sofa, dining table, modular beds, wardrobes, furniture manufacturer Kerala, Pattambi, Palakkad, ZOOSH",
  openGraph: {
    title: "ZOOSH | Premium Custom Solid Wood Furniture | Kerala",
    description: "Bespoke solid wood furniture crafted to order in our Pattambi factory workshop.",
    type: "website",
    locale: "en_US",
    siteName: "ZOOSH",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZOOSH | Premium Custom Solid Wood Furniture | Kerala",
    description: "Bespoke solid wood furniture crafted to order in our Pattambi factory workshop.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
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
      className={`${ebGaramond.variable} ${plusJakartaSans.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-black font-sans selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
