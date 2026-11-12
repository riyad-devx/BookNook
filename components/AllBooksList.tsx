
"use client";

import { useEffect, useState } from "react";
import { BookOpen, LibraryBig, Loader2 } from "lucide-react";
import BookCard, { BookCardSkeleton, type Book } from "@/components/BookCard";

type Status = "loading" | "ready" | "error";

const API_BASE = "http://localhost:5000";

const CARD_SKELETONS = Array.from({ length: 6 });

export default function AllBooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;

    async function fetchBooks(): Promise<Book[]> {
      const res = await fetch(`${API_BASE}/books`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Failed to load books (${res.status})`);
      }

      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }

    fetchBooks()
      .then((data) => {
        if (cancelled) return;

        setBooks(data);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;

        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-w-0 flex-1">
      <section className="relative w-full overflow-hidden border-b border-emerald-200/10 bg-[#04110b]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/35 to-transparent" />
          <div className="absolute -top-28 left-1/2 size-[24rem] -translate-x-1/2 rounded-full bg-emerald-500/[0.12] blur-[110px]" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 py-12 text-center sm:px-6 sm:py-14 lg:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-semibold tracking-[0.28em] text-emerald-200/90 uppercase">
            <LibraryBig className="size-3" />
            The collection
          </span>

          <h1 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-[#f7f4e9] sm:text-4xl">
            All Books
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-emerald-50/55">
            Every book currently waiting on the BookNook shelves.
          </p>

          {status === "loading" && (
            <p className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.28em] text-emerald-200/50 uppercase">
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              Loading books
            </p>
          )}

          {status === "ready" && books.length > 0 && (
            <p className="mt-4 text-[11px] font-semibold tracking-[0.28em] text-emerald-200/40 uppercase">
              {books.length} {books.length === 1 ? "book" : "books"}
            </p>
          )}
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-6">
          {status === "loading" && (
            <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CARD_SKELETONS.map((_, index) => (
                <BookCardSkeleton key={index} />
              ))}
            </div>
          )}

          {status === "error" && (
            <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-white/[0.08] bg-[#06120d]/60 px-6 py-14 text-center">
              <span className="grid size-12 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-emerald-200/50">
                <BookOpen className="size-5" />
              </span>

              <h2 className="mt-4 font-heading text-xl font-semibold text-[#f5f2e8]">
                The shelves are out of reach
              </h2>

              <p className="mt-2 text-sm leading-6 text-emerald-50/45">
                We could not load the library right now. Please try again in a
                moment.
              </p>
            </div>
          )}

          {status === "ready" && books.length === 0 && (
            <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-white/[0.08] bg-[#06120d]/60 px-6 py-14 text-center">
              <span className="grid size-12 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-emerald-200/50">
                <LibraryBig className="size-5" />
              </span>

              <h2 className="mt-4 font-heading text-xl font-semibold text-[#f5f2e8]">
                No books yet
              </h2>

              <p className="mt-2 text-sm leading-6 text-emerald-50/45">
                Add the first book and it will show up here.
              </p>
            </div>
          )}

          {status === "ready" && books.length > 0 && (
            <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
