"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { useUserStore } from "@/lib/store/user";

export default function LoginPage() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

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

      login(user); // Zustand 저장
      localStorage.setItem("orchedule-user", JSON.stringify(user)); // localStorage 저장

      router.push("/");
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

          <label className="flex items-center text-xs text-[#3E3232] select-none ml-1">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="mr-2"
            />
            로그인 유지하기
          </label>

          <button
            onClick={handleLogin}
            disabled={!isFormValid}
            className={`w-full py-2 rounded-full text-sm font-semibold tracking-wide transition 
              ${
                isFormValid
                  ? "bg-[#7E6363] text-white hover:bg-[#5c4f4f]"
                  : "bg-[#e5e5e5] text-gray-400 cursor-not-allowed"
              }`}
          >
            시작하기
          </button>

          <div className="text-center mt-2">
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
