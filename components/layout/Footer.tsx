import Link from "next/link";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { MapPin } from "lucide-react";
import { restaurantInfo } from "@/lib/data";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/track-order", label: "Track Order" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

type FooterProps = {
  name?: string | null;
  description?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  googleMapsUrl?: string | null;
};

export default function Footer({
  name,
  description,
  facebookUrl,
  instagramUrl,
  googleMapsUrl,
}: FooterProps) {
  const info = restaurantInfo;
  const displayName = name || info.name;
  const displayDescription = description || info.description;

  return (
    <footer className="bg-walnut px-5 pb-8 pt-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage font-display text-lg font-semibold text-offwhite">
                {displayName.charAt(0).toUpperCase()}
              </span>
              <span className="font-display text-xl font-semibold text-offwhite">
                {displayName}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-offwhite/60">
              {displayDescription}
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-offwhite">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-offwhite/60 transition-colors hover:text-sage-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-offwhite">
              Follow Us
            </h3>
            <div className="mt-4 flex gap-3">
              <a
                href={facebookUrl || info.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-offwhite/10 text-offwhite transition-colors hover:bg-sage"
              >
                <FaFacebookF className="h-5 w-5" />
              </a>

              <a
                href={instagramUrl || info.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-offwhite/10 text-offwhite transition-colors hover:bg-sage"
              >
                <FaInstagram className="h-5 w-5" />
              </a>

              {googleMapsUrl ? (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Google Maps"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-offwhite/10 text-offwhite transition-colors hover:bg-sage"
                >
                  <MapPin className="h-5 w-5" />
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-offwhite/10 pt-6 text-center text-sm text-offwhite/50">
          © {new Date().getFullYear()} {displayName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}