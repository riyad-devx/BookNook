import { auth } from "@/lib/auth";
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

  try {
    const url = new URL(`${BOOKS_API_BASE}/my-books`);
    url.searchParams.set("userId", session.user.id);

    const response = await fetch(url, { cache: "no-store" });
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
