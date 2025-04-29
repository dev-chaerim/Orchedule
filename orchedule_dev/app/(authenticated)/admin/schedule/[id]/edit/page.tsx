"use client";

import { useEffect, useState, use } from "react"; // ← use 추가
import { useRouter } from "next/navigation";
import ScheduleForm from "@/components/admin/ScheduleForm";

interface Piece {
  time: string;
  title: string;
  note?: string;
}

interface Schedule {
  _id: string;
  date: string;
  pieces: Piece[];
}

export default function EditSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>; // ← Promise로 변경
}) {
  const router = useRouter();
  const { id } = use(params);

  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(`/api/schedules/${id}`);
        if (!res.ok) throw new Error("일정 불러오기 실패");
        const data = await res.json();
        setSchedule(data);
      } catch (err) {
        console.error(err);
        alert("일정 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id]);

  const handleSubmit = async (data: { date: string; pieces: Piece[] }) => {
    try {
      const res = await fetch(`/api/schedules/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("수정 실패");

      router.push("/admin/schedule");
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정에 실패했습니다.");
    }
  };

  if (loading) {
    return <div className="p-6 text-[#7E6363]">불러오는 중...</div>;
  }

  if (!schedule) {
    return <div className="p-6 text-red-500">일정을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-lg font-bold text-[#3E3232] mb-4">연습일정 수정</h2>
      <ScheduleForm
        defaultDate={schedule.date}
        defaultPieces={schedule.pieces}
        onSubmit={handleSubmit}
        submitLabel="수정 저장"
      />
    </div>
  );
}
