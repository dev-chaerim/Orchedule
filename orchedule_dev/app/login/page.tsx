"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { useUserStore } from "@/lib/store/user";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [remember, setRemember] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleLogin = async () => {
    if (!isFormValid) return;

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      const user = data.user;
      login(user);
      localStorage.setItem("orchedule-user", JSON.stringify(user));
      window.location.href = "/";
    } else {
      setErrorMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
      setPassword(""); // 보안상 비밀번호 초기화
    }
  };
  return (
    <main className="min-h-screen bg-[#FAF7F3] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-sm px-6 py-10">
        {/* 타이틀 */}
        <div className="text-center space-y-2 mb-8">
          <p className="text-[12px] text-[#7E6363] tracking-wide">
            오늘의 오케스트라
          </p>
          <Logo size="4xl" />
        </div>

        <div className="space-y-4">
          <input
            type="email"
            value={email}
            placeholder="이메일"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-[#f5f5f5] rounded-full text-sm placeholder:text-[#C3B4A3] focus:outline-none"
          />
          <input
            type="password"
            value={password}
            placeholder="비밀번호"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-[#f5f5f5] rounded-full text-sm placeholder:text-[#C3B4A3] focus:outline-none"
          />

          {errorMessage && (
            <p className="text-xs text-[#bd3232] text-center -mt-1">
              {errorMessage}
            </p>
          )}

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs text-[#3E3232] hover:underline mr-2 -mt-2"
            >
              비밀번호 찾기
            </Link>
          </div>

          <button
            onClick={handleLogin}
            disabled={!isFormValid}
            className={`w-full py-2 mt-3 rounded-full text-sm font-semibold tracking-wide transition 
              ${
                isFormValid
                  ? "bg-[#7E6363] text-white hover:bg-[#5c4f4f]"
                  : "bg-[#e5e5e5] text-gray-400 cursor-not-allowed"
              }`}
          >
            시작하기
          </button>

          <div className="text-center mt-1">
            <button
              type="button"
              onClick={() => router.push("/join")}
              className="text-sm text-[#7E6363] underline hover:text-[#3E3232] transition"
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
