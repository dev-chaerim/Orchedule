"use client";

interface LoadingTextProps {
  message: string;
}

export default function LoadingText({ message }: LoadingTextProps) {
  return (
    <div className="flex justify-center py-10 text-[#a79c90] text-sm">
      ⏳ {message}
    </div>
  );
}
