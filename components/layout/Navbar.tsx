"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

const navLinks = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/menu",
    label: "Menu",
  },
  {
    href: "/track-order",
    label: "Track Order",
  },
  {
    href: "/#about",
    label: "About",
  },
  {
    href: "/#contact",
    label: "Contact",
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const { itemCount } = useCart();

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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-offwhite/90 shadow-soft backdrop-blur-md"
        : "bg-offwhite/60 backdrop-blur-sm"
        }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage font-display text-lg font-semibold text-offwhite shadow-soft">
            H
          </span>

          <span className="font-display text-xl font-semibold tracking-tight text-walnut">
            Home Made Food
          </span>
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
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
            className="flex h-11 w-11 items-center justify-center rounded-full text-walnut transition-colors hover:bg-cream md:hidden"
          >
            {open ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 top-[73px] z-40 bg-offwhite transition-transform duration-300 md:hidden ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <ul className="flex flex-col gap-1 px-6 py-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-4 font-display text-2xl font-medium text-walnut transition-colors hover:bg-cream"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}