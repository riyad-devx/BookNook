import type { Metadata } from "next";
import { requireGuest } from "@/lib/session";

export const instant = false;

export const metadata: Metadata = {
  title: "Register",
};

export default async function RegisterLayout({
  children,
}: LayoutProps<"/register">) {
  await requireGuest();

  return children;
}
