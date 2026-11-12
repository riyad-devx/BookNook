
"use client";

import { useEffect, useState } from "react";
import { BookOpen, LibraryBig, Loader2 } from "lucide-react";
import BookCard, { BookCardSkeleton, type Book } from "@/components/BookCard";
import {
  StaggerGroup,
  StaggerItem,
} from "@/components/motion/Stagger";


type Status = "loading" | "ready" | "error";

const CARD_SKELETONS = Array.from({ length: 6 });

// The books API the browser talks to directly.
const API_BASE = process.env.NEXT_PUBLIC_BOOKS_API_URL ?? "http://localhost:5000";

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
      <section className="relative w-full overflow-hidden border-b border-accent-line/10 bg-page">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/35 to-transparent" />
          <div className="absolute -top-28 left-1/2 size-[24rem] -translate-x-1/2 rounded-full bg-emerald-500/[0.12] blur-[110px]" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 py-12 text-center sm:px-6 sm:py-14 lg:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-line/20 bg-accent/10 px-3 py-1 text-[10px] font-semibold tracking-[0.28em] text-accent-soft uppercase">
            <LibraryBig className="size-3" />
            The collection
          </span>

          <h1 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-heading sm:text-4xl">
            All Books
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-soft">
            Every book currently waiting on the BookNook shelves.
          </p>

          {status === "loading" && (
            <p className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.28em] text-accent-faint uppercase">
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              Loading books
            </p>
          )}

          {status === "ready" && books.length > 0 && (
            <p className="mt-4 text-[11px] font-semibold tracking-[0.28em] text-accent-dim uppercase">
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
            <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-line-soft bg-panel/60 px-6 py-14 text-center">
              <span className="grid size-12 place-items-center rounded-2xl border border-line-soft bg-surface text-accent-faint">
                <BookOpen className="size-5" />
              </span>

              <h2 className="mt-4 font-heading text-xl font-semibold text-heading">
                The shelves are out of reach
              </h2>

              <p className="mt-2 text-sm leading-6 text-ink-muted">
                We could not load the library right now. Please try again in a
                moment.
              </p>
            </div>
          )}

          {status === "ready" && books.length === 0 && (
            <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-line-soft bg-panel/60 px-6 py-14 text-center">
              <span className="grid size-12 place-items-center rounded-2xl border border-line-soft bg-surface text-accent-faint">
                <LibraryBig className="size-5" />
              </span>

              <h2 className="mt-4 font-heading text-xl font-semibold text-heading">
                No books yet
              </h2>

              <p className="mt-2 text-sm leading-6 text-ink-muted">
                Add the first book and it will show up here.
              </p>
            </div>
          )}

          {status === "ready" && books.length > 0 && (
            <StaggerGroup className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <StaggerItem key={book._id} className="h-full">
                  <BookCard book={book} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          )}
        </div>
      </section>
    </main>
  );
}
