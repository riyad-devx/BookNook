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
    <section className="relative w-full overflow-hidden border-t border-emerald-200/10 bg-[#03100a]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 size-[22rem] -translate-x-1/2 rounded-full bg-emerald-500/[0.08] blur-[110px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-6">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-semibold tracking-[0.28em] text-emerald-200/90 uppercase">
            Simple steps
          </span>

          <h2 className="mt-4 font-heading text-2xl font-semibold tracking-[-0.03em] text-[#f7f4e9] sm:text-3xl">
            How Borrowing Works
          </h2>

          <p className="mt-2 text-sm leading-6 text-emerald-50/55">
            Three steps. No library card needed.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map(({ number, icon: Icon, title, text }) => (
            <article
              key={number}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#06120d]/80 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200/25 hover:shadow-[0_24px_60px_-30px_rgba(16,185,129,0.45)]"
            >
              <span className="absolute top-5 right-5 font-heading text-xs font-semibold tracking-[0.2em] text-emerald-200/25">
                {number}
              </span>

              <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-emerald-200/20 bg-emerald-300/10 text-emerald-200 shadow-[0_12px_30px_-16px_rgba(52,211,153,0.7)] transition-transform duration-300 group-hover:-translate-y-0.5">
                <Icon className="size-6" />
              </span>

              <h3 className="mt-5 font-heading text-lg font-semibold text-[#f5f2e8]">
                {title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-emerald-50/45">
                {text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
