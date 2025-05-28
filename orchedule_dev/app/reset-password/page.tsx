"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useToastStore } from "@/lib/store/toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { showToast } = useToastStore();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = password.length >= 10 && password === confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !isValid) return;

    try {
      setLoading(true);
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast({ message: "비밀번호가 변경되었습니다.", type: "success" });
        router.push("/login");
      } else {
        showToast({ message: data.message || "변경 실패", type: "error" });
      }
    } catch (err) {
      console.log(err);
      showToast({ message: "서버 오류가 발생했습니다.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#FAF7F3]">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-6">
        <h1 className="text-center text-lg font-bold text-[#3E3232]">
          비밀번호 재설정
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="새 비밀번호 (10자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-sm"
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-sm"
          />
          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full py-2 rounded-md text-white text-sm font-semibold transition ${
              isValid
                ? "bg-[#7E6363] hover:bg-[#5c4f4f]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {loading ? "변경 중..." : "비밀번호 변경하기"}
          </button>
        </form>
      </div>
    </main>
  );
}
