import { UserRound } from "lucide-react";
import type { Metadata } from "next";
import { requireSession } from "@/lib/session";
import ProfileEditor from "@/components/ProfileEditor";
import { Toaster } from "@/components/ui/toast";

export const instant = false;

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const session = await requireSession("/profile");
  const { user } = session;

  const joined = user.createdAt
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
        new Date(user.createdAt),
      )
    : null;

  return (
    <main className="min-w-0 flex-1">
      <section className="relative w-full overflow-hidden border-b border-accent-line/10 bg-page">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/35 to-transparent" />
          <div className="absolute -top-28 left-1/2 size-[24rem] -translate-x-1/2 rounded-full bg-emerald-500/[0.12] blur-[110px]" />
        </div>

        <div className="relative mx-auto w-full max-w-5xl px-4 py-10 text-center sm:px-6 sm:py-12 lg:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-line/20 bg-accent/10 px-3 py-1 text-[10px] font-semibold tracking-[0.28em] text-accent-soft uppercase">
            <UserRound className="size-3" />
            My profile
          </span>
          <h1 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-heading sm:text-4xl">
            Your BookNook account
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-ink-soft">
            The details we use to keep your borrowing in order.
          </p>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-12 lg:px-6">
          <ProfileEditor
            user={{
              name: user.name,
              email: user.email,
              image: user.image ?? null,
              joined,
            }}
          />
        </div>
      </section>

      <Toaster />
    </main>
  );
}
