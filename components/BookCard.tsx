import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";

export type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  description: string;
  image: string | null;
};

type BookCardProps = {
  book: Book;
  /** Defaults to `/books/{id}` */
  href?: string;
  className?: string;
  priority?: boolean;
};

export default function BookCard({
  book,
  href = `/books/${book._id}`,
  className = "",
  priority = false,
}: BookCardProps) {
  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line-soft bg-panel/80 transition-all duration-300 hover:-translate-y-1 hover:border-accent-line/25 hover:shadow-[0_24px_60px_-30px_rgba(16,185,129,0.45)] ${className}`}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-page">
        {book.image ? (
          <Image
            src={book.image}
            alt={`${book.title} by ${book.author}`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 17rem, (min-width: 640px) 45vw, 88vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-accent-dim">
            <BookOpen className="size-7" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-page via-page/15 to-transparent" />

        <span className="absolute top-2.5 left-2.5 inline-flex items-center rounded-full border border-accent-line/20 bg-page/70 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-accent-soft uppercase backdrop-blur-sm">
          {book.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <h2 className="line-clamp-2 min-h-[3.1rem] font-heading text-lg leading-snug font-semibold tracking-[-0.02em] text-heading">
          {book.title}
        </h2>
        <p className="mt-1 text-[13px] text-ink-muted">by {book.author}</p>

        <div className="mt-auto pt-3.5">
          <Link
            href={href}
            className="group/button inline-flex h-9 w-full items-center justify-between gap-2 rounded-full border border-line bg-surface px-3.5 text-[13px] font-medium text-ink-soft transition-colors hover:border-accent-line/30 hover:bg-accent/10 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
          >
            View Details
            <ArrowUpRight className="size-3.5 text-accent-faint transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5 group-hover/button:text-accent" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function BookCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse overflow-hidden rounded-2xl border border-line-soft bg-panel/60 ${className}`}
    >
      <div className="aspect-[3/4] w-full bg-surface" />
      <div className="space-y-3 p-3.5">
        <div className="h-4 w-3/4 rounded-full bg-surface-strong" />
        <div className="h-3 w-1/2 rounded-full bg-surface" />
        <div className="h-9 w-full rounded-xl bg-surface" />
      </div>
    </div>
  );
}
