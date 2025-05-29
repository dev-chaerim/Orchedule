"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/user";

interface Props {
  onClose: () => void;
  position: { top: number; left: number };
  direction?: "bottom" | "top";
}

export default function SettingDropdown({
  onClose,
  position,
  direction = "bottom", // 기본값은 아래
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const logout = useUserStore((state) => state.logout);
  const user = useUserStore((state) => state.user);

  const DROPDOWN_WIDTH = 160;
  const DROPDOWN_HEIGHT = 150;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const correctedLeft =
    position.left + DROPDOWN_WIDTH > window.innerWidth
      ? window.innerWidth - DROPDOWN_WIDTH - 12
      : position.left - 4;

  const dropdownTop =
    direction === "top" ? position.top - DROPDOWN_HEIGHT - 8 : position.top;

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: dropdownTop,
        left: correctedLeft,
        zIndex: 9999,
        minWidth: DROPDOWN_WIDTH,
      }}
      className="bg-white shadow-md rounded-md px-4 py-3 text-xs text-[#7E6363] space-y-2"
    >
      <button className="block w-full text-left hover:bg-gray-100 hover:text-[#5c4f4f] transition px-2 py-1 rounded">
        프로필 보기
      </button>
      <button className="block w-full text-left hover:bg-gray-100 hover:text-[#5c4f4f] transition px-2 py-1 rounded">
        테마 설정
      </button>
      {user?.role === "admin" && (
        <button
          onClick={() => {
            router.push("/admin");
            onClose();
          }}
          className="block w-full text-left hover:bg-gray-100 hover:text-[#5c4f4f] transition px-2 py-1 rounded"
        >
          관리자 페이지
        </button>
      )}
      <hr className="border-t border-dashed border-gray-300 my-1" />
      <button
        onClick={async () => {
          await fetch("/api/logout", { method: "DELETE" });
          localStorage.removeItem("orchedule-user");
          logout();
          router.replace("/login");
        }}
        className="block w-full text-left hover:bg-gray-100 hover:text-red-500 transition px-2 py-1 rounded"
      >
        로그아웃
      </button>
    </div>
  );
}
