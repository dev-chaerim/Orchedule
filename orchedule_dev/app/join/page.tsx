"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ router 사용 추가
import SimpleDropdown from "@/components/dropdown/SimpleDropdown";
import { useToastStore } from "@/lib/store/toast"; // ✅ 토스트 사용
import { orderedParts } from "@/src/constants/parts";

export default function JoinPage() {
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [form, setForm] = useState({
    name: "",
    part: "",
    group: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const groupOptions = ["아람 필하모닉"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      showToast({ message: "비밀번호가 일치하지 않습니다.", type: "error" });
      return;
    }

    try {
      const res = await fetch("/api/join-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("가입 신청 실패");

      showToast({ message: "가입 신청이 완료되었습니다.", type: "success" });
      router.push("/join-success"); // ✅ 가입 성공 페이지로 이동
    } catch (error) {
      console.error("가입 신청 오류:", error);
      showToast({ message: "가입 신청에 실패했습니다.", type: "error" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-xl border border-[#e0dada] space-y-6"
      >
        <h1 className="text-lg font-bold text-[#3E3232] text-center">
          회원가입 신청
        </h1>

        {/* 이름 입력 */}
        <div>
          <label className="block text-sm font-medium text-[#7E6363] mb-1">
            이름
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#A5796E] focus:border-[#A5796E]"
          />
        </div>

        {/* 파트 선택 */}
        <div>
          <label className="block text-sm font-medium text-[#7E6363] mb-1">
            파트
          </label>
          <SimpleDropdown
            options={orderedParts}
            value={form.part}
            onChange={(val) => setForm((prev) => ({ ...prev, part: val }))}
            placeholder="파트를 선택하세요"
          />
        </div>

        {/* 단체명 입력 */}
        <div>
          <label className="block text-sm font-medium text-[#7E6363] mb-1">
            단체명
          </label>
          <SimpleDropdown
            options={groupOptions}
            value={form.group}
            onChange={(val) => setForm((prev) => ({ ...prev, group: val }))}
            placeholder="단체를 선택하세요"
          />
        </div>

        {/* 이메일 입력 */}
        <div>
          <label className="block text-sm font-medium text-[#7E6363] mb-1">
            이메일
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="예: example@email.com"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#A5796E] focus:border-[#A5796E]"
          />
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label className="block text-sm font-medium text-[#7E6363] mb-1">
            비밀번호
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="10자 이상 입력"
            minLength={10}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#A5796E] focus:border-[#A5796F]"
          />
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label className="block text-sm font-medium text-[#7E6363] mb-1">
            비밀번호 확인
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="비밀번호를 다시 입력하세요"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#A5796E] focus:border-[#A5796F]"
          />
          {confirmPassword && confirmPassword !== form.password && (
            <p className="text-xs text-red-500 mt-1">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="w-full py-2 bg-[#7E6363] text-white text-sm font-semibold rounded-md hover:bg-[#685b5b] transition"
        >
          가입 신청하기
        </button>
      </form>
    </div>
  );
}
