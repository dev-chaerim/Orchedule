"use client";

import { useState } from "react";
import SessionListForm from "./SessionListForm";
import OrchestraSessionForm from "./OrchestraSessionForm";
import {
  PracticeSession,
  OrchestraSession,
  SpecialNotice,
} from "@/src/lib/types/schedule";

interface ScheduleFormProps {
  defaultDate?: string;
  auditionSessions?: PracticeSession[];
  partSessions?: PracticeSession[];
  orchestraSession?: OrchestraSession;
  specialNotices?: SpecialNotice[];
  onSubmit: (data: {
    date: string;
    auditionSessions: PracticeSession[];
    partSessions: PracticeSession[];
    orchestraSession: OrchestraSession;
    specialNotices: SpecialNotice[];
  }) => void;
  submitLabel?: string;
}

export default function ScheduleForm({
  defaultDate = "",
  auditionSessions = [],
  partSessions = [],
  orchestraSession = {
    time: "",
    location: "",
    conductor: "",
    pieces: [],
  },
  specialNotices = [],
  onSubmit,
  submitLabel = "저장",
}: ScheduleFormProps) {
  const [date, setDate] = useState(defaultDate);
  const [auditionList, setAuditionList] =
    useState<PracticeSession[]>(auditionSessions);
  const [partList, setPartList] = useState<PracticeSession[]>(partSessions);
  const [orchestra, setOrchestra] =
    useState<OrchestraSession>(orchestraSession);
  const [notices, setNotices] = useState<SpecialNotice[]>(specialNotices);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date,
      auditionSessions: auditionList,
      partSessions: partList,
      orchestraSession: orchestra,
      specialNotices: notices,
    });
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
      className="space-y-6 bg-white rounded-xl shadow-md p-8 border border-gray-100"
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

      <SessionListForm
        label="자리오디션"
        sessions={auditionList}
        onChange={setAuditionList}
      />
      <div className="border-t border-dashed border-[#D5CAC3] mt-2 mb-3" />

      <SessionListForm
        label="파트 레슨"
        sessions={partList}
        onChange={setPartList}
      />
      <div className="border-t border-dashed border-[#D5CAC3] mt-2 mb-3" />

      <OrchestraSessionForm session={orchestra} onChange={setOrchestra} />

      {/* 특이사항 입력 */}
      <div>
        <label className="block text-sm font-semibold text-[#3E3232] mb-2">
          특이사항
        </label>
        {notices.map((notice, index) => (
          <div key={index} className="flex items-start gap-2 mb-2">
            <input
              type="text"
              placeholder="내용 입력"
              value={notice.content}
              onChange={(e) => updateNotice(index, "content", e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <select
              value={notice.level}
              onChange={(e) => updateNotice(index, "level", e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-2 py-2"
            >
              <option value="default">일반</option>
              <option value="warning">주의</option>
              <option value="important">중요</option>
            </select>
            <button
              type="button"
              onClick={() => removeNotice(index)}
              className="text-sm text-red-500 hover:underline mt-2"
            >
              삭제
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addNotice}
          className="text-sm text-[#5c4f4f] hover:underline mt-2"
        >
          + 특이사항 추가
        </button>
      </div>

      <button
        type="submit"
        className="px-5 py-2 bg-[#3E3232] text-white text-sm font-semibold rounded-md hover:bg-[#2e2626] transition"
      >
        {submitLabel}
      </button>
    </form>
  );
}
