import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const title = "Ashley Barnes, REALTOR® | JPAR Real Estate | San Antonio, TX";
const description =
  "Buying, selling, or investing in the San Antonio area? Ashley Barnes, REALTOR® with JPAR Real Estate, offers thoughtful guidance, local market insight, and a strategy built around your goals — serving San Antonio, Schertz, Cibolo, New Braunfels, and surrounding Texas communities.";

export const metadata: Metadata = {
  ...(site.url ? { metadataBase: new URL(site.url), alternates: { canonical: "/" } } : {}),
  title,
  description,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ashley Barnes, REALTOR®",
    title,
    description,
    ...(site.url ? { url: "/" } : {}),
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#F5F0E8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${manrope.variable} antialiased`}
    >
      <body className="min-h-dvh overflow-x-clip">{children}</body>
    </html>
  );
}
