"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToastStore } from "@/lib/store/toast";
import { useUserStore } from "@/src/lib/store/user";

export default function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { showToast } = useToastStore();
  const { isLoggedIn } = useUserStore();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isValid = password.length >= 10 && password === confirm;

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/"); // 로그인 상태면 홈으로 이동
    }
  }, [isLoggedIn, router]);

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
        setSuccess(true);
      } else {
        showToast({
          message: data.message || "비밀번호 변경 실패",
          type: "error",
        });
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
        {!success && (
          <>
            <h1 className="text-lg font-bold text-[#3E3232] text-center mb-2">
              새 비밀번호 설정
            </h1>
            <p className="text-xs text-[#927d7d] text-center mb-9">
              새로 사용할 비밀번호를 입력해주세요.
              <br />
              영문, 숫자 포함 10자 이상 입력해야 합니다.
            </p>
          </>
        )}

        {success ? (
          <div className="text-center space-y-6 max-w-xs mx-auto">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#3E3232]">
                비밀번호가 성공적으로 변경되었습니다.
              </p>
              <p className="text-xs text-[#5C4F4F] leading-relaxed">
                이제 로그인 페이지에서
                <br />새 비밀번호로 로그인해 주세요.
              </p>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="inline-block px-4 py-2 bg-[#7E6363] text-white rounded-md text-sm font-semibold hover:bg-[#5c4f4f] transition"
            >
              로그인 하러 가기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#3E3232] mb-3">
                새 비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="새 비밀번호 (10자 이상)"
                className="w-full px-4 py-2 border border-[#d9d8d8] bg-[#f5f5f5] rounded-md text-sm placeholder:text-[#C3B4A3] focus:outline-none"
              />
            </div>
            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-medium text-[#3E3232] mb-3">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="비밀번호 재입력"
                className="w-full px-4 py-2 border border-[#d9d8d8] bg-[#f5f5f5] rounded-md text-sm placeholder:text-[#C3B4A3] focus:outline-none"
              />
              {/* 불일치 시 경고 메시지 */}
              {confirm && confirm !== password && (
                <p className="text-xs text-red-500 mt-1">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
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
              {loading ? "변경 중..." : "비밀번호 변경하기"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
