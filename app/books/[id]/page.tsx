import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { BookOpen, LibraryBig, TriangleAlert } from "lucide-react";
import BorrowBookButton from "@/components/BorrowBookButton";
import { Toaster } from "@/components/ui/toast";
import { getServerSession } from "@/lib/session";
import type { Book } from "@/components/BookCard";

type BookDetail = Book & {
  userName?: string;
  userEmail?: string;
  imageId?: string;
};

const API_BASE = "http://localhost:5000";

export const metadata: Metadata = {
  title: "Book Details",
};

async function fetchBook(id: string): Promise<BookDetail | null> {
  const res = await fetch(`${API_BASE}/books/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to load book (${res.status})`);
  }

  const data = await res.json();
  return data;
}

function errorStatus(error: unknown) {
  if (!(error instanceof Error)) return null;

  const match = error.message.match(/\((\d{3})\)$/);
  return match ? Number(match[1]) : null;
}

export default function BookDetailsPage({ params }: PageProps<"/books/[id]">) {
  return (
    <main className="min-w-0 flex-1">
      <section className="relative w-full overflow-hidden border-b border-emerald-200/10 bg-[#04110b]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/35 to-transparent" />
          <div className="absolute -top-28 left-1/2 size-[24rem] -translate-x-1/2 rounded-full bg-emerald-500/[0.12] blur-[110px]" />
        </div>

        <div className="relative mx-auto w-full max-w-5xl px-4 py-10 text-center sm:px-6 sm:py-12 lg:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-semibold tracking-[0.28em] text-emerald-200/90 uppercase">
            <LibraryBig className="size-3" />
            Book details
          </span>
          <h1 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-[#f7f4e9] sm:text-4xl">
            Book Details
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-emerald-50/55">
            Everything you need to know before borrowing.
          </p>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-6">
          <Suspense
            fallback={
              <div className="grid gap-8 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:gap-10">
                <div className="mx-auto w-full max-w-xs animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.04] md:max-w-none">
                  <div className="aspect-[3/4] w-full" />
                </div>
                <div className="animate-pulse space-y-4">
                  <div className="h-6 w-24 rounded-full bg-white/[0.06]" />
                  <div className="h-9 w-4/5 rounded-full bg-white/[0.06]" />
                  <div className="h-4 w-1/3 rounded-full bg-white/[0.04]" />
                  <div className="space-y-2 pt-4">
                    <div className="h-3.5 w-full rounded-full bg-white/[0.04]" />
                    <div className="h-3.5 w-11/12 rounded-full bg-white/[0.04]" />
                    <div className="h-3.5 w-2/3 rounded-full bg-white/[0.04]" />
                  </div>
                  <div className="h-28 w-full rounded-2xl bg-white/[0.03]" />
                  <div className="h-12 w-full rounded-xl bg-white/[0.05] sm:w-56" />
                </div>
              </div>
            }
          >
            <BookDetails params={params} />
          </Suspense>
        </div>
      </section>

      <Toaster />
    </main>
  );
}

async function BookDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let book: BookDetail | null;

  try {
    book = await fetchBook(id);
  } catch (error) {
    const status = errorStatus(error);

    if (status === 400 || status === 404) {
      return <BookNotFound />;
    }

    return <BookError />;
  }

  if (!book) {
    return <BookNotFound />;
  }

  const imageSrc =
    book.image ?? (book.imageId ? `/book-image/${book.imageId}` : null);

  // The layout already requires a session, so this is the signed-in user.
  const session = await getServerSession();

  return (
    <article className="grid gap-8 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:gap-10">
      <div className="mx-auto w-full max-w-xs md:max-w-none">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#04110b] shadow-[0_30px_70px_-40px_rgba(0,0,0,0.95)]">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={`${book.title} by ${book.author}`}
              fill
              priority
              sizes="(min-width: 768px) 18rem, 80vw"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-emerald-200/25">
              <BookOpen className="size-10" />
            </div>
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-col">
        <span className="inline-flex w-fit items-center rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-emerald-200/85 uppercase">
          {book.category || "Uncategorised"}
        </span>

        <h2 className="mt-4 font-heading text-2xl leading-tight font-semibold tracking-[-0.02em] text-[#f7f4e9] sm:text-3xl">
          {book.title}
        </h2>
        <p className="mt-2 text-sm text-emerald-100/50">by {book.author}</p>

        <p className="mt-6 text-sm leading-7 text-emerald-50/60 sm:text-[15px]">
          {book.description?.trim()
            ? book.description
            : "No description provided for this book yet."}
        </p>

        <dl className="mt-8 grid gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 sm:grid-cols-2 sm:p-5">
          <div className="min-w-0">
            <dt className="text-[10px] font-semibold tracking-[0.2em] text-emerald-200/45 uppercase">
              Category
            </dt>
            <dd className="mt-1.5 text-sm text-emerald-50/80">
              {book.category || "Uncategorised"}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[10px] font-semibold tracking-[0.2em] text-emerald-200/45 uppercase">
              Added By
            </dt>
            <dd className="mt-1.5 text-sm text-emerald-50/80">
              {book.userName?.trim() || "BookNook member"}
            </dd>
            {book.userEmail?.trim() && (
              <dd className="mt-0.5 truncate text-xs text-emerald-100/35">
                {book.userEmail}
              </dd>
            )}
          </div>
          <div className="min-w-0">
            <dt className="text-[10px] font-semibold tracking-[0.2em] text-emerald-200/45 uppercase">
              Availability
            </dt>
            <dd className="mt-1.5 text-sm text-emerald-50/80">
              {book.availableCopies} of {book.totalCopies} available
            </dd>
          </div>
        </dl>

        <BorrowBookButton
          bookId={book._id}
          availableCopies={book.availableCopies}
          userName={session?.user.name ?? ""}
          userEmail={session?.user.email ?? ""}
        />
      </div>
    </article>
  );
}

function BookNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-white/[0.08] bg-[#06120d]/60 px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-emerald-200/50">
        <BookOpen className="size-5" />
      </span>
      <h2 className="mt-4 font-heading text-xl font-semibold text-[#f5f2e8]">
        Book not found
      </h2>
      <p className="mt-2 text-sm leading-6 text-emerald-50/45">
        This book is no longer on our shelves. It may have been removed.
      </p>
      <Link
        href="/books"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-emerald-100/70 transition-colors hover:border-emerald-200/30 hover:bg-emerald-300/10 hover:text-emerald-100 focus-visible:ring-2 focus-visible:ring-emerald-300/50 focus-visible:outline-none"
      >
        Browse all books
      </Link>
    </div>
  );
}

function BookError() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-white/[0.08] bg-[#06120d]/60 px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-amber-200/60">
        <TriangleAlert className="size-5" />
      </span>
      <h2 className="mt-4 font-heading text-xl font-semibold text-[#f5f2e8]">
        Could not load this book
      </h2>
      <p className="mt-2 text-sm leading-6 text-emerald-50/45">
        The library is out of reach right now. Please try again in a moment.
      </p>
      <Link
        href="/books"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-emerald-100/70 transition-colors hover:border-emerald-200/30 hover:bg-emerald-300/10 hover:text-emerald-100 focus-visible:ring-2 focus-visible:ring-emerald-300/50 focus-visible:outline-none"
      >
        Back to all books
      </Link>
    </div>
  );
}
