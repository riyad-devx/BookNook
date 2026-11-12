"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

import "swiper/css";

type Slide = {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  alt: string;
};

const SLIDES: Slide[] = [
  {
    eyebrow: "BookNook",
    title: "Borrow, read, return. Repeat.",
    text: "Fourteen days for every book. Return it with one click when you are done.",
    image: "/images/banner/banner-1.jpg",
    alt: "Floor-to-ceiling shelves filled with books",
  },
  {
    eyebrow: "Curated shelves",
    title: "Every shelf has a story worth opening.",
    text: "Explore hand-picked fiction, non-fiction, and rare finds from our growing library.",
    image: "/images/banner/banner-2.jpg",
    alt: "A stack of thoughtfully chosen books",
  },
  {
    eyebrow: "Your reading space",
    title: "Your next chapter starts here.",
    text: "Borrow instantly, track what you are reading, and build a shelf that feels like yours.",
    image: "/images/banner/banner-3.jpg",
    alt: "Rows of well-worn books waiting to be read",
  },
  {
    eyebrow: "Read without limits",
    title: "Read more. Carry less.",
    text: "Thousands of books, zero late fees, and a reading list that travels with you.",
    image: "/images/banner/banner-4.jpg",
    alt: "A curved library aisle lined with colourful books",
  },
  {
    eyebrow: "A quiet corner",
    title: "Find a quiet corner for every story.",
    text: "Discover new voices and timeless classics, curated for curious minds.",
    image: "/images/banner/banner-5.jpg",
    alt: "Warmly lit library shelves glowing under hanging bulbs",
  },
];

export default function BookBanner() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      aria-label="Featured books"
      className="w-full min-w-0 pt-2 sm:pt-3"
    >
      <div className="relative overflow-hidden bg-page-alt">
        <div className="pointer-events-none absolute inset-x-12 top-0 z-20 h-px bg-gradient-to-r from-transparent via-emerald-200/40 to-transparent" />

        <Swiper
          modules={[Autoplay, Keyboard, A11y]}
          speed={850}
          loop
          autoplay={{
            delay: 6500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          keyboard={{ enabled: true }}
          a11y={{ enabled: true }}
          onSwiper={setSwiper}
          onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
          className="h-[520px] w-full min-w-0 sm:h-[560px] lg:h-[600px]"
        >
          {SLIDES.map((slide, index) => (
            <SwiperSlide
              key={slide.title}
              className="relative h-full w-full overflow-hidden"
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="(min-width: 1280px) 1280px, 100vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-page-alt/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-page-alt/95 via-page-alt/65 to-page-alt/5" />
              <div className="absolute inset-0 bg-gradient-to-t from-page-alt/80 via-transparent to-page-alt/10" />

              <div className="relative z-10 flex h-full min-w-0 items-center px-6 pt-10 pb-28 sm:px-10 lg:px-16">
                <div className="w-full min-w-0 max-w-2xl">
                  <span className="inline-flex items-center gap-2 rounded-full border border-accent-line/20 bg-accent/10 px-3 py-1 text-[10px] font-semibold tracking-[0.28em] text-accent-soft uppercase backdrop-blur-sm">
                    <Sparkles className="size-3" />
                    {slide.eyebrow}
                  </span>

                  <h1 className="mt-5 max-w-2xl text-balance font-heading text-4xl leading-[1.02] font-semibold tracking-[-0.04em] text-heading sm:text-5xl lg:text-6xl xl:text-7xl">
                    {slide.title}
                  </h1>

                  <p className="mt-5 max-w-lg text-sm leading-6 text-ink-soft sm:text-base sm:leading-7">
                    {slide.text}
                  </p>

                  <Link
                    href="/books"
                    className="group relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-6 py-3 text-sm font-semibold text-emerald-950 shadow-[0_18px_40px_-16px_rgba(52,211,153,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-16px_rgba(52,211,153,1)] focus-visible:ring-2 focus-visible:ring-accent-line/70 focus-visible:ring-offset-2 focus-visible:ring-offset-page-alt focus-visible:outline-none"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <BookOpen className="relative size-4" />
                    <span className="relative">Browse Books</span>
                    <ArrowUpRight className="relative size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 px-6 pb-6 sm:px-10 sm:pb-8 lg:px-16">
          <div className="pointer-events-auto flex items-center gap-2">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => swiper?.slideToLoop(index)}
                aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                aria-current={activeIndex === index ? "true" : undefined}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500 focus-visible:ring-2 focus-visible:ring-accent-line/70 focus-visible:outline-none",
                  activeIndex === index
                    ? "w-8 bg-accent shadow-[0_0_12px_rgba(110,231,183,0.8)]"
                    : "w-3 bg-heading/25 hover:bg-heading/45"
                )}
              />
            ))}
          </div>

          <div className="pointer-events-auto flex items-center gap-3">
            <span className="text-[10px] font-semibold tracking-[0.3em] text-heading/45">
              {String(activeIndex + 1).padStart(2, "0")}
              <span className="mx-1 text-heading/20">/</span>
              {String(SLIDES.length).padStart(2, "0")}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => swiper?.slidePrev()}
                aria-label="Previous slide"
                className="grid size-10 place-items-center rounded-full border border-line-strong bg-panel/40 text-heading/70 backdrop-blur-md transition-all duration-300 hover:border-accent-line/40 hover:bg-accent/15 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent-line/70 focus-visible:outline-none"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => swiper?.slideNext()}
                aria-label="Next slide"
                className="grid size-10 place-items-center rounded-full border border-line-strong bg-panel/40 text-heading/70 backdrop-blur-md transition-all duration-300 hover:border-accent-line/40 hover:bg-accent/15 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent-line/70 focus-visible:outline-none"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
