"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  HandCoins,
  Loader2,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

type Borrow = {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string | null;
  borrowDate: string;
  returnDate: string;
  status: "borrowed" | "returned";
};

type Status = "loading" | "ready" | "error";

const ROW_GRID = "md:grid-cols-[minmax(0,1fr)_8rem_8rem_7rem_8rem]";

const MOBILE_LABEL =
  "text-[10px] font-semibold tracking-[0.18em] text-emerald-200/40 uppercase md:hidden";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function MyBorrowsList() {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [returningId, setReturningId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadBorrows() {
      try {
        const response = await fetch("/api/borrows", { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Failed to load borrows (${response.status})`);
        }

        const data = await response.json();

        if (cancelled) return;

        setBorrows(Array.isArray(data) ? data : []);
        setStatus("ready");
      } catch {
        if (cancelled) return;

        setStatus("error");
      }
    }

    loadBorrows();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const handleReturn = async (borrow: Borrow) => {
    if (returningId) return;

    setReturningId(borrow._id);

    try {
      const response = await fetch(`/api/borrows/${borrow._id}/return`, {
        method: "POST",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        toast.add({
          type: "error",
          title: "Could not return",
          description: data?.message || "Please try again.",
        });
        return;
      }

      setBorrows((current) =>
        current.map((item) => {
          if (item._id !== borrow._id) return item;

          const returned: Borrow = { ...item, status: "returned" };
          return returned;
        }),
      );

      toast.add({
        type: "success",
        title: "Book returned",
        description: `"${borrow.bookTitle}" is back on the shelf.`,
      });
    } catch {
      toast.add({
        type: "error",
        title: "Could not return",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div>
      <p className="mb-4 text-[11px] font-semibold tracking-[0.28em] text-emerald-200/40 uppercase">
        {status === "loading" ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            Loading your borrows
          </span>
        ) : status === "ready" ? (
          `${borrows.length} ${borrows.length === 1 ? "borrow" : "borrows"} in total`
        ) : (
          "Your borrows"
        )}
      </p>

      {status === "error" ? (
        <div className="flex flex-col items-center rounded-[1.75rem] border border-white/[0.09] bg-[#06120d]/80 px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-amber-200/60">
            <TriangleAlert className="size-5" />
          </span>

          <h2 className="mt-4 font-heading text-xl font-semibold text-[#f5f2e8]">
            Could not load your borrows
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-emerald-50/45">
            The library is out of reach right now. Please try again in a
            moment.
          </p>

          <button
            type="button"
            onClick={() => {
              setStatus("loading");
              setReloadKey((key) => key + 1);
            }}
            className="mt-6 inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-emerald-100/70 transition-colors hover:border-emerald-200/30 hover:bg-emerald-300/10 hover:text-emerald-100 focus-visible:ring-2 focus-visible:ring-emerald-300/50 focus-visible:outline-none"
          >
            Try again
          </button>
        </div>
      ) : status === "loading" ? (
        <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[#06120d]/80">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className={`grid animate-pulse gap-4 border-b border-white/[0.06] px-4 py-4 last:border-b-0 sm:px-5 ${ROW_GRID}`}
            >
              <div className="flex items-center gap-3">
                <div className="h-14 w-11 shrink-0 rounded-lg bg-white/[0.05]" />
                <div className="h-3.5 w-40 rounded-full bg-white/[0.06]" />
              </div>
              <div className="hidden h-4 w-20 rounded-full bg-white/[0.04] md:block" />
              <div className="hidden h-4 w-20 rounded-full bg-white/[0.04] md:block" />
              <div className="hidden h-6 w-20 rounded-full bg-white/[0.04] md:block" />
              <div className="hidden h-9 w-full rounded-xl bg-white/[0.04] md:block" />
            </div>
          ))}
        </div>
      ) : borrows.length === 0 ? (
        <div className="flex flex-col items-center rounded-[1.75rem] border border-white/[0.09] bg-[#06120d]/80 px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-emerald-200/50">
            <HandCoins className="size-5" />
          </span>

          <h2 className="mt-4 font-heading text-xl font-semibold text-[#f5f2e8]">
            No borrowed books yet
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-emerald-50/45">
            Browse the library and borrow a book. It will show up here with its
            return date.
          </p>

          <Link
            href="/books"
            className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-300/10 px-4 text-sm font-medium text-emerald-200 transition-colors hover:border-emerald-200/35 hover:bg-emerald-300/15 hover:text-emerald-100 focus-visible:ring-2 focus-visible:ring-emerald-300/50 focus-visible:outline-none"
          >
            <BookOpen className="size-4" />
            Browse books
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[#06120d]/80 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div
            className={`hidden gap-4 border-b border-white/[0.07] bg-white/[0.02] px-5 py-3 text-[10px] font-semibold tracking-[0.2em] text-emerald-200/45 uppercase md:grid ${ROW_GRID}`}
          >
            <span>Book</span>
            <span>Borrow Date</span>
            <span>Return Date</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          <ul>
            {borrows.map((borrow) => (
              <li
                key={borrow._id}
                className={`grid gap-4 border-b border-white/[0.06] px-4 py-4 transition-colors last:border-b-0 hover:bg-white/[0.02] sm:px-5 md:items-center ${ROW_GRID}`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative aspect-[3/4] w-11 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#04110b]">
                    {borrow.bookImage ? (
                      <Image
                        src={borrow.bookImage}
                        alt={borrow.bookTitle}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-emerald-200/25">
                        <BookOpen className="size-4" />
                      </div>
                    )}
                  </div>

                  <p className="min-w-0 truncate font-heading text-[15px] font-semibold tracking-[-0.01em] text-[#f5f2e8]">
                    {borrow.bookTitle}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-emerald-50/70 md:block">
                  <span className={MOBILE_LABEL}>Borrow Date</span>
                  {formatDate(borrow.borrowDate)}
                </div>

                <div className="flex items-center gap-2 text-sm text-emerald-50/70 md:block">
                  <span className={MOBILE_LABEL}>Return Date</span>
                  {formatDate(borrow.returnDate)}
                </div>

                <div className="flex items-center gap-2">
                  <span className={MOBILE_LABEL}>Status</span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase ${
                      borrow.status === "borrowed"
                        ? "border-amber-300/25 bg-amber-400/10 text-amber-200/90"
                        : "border-emerald-200/20 bg-emerald-300/10 text-emerald-200/70"
                    }`}
                  >
                    {borrow.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {borrow.status === "borrowed" ? (
                    <button
                      type="button"
                      onClick={() => handleReturn(borrow)}
                      disabled={returningId !== null}
                      className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full border border-emerald-200/25 bg-emerald-300/10 px-3 text-xs font-medium text-emerald-200 transition-colors hover:border-emerald-200/40 hover:bg-emerald-300/15 hover:text-emerald-100 focus-visible:ring-2 focus-visible:ring-emerald-300/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60 md:w-auto"
                    >
                      {returningId === borrow._id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <RotateCcw className="size-3.5" />
                      )}
                      {returningId === borrow._id
                        ? "Returning..."
                        : "Return Book"}
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-100/30">Returned</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
