import { auth } from "@/lib/auth";
import { bearerAuth, getRequestToken } from "@/lib/api-auth";
import { BOOKS_API_BASE } from "@/lib/books-api";

type RouteParams = {
  params: Promise<{ id: string }>;
};

/** Returns one of the signed-in user's borrowed books. */
export async function POST(request: Request, { params }: RouteParams) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return Response.json(
      { message: "You must be signed in to return a book." },
      { status: 401 },
    );
  }

  const token = await getRequestToken(request);

  if (!token) {
    return Response.json(
      { message: "You must be signed in to return a book." },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;

    // The backend checks the borrower from the token.
    const response = await fetch(`${BOOKS_API_BASE}/borrows/${id}/return`, {
      method: "POST",
      headers: bearerAuth(token),
    });

    const data = await response.json().catch(() => null);

    return Response.json(
      data ?? { message: "The book could not be returned." },
      { status: response.status },
    );
  } catch {
    return Response.json(
      { message: "The book could not be returned." },
      { status: 502 },
    );
  }
}
