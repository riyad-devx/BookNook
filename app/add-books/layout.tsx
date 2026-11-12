import type { Metadata } from "next";
import { requireSession } from "@/lib/session";

export const instant = false;

export const metadata: Metadata = {
  title: "Add Book",
};

export default async function AddBooksLayout({
  children,
}: LayoutProps<"/add-books">) {
  await requireSession("/add-books");

  return children;
}
