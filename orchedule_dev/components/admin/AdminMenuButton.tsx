"use client";

import Link from "next/link";

interface AdminMenuButtonProps {
  href: string;
  label: string;
  emoji: string;
}

export default function AdminMenuButton({
  href,
  label,
  emoji,
}: AdminMenuButtonProps) {
  const bgColor = "#E8E1DD";
  const hoverColor = "#ffffff";

  return (
    <Link href={href}>
      <button
        className={`w-full text-[#3E3232] border border-[#D5CBC5] text-sm font-semibold py-2 px-4 rounded-xl transition`}
        style={{
          backgroundColor: bgColor,
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            hoverColor;
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            bgColor;
        }}
      >
        {emoji} {label}
      </button>
    </Link>
  );
}
