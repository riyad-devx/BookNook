"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  BookMarked,
  BookOpen,
  BookPlus,
  HandCoins,
  Home,
  LibraryBig,
  LogIn,
  Menu,
  Moon,
  Sun,
  UserPlus,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export type NavberProps = {
  loginHref?: string;
  registerHref?: string;
};

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type Theme = "light" | "dark";

// Add Book, My Books and My Borrows are private and only shown to
// signed-in users. The Login/Register buttons are replaced by the
// signed-in user's photo, which links to /profile.
const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "All Books", href: "/books", icon: LibraryBig },
  { label: "Add Book", href: "/add-books", icon: BookPlus },
  { label: "My Books", href: "/my-books", icon: BookMarked },
  { label: "My Borrows", href: "/my-borrows", icon: HandCoins },
];

const PRIVATE_NAV_HREFS = new Set(["/add-books", "/my-books", "/my-borrows"]);

function getInitials(name?: string | null) {
  const initials = (name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "BN";
}

function ProfileAvatar({
  name,
  image,
  className,
}: {
  name: string;
  image?: string | null;
  className?: string;
}) {
  return (
    <Avatar className={cn("size-9 border border-accent-line/20", className)}>
      <AvatarImage src={image ?? undefined} alt={name} />
      <AvatarFallback className="bg-accent/10 text-[11px] font-semibold tracking-wide text-accent-soft">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

const THEME_KEY = "booknook-theme";
const THEME_EVENT = "booknook-theme-change";

function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const stored = window.localStorage.getItem(THEME_KEY);

  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function subscribeToTheme(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_KEY) {
      callback();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(THEME_EVENT, callback);
  media.addEventListener("change", callback);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(THEME_EVENT, callback);
    media.removeEventListener("change", callback);
  };
}

function useBookNookTheme() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => "dark" as Theme
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const next: Theme = getThemeSnapshot() === "dark" ? "light" : "dark";

    window.localStorage.setItem(THEME_KEY, next);
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return { theme, toggleTheme };
}

function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: Theme;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="relative grid size-9 place-items-center rounded-full border border-line bg-surface text-ink-soft transition-all duration-300 hover:border-accent-line/25 hover:bg-accent/10 hover:text-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
    >
      <Sun
        className={cn(
          "absolute size-4 transition-all duration-300",
          theme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-50 opacity-0"
        )}
      />
      <Moon
        className={cn(
          "absolute size-4 transition-all duration-300",
          theme === "dark"
            ? "rotate-90 scale-50 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        )}
      />
    </button>
  );
}

function DesktopNavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-medium tracking-[0.01em] transition-colors duration-300",
        active
          ? "text-heading"
          : "text-ink-soft hover:text-heading"
      )}
    >
      <span
        className={cn(
          "absolute inset-0 rounded-full transition-all duration-300",
          active
            ? "bg-gradient-to-b from-emerald-300/15 via-emerald-400/10 to-transparent shadow-[0_10px_30px_-14px_rgba(52,211,153,0.9)] ring-1 ring-accent-line/20 ring-inset"
            : "bg-transparent group-hover:bg-surface-strong"
        )}
      />
      <span className="relative flex items-center gap-2">
        <Icon
          className={cn(
            "size-4 transition-all duration-300 group-hover:-translate-y-0.5",
            active
              ? "text-accent"
              : "text-accent-faint group-hover:text-accent-soft"
          )}
          strokeWidth={active ? 2.2 : 1.8}
        />
        {item.label}
      </span>
      <span
        className={cn(
          "absolute -bottom-1 left-1/2 h-px -translate-x-1/2 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(110,231,183,0.55)] transition-all duration-300",
          active
            ? "w-6 opacity-100"
            : "w-0 opacity-0 group-hover:w-3 group-hover:opacity-60"
        )}
      />
    </Link>
  );
}

function MobileNavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-300",
        active
          ? "text-heading"
          : "text-ink-soft hover:bg-surface-strong hover:text-heading"
      )}
    >
      {active && (
        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/15 to-transparent ring-1 ring-accent-line/15 ring-inset" />
      )}
      <span
        className={cn(
          "relative grid size-8 place-items-center rounded-lg border transition-colors duration-300",
          active
            ? "border-accent/20 bg-accent/10 text-accent"
            : "border-line-soft bg-surface text-accent-faint group-hover:text-accent-soft"
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="relative">{item.label}</span>
      {active && (
        <span className="relative ml-auto size-1.5 rounded-full bg-accent shadow-[0_0_8px_2px_rgba(110,231,183,0.6)]" />
      )}
    </Link>
  );
}

export default function Navber({
  loginHref = "/login",
  registerHref = "/register",
}: NavberProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useBookNookTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const isLoggedIn = Boolean(user);

  const navItems = NAV_ITEMS.filter(
    (item) => isLoggedIn || !PRIVATE_NAV_HREFS.has(item.href),
  );

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href;

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4 lg:px-6">
      <div className="relative mx-auto max-w-7xl rounded-[1.65rem] border border-line-soft bg-panel/80 shadow-[0_24px_70px_-24px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl supports-[backdrop-filter]:bg-panel/70">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/40 to-transparent" />
          <div className="absolute top-1/2 -left-24 size-64 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute top-1/2 -right-16 size-52 -translate-y-1/2 rounded-full bg-lime-300/[0.06] blur-3xl" />
        </div>

        <div className="relative flex h-16 items-center gap-3 px-3 sm:h-[4.5rem] sm:px-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <Link
            href="/"
            onClick={closeMobile}
            aria-label="BookNook home"
            className="group flex min-w-0 items-center gap-2.5 rounded-full focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
          >
            <span className="relative grid size-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-200 via-emerald-400 to-teal-700 shadow-[0_10px_24px_-8px_rgba(16,185,129,0.7),inset_0_1px_0_rgba(255,255,255,0.45)] transition-all duration-500 group-hover:-rotate-6 group-hover:scale-105">
              <BookOpen className="size-5 text-[#04110b]" strokeWidth={2.4} />
              <span className="absolute -top-1 -right-1 size-2.5 rounded-full border-2 border-panel bg-lime-300 shadow-[0_0_10px_2px_rgba(190,242,100,0.7)]" />
            </span>
            <span className="flex min-w-0 flex-col leading-none">
              <span className="truncate font-heading text-[1.35rem] font-semibold tracking-[-0.03em] text-heading">
                Book<span className="text-accent">Nook</span>
              </span>
              <span className="mt-1 text-[8px] font-semibold tracking-[0.34em] text-accent-faint uppercase">
                Digital Library
              </span>
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center justify-center gap-1 lg:flex"
          >
            {navItems.map((item) => (
              <DesktopNavLink
                key={item.href}
                item={item}
                active={isActive(item.href)}
              />
            ))}
          </nav>

          <div className="ml-auto flex items-center justify-end gap-2 lg:ml-0">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            <div className="hidden items-center gap-2 lg:flex">
              {isPending ? (
                <span
                  aria-hidden
                  className="size-9 animate-pulse rounded-full border border-line bg-surface-strong"
                />
              ) : user ? (
                <Link
                  href="/profile"
                  aria-label="My profile"
                  title="My profile"
                  className="group rounded-full ring-2 ring-accent/0 transition-all hover:ring-accent/35 focus-visible:ring-accent/60 focus-visible:outline-none"
                >
                  <ProfileAvatar name={user.name} image={user.image} />
                </Link>
              ) : (
                <>
                  <Link
                    href={loginHref}
                    className="group inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-heading focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
                  >
                    <LogIn className="size-4 text-accent-faint transition-colors group-hover:text-accent" />
                    Login
                  </Link>
                  <Link
                    href={registerHref}
                    className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-[0_10px_28px_-12px_rgba(52,211,153,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-12px_rgba(52,211,153,0.95)] focus-visible:ring-2 focus-visible:ring-accent-line/70 focus-visible:ring-offset-2 focus-visible:ring-offset-panel focus-visible:outline-none"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <UserPlus className="relative size-4" />
                    <span className="relative">Register</span>
                  </Link>
                </>
              )}
            </div>

            {user && (
              <Link
                href="/profile"
                onClick={closeMobile}
                aria-label="My profile"
                title="My profile"
                className="group rounded-full ring-2 ring-accent/0 transition-all hover:ring-accent/35 focus-visible:ring-accent/60 focus-visible:outline-none lg:hidden"
              >
                <ProfileAvatar
                  name={user.name}
                  image={user.image}
                  className="size-8"
                />
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              aria-label={
                mobileOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              className="relative grid size-9 place-items-center rounded-full border border-line bg-surface text-ink-soft transition-all duration-300 hover:border-accent-line/25 hover:bg-accent/10 hover:text-accent-soft focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none lg:hidden"
            >
              <Menu
                className={cn(
                  "absolute size-4 transition-all duration-300",
                  mobileOpen
                    ? "rotate-90 scale-50 opacity-0"
                    : "rotate-0 scale-100 opacity-100"
                )}
              />
              <X
                className={cn(
                  "absolute size-4 transition-all duration-300",
                  mobileOpen
                    ? "rotate-0 scale-100 opacity-100"
                    : "-rotate-90 scale-50 opacity-0"
                )}
              />
            </button>
          </div>
        </div>

        <div
          id="mobile-navigation"
          aria-hidden={!mobileOpen}
          inert={!mobileOpen}
          className={cn(
            "grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out lg:hidden",
            mobileOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="border-t border-line-soft px-3 pt-3 pb-3">
              <nav
                aria-label="Mobile navigation"
                className="flex flex-col gap-1"
              >
                {navItems.map((item) => (
                  <MobileNavLink
                    key={item.href}
                    item={item}
                    active={isActive(item.href)}
                    onNavigate={closeMobile}
                  />
                ))}
              </nav>

              {!isPending && !user && (
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line-soft pt-3">
                  <Link
                    href={loginHref}
                    onClick={closeMobile}
                    className="flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-strong hover:text-heading"
                  >
                    <LogIn className="size-4" />
                    Login
                  </Link>
                  <Link
                    href={registerHref}
                    onClick={closeMobile}
                    className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 to-lime-300 px-3 py-2.5 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-950/30 transition hover:brightness-105"
                  >
                    <UserPlus className="size-4" />
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
