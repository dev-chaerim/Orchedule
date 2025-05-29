"use client";

interface LoadingSkeletonProps {
  lines?: number; // 표시할 줄 수
  className?: string; // 외부에서 추가할 클래스
}

export default function LoadingSkeleton({
  lines = 3,
  className = "",
}: LoadingSkeletonProps) {
  // 줄마다 길이를 조금씩 다르게 주기 위해 클래스 배열
  const widths = ["w-2/3", "w-full", "w-5/6"];

  return (
    <div className={`space-y-2 ${className} px-4`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 ${
            widths[i % widths.length]
          } bg-[#ece9e3] rounded-full animate-pulse`}
        />
      ))}
    </div>
  );
}
