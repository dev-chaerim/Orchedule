"use client";

import { useState } from "react";
import SimpleDropdown from "../dropdown/SimpleDropdown";

const partOptions = [
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
];

interface AddMemberFormProps {
  onAdd: (member: { name: string; part: string; email?: string }) => void;
}

export default function AddMemberForm({ onAdd }: AddMemberFormProps) {
  const [name, setName] = useState("");
  const [part, setPart] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !part) {
      alert("이름과 파트를 입력해주세요!");
      return;
    }
    onAdd({ name, part, email });
    setName("");
    setPart("");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#7E6363] mb-1">
          이름
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#A5796E] focus:border-[#A5796E]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#7E6363] mb-1">
          파트
        </label>
        <SimpleDropdown
          options={partOptions}
          value={part}
          onChange={setPart}
          placeholder="파트를 선택하세요"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#7E6363] mb-1">
          이메일 (선택)
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#A5796E] focus:border-[#A5796E]"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-[#7E6363] text-white text-sm font-semibold rounded-md hover:bg-[#5c4f4f] transition"
      >
        단원 추가하기
      </button>
    </form>
  );
}
