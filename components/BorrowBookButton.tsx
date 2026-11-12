"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookmarkPlus, Loader2, Mail, UserRound } from "lucide-react";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type BorrowBookButtonProps = {
  bookId: string;
  availableCopies: number;
  userName: string;
  userEmail: string;
};

export default function BorrowBookButton({
  bookId,
  availableCopies,
  userName,
  userEmail,
}: BorrowBookButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [borrowing, setBorrowing] = useState(false);

  const outOfStock = availableCopies <= 0;

  const handleBorrow = async () => {
    if (borrowing) return;

    setBorrowing(true);

    try {
      const response = await fetch("/api/borrows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        toast.add({
          type: "error",
          title: "Could not borrow",
          description: data?.message || "Please try again.",
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Book borrowed",
        description: `Please return "${data?.bookTitle ?? "this book"}" by ${new Date(
          data.returnDate,
        ).toLocaleDateString()}.`,
      });

      setOpen(false);
      // Reloads the server page so the available copies number updates.
      router.refresh();
    } catch {
      toast.add({
        type: "error",
        title: "Could not borrow",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={outOfStock}
        onClick={() => setOpen(true)}
        className="group mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 text-sm font-semibold text-emerald-950 shadow-[0_18px_40px_-18px_rgba(52,211,153,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-18px_rgba(52,211,153,1)] focus-visible:ring-2 focus-visible:ring-accent-line/70 focus-visible:ring-offset-2 focus-visible:ring-offset-page focus-visible:outline-none disabled:pointer-events-none disabled:bg-none disabled:bg-surface-disabled disabled:text-ink-muted disabled:shadow-none sm:w-auto sm:min-w-56 sm:self-start sm:px-8"
      >
        <BookmarkPlus className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
        {outOfStock ? "Out of Stock" : "Borrow This Book"}
      </button>

      {open && (
        <Dialog
          open
          onOpenChange={(nextOpen) => {
            if (!nextOpen && !borrowing) setOpen(false);
          }}
        >
          <DialogContent className="max-w-md gap-0 rounded-[1.5rem] border border-line bg-panel p-5 text-heading shadow-[0_40px_100px_-40px_rgba(0,0,0,0.95)] ring-line sm:p-6">
            <DialogTitle className="pr-8 font-heading text-xl font-semibold tracking-[-0.02em] text-heading">
              Borrow this book
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm leading-6 text-ink-muted">
              Confirm your details to borrow one copy for 14 days.
            </DialogDescription>

            <div className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="borrow-name"
                  className="text-[11px] font-semibold tracking-[0.18em] text-accent-soft uppercase"
                >
                  User Name
                </label>
                <div className="relative mt-2">
                  <UserRound className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-accent-dim" />
                  <input
                    id="borrow-name"
                    readOnly
                    value={userName}
                    placeholder="Sign in to autofill"
                    className="h-11 w-full cursor-not-allowed rounded-xl border border-line-soft bg-surface pr-3.5 pl-10 text-sm text-ink-soft outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="borrow-email"
                  className="text-[11px] font-semibold tracking-[0.18em] text-accent-soft uppercase"
                >
                  User Email
                </label>
                <div className="relative mt-2">
                  <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-accent-dim" />
                  <input
                    id="borrow-email"
                    type="email"
                    readOnly
                    value={userEmail}
                    placeholder="Sign in to autofill"
                    className="h-11 w-full cursor-not-allowed rounded-xl border border-line-soft bg-surface pr-3.5 pl-10 text-sm text-ink-soft outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={borrowing}
                className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-surface px-5 text-sm font-medium text-ink-soft transition-colors hover:border-line-strong hover:bg-surface-strong hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleBorrow}
                disabled={borrowing}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-5 text-sm font-semibold text-emerald-950 shadow-[0_18px_40px_-18px_rgba(52,211,153,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-18px_rgba(52,211,153,1)] focus-visible:ring-2 focus-visible:ring-accent-line/70 focus-visible:ring-offset-2 focus-visible:ring-offset-panel focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"
              >
                {borrowing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <BookmarkPlus className="size-4" />
                )}
                {borrowing ? "Borrowing..." : "Confirm Borrow"}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}