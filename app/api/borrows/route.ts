import { auth } from "@/lib/auth";
import { bearerAuth, getRequestToken } from "@/lib/api-auth";
import { BOOKS_API_BASE } from "@/lib/books-api";

/** Lists the signed-in user's own borrow records. */
export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return Response.json(
      { message: "You must be signed in to view your borrows." },
      { status: 401 },
    );
  }

  const token = await getRequestToken(request);

  if (!token) {
    return Response.json(
      { message: "You must be signed in to view your borrows." },
      { status: 401 },
    );
  }

  try {
    // The backend reads the borrower from the token.
    const response = await fetch(`${BOOKS_API_BASE}/borrows`, {
      headers: bearerAuth(token),
      cache: "no-store",
    });
    const data = await response.json().catch(() => null);

    return Response.json(
      data ?? { message: "Your borrows could not be loaded." },
      { status: response.status },
    );
  } catch {
    return Response.json(
      { message: "Your borrows could not be loaded." },
      { status: 502 },
    );
  }
}

/** Borrows one copy of a book for the signed-in user. */
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return Response.json(
      { message: "You must be signed in to borrow a book." },
      { status: 401 },
    );
  }

  const token = await getRequestToken(request);

  if (!token) {
    return Response.json(
      { message: "You must be signed in to borrow a book." },
      { status: 401 },
    );
  }

  try {
    const body = await request.json().catch(() => ({}));

    // The backend reads the borrower from the token.
    const response = await fetch(`${BOOKS_API_BASE}/borrows`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...bearerAuth(token) },
      body: JSON.stringify({ bookId: body?.bookId }),
    });

    const data = await response.json().catch(() => null);

    return Response.json(
      data ?? { message: "The book could not be borrowed." },
      { status: response.status },
    );
  } catch {
    return Response.json(
      { message: "The book could not be borrowed." },
      { status: 502 },
    );
  }
}
