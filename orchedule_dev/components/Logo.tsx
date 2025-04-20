"use client";

import Link from "next/link";
import { vibur } from "../app/(authenticated)/fonts";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
}

export default function Logo({ size = "3xl" }: LogoProps) {
  const sizeMap = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
    "2xl": "text-3xl",
    "3xl": "text-4xl",
    "4xl": "text-5xl",
    "5xl": "text-6xl",
    "6xl": "text-7xl",
  };

  const sizeClass = sizeMap[size] ?? "text-4xl";

  return (
    <Link href="/">
      <h1
        className={`${vibur.className} ${sizeClass} text-[#3E3232] font-bold mb-0 cursor-pointer`}
      >
        Orchedule
      </h1>
    </Link>
  );
}
