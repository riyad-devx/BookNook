import { auth } from "@/lib/auth";
import { bearerAuth, getRequestToken } from "@/lib/api-auth";
import { BOOKS_API_BASE } from "@/lib/books-api";

/**
 * Lists the whole catalogue.
 *
 * The browser calls this route instead of the books API directly, so the
 * request stays same-origin and never depends on the books API's CORS
 * policy. That is what lets the catalogue render on localhost and on
 * Vercel preview deployments as well as on the production domain.
 */
export async function GET() {
  try {
    const response = await fetch(`${BOOKS_API_BASE}/books`, {
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    return Response.json(
      data ?? { message: "The books could not be loaded." },
      { status: response.status },
    );
  } catch {
    return Response.json(
      { message: "The books could not be loaded." },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return Response.json(
      { message: "You must be signed in to add a book." },
      { status: 401 },
    );
  }

  const token = await getRequestToken(request);

  if (!token) {
    return Response.json(
      { message: "You must be signed in to add a book." },
      { status: 401 },
    );
  }

  try {
    const form = await request.formData();

    const response = await fetch(`${BOOKS_API_BASE}/add-books`, {
      method: "POST",
      headers: bearerAuth(token),
      body: form,
    });

    const data = await response.json().catch(() => null);

    return Response.json(
      data ?? { message: "The book could not be saved." },
      { status: response.status },
    );
  } catch {
    return Response.json(
      { message: "The book could not be saved." },
      { status: 502 },
    );
  }
}
