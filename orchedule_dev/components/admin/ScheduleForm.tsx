"use client";

import { useState } from "react";
import SessionListForm from "./SessionListForm";
import OrchestraSessionListForm from "./OrchestraSessionListForm";
import {
  PracticeSession,
  OrchestraSession,
  SpecialNotice,
} from "@/src/lib/types/schedule";
import { X } from "lucide-react";

interface ScheduleFormProps {
  defaultDate?: string;
  auditionSessions?: PracticeSession[];
  partSessions?: PracticeSession[];
  orchestraSessions?: OrchestraSession[]; // ✅ 수정됨
  specialNotices?: SpecialNotice[];
  onSubmit: (data: {
    date: string;
    auditionSessions: PracticeSession[];
    partSessions: PracticeSession[];
    orchestraSessions: OrchestraSession[]; // ✅ 수정됨
    specialNotices: SpecialNotice[];
  }) => void;
  submitLabel?: string;
}

export default function ScheduleForm({
  defaultDate = "",
  auditionSessions = [],
  partSessions = [],
  orchestraSessions = [], // ✅ 기본값도 배열
  specialNotices = [],
  onSubmit,
  submitLabel = "저장",
}: ScheduleFormProps) {
  const [date, setDate] = useState(defaultDate);
  const [auditionList, setAuditionList] =
    useState<PracticeSession[]>(auditionSessions);
  const [partList, setPartList] = useState<PracticeSession[]>(partSessions);
  const [orchestraList, setOrchestraList] =
    useState<OrchestraSession[]>(orchestraSessions); // ✅ 상태 변경
  const [notices, setNotices] = useState<SpecialNotice[]>(specialNotices);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    onSubmit({
      date,
      auditionSessions: auditionList,
      partSessions: partList,
      orchestraSessions: orchestraList, // ✅ 이름 변경됨
      specialNotices: notices,
    });

    // 저장 후 setIsSubmitting(false) 필요시 적용
  };

  const updateNotice = (
    index: number,
    field: keyof SpecialNotice,
    value: string
  ) => {
    const updated = [...notices];
    if (field === "level") {
      updated[index].level = value as "default" | "warning" | "important";
    } else {
      updated[index][field] = value;
    }
    setNotices(updated);
  };

  const addNotice = () => {
    setNotices([...notices, { content: "", level: "default" }]);
  };

  const removeNotice = (index: number) => {
    setNotices(notices.filter((_, i) => i !== index));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-white rounded-xl shadow-md p-6 border border-gray-100"
    >
      {/* 날짜 입력 */}
      <div>
        <label className="block text-sm font-semibold text-[#3E3232] mb-1">
          날짜
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A5796E] mt-1"
          required
        />
      </div>

      {/* 자리오디션 */}
      <SessionListForm
        label="자리오디션"
        sessions={auditionList}
        onChange={setAuditionList}
      />

      <hr className="border-t border-dashed border-[#D5CAC3]" />

      {/* 파트레슨 */}
      <SessionListForm
        label="파트 레슨"
        sessions={partList}
        onChange={setPartList}
      />

      <hr className="border-t border-dashed border-[#D5CAC3]" />

      {/* 오케스트라 전체연습 */}
      <OrchestraSessionListForm
        sessions={orchestraList}
        onChange={setOrchestraList}
      />

      <hr className="border-t border-dashed border-[#D5CAC3]" />

      {/* 특이사항 */}
      <div>
        <label className="block text-sm font-semibold text-[#3E3232] mb-4">
          특이사항
        </label>
        {notices.length === 0 && (
          <p className="text-center text-sm text-[#a49d9d] mb-4 py-2">
            아직 등록된 특이사항이 없습니다.
          </p>
        )}
        {notices.map((notice, index) => (
          <div key={index} className="flex items-center gap-2 mb-3">
            <textarea
              placeholder="내용 입력"
              value={notice.content}
              onChange={(e) => updateNotice(index, "content", e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm h-[40px] resize-none leading-[1.6]"
              rows={1}
            />
            <select
              value={notice.level}
              onChange={(e) => updateNotice(index, "level", e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 h-[40px]"
            >
              <option value="default">일반</option>
              <option value="warning">주의</option>
              <option value="important">중요</option>
            </select>
            <button
              type="button"
              onClick={() => removeNotice(index)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f3f0ed] text-[#7E6363] hover:bg-[#e2dbd7] transition"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={addNotice}
            className="px-6 py-2 mt-1 rounded-full bg-[#d2b8b5] text-[#3E3232] font-semibold text-sm hover:bg-[#c2a5a1] transition"
          >
            + 특이사항 추가
          </button>
        </div>
      </div>

      {/* 제출 */}
      <div className="pt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 bg-[#3E3232] text-white text-sm font-semibold rounded-md hover:bg-[#2e2626] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "저장 중..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
