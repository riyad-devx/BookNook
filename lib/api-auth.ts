import { auth } from "@/lib/auth";

/**
 * Mints a short-lived Better Auth JWT for the caller of a route handler.
 * The backend accepts this token instead of trusting ids from the client.
 */
export async function getRequestToken(request: Request) {
  try {
    const jwt = await auth.api.getToken({ headers: request.headers });
    return jwt?.token ?? null;
  } catch {
    return null;
  }
}

/** Header used when calling the books API with a minted JWT. */
export function bearerAuth(token: string) {
  return { Authorization: `Bearer ${token}` };
}
