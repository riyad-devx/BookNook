import Link from "next/link";
import { ArrowRight, BookOpen, LibraryBig, Sparkles } from "lucide-react";
import BookCard, {
  BookCardSkeleton,
  type Book,
} from "@/components/BookCard";
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
    <section className="relative w-full overflow-hidden border-t border-emerald-200/10 bg-[#04110b]">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-6">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-semibold tracking-[0.28em] text-emerald-200/90 uppercase">
            <Sparkles className="size-3" />
            Discover books
          </span>

          <h2 className="mt-4 font-heading text-2xl font-semibold tracking-[-0.03em] text-[#f7f4e9] sm:text-3xl">
            New Arrivals
          </h2>

          <p className="mt-2 text-sm leading-6 text-emerald-50/55">
            The latest books added to the BookNook shelves.
          </p>
        </div>

        {books.length > 0 ? (
          <div className="mx-auto mt-8 grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center rounded-[1.75rem] border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center">
            <span className="grid size-12 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-emerald-200/50">
              <BookOpen className="size-5" />
            </span>

            <h3 className="mt-4 font-heading text-xl font-semibold text-[#f5f2e8]">
              No books yet
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-emerald-50/45">
              New books will appear here as soon as they are added to the
              library.
            </p>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/books"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-6 py-3 text-sm font-semibold text-emerald-950 shadow-[0_18px_40px_-16px_rgba(52,211,153,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-16px_rgba(52,211,153,1)] focus-visible:ring-2 focus-visible:ring-emerald-200/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#04110b] focus-visible:outline-none"
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
    <section className="w-full border-t border-emerald-200/10 bg-[#04110b]">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-36 rounded-full bg-white/[0.05]" />
          <div className="h-8 w-56 rounded-full bg-white/[0.06]" />
          <div className="h-4 w-72 rounded-full bg-white/[0.04]" />
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
