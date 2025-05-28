"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/lib/store/toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const showToast = useToastStore((state) => state.showToast);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast({
          message: "재설정 링크가 이메일로 전송되었습니다.",
          type: "success",
        });
        router.push("/login");
      } else {
        showToast({
          message: data.message || "이메일 전송 실패",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
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
          <div>
            <label className="block text-sm font-medium text-[#7E6363] mb-1">
              이메일 주소
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="가입한 이메일을 입력하세요"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#A5796E] focus:border-[#A5796E]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#7E6363] text-white text-sm font-semibold rounded-md hover:bg-[#5c4f4f] transition"
          >
            {loading ? "전송 중..." : "재설정 링크 보내기"}
          </button>
        </form>
      </div>
    </main>
  );
}
