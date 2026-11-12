import { auth } from "@/lib/auth";
import { BOOKS_API_BASE } from "@/lib/books-api";

type RouteParams = {
  params: Promise<{ id: string }>;
};

/** Updates a book, but only when the signed-in user owns it. */
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return Response.json(
      { message: "You must be signed in to edit a book." },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    const response = await fetch(`${BOOKS_API_BASE}/books/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, userId: session.user.id }),
    });

    const data = await response.json().catch(() => null);

    return Response.json(
      data ?? { message: "The book could not be updated." },
      { status: response.status },
    );
  } catch {
    return Response.json(
      { message: "The book could not be updated." },
      { status: 502 },
    );
  }
}

/** Deletes a book, but only when the signed-in user owns it. */
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return Response.json(
      { message: "You must be signed in to delete a book." },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;
    const url = new URL(`${BOOKS_API_BASE}/books/${id}`);
    url.searchParams.set("userId", session.user.id);

    const response = await fetch(url, { method: "DELETE" });
    const data = await response.json().catch(() => null);

    return Response.json(
      data ?? { message: "The book could not be deleted." },
      { status: response.status },
    );
  } catch {
    return Response.json(
      { message: "The book could not be deleted." },
      { status: 502 },
    );
  }
}
