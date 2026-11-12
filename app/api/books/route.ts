import { auth } from "@/lib/auth";
import { bearerAuth, getRequestToken } from "@/lib/api-auth";
import { BOOKS_API_BASE } from "@/lib/books-api";

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
