import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { restaurantInfo } from "@/lib/data";

type ContactProps = {
  name?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
};

export default function Contact({ name, phone, whatsapp, email, address }: ContactProps) {
  const info = restaurantInfo;
  const displayName = name || info.name;
  const displayPhone = phone || info.phone;
  const displayWhatsapp = whatsapp || info.whatsapp;
  const displayEmail = email || info.email;
  const displayAddress = address || `${info.address}, ${info.city}`;

  return (
    <section
      id="contact"
      className="scroll-mt-24 bg-cream/40 px-4 py-14 sm:px-8 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-sage-dark">
            Get In Touch
          </p>

          <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-walnut sm:text-4xl">
            We&apos;d love to hear from you
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-6">
          <div className="rounded-3xl bg-offwhite p-5 text-center shadow-soft sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sage text-offwhite">
              <Phone className="h-6 w-6" strokeWidth={1.75} />
            </div>

            <h3 className="mt-5 font-display text-lg font-semibold text-walnut">
              Call Us
            </h3>

            <p className="mt-1 text-walnut-light">{displayPhone}</p>
          </div>

          <div className="rounded-3xl bg-offwhite p-5 text-center shadow-soft sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sage text-offwhite">
              <Mail className="h-6 w-6" strokeWidth={1.75} />
            </div>

            <h3 className="mt-5 font-display text-lg font-semibold text-walnut">
              Email Us
            </h3>

            <p className="mt-1 text-walnut-light">{displayEmail}</p>
          </div>

          <div className="rounded-3xl bg-offwhite p-5 text-center shadow-soft sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sage text-offwhite">
              <MapPin className="h-6 w-6" strokeWidth={1.75} />
            </div>

            <h3 className="mt-5 font-display text-lg font-semibold text-walnut">
              Visit Us
            </h3>

            <p className="mt-1 text-walnut-light">{displayAddress}</p>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={`https://wa.me/${displayWhatsapp}?text=Hi%20${encodeURIComponent(displayName)}%2C%20I'd%20like%20to%20place%20an%20order`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#25D366] px-7 py-3.5 font-semibold text-offwhite shadow-soft-lg transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle className="h-5 w-5" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
