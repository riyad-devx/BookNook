"use client";

import Link from "next/link";
import type { ReactElement } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type BrandIconProps = {
  className?: string;
};

function FacebookIcon({ className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.87.24-1.46 1.49-1.46H16.6V4.45A20.4 20.4 0 0 0 14.3 4.3c-2.3 0-3.87 1.4-3.87 3.98V10.5H7.8v3h2.63V21h3.07Z" />
    </svg>
  );
}

function InstagramIcon({ className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function XIcon({ className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.53 3H20l-5.4 6.17L21 21h-4.96l-3.88-5.08L7.7 21H5.2l5.78-6.6L3 3h5.08l3.5 4.63L17.53 3Zm-.87 16.2h1.37L7.4 4.72H5.93L16.66 19.2Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M6.94 8.5H4.2V20h2.74V8.5ZM5.57 4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2ZM20 13.47c0-3.3-1.76-4.83-4.1-4.83a3.53 3.53 0 0 0-3.2 1.76V8.5H10v11.5h2.73v-6.06c0-1.6.3-3.15 2.29-3.15 1.95 0 1.98 1.83 1.98 3.25V20H20v-6.53Z" />
    </svg>
  );
}

function YouTubeIcon({ className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.28 5 12 5 12 5s-6.28 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.72 19 12 19 12 19s6.28 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.02V8.98L15.2 12 10 15.02Z" />
    </svg>
  );
}

const YEAR = 2026;

const CONTACT_ITEMS: {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
}[] = [
  {
    icon: MapPin,
    label: "Visit us",
    value: "House 12, Road 5, Dhanmondi, Dhaka 1205",
    href: "https://maps.google.com/?q=Dhanmondi,Dhaka",
  },
  {
    icon: Mail,
    label: "Email us",
    value: "hello@booknook.com",
    href: "mailto:hello@booknook.com",
  },
  {
    icon: Phone,
    label: "Call us",
    value: "+880 1700 000000",
    href: "tel:+8801700000000",
  },
];

const SOCIAL_LINKS: {
  icon: (props: BrandIconProps) => ReactElement;
  label: string;
  href: string;
}[] = [
  { icon: FacebookIcon, label: "BookNook on Facebook", href: "https://facebook.com" },
  { icon: InstagramIcon, label: "BookNook on Instagram", href: "https://instagram.com" },
  { icon: XIcon, label: "BookNook on X", href: "https://x.com" },
  { icon: LinkedInIcon, label: "BookNook on LinkedIn", href: "https://linkedin.com" },
  { icon: YouTubeIcon, label: "BookNook on YouTube", href: "https://youtube.com" },
];

// Sign-in links are shown to guests, while the private routes and the
// profile link only appear once a session exists.
const GUEST_LINKS = [
  { label: "All Books", href: "/books" },
  { label: "Login", href: "/login" },
];

const MEMBER_LINKS = [
  { label: "All Books", href: "/books" },
  { label: "My Borrows", href: "/my-borrows" },
  { label: "Add Book", href: "/add-books" },
  { label: "My Profile", href: "/profile" },
];

export default function Footer() {
  const { data: session } = authClient.useSession();
  const footerLinks = session?.user ? MEMBER_LINKS : GUEST_LINKS;

  return (
    <footer className="relative mt-auto w-full overflow-hidden border-t border-emerald-200/10 bg-[#04110b]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/35 to-transparent" />
        <div className="absolute -top-40 -left-24 size-[26rem] rounded-full bg-emerald-500/[0.09] blur-[110px]" />
        <div className="absolute -right-20 bottom-0 size-[22rem] rounded-full bg-lime-300/[0.06] blur-[110px]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-300/10 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-14 pb-8 sm:px-6 sm:pt-16 lg:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1.2fr_0.9fr] lg:gap-12">
          <div className="min-w-0 md:col-span-2 lg:col-span-1">
            <Link
              href="/"
              aria-label="BookNook home"
              className="group inline-flex items-center gap-2.5 rounded-full focus-visible:ring-2 focus-visible:ring-emerald-300/50 focus-visible:outline-none"
            >
              <span className="relative grid size-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-200 via-emerald-400 to-teal-700 shadow-[0_10px_24px_-8px_rgba(16,185,129,0.7),inset_0_1px_0_rgba(255,255,255,0.45)] transition-all duration-500 group-hover:-rotate-6 group-hover:scale-105">
                <BookOpen className="size-5 text-[#04110b]" strokeWidth={2.4} />
                <span className="absolute -top-1 -right-1 size-2.5 rounded-full border-2 border-[#04110b] bg-lime-300 shadow-[0_0_10px_2px_rgba(190,242,100,0.7)]" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-heading text-[1.35rem] font-semibold tracking-[-0.03em] text-[#f5f2e8]">
                  Book<span className="text-emerald-300">Nook</span>
                </span>
                <span className="mt-1 text-[8px] font-semibold tracking-[0.34em] text-emerald-200/45 uppercase">
                  Digital Library
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-emerald-50/55">
              A quiet corner of the internet for readers. Borrow books for
              fourteen days, keep your shelf organised, and always have something
              good waiting on the next page.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/15 bg-emerald-300/[0.07] px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-emerald-200/80 uppercase">
                <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_2px_rgba(110,231,183,0.7)]" />
                Open 24 / 7
              </span>
              <span className="inline-flex items-center rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-emerald-100/45 uppercase">
                No late fees
              </span>
            </div>
          </div>

          <div className="min-w-0">
            <h2 className="text-[11px] font-semibold tracking-[0.28em] text-emerald-200/60 uppercase">
              Contact
            </h2>
            <ul className="mt-5 space-y-4">
              {CONTACT_ITEMS.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="group flex items-start gap-3 rounded-xl text-sm text-emerald-50/55 transition-colors hover:text-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-300/50 focus-visible:outline-none"
                    >
                      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-emerald-200/60 transition-colors group-hover:border-emerald-200/25 group-hover:bg-emerald-300/10 group-hover:text-emerald-300">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[10px] font-semibold tracking-[0.18em] text-emerald-200/35 uppercase">
                          {item.label}
                        </span>
                        <span className="mt-1 block leading-5 break-words">
                          {item.value}
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="min-w-0">
            <h2 className="text-[11px] font-semibold tracking-[0.28em] text-emerald-200/60 uppercase">
              Explore
            </h2>
            <ul className="mt-5 space-y-2.5">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-emerald-50/55 transition-colors hover:text-emerald-200 focus-visible:ring-2 focus-visible:ring-emerald-300/50 focus-visible:outline-none"
                  >
                    <span className="h-px w-3 bg-emerald-300/30 transition-all duration-300 group-hover:w-5 group-hover:bg-emerald-300" />
                    {item.label}
                    <ArrowUpRight className="size-3 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-70" />
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="mt-7 text-[11px] font-semibold tracking-[0.28em] text-emerald-200/60 uppercase">
              Follow us
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-emerald-100/55 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200/30 hover:bg-emerald-300/10 hover:text-emerald-200 focus-visible:ring-2 focus-visible:ring-emerald-300/50 focus-visible:outline-none"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs tracking-[0.02em] text-emerald-100/40">
            © {YEAR} BookNook. All rights reserved.
          </p>
          <p className="text-xs tracking-[0.02em] text-emerald-100/30">
            Built for readers, by readers.
          </p>
        </div>
      </div>
    </footer>
  );
}
