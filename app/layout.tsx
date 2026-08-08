import type { Metadata } from "next";
import { Fraunces, Figtree } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { Toaster } from "sonner";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const siteName = "Home Made Food";
const siteDescription =
  "Fresh homemade food delivered to your door. Enjoy delicious breakfast, lunch and dinner, prepared with the taste of home.";

export const metadata: Metadata = {
  metadataBase: new URL("https://food-0dering-platform.vercel.app"),

  title: {
    default: `${siteName} | Fresh Homemade Food`,
    template: `%s | ${siteName}`,
  },

  description: siteDescription,

  keywords: [
    "homemade food",
    "home made food",
    "homemade food delivery",
    "fresh homemade meals",
    "breakfast",
    "lunch",
    "dinner",
  ],

  openGraph: {
    title: `${siteName} | Fresh Homemade Food`,
    description: siteDescription,
    siteName,
    type: "website",
    locale: "en_PK",
    url: "https://food-0dering-platform.vercel.app",
  },

  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Fresh Homemade Food`,
    description: siteDescription,
  },

  robots: {
    index: true,
    follow: true,
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${figtree.variable}`}>
      <body>
        <CartProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
          />
        </CartProvider>
      </body>
    </html>
  );
}