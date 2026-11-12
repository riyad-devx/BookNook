"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  BookPlus,
  ChevronDown,
  ImagePlus,
  Loader2,
  Mail,
  UploadCloud,
  UserRound,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Toaster, toast } from "@/components/ui/toast";

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"] as const;

export default function AddBookPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const objectUrl = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrl.current) {
        URL.revokeObjectURL(objectUrl.current);
      }
    };
  }, []);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (objectUrl.current) {
      URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = null;
    }

    if (!file) {
      setPreview(null);
      setFileName(null);
      return;
    }

    const url = URL.createObjectURL(file);
    objectUrl.current = url;
    setPreview(url);
    setFileName(file.name);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitting(true);

    try {
      // The route handler verifies the session and stamps the book with the
      // signed-in user, so it shows up under /my-books.
      const response = await fetch("/api/books", {
        method: "POST",
        body: formData,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Book could not be added.");
      }

      toast.add({
        type: "success",
        title: "Book added",
        description: `"${result?.title ?? formData.get("title")}" is now on your shelf.`,
      });

      form.reset();
      setPreview(null);
      setFileName(null);

      setTimeout(() => router.push("/my-books"), 900);
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not add book",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-w-0 flex-1">
      <section className="relative w-full overflow-hidden border-b border-emerald-200/10 bg-[#04110b]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/35 to-transparent" />
          <div className="absolute -top-28 left-1/2 size-[24rem] -translate-x-1/2 rounded-full bg-emerald-500/[0.12] blur-[110px]" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 py-12 text-center sm:px-6 sm:py-14 lg:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-semibold tracking-[0.28em] text-emerald-200/90 uppercase">
            <BookPlus className="size-3" />
            New arrival
          </span>
          <h1 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-[#f7f4e9] sm:text-4xl">
            Add a Book
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-emerald-50/55">
            Put a book from your shelf into the library.
          </p>
        </div>
      </section>

      <section className="relative w-full">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-6">
          <form
            onSubmit={handleSubmit}
            className="rounded-[1.75rem] border border-white/[0.09] bg-[#06120d]/80 p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-8"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="min-w-0">
                <label
                  htmlFor="book-title"
                  className="text-[11px] font-semibold tracking-[0.18em] text-emerald-200/60 uppercase"
                >
                  Book Title
                </label>
                <input
                  id="book-title"
                  name="title"
                  required
                  placeholder="e.g. The Silent Patient"
                  className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm text-emerald-50 transition-colors outline-none placeholder:text-emerald-100/25 hover:border-white/20 focus-visible:border-emerald-300/40 focus-visible:ring-2 focus-visible:ring-emerald-300/20"
                />
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="author-name"
                  className="text-[11px] font-semibold tracking-[0.18em] text-emerald-200/60 uppercase"
                >
                  Author Name
                </label>
                <input
                  id="author-name"
                  name="author"
                  required
                  placeholder="e.g. Alex Michaelides"
                  className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm text-emerald-50 transition-colors outline-none placeholder:text-emerald-100/25 hover:border-white/20 focus-visible:border-emerald-300/40 focus-visible:ring-2 focus-visible:ring-emerald-300/20"
                />
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="category"
                  className="text-[11px] font-semibold tracking-[0.18em] text-emerald-200/60 uppercase"
                >
                  Category
                </label>
                <div className="relative mt-2">
                  <select
                    id="category"
                    name="category"
                    defaultValue="Fiction"
                    className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] pr-10 pl-3.5 text-sm text-emerald-50 transition-colors outline-none hover:border-white/20 focus-visible:border-emerald-300/40 focus-visible:ring-2 focus-visible:ring-emerald-300/20"
                  >
                    {CATEGORIES.map((category) => (
                      <option
                        key={category}
                        value={category}
                        className="bg-[#06120d] text-emerald-50"
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-emerald-200/50" />
                </div>
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="total-copies"
                  className="text-[11px] font-semibold tracking-[0.18em] text-emerald-200/60 uppercase"
                >
                  Total Copies
                </label>
                <input
                  id="total-copies"
                  name="totalCopies"
                  type="number"
                  min={1}
                  defaultValue={1}
                  className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm text-emerald-50 transition-colors outline-none hover:border-white/20 focus-visible:border-emerald-300/40 focus-visible:ring-2 focus-visible:ring-emerald-300/20"
                />
              </div>

              <div className="min-w-0 md:col-span-2">
                <span className="text-[11px] font-semibold tracking-[0.18em] text-emerald-200/60 uppercase">
                  Book Image
                </span>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label
                    htmlFor="book-image"
                    className="group flex h-11 w-full cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-3.5 text-sm text-emerald-100/50 transition-colors hover:border-emerald-200/30 hover:bg-emerald-300/[0.06] hover:text-emerald-100 focus-within:border-emerald-300/40 focus-within:ring-2 focus-within:ring-emerald-300/20 sm:w-auto sm:min-w-56"
                  >
                    <UploadCloud className="size-4 text-emerald-200/60" />
                    <span className="truncate">
                      {fileName ?? "Choose File"}
                    </span>
                    {!fileName && (
                      <span className="text-emerald-100/30">
                        No file chosen
                      </span>
                    )}
                    <input
                      id="book-image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>

                  <div
                    role="img"
                    aria-label={
                      preview
                        ? "Selected book cover preview"
                        : "No cover selected"
                    }
                    style={
                      preview
                        ? { backgroundImage: `url(${preview})` }
                        : undefined
                    }
                    className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] bg-cover bg-center"
                  >
                    {!preview && (
                      <ImagePlus className="size-5 text-emerald-200/30" />
                    )}
                  </div>

                  <p className="text-xs leading-5 text-emerald-100/30">
                    JPG or PNG, square cover works best.
                  </p>
                </div>
              </div>

              <div className="min-w-0 md:col-span-2">
                <label
                  htmlFor="description"
                  className="text-[11px] font-semibold tracking-[0.18em] text-emerald-200/60 uppercase"
                >
                  Short Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="What is this book about?"
                  className="mt-2 min-h-32 w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm leading-6 text-emerald-50 transition-colors outline-none placeholder:text-emerald-100/25 hover:border-white/20 focus-visible:border-emerald-300/40 focus-visible:ring-2 focus-visible:ring-emerald-300/20"
                />
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="user-name"
                  className="text-[11px] font-semibold tracking-[0.18em] text-emerald-200/60 uppercase"
                >
                  User Name
                </label>
                <div className="relative mt-2">
                  <UserRound className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-emerald-200/35" />
                  <input
                    id="user-name"
                    name="userName"
                    readOnly
                    value={user?.name ?? ""}
                    placeholder="Sign in to autofill"
                    className="h-11 w-full cursor-not-allowed rounded-xl border border-white/[0.07] bg-white/[0.02] pr-3.5 pl-10 text-sm text-emerald-100/60 outline-none placeholder:text-emerald-100/25"
                  />
                </div>
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="user-email"
                  className="text-[11px] font-semibold tracking-[0.18em] text-emerald-200/60 uppercase"
                >
                  User Email
                </label>
                <div className="relative mt-2">
                  <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-emerald-200/35" />
                  <input
                    id="user-email"
                    name="userEmail"
                    type="email"
                    readOnly
                    value={user?.email ?? ""}
                    placeholder="Sign in to autofill"
                    className="h-11 w-full cursor-not-allowed rounded-xl border border-white/[0.07] bg-white/[0.02] pr-3.5 pl-10 text-sm text-emerald-100/60 outline-none placeholder:text-emerald-100/25"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group relative mt-8 inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 text-sm font-semibold text-emerald-950 shadow-[0_18px_40px_-18px_rgba(52,211,153,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-18px_rgba(52,211,153,1)] focus-visible:ring-2 focus-visible:ring-emerald-200/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06120d] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              {submitting ? (
                <Loader2 className="relative size-4 animate-spin" />
              ) : (
                <BookPlus className="relative size-4" />
              )}
              <span className="relative">
                {submitting ? "Adding..." : "Add Book"}
              </span>
            </button>
          </form>
        </div>
      </section>

      <Toaster />
    </main>
  );
}
