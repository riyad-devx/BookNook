"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  BookPlus,
  ChevronDown,
  Loader2,
  Pencil,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Book } from "@/components/BookCard";
import {
  StaggerGroup,
  StaggerItem,
} from "@/components/motion/Stagger";

type MyBook = Book & {
  userId?: string;
  userName?: string;
  userEmail?: string;
};

type Status = "loading" | "ready" | "error";

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"] as const;

const ROW_GRID = "md:grid-cols-[minmax(0,1fr)_8rem_7rem_12rem]";

const inputClass =
  "h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-heading outline-none transition-colors placeholder:text-ink-faint focus:border-accent/40 focus-visible:ring-2 focus-visible:ring-accent/20";

export default function MyBooksList() {
  const [books, setBooks] = useState<MyBook[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [editing, setEditing] = useState<MyBook | null>(null);
  const [deleting, setDeleting] = useState<MyBook | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadBooks() {
      try {
        const response = await fetch("/api/my-books", { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Failed to load books (${response.status})`);
        }

        const data = await response.json();

        if (cancelled) return;

        setBooks(Array.isArray(data) ? data : []);
        setStatus("ready");
      } catch {
        if (cancelled) return;

        setStatus("error");
      }
    }

    loadBooks();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-semibold tracking-[0.28em] text-accent-dim uppercase">
          {status === "loading" ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              Loading your books
            </span>
          ) : status === "ready" ? (
            `${books.length} ${books.length === 1 ? "book" : "books"} on your shelf`
          ) : (
            "Your shelf"
          )}
        </p>

        <Link
          href="/add-books"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-4 text-sm font-semibold text-emerald-950 shadow-[0_16px_36px_-18px_rgba(52,211,153,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_46px_-18px_rgba(52,211,153,1)] focus-visible:ring-2 focus-visible:ring-accent-line/70 focus-visible:ring-offset-2 focus-visible:ring-offset-panel focus-visible:outline-none"
        >
          <BookPlus className="size-4" />
          Add Book
        </Link>
      </div>

      {status === "error" ? (
        <div className="flex flex-col items-center rounded-[1.75rem] border border-line-soft bg-panel/80 px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-2xl border border-line-soft bg-surface text-warn/60">
            <TriangleAlert className="size-5" />
          </span>

          <h2 className="mt-4 font-heading text-xl font-semibold text-heading">
            Could not load your books
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-ink-muted">
            The library is out of reach right now. Please try again in a
            moment.
          </p>

          <button
            type="button"
            onClick={() => {
              setStatus("loading");
              setReloadKey((key) => key + 1);
            }}
            className="mt-6 inline-flex h-10 items-center justify-center rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink-soft transition-colors hover:border-accent-line/30 hover:bg-accent/10 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
          >
            Try again
          </button>
        </div>
      ) : status === "loading" ? (
        <div className="overflow-hidden rounded-[1.75rem] border border-line-soft bg-panel/80">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className={`grid animate-pulse gap-4 border-b border-line-soft px-4 py-4 last:border-b-0 sm:px-5 ${ROW_GRID}`}
            >
              <div className="flex items-center gap-3">
                <div className="h-14 w-11 shrink-0 rounded-lg bg-surface-strong" />
                <div className="space-y-2">
                  <div className="h-3.5 w-40 rounded-full bg-surface-strong" />
                  <div className="h-3 w-24 rounded-full bg-surface" />
                </div>
              </div>
              <div className="hidden h-6 w-20 rounded-full bg-surface md:block" />
              <div className="hidden h-4 w-6 rounded-full bg-surface md:block" />
              <div className="hidden h-9 w-full rounded-xl bg-surface md:block" />
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="flex flex-col items-center rounded-[1.75rem] border border-line-soft bg-panel/80 px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-2xl border border-line-soft bg-surface text-accent-faint">
            <BookOpen className="size-5" />
          </span>

          <h2 className="mt-4 font-heading text-xl font-semibold text-heading">
            Your shelf is empty
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-ink-muted">
            Add a book from your collection and it will show up here, ready to
            edit or remove.
          </p>

          <Link
            href="/add-books"
            className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-accent-line/20 bg-accent/10 px-4 text-sm font-medium text-accent-soft transition-colors hover:border-accent-line/35 hover:bg-accent/15 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
          >
            <BookPlus className="size-4" />
            Add your first book
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.75rem] border border-line-soft bg-panel/80 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div
            className={`hidden gap-4 border-b border-line-soft bg-surface px-5 py-3 text-[10px] font-semibold tracking-[0.2em] text-accent-faint uppercase md:grid ${ROW_GRID}`}
          >
            <span>Book</span>
            <span>Category</span>
            <span>Available</span>
            <span>Actions</span>
          </div>

          <StaggerGroup as="ul">
            {books.map((book) => (
              <StaggerItem
                as="li"
                key={book._id}
                className={`grid gap-4 border-b border-line-soft px-4 py-4 transition-colors last:border-b-0 hover:bg-surface sm:px-5 md:items-center ${ROW_GRID}`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative aspect-[3/4] w-11 shrink-0 overflow-hidden rounded-lg border border-line bg-page">
                    {book.image ? (
                      <Image
                        src={book.image}
                        alt={`${book.title} by ${book.author}`}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-accent-dim">
                        <BookOpen className="size-4" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-heading text-[15px] font-semibold tracking-[-0.01em] text-heading">
                      {book.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-ink-muted">
                      {book.author}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:block">
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-accent-dim uppercase md:hidden">
                    Category
                  </span>
                  <span className="inline-flex items-center rounded-full border border-accent-line/20 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-accent-soft uppercase">
                    {book.category || "Others"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-ink-soft md:block">
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-accent-dim uppercase md:hidden">
                    Available
                  </span>
                  {book.availableCopies} / {book.totalCopies}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(book)}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-line bg-surface px-3 text-xs font-medium text-ink-soft transition-colors hover:border-accent-line/30 hover:bg-accent/10 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none md:flex-none"
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleting(book)}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-danger-line/25 bg-danger-surface/10 px-3 text-xs font-medium text-danger/90 transition-colors hover:border-danger-line/40 hover:bg-danger-surface/15 hover:text-danger-bright focus-visible:ring-2 focus-visible:ring-danger-line/40 focus-visible:outline-none md:flex-none"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </button>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      )}

      {editing && (
        <EditBookDialog
          book={editing}
          onClose={() => setEditing(null)}
          onSaved={(saved) => {
            setBooks((current) =>
              current.map((book) => (book._id === saved._id ? saved : book)),
            );
          }}
        />
      )}

      {deleting && (
        <DeleteBookDialog
          book={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={(id) => {
            setBooks((current) => current.filter((book) => book._id !== id));
          }}
        />
      )}
    </div>
  );
}

function EditBookDialog({
  book,
  onClose,
  onSaved,
}: {
  book: MyBook;
  onClose: () => void;
  onSaved: (book: MyBook) => void;
}) {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [category, setCategory] = useState(book.category || "Others");
  const [copies, setCopies] = useState(String(book.totalCopies ?? 1));
  const [description, setDescription] = useState(book.description ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (saving) return;

    const nextTitle = title.trim();
    const nextAuthor = author.trim();

    setError("");

    if (!nextTitle) {
      setError("Please enter the book title.");
      return;
    }

    if (!nextAuthor) {
      setError("Please enter the author name.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/my-books/${book._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: nextTitle,
          author: nextAuthor,
          category,
          totalCopies: Math.max(1, Number(copies) || 1),
          description: description.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.message || "Could not update this book.");
        return;
      }

      onSaved({ ...book, ...data });
      toast.add({
        type: "success",
        title: "Book updated",
        description: `"${nextTitle}" has been saved.`,
      });
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !saving) onClose();
      }}
    >
      <DialogContent className="max-w-lg gap-0 rounded-[1.5rem] border border-line bg-panel p-5 text-heading shadow-[0_40px_100px_-40px_rgba(0,0,0,0.95)] ring-line sm:p-6">
        <DialogTitle className="pr-8 font-heading text-xl font-semibold tracking-[-0.02em] text-heading">
          Edit book
        </DialogTitle>
        <DialogDescription className="mt-1 text-sm text-ink-muted">
          Update the details of this book.
        </DialogDescription>

        <form onSubmit={handleSubmit} noValidate className="mt-5">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="edit-title"
                className="text-[11px] font-semibold tracking-[0.18em] text-accent-soft uppercase"
              >
                Book Title
              </label>
              <input
                id="edit-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className={`mt-2 ${inputClass}`}
              />
            </div>

            <div>
              <label
                htmlFor="edit-author"
                className="text-[11px] font-semibold tracking-[0.18em] text-accent-soft uppercase"
              >
                Author Name
              </label>
              <input
                id="edit-author"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                className={`mt-2 ${inputClass}`}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="edit-category"
                  className="text-[11px] font-semibold tracking-[0.18em] text-accent-soft uppercase"
                >
                  Category
                </label>
                <div className="relative mt-2">
                  <select
                    id="edit-category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className={`${inputClass} appearance-none pr-10`}
                  >
                    {CATEGORIES.map((item) => (
                      <option
                        key={item}
                        value={item}
                        className="bg-panel text-heading"
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-accent-faint" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-copies"
                  className="text-[11px] font-semibold tracking-[0.18em] text-accent-soft uppercase"
                >
                  Total Copies
                </label>
                <input
                  id="edit-copies"
                  type="number"
                  min={1}
                  value={copies}
                  onChange={(event) => setCopies(event.target.value)}
                  className={`mt-2 ${inputClass}`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="edit-description"
                className="text-[11px] font-semibold tracking-[0.18em] text-accent-soft uppercase"
              >
                Short Description
              </label>
              <textarea
                id="edit-description"
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-2 min-h-24 w-full resize-y rounded-xl border border-line bg-surface px-3.5 py-3 text-sm leading-6 text-heading outline-none transition-colors placeholder:text-ink-faint focus:border-accent/40 focus-visible:ring-2 focus-visible:ring-accent/20"
              />
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-danger-line-strong/25 bg-danger-surface/10 px-3.5 py-2.5 text-xs text-danger"
            >
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-surface px-5 text-sm font-medium text-ink-soft transition-colors hover:border-line-strong hover:bg-surface-strong hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-5 text-sm font-semibold text-emerald-950 shadow-[0_18px_40px_-18px_rgba(52,211,153,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-18px_rgba(52,211,153,1)] focus-visible:ring-2 focus-visible:ring-accent-line/70 focus-visible:ring-offset-2 focus-visible:ring-offset-panel focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Pencil className="size-4" />
              )}
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteBookDialog({
  book,
  onClose,
  onDeleted,
}: {
  book: MyBook;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (deleting) return;

    setError("");
    setDeleting(true);

    try {
      const response = await fetch(`/api/my-books/${book._id}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.message || "Could not delete this book.");
        return;
      }

      onDeleted(book._id);
      toast.add({
        type: "success",
        title: "Book deleted",
        description: `"${book.title}" has been removed from your shelf.`,
      });
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !deleting) onClose();
      }}
    >
      <DialogContent className="max-w-md gap-0 rounded-[1.5rem] border border-line bg-panel p-5 text-heading shadow-[0_40px_100px_-40px_rgba(0,0,0,0.95)] ring-line sm:p-6">
        <DialogTitle className="pr-8 font-heading text-xl font-semibold tracking-[-0.02em] text-heading">
          Delete book?
        </DialogTitle>
        <DialogDescription className="mt-2 text-sm leading-6 text-ink-muted">
          &quot;{book.title}&quot; will be removed from the library. This cannot
          be undone.
        </DialogDescription>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-danger-line-strong/25 bg-danger-surface/10 px-3.5 py-2.5 text-xs text-danger"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-surface px-5 text-sm font-medium text-ink-soft transition-colors hover:border-line-strong hover:bg-surface-strong hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"
          >
            Keep book
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-danger-line/30 bg-danger-surface/15 px-5 text-sm font-semibold text-danger-bright transition-colors hover:border-danger-line/45 hover:bg-danger-surface/25 focus-visible:ring-2 focus-visible:ring-danger-line/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"
          >
            {deleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
