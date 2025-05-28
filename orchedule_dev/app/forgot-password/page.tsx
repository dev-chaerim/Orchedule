"use client";

import { useState } from "react";
import { useToastStore } from "@/lib/store/toast";

export default function ForgotPasswordPage() {
  const { showToast } = useToastStore();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = email.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      setLoading(true);
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSent(true);
      } else {
        showToast({ message: data.message || "전송 실패", type: "error" });
      }
    } catch (err) {
      console.log(err);
      showToast({ message: "서버 오류가 발생했습니다.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F3] flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm">
        <h1 className="text-lg font-bold text-[#3E3232] text-center mb-2">
          비밀번호를 잊어버리셨나요?
        </h1>
        <p className="text-xs text-[#927d7d] text-center mb-9">
          가입한 이메일 주소를 입력해 주세요.
          <br />
          비밀번호 재설정 링크를 메일로 보내드립니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#3E3232] mb-3">
              이메일 주소
            </label>
            <input
              type="email"
              value={email}
              placeholder="가입한 이메일을 입력하세요"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-[#d9d8d8] bg-[#f5f5f5] rounded-md text-sm placeholder:text-[#C3B4A3] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full py-2 rounded-md text-sm font-semibold tracking-wide transition 
              ${
                isValid
                  ? "bg-[#7E6363] text-white hover:bg-[#5c4f4f]"
                  : "bg-[#e5e5e5] text-gray-400 cursor-not-allowed"
              }`}
          >
            {loading ? "전송 중..." : "비밀번호 재설정 메일 보내기"}
          </button>

          {sent && (
            <p className="text-sm text-blue-600 text-center mt-2">
              입력하신 이메일로 재설정 링크를 보냈습니다.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
