import type { Metadata } from "next";
import { Fraunces, National_Park } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Home/Footer";
import Navber from "@/components/Navber";
import { cn } from "@/lib/utils";

const frauncesHeading = Fraunces({ subsets: ["latin"], variable: "--font-heading" });

const nationalPark = National_Park({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  // Child pages only set the short part, e.g. "All Books".
  // The template turns that into "BookNook | All Books".
  title: {
    default: "BookNook | Digital Library",
    template: "BookNook | %s",
  },
  description:
    "BookNook is a digital library. Browse the shelves, borrow a book for fourteen days, and return it with one click.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", "font-sans", nationalPark.variable, frauncesHeading.variable)}
    >
      <head>
        {/*
          Applies the saved theme before the browser paints, so the page never
          flashes the wrong theme. Keep the key in sync with components/Navber.tsx.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k="booknook-theme";var s=localStorage.getItem(k);var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Navber />
        {children}
        <Footer />
      </body>
    </html>
  );
}
