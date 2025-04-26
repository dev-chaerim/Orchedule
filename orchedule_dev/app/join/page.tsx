// app/(unauthenticated)/join/page.tsx
"use client";

import { useState } from "react";
import SimpleDropdown from "@/components/dropdown/SimpleDropdown";

export default function JoinPage() {
  const [form, setForm] = useState({
    name: "",
    part: "",
    group: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("가입 신청 내용:", form);
    alert("가입 신청이 완료되었습니다!");
    // TODO: 서버로 form 데이터 보내기
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

        {/* 파트 선택 (✅ SimpleDropdown 적용) */}
        <div>
          <label className="block text-sm font-medium text-[#7E6363] mb-1">
            파트
          </label>
          <SimpleDropdown
            options={[
              "Vn1",
              "Vn2",
              "Va",
              "Vc",
              "Ba",
              "Fl",
              "Ob",
              "Cl",
              "Bs",
              "Hr",
              "Perc",
            ]}
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
          <input
            type="text"
            name="group"
            value={form.group}
            onChange={handleChange}
            required
            placeholder="예: 아람 필하모닉"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#A5796E] focus:border-[#A5796E]"
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
            placeholder="6자 이상 입력"
            minLength={6}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#A5796E] focus:border-[#A5796E]"
          />
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
