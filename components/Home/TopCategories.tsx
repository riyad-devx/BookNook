import Link from "next/link";
import { ArrowUpRight, Atom, Landmark, Smile, Sparkles } from "lucide-react";

const CATEGORIES = [
  {
    name: "Fiction",
    icon: Sparkles,
    text: "Novels and short stories",
  },
  {
    name: "Science",
    icon: Atom,
    text: "How the world works",
  },
  {
    name: "History",
    icon: Landmark,
    text: "Stories from the past",
  },
  {
    name: "Kids",
    icon: Smile,
    text: "Picture books and more",
  },
];

export default function TopCategories() {
  return (
    <section className="w-full border-t border-emerald-200/10 bg-[#04110b]">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-6">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-semibold tracking-[0.28em] text-emerald-200/90 uppercase">
            Explore shelves
          </span>

          <h2 className="mt-4 font-heading text-2xl font-semibold tracking-[-0.03em] text-[#f7f4e9] sm:text-3xl">
            Top Categories
          </h2>

          <p className="mt-2 text-sm leading-6 text-emerald-50/55">
            Pick a shelf and start reading.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map(({ name, icon: Icon, text }) => (
            <Link
              key={name}
              href="/books"
              className="group flex h-full flex-col items-center rounded-2xl border border-white/[0.08] bg-[#06120d]/80 px-6 py-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200/25 hover:bg-emerald-300/[0.04] hover:shadow-[0_24px_60px_-30px_rgba(16,185,129,0.45)] focus-visible:ring-2 focus-visible:ring-emerald-300/50 focus-visible:outline-none"
            >
              <span className="grid size-14 place-items-center rounded-2xl border border-emerald-200/20 bg-emerald-300/10 text-emerald-200 shadow-[0_12px_30px_-16px_rgba(52,211,153,0.7)] transition-transform duration-300 group-hover:-translate-y-0.5">
                <Icon className="size-6" />
              </span>

              <h3 className="mt-5 font-heading text-lg font-semibold text-[#f5f2e8]">
                {name}
              </h3>

              <p className="mt-1.5 text-sm text-emerald-50/45">{text}</p>

              <ArrowUpRight className="mt-4 size-4 text-emerald-200/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
