// components/search/SearchButton.tsx
"use client";

import Image from "next/image";
import { useSearchStore } from "@/lib/store/search";

export default function SearchButton() {
  const { open } = useSearchStore();

  return (
    <button onClick={open}>
      <Image
        src="/icons/search.svg"
        alt="검색"
        width={20}
        height={20}
        className="cursor-pointer"
      />
    </button>
  );
}
