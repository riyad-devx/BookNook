import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Home, LibraryBig } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
};

/**
 * Custom 404 page.
 * Next.js renders this automatically for unknown routes and `notFound()` calls.
 */
export default function NotFound() {
  return (
    <main className="min-w-0 flex-1">
      <section className="relative flex w-full items-center justify-center overflow-hidden bg-[#04110b] px-4 py-20 sm:px-6 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/35 to-transparent" />
          <div className="absolute -top-28 left-1/2 size-[26rem] -translate-x-1/2 rounded-full bg-emerald-500/[0.12] blur-[110px]" />
        </div>

        <div className="relative flex max-w-md flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-semibold tracking-[0.28em] text-emerald-200/90 uppercase">
            <BookOpen className="size-3" />
            Error 404
          </span>

          <p className="mt-6 font-heading text-6xl font-semibold tracking-[-0.04em] text-emerald-200/20 sm:text-7xl">
            404
          </p>

          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-[-0.03em] text-[#f7f4e9] sm:text-4xl">
            This page is missing
          </h1>

          <p className="mt-3 text-sm leading-6 text-emerald-50/55">
            The page you are looking for was moved or never existed. It is not on
            the BookNook shelves.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-5 text-sm font-semibold text-emerald-950 shadow-[0_18px_40px_-16px_rgba(52,211,153,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-16px_rgba(52,211,153,1)] focus-visible:ring-2 focus-visible:ring-emerald-200/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#04110b] focus-visible:outline-none"
            >
              <Home className="size-4" />
              Back to Home
            </Link>

            <Link
              href="/books"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 text-sm font-medium text-emerald-100/70 transition-colors hover:border-emerald-200/30 hover:bg-emerald-300/10 hover:text-emerald-100 focus-visible:ring-2 focus-visible:ring-emerald-300/50 focus-visible:outline-none"
            >
              <LibraryBig className="size-4" />
              Browse all books
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
