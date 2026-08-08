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
  "Home Made Food delivers fresh, homemade meals made with love, straight to your door. Breakfast, lunch, dinner and desserts cooked the way home should taste.";

export const metadata: Metadata = {
  title: `${siteName} | Fresh Homemade Meals Delivered`,
  description: siteDescription,
  openGraph: {
    title: `${siteName} | Fresh Homemade Meals Delivered`,
    description: siteDescription,
    siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Fresh Homemade Meals Delivered`,
    description: siteDescription,
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