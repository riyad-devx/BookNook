import type { Metadata } from "next";
import AllBooksList from "@/components/AllBooksList";

export const metadata: Metadata = {
  title: "All Books",
};

/**
 * The page stays a server component so it can set the title.
 * The interactive list lives in `components/AllBooksList.tsx`.
 */
export default function AllBooksPage() {
  return <AllBooksList />;
}
