"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  BookOpen,
  CalendarDays,
  Check,
  ImageIcon,
  Loader2,
  Mail,
  Pencil,
  UserRound,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogoutButton from "@/components/LogoutButton";

type ProfileUser = {
  name: string;
  email: string;
  image: string | null;
  joined: string | null;
};

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "BN";
}

function validPhotoUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const inputClass =
  "h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-heading outline-none transition-colors placeholder:text-ink-faint focus:border-accent/40 focus-visible:ring-2 focus-visible:ring-accent/20";

export default function ProfileEditor({ user: initialUser }: { user: ProfileUser }) {
  const router = useRouter();

  const [user, setUser] = useState(initialUser);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(initialUser.name);
  const [image, setImage] = useState(initialUser.image ?? "");

  const startEditing = () => {
    setName(user.name);
    setImage(user.image ?? "");
    setError("");
    setEditing(true);
  };

  const cancelEditing = () => {
    if (saving) return;

    setName(user.name);
    setImage(user.image ?? "");
    setError("");
    setEditing(false);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (saving) return;

    const nextName = name.trim();
    const nextImage = image.trim();

    setError("");

    if (!nextName) {
      setError("Please enter your name.");
      return;
    }

    if (nextImage && !validPhotoUrl(nextImage)) {
      setError("Photo URL must start with http:// or https://.");
      return;
    }

    const nameChanged = nextName !== user.name;
    const imageChanged = nextImage !== (user.image ?? "");

    if (!nameChanged && !imageChanged) {
      setEditing(false);
      return;
    }

    setSaving(true);

    try {
      const { error: updateError } = await authClient.updateUser({
        name: nextName,
        image: nextImage || null,
      });

      if (updateError) {
        setError(updateError.message || "Could not update your profile.");
        return;
      }

      setUser({
        ...user,
        name: nextName,
        image: nextImage || null,
      });
      setEditing(false);
      toast.add({
        type: "success",
        title: "Profile updated",
        description: "Your details have been saved.",
      });
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-[1.75rem] border border-line-soft bg-panel/80 p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-8">
      {editing ? (
        <form onSubmit={handleSave} noValidate>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em] text-heading">
                Edit profile
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                Update your photo and name.
              </p>
            </div>

            <button
              type="button"
              onClick={cancelEditing}
              disabled={saving}
              aria-label="Cancel editing"
              className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink-soft transition-colors hover:bg-surface-strong hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none disabled:opacity-50"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
            <Avatar className="size-20 border border-accent-line/20 shadow-[0_18px_40px_-22px_rgba(52,211,153,0.9)]">
              <AvatarImage
                key={image}
                src={image.trim() || undefined}
                alt={name || "Profile photo"}
              />
              <AvatarFallback className="bg-accent/10 font-heading text-2xl font-semibold text-accent-soft">
                {getInitials(name || user.name)}
              </AvatarFallback>
            </Avatar>

            <p className="text-center text-xs leading-5 text-ink-faint sm:text-left">
              Paste a public image URL below to change your photo. Leave it
              empty to use your initials.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="profile-name"
                className="text-xs text-accent-soft"
              >
                Name
              </label>
              <div className="relative mt-2">
                <UserRound className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-accent-dim" />
                <input
                  id="profile-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="profile-image"
                className="text-xs text-accent-soft"
              >
                Photo URL
              </label>
              <div className="relative mt-2">
                <ImageIcon className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-accent-dim" />
                <input
                  id="profile-image"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-danger-line-strong/25 bg-danger-surface/10 px-3.5 py-2.5 text-xs text-danger"
            >
              {error}
            </p>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-5 text-sm font-semibold text-emerald-950 shadow-[0_18px_40px_-18px_rgba(52,211,153,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-18px_rgba(52,211,153,1)] focus-visible:ring-2 focus-visible:ring-accent-line/70 focus-visible:ring-offset-2 focus-visible:ring-offset-panel focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              {saving ? "Saving..." : "Save changes"}
            </button>

            <button
              type="button"
              onClick={cancelEditing}
              disabled={saving}
              className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-surface px-5 text-sm font-medium text-ink-soft transition-colors hover:border-line-strong hover:bg-surface-strong hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <Avatar className="size-20 border border-accent-line/20 shadow-[0_18px_40px_-22px_rgba(52,211,153,0.9)]">
              <AvatarImage key={user.image} src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback className="bg-accent/10 font-heading text-2xl font-semibold text-accent-soft">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <h2 className="truncate font-heading text-2xl font-semibold tracking-[-0.02em] text-heading">
                {user.name}
              </h2>
              <p className="mt-1 truncate text-sm text-ink-muted">
                {user.email}
              </p>
            </div>

            <button
              type="button"
              onClick={startEditing}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-accent-line/20 bg-accent/10 px-4 text-sm font-medium text-accent-soft transition-colors hover:border-accent-line/35 hover:bg-accent/15 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
            >
              <Pencil className="size-3.5" />
              Edit
            </button>
          </div>

          <dl className="mt-8 grid gap-4 rounded-2xl border border-line-soft bg-surface p-4 sm:grid-cols-2 sm:p-5">
            <div className="min-w-0">
              <dt className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.2em] text-accent-faint uppercase">
                <UserRound className="size-3" />
                Name
              </dt>
              <dd className="mt-1.5 truncate text-sm text-ink">
                {user.name}
              </dd>
            </div>

            <div className="min-w-0">
              <dt className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.2em] text-accent-faint uppercase">
                <Mail className="size-3" />
                Email
              </dt>
              <dd className="mt-1.5 truncate text-sm text-ink">
                {user.email}
              </dd>
            </div>

            {user.joined && (
              <div className="min-w-0">
                <dt className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.2em] text-accent-faint uppercase">
                  <CalendarDays className="size-3" />
                  Member since
                </dt>
                <dd className="mt-1.5 truncate text-sm text-ink">
                  {user.joined}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/books"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-medium text-ink-soft transition-colors hover:border-accent-line/30 hover:bg-accent/10 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none sm:w-auto"
            >
              <BookOpen className="size-4" />
              Browse books
            </Link>

            <LogoutButton />
          </div>
        </>
      )}
    </div>
  );
}
