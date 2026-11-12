import Link from "next/link";
import { ArrowRight, BookOpen, LibraryBig, Sparkles } from "lucide-react";
import BookCard, {
  BookCardSkeleton,
  type Book,
} from "@/components/BookCard";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { BOOKS_API_BASE } from "@/lib/books-api";


async function getNewArrivals(): Promise<Book[]> {
  try {
    // The backend returns the newest 6 books (sorted and limited in MongoDB).
    const res = await fetch(`${BOOKS_API_BASE}/new-arrivals`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function NewArrivals() {
  const books = await getNewArrivals();

  return (
    <section className="relative w-full overflow-hidden border-t border-accent-line/10 bg-page">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-6">
        <Reveal className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-line/20 bg-accent/10 px-3 py-1 text-[10px] font-semibold tracking-[0.28em] text-accent-soft uppercase">
            <Sparkles className="size-3" />
            Discover books
          </span>

          <h2 className="mt-4 font-heading text-2xl font-semibold tracking-[-0.03em] text-heading sm:text-3xl">
            New Arrivals
          </h2>

          <p className="mt-2 text-sm leading-6 text-ink-soft">
            The latest books added to the BookNook shelves.
          </p>
        </Reveal>

        {books.length > 0 ? (
          <StaggerGroup className="mx-auto mt-8 grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <StaggerItem key={book._id}>
                <BookCard book={book} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <div className="mt-8 flex flex-col items-center rounded-[1.75rem] border border-dashed border-line bg-surface px-6 py-14 text-center">
            <span className="grid size-12 place-items-center rounded-2xl border border-line-soft bg-surface text-accent-faint">
              <BookOpen className="size-5" />
            </span>

            <h3 className="mt-4 font-heading text-xl font-semibold text-heading">
              No books yet
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-ink-muted">
              New books will appear here as soon as they are added to the
              library.
            </p>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/books"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-6 py-3 text-sm font-semibold text-emerald-950 shadow-[0_18px_40px_-16px_rgba(52,211,153,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-16px_rgba(52,211,153,1)] focus-visible:ring-2 focus-visible:ring-accent-line/70 focus-visible:ring-offset-2 focus-visible:ring-offset-page focus-visible:outline-none"
          >
            <LibraryBig className="size-4" />
            See All Books
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function NewArrivalsSkeleton() {
  return (
    <section className="w-full border-t border-accent-line/10 bg-page">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-36 rounded-full bg-surface-strong" />
          <div className="h-8 w-56 rounded-full bg-surface-strong" />
          <div className="h-4 w-72 rounded-full bg-surface" />
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
