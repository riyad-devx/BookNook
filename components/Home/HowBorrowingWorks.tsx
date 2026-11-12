import { BookMarked, RotateCcw, Search } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Find a book",
    text: "Browse the shelves and open any book you like.",
  },
  {
    number: "02",
    icon: BookMarked,
    title: "Borrow it",
    text: "Confirm the borrow and keep the book for 14 days.",
  },
  {
    number: "03",
    icon: RotateCcw,
    title: "Return it",
    text: "Return it from My Borrows with one click when you are done.",
  },
];

export default function HowBorrowingWorks() {
  return (
    <section className="relative w-full overflow-hidden border-t border-accent-line/10 bg-page-alt">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 size-[22rem] -translate-x-1/2 rounded-full bg-emerald-500/[0.08] blur-[110px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-6">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-line/20 bg-accent/10 px-3 py-1 text-[10px] font-semibold tracking-[0.28em] text-accent-soft uppercase">
            Simple steps
          </span>

          <h2 className="mt-4 font-heading text-2xl font-semibold tracking-[-0.03em] text-heading sm:text-3xl">
            How Borrowing Works
          </h2>

          <p className="mt-2 text-sm leading-6 text-ink-soft">
            Three steps. No library card needed.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map(({ number, icon: Icon, title, text }) => (
            <article
              key={number}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line-soft bg-panel/80 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent-line/25 hover:shadow-[0_24px_60px_-30px_rgba(16,185,129,0.45)]"
            >
              <span className="absolute top-5 right-5 font-heading text-xs font-semibold tracking-[0.2em] text-accent-dim">
                {number}
              </span>

              <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-accent-line/20 bg-accent/10 text-accent-soft shadow-[0_12px_30px_-16px_rgba(52,211,153,0.7)] transition-transform duration-300 group-hover:-translate-y-0.5">
                <Icon className="size-6" />
              </span>

              <h3 className="mt-5 font-heading text-lg font-semibold text-heading">
                {title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-ink-muted">
                {text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
