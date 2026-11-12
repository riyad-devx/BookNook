import { auth } from "@/lib/auth";
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

  try {
    const url = new URL(`${BOOKS_API_BASE}/borrows`);
    // The email comes from the verified session, never from the client.
    url.searchParams.set("userEmail", session.user.email);

    const response = await fetch(url, { cache: "no-store" });
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

  try {
    const body = await request.json().catch(() => ({}));

    const response = await fetch(`${BOOKS_API_BASE}/borrows`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookId: body?.bookId,
        userEmail: session.user.email,
      }),
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
