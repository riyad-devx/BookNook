import { auth } from "@/lib/auth";
import { BOOKS_API_BASE } from "@/lib/books-api";

/**
 * Creates a book on behalf of the signed-in user. The owner fields are
 * filled from the verified session so they cannot be spoofed by the client.
 */
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return Response.json(
      { message: "You must be signed in to add a book." },
      { status: 401 },
    );
  }

  try {
    const form = await request.formData();

    form.set("userId", session.user.id);
    form.set("userName", session.user.name);
    form.set("userEmail", session.user.email);

    const response = await fetch(`${BOOKS_API_BASE}/add-books`, {
      method: "POST",
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
