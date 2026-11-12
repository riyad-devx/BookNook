import type { Metadata } from "next";
import { Suspense } from "react";
import BookBanner from "@/components/Home/BookBanner";
import HowBorrowingWorks from "@/components/Home/HowBorrowingWorks";
import NewArrivals, {
  NewArrivalsSkeleton,
} from "@/components/Home/NewArrivals";
import TopCategories from "@/components/Home/TopCategories";

export const metadata: Metadata = {
  // The root template does not apply to this page (same segment as the layout),
  // so the full title is written out here.
  title: { absolute: "BookNook | Home" },
};

function BannerFallback() {
  return (
    <section className="w-full pt-2 sm:pt-3">
      <div className="h-[520px] w-full animate-pulse bg-page-alt sm:h-[560px] lg:h-[600px]" />
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-w-0 flex-1">
      <Suspense fallback={<BannerFallback />}>
        <BookBanner />
      </Suspense>

      <Suspense fallback={<NewArrivalsSkeleton />}>
        <NewArrivals />
      </Suspense>

      <HowBorrowingWorks />
      <TopCategories />
    </main>
  );
}
