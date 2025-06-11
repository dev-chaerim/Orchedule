"use client";

interface NewBadgeProps {
  size?: number; // 원형 크기 (기본 14px)
  fontSize?: number; // 글자 크기 (기본 9px)
  bgColor?: string; // 배경색 (기본 '#e85454')
  textColor?: string; // 글자색 (기본 '#fff')
}

export default function NewBadge({
  size = 12,
  fontSize = 8,
  bgColor = "#e85454",
  textColor = "#fff",
}: NewBadgeProps) {
  return (
    <div
      className="relative top-[0.5px] flex items-center justify-center rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: bgColor,
        color: textColor,
        fontSize: `${fontSize}px`,
        fontWeight: "bold",
        lineHeight: `${size}px`,
        flexShrink: 0,
      }}
    >
      N
    </div>
  );
}
