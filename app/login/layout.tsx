import type { Metadata } from "next";
import { requireGuest } from "@/lib/session";

export const instant = false;

export const metadata: Metadata = {
  title: "Login",
};

export default async function LoginLayout({
  children,
}: LayoutProps<"/login">) {
  await requireGuest();

  return children;
}
