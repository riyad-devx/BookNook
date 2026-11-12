import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/** Reads and verifies the Better Auth session on the server. */
export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Sends guests to /login and returns them to `returnTo` afterwards. */
export async function requireSession(returnTo: string) {
  const session = await getServerSession();

  if (!session) {
    redirect(`/login?redirect=${encodeURIComponent(returnTo)}`);
  }

  return session;
}

/** Keeps signed-in users away from /login and /register. */
export async function requireGuest() {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }
}
