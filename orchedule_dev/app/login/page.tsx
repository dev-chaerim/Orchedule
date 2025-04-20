"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleLogin = () => {
    if (!isFormValid) return;
    localStorage.setItem(
      "orchedule-user",
      JSON.stringify({ name: "김단원", part: "Vn1" })
    );
    router.push("/");
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
          {/* 이메일 입력 */}
          <div className="flex items-center bg-[#f5f5f5] rounded-full px-4 py-2">
            <input
              type="email"
              value={email}
              placeholder="이메일"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent focus:outline-none text-sm w-full placeholder:text-[#C3B4A3]"
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="flex items-center bg-[#f5f5f5] rounded-full px-4 py-2">
            <input
              type="password"
              value={password}
              placeholder="비밀번호"
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent focus:outline-none text-sm w-full placeholder:text-[#C3B4A3]"
            />
          </div>

          {/* 로그인 유지 체크 */}
          <label className="flex items-center text-xs text-[#3E3232] select-none ml-1">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="mr-2"
            />
            로그인 유지하기
          </label>

          {/* 로그인 버튼 */}
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

          {/* 회원가입 */}
          <div className="text-center">
            <button className="text-xs text-[#7E6363] underline">
              회원가입
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
