import { auth } from "@/lib/auth";
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

  try {
    const { id } = await params;

    const response = await fetch(`${BOOKS_API_BASE}/borrows/${id}/return`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // The backend checks this email against the borrow record owner.
      body: JSON.stringify({ userEmail: session.user.email }),
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
