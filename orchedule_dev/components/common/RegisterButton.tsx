// components/common/RegisterButton.tsx
"use client";

import Link from "next/link";

interface RegisterButtonProps {
  href: string;
  bgColor?: string;
  hoverColor?: string;
  borderColor?: string;
  children: React.ReactNode;
}

export default function RegisterButton({
  href,
  bgColor = "#E5C8C8",
  hoverColor = "#DDBBBB",
  borderColor = "#E5C8C8",
  children,
}: RegisterButtonProps) {
  return (
    <div className="text-right mb-4">
      <Link href={href}>
        <button
          className="inline-flex whitespace-nowrap items-center gap-1 text-sm font-semibold text-[#3E3232] px-4 py-1.5 rounded-xl shadow transition border cursor-pointer"
          style={{
            backgroundColor: bgColor,
            borderColor: borderColor,
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
          ＋ {children}
        </button>
      </Link>
    </div>
  );
}
