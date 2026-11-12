import { auth } from "@/lib/auth";
import { bearerAuth, getRequestToken } from "@/lib/api-auth";
import { BOOKS_API_BASE } from "@/lib/books-api";

/** Lists only the books owned by the signed-in user. */
export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return Response.json(
      { message: "You must be signed in to view your books." },
      { status: 401 },
    );
  }

  const token = await getRequestToken(request);

  if (!token) {
    return Response.json(
      { message: "You must be signed in to view your books." },
      { status: 401 },
    );
  }

  try {
    // The backend reads the owner from the token.
    const response = await fetch(`${BOOKS_API_BASE}/my-books`, {
      headers: bearerAuth(token),
      cache: "no-store",
    });
    const data = await response.json().catch(() => null);

    return Response.json(
      data ?? { message: "Your books could not be loaded." },
      { status: response.status },
    );
  } catch {
    return Response.json(
      { message: "Your books could not be loaded." },
      { status: 502 },
    );
  }
}
