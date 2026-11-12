import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { BookOpen, LibraryBig, TriangleAlert } from "lucide-react";
import BorrowBookButton from "@/components/BorrowBookButton";
import { Toaster } from "@/components/ui/toast";
import { getServerSession } from "@/lib/session";
import type { Book } from "@/components/BookCard";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

type BookDetail = Book & {
  userName?: string;
  userEmail?: string;
  imageId?: string;
};

const API_BASE = "http://localhost:5000";

export const metadata: Metadata = {
  title: "Book Details",
};

async function fetchBook(id: string, token: string): Promise<BookDetail | null> {
  const res = await fetch(`${API_BASE}/books/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
      <section className="relative w-full overflow-hidden border-b border-accent-line/10 bg-page">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/35 to-transparent" />
          <div className="absolute -top-28 left-1/2 size-[24rem] -translate-x-1/2 rounded-full bg-emerald-500/[0.12] blur-[110px]" />
        </div>

        <div className="relative mx-auto w-full max-w-5xl px-4 py-10 text-center sm:px-6 sm:py-12 lg:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-line/20 bg-accent/10 px-3 py-1 text-[10px] font-semibold tracking-[0.28em] text-accent-soft uppercase">
            <LibraryBig className="size-3" />
            Book details
          </span>
          <h1 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-heading sm:text-4xl">
            Book Details
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-ink-soft">
            Everything you need to know before borrowing.
          </p>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-6">
          <Suspense
            fallback={
              <div className="grid gap-8 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:gap-10">
                <div className="mx-auto w-full max-w-xs animate-pulse rounded-2xl border border-line-soft bg-surface md:max-w-none">
                  <div className="aspect-[3/4] w-full" />
                </div>
                <div className="animate-pulse space-y-4">
                  <div className="h-6 w-24 rounded-full bg-surface-strong" />
                  <div className="h-9 w-4/5 rounded-full bg-surface-strong" />
                  <div className="h-4 w-1/3 rounded-full bg-surface" />
                  <div className="space-y-2 pt-4">
                    <div className="h-3.5 w-full rounded-full bg-surface" />
                    <div className="h-3.5 w-11/12 rounded-full bg-surface" />
                    <div className="h-3.5 w-2/3 rounded-full bg-surface" />
                  </div>
                  <div className="h-28 w-full rounded-2xl bg-surface" />
                  <div className="h-12 w-full rounded-xl bg-surface-strong sm:w-56" />
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

  const jwtToken = await auth.api.getToken({
    headers: await headers(),
  });

  const token = jwtToken?.token;

  if (!token) {
    return <BookError />;
  }

  let book: BookDetail | null;

  try {
    book = await fetchBook(id, token);
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
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-line-soft bg-page shadow-[0_30px_70px_-40px_rgba(0,0,0,0.95)]">
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
            <div className="grid h-full w-full place-items-center text-accent-dim">
              <BookOpen className="size-10" />
            </div>
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-col">
        <span className="inline-flex w-fit items-center rounded-full border border-accent-line/20 bg-accent/10 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-accent-soft uppercase">
          {book.category || "Uncategorised"}
        </span>

        <h2 className="mt-4 font-heading text-2xl leading-tight font-semibold tracking-[-0.02em] text-heading sm:text-3xl">
          {book.title}
        </h2>
        <p className="mt-2 text-sm text-ink-muted">by {book.author}</p>

        <p className="mt-6 text-sm leading-7 text-ink-soft sm:text-[15px]">
          {book.description?.trim()
            ? book.description
            : "No description provided for this book yet."}
        </p>

        <dl className="mt-8 grid gap-4 rounded-2xl border border-line-soft bg-surface p-4 sm:grid-cols-2 sm:p-5">
          <div className="min-w-0">
            <dt className="text-[10px] font-semibold tracking-[0.2em] text-accent-faint uppercase">
              Category
            </dt>
            <dd className="mt-1.5 text-sm text-ink">
              {book.category || "Uncategorised"}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[10px] font-semibold tracking-[0.2em] text-accent-faint uppercase">
              Added By
            </dt>
            <dd className="mt-1.5 text-sm text-ink">
              {book.userName?.trim() || "BookNook member"}
            </dd>
            {book.userEmail?.trim() && (
              <dd className="mt-0.5 truncate text-xs text-ink-faint">
                {book.userEmail}
              </dd>
            )}
          </div>
          <div className="min-w-0">
            <dt className="text-[10px] font-semibold tracking-[0.2em] text-accent-faint uppercase">
              Availability
            </dt>
            <dd className="mt-1.5 text-sm text-ink">
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
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-line-soft bg-panel/60 px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-2xl border border-line-soft bg-surface text-accent-faint">
        <BookOpen className="size-5" />
      </span>
      <h2 className="mt-4 font-heading text-xl font-semibold text-heading">
        Book not found
      </h2>
      <p className="mt-2 text-sm leading-6 text-ink-muted">
        This book is no longer on our shelves. It may have been removed.
      </p>
      <Link
        href="/books"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink-soft transition-colors hover:border-accent-line/30 hover:bg-accent/10 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
      >
        Browse all books
      </Link>
    </div>
  );
}

function BookError() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-line-soft bg-panel/60 px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-2xl border border-line-soft bg-surface text-warn/60">
        <TriangleAlert className="size-5" />
      </span>
      <h2 className="mt-4 font-heading text-xl font-semibold text-heading">
        Could not load this book
      </h2>
      <p className="mt-2 text-sm leading-6 text-ink-muted">
        The library is out of reach right now. Please try again in a moment.
      </p>
      <Link
        href="/books"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink-soft transition-colors hover:border-accent-line/30 hover:bg-accent/10 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
      >
        Back to all books
      </Link>
    </div>
  );
}
