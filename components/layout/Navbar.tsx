"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X, ShoppingBag, Home, ClipboardList, Phone, Info, MapPinned } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { restaurantInfo } from "@/lib/data";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/menu", label: "Menu", icon: ClipboardList },
  { href: "/track-order", label: "Track Order", icon: MapPinned },
  { href: "/#about", label: "About", icon: Info },
  { href: "/#contact", label: "Contact", icon: Phone },
];

type NavbarProps = {
  name?: string | null;
  logoUrl?: string | null;
};

export default function Navbar({ name, logoUrl }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { itemCount } = useCart();

  const displayName = name || restaurantInfo.name;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-offwhite/90 shadow-soft backdrop-blur-md"
          : "bg-offwhite/60 backdrop-blur-sm"
          }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-8 sm:py-4">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sage font-display text-lg font-semibold text-offwhite shadow-soft sm:h-11 sm:w-11">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </span>

            <span className="max-w-[170px] truncate font-display text-lg font-semibold tracking-tight text-walnut xs:max-w-none sm:text-xl">
              {displayName}
            </span>
          </Link>

          <ul className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative font-body text-[15px] font-medium text-walnut-light transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-sage after:transition-all after:duration-300 hover:text-walnut hover:after:w-full"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              aria-label="View cart"
              className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-cream text-walnut shadow-soft transition-transform hover:scale-105 hover:bg-cream-dark"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={2} />

              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-sage text-[11px] font-semibold text-offwhite">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-walnut transition-colors hover:bg-cream lg:hidden"
            >
              {open ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {isMounted && createPortal(
        <div
          className={`fixed inset-0 top-[68px] z-40 overflow-hidden bg-walnut/35 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          onClick={() => setOpen(false)}
        >
          <div
            className={`ml-auto h-full w-[min(88vw,360px)] bg-offwhite px-4 py-5 shadow-soft-lg transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 rounded-3xl bg-cream/70 p-4">
              <p className="font-display text-lg font-semibold text-walnut">
                {displayName}
              </p>
              <p className="mt-1 text-sm text-walnut-light">
                Fresh homemade meals, ready when you are.
              </p>
            </div>

            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3.5 text-base font-semibold text-walnut transition-colors hover:bg-cream"
                  >
                    <link.icon className="h-5 w-5 text-sage-dark" strokeWidth={1.9} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-full bg-sage px-5 py-3 font-semibold text-offwhite shadow-soft transition hover:bg-sage-dark"
            >
              <ShoppingBag className="h-5 w-5" />
              View Cart {itemCount > 0 ? `(${itemCount})` : ""}
            </Link>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}