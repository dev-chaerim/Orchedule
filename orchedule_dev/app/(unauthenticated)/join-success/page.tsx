// app/(unauthenticated)/join-success/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function JoinSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white rounded-xl border border-[#e0dada] p-8 max-w-md w-full space-y-6">
        <h1 className="text-xl font-bold text-[#3E3232]">가입 신청 완료</h1>
        <p className="text-sm text-[#7E6363]">
          회원가입 신청이 정상적으로 완료되었습니다. <br />
          관리자의 승인을 기다려주세요!
        </p>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full py-2 bg-[#7E6363] text-white text-sm font-semibold rounded-md hover:bg-[#685b5b] transition"
        >
          로그인 화면으로 이동
        </button>
      </div>
    </div>
  );
}
