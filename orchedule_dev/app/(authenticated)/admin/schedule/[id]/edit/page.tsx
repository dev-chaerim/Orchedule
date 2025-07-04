"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import ScheduleForm from "@/components/admin/ScheduleForm";
import { Switch } from "@headlessui/react";
import type { Schedule } from "@/src/lib/types/schedule";
import LoadingText from "@/components/common/LoadingText";

export default function EditSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelledState, setIsCancelledState] = useState<boolean>(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(`/api/schedules/${id}`);
        if (!res.ok) throw new Error("일정 불러오기 실패");
        const data = await res.json();
        setSchedule(data);
        setIsCancelledState(data.isCancelled);
      } catch (err) {
        console.error(err);
        alert("일정 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id]);

  const handleSubmit = async ({
    date,
    auditionSessions,
    partSessions,
    orchestraSessions,
    specialNotices,
  }: Omit<Schedule, "_id" | "seasonId" | "isCancelled"> & {
    orchestraSessions: Schedule["orchestraSessions"];
  }) => {
    try {
      const res = await fetch(`/api/schedules/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          auditionSessions,
          partSessions,
          orchestraSessions,
          specialNotices,
          isCancelled: isCancelledState,
        }),
      });

      if (!res.ok) throw new Error("수정 실패");

      router.push("/admin/schedule");
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정에 실패했습니다.");
    }
  };

  if (loading) {
    return <LoadingText message="불러오는 중입니다.." />;
  }

  if (!schedule) {
    return <div className="p-6 text-red-500">일정을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-lg font-bold text-[#3E3232] mb-4">연습일정 수정</h2>

      <div className="flex justify-end mb-4 items-center gap-2">
        <span className="text-sm font-medium text-[#3E3232]">
          연습 취소 여부
        </span>
        <Switch
          checked={isCancelledState}
          onChange={setIsCancelledState}
          className={`${
            isCancelledState ? "bg-[#7E6363]" : "bg-gray-300"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
        >
          <span
            className={`${
              isCancelledState ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      <ScheduleForm
        defaultDate={schedule.date}
        auditionSessions={schedule.auditionSessions}
        partSessions={schedule.partSessions}
        orchestraSessions={schedule.orchestraSessions} // ✅ 배열로 전달
        specialNotices={schedule.specialNotices}
        onSubmit={handleSubmit}
        submitLabel="수정 저장"
      />
    </div>
  );
}
