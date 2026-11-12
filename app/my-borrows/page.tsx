import { HandCoins } from "lucide-react";
import type { Metadata } from "next";
import { requireSession } from "@/lib/session";
import MyBorrowsList from "@/components/MyBorrowsList";
import { Toaster } from "@/components/ui/toast";

export const instant = false;

export const metadata: Metadata = {
  title: "My Borrows",
};

export default async function MyBorrowsPage() {
  await requireSession("/my-borrows");

  return (
    <main className="min-w-0 flex-1">
      <section className="relative w-full overflow-hidden border-b border-accent-line/10 bg-page">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/35 to-transparent" />
          <div className="absolute -top-28 left-1/2 size-[24rem] -translate-x-1/2 rounded-full bg-emerald-500/[0.12] blur-[110px]" />
        </div>

        <div className="relative mx-auto w-full max-w-5xl px-4 py-10 text-center sm:px-6 sm:py-12 lg:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-line/20 bg-accent/10 px-3 py-1 text-[10px] font-semibold tracking-[0.28em] text-accent-soft uppercase">
            <HandCoins className="size-3" />
            My borrows
          </span>
          <h1 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-heading sm:text-4xl">
            My Borrows
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-ink-soft">
            Every book you have borrowed, with the date it is due back.
          </p>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-6">
          <MyBorrowsList />
        </div>
      </section>

      <Toaster />
    </main>
  );
}
