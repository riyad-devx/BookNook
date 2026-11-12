import { auth } from "@/lib/auth";
import { bearerAuth, getRequestToken } from "@/lib/api-auth";
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

  const token = await getRequestToken(request);

  if (!token) {
    return Response.json(
      { message: "You must be signed in to edit a book." },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    // The backend derives ownership from the token.
    const response = await fetch(`${BOOKS_API_BASE}/books/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...bearerAuth(token) },
      body: JSON.stringify(body),
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

  const token = await getRequestToken(request);

  if (!token) {
    return Response.json(
      { message: "You must be signed in to delete a book." },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;

    // The backend derives ownership from the token.
    const response = await fetch(`${BOOKS_API_BASE}/books/${id}`, {
      method: "DELETE",
      headers: bearerAuth(token),
    });
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
