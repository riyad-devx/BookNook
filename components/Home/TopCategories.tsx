import Link from "next/link";
import { ArrowUpRight, Atom, Landmark, Smile, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

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
    <section className="w-full border-t border-accent-line/10 bg-page">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-6">
        <Reveal className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-line/20 bg-accent/10 px-3 py-1 text-[10px] font-semibold tracking-[0.28em] text-accent-soft uppercase">
            Explore shelves
          </span>

          <h2 className="mt-4 font-heading text-2xl font-semibold tracking-[-0.03em] text-heading sm:text-3xl">
            Top Categories
          </h2>

          <p className="mt-2 text-sm leading-6 text-ink-soft">
            Pick a shelf and start reading.
          </p>
        </Reveal>

        <StaggerGroup className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map(({ name, icon: Icon, text }) => (
            <StaggerItem key={name} className="h-full">
              <Link
                href="/books"
                className="group flex h-full flex-col items-center rounded-2xl border border-line-soft bg-panel/80 px-6 py-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent-line/25 hover:bg-accent/[0.04] hover:shadow-[0_24px_60px_-30px_rgba(16,185,129,0.45)] focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
              >
                <span className="grid size-14 place-items-center rounded-2xl border border-accent-line/20 bg-accent/10 text-accent-soft shadow-[0_12px_30px_-16px_rgba(52,211,153,0.7)] transition-transform duration-300 group-hover:-translate-y-0.5">
                  <Icon className="size-6" />
                </span>

                <h3 className="mt-5 font-heading text-lg font-semibold text-heading">
                  {name}
                </h3>

                <p className="mt-1.5 text-sm text-ink-muted">{text}</p>

                <ArrowUpRight className="mt-4 size-4 text-accent-dim transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
