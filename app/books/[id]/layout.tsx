import { requireSession } from "@/lib/session";

export const instant = false;

export default async function BookDetailsLayout({
  children,
  params,
}: LayoutProps<"/books/[id]">) {
  const { id } = await params;

  await requireSession(`/books/${id}`);

  return children;
}
