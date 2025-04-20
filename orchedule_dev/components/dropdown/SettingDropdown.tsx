// components/SettingDropdown.tsx
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/user";

interface Props {
  onClose: () => void;
  direction?: "top" | "bottom"; // 드롭다운이 열릴 방향
}

export default function SettingDropdown({
  onClose,
  direction = "bottom",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const logout = useUserStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("orchedule-user");
    document.cookie = "orchedule-auth=; Max-Age=0; path=/";
    router.replace("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const positionClass =
    direction === "bottom" ? "bottom-full mb-2" : "top-full mt-2";

  return (
    <div
      ref={ref}
      className={`absolute left-1/2 -translate-x-1/2 ${positionClass} min-w-[150px] bg-white shadow-md rounded-md px-4 py-3 z-10 text-xs text-[#7E6363] space-y-2`}
    >
      <button className="block w-full text-left hover:text-[#5c4f4f] transition">
        프로필 보기
      </button>
      <button className="block w-full text-left hover:text-[#5c4f4f] transition">
        테마 설정
      </button>
      <hr className="border-t border-dashed border-gray-300 my-1" />
      <button
        onClick={handleLogout}
        className="block w-full text-left hover:text-red-500 transition"
      >
        로그아웃
      </button>
    </div>
  );
}
