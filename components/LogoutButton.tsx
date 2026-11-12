"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        setError(error.message || "Could not sign out.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("Could not sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full sm:w-auto">
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-rose-300/25 bg-rose-500/10 px-5 text-sm font-semibold text-rose-200/90 transition-colors hover:border-rose-300/40 hover:bg-rose-500/15 hover:text-rose-100 focus-visible:ring-2 focus-visible:ring-rose-300/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <LogOut className="size-4" />
        )}
        {loading ? "Signing out..." : "Logout"}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-xs text-rose-300/90">
          {error}
        </p>
      )}
    </div>
  );
}
