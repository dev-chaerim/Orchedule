"use client";

import { useEffect, useState } from "react";
import { PartKey, orderedParts, partLabels } from "@/src/constants/parts";
import { useToastStore } from "@/lib/store/toast";
import { getNearestDate } from "@/lib/utils/getNearestDate";
import { useSeasonStore } from "@/lib/store/season";
import { Schedule } from "@/src/lib/types/schedule";

type AttendanceStatus = "출석" | "지각" | "불참";

export default function AttendanceDashboardPage() {
  const [attendance, setAttendance] = useState<Map<string, AttendanceStatus>>(
    new Map()
  );
  const [scheduleDates, setScheduleDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [scheduleDetail, setScheduleDetail] = useState<Schedule | null>(null);
  const [selectedPart, setSelectedPart] = useState<PartKey | "전체">("전체");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<AttendanceStatus>("출석");

  const [members, setMembers] = useState<
    { _id: string; name: string; part: PartKey }[]
  >([]);

  const showToast = useToastStore((state) => state.showToast);

  const selectedSeason = useSeasonStore((state) => state.selectedSeason);
  const seasonId = selectedSeason?._id;

  const filteredMembers =
    selectedPart === "전체"
      ? members
      : members.filter((m) => m.part === selectedPart);

  const counts = Array.from(attendance.values()).reduce(
    (acc, status) => {
      acc[status]++;
      return acc;
    },
    { 출석: 0, 지각: 0, 불참: 0 }
  );

  // ✅ 멤버 데이터를 불러오는 함수
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch("/api/members");
        if (!res.ok) throw new Error("멤버 데이터를 불러오는데 실패했습니다.");
        const data = await res.json();
        setMembers(data);
      } catch (error) {
        console.error("멤버 데이터 로딩 오류:", error);
        showToast({
          message: "멤버 데이터를 불러오는데 실패했습니다.",
          type: "error",
        });
      }
    };
    fetchMembers();
  }, []);

  // ✅ 연습 날짜 목록 불러오기
  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await fetch("/api/schedules/dates");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const nearestDate = getNearestDate(data);
          setScheduleDates(data);
          setSelectedDate(nearestDate);
        }
      } catch (error) {
        console.error("스케줄 날짜 불러오기 실패:", error);
      }
    };
    fetchDates();
  }, []);

  // ✅ 출석 상태 - 실시간 polling
  useEffect(() => {
    if (!selectedDate || !selectedSeason) return;

    const fetchAttendance = async () => {
      try {
        const res = await fetch(
          `/api/attendances?date=${selectedDate}&seasonId=${selectedSeason._id}`
        );
        const data = await res.json();
        const map = new Map<string, AttendanceStatus>();
        members.forEach((m) => {
          const found = data.records?.find(
            (r: { memberId: string; status: AttendanceStatus }) =>
              r.memberId === m._id
          );
          map.set(m._id, found?.status || "출석");
        });
        setAttendance(map);
      } catch (err) {
        console.error("출석 로딩 실패:", err);
        showToast({ message: "출석 데이터 로딩 실패", type: "error" });
      }
    };

    fetchAttendance();
    const interval = setInterval(fetchAttendance, 5000);
    return () => clearInterval(interval);
  }, [selectedDate, selectedSeason, members, showToast]);

  // ✅ 연습 일정 불러오기
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch("/api/schedules");
        const all = await res.json();
        const matched = all.find((s: Schedule) => s.date === selectedDate);
        setScheduleDetail(matched || null);
      } catch (err) {
        console.error("스케줄 로딩 실패:", err);
      }
    };

    if (selectedDate) {
      fetchSchedule();
    }
  }, [selectedDate]);

  const startEdit = (memberId: string) => {
    const current = attendance.get(memberId) ?? "출석";
    setEditingId(memberId);
    setEditingStatus(current);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingStatus("출석");
  };

  const saveEdit = async () => {
    if (!editingId || !selectedDate || !seasonId) return;

    try {
      const checkRes = await fetch(
        `/api/attendances?date=${selectedDate}&seasonId=${seasonId}`
      );
      const checkData = await checkRes.json();

      if (!checkData.records || checkData.records.length === 0) {
        await fetch(`/api/attendances`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: selectedDate,
            seasonId,
            memberId: editingId,
            status: editingStatus,
          }),
        });
      } else {
        await fetch(
          `/api/attendances?date=${selectedDate}&seasonId=${seasonId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              date: selectedDate,
              seasonId,
              memberId: editingId,
              status: editingStatus,
            }),
          }
        );
      }

      showToast({ message: "출석 상태가 저장되었습니다.", type: "success" });
      setAttendance((prev) => new Map(prev).set(editingId, editingStatus));
      setEditingId(null);
    } catch (error) {
      console.error("출석 저장 오류:", error);
      showToast({ message: "출석 상태 저장에 실패했습니다.", type: "error" });
    }
  };

  const hasNextSchedule = !!selectedDate;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-lg font-bold text-[#3E3232] mb-6">출석현황 관리</h1>

      {hasNextSchedule ? (
        <div className="mb-6 p-5 border border-[#dfd8d2] rounded-xl bg-white text-sm text-[#3E3232]">
          <div className="font-semibold text-base mb-2 flex items-center gap-2">
            <span className="text-[#2c2c2c]">다음 연습일</span>
          </div>
          <div className="text-sm font-medium">
            🎼 {selectedDate || "날짜 없음"}
          </div>
          {scheduleDetail &&
            scheduleDetail.orchestraSession?.pieces?.length > 0 && (
              <ul className="list-disc list-inside text-xs mt-2 text-[#7E6363] space-y-0.5">
                {scheduleDetail.orchestraSession.pieces.map((piece, i) => (
                  <li key={i}>{piece.title}</li>
                ))}
              </ul>
            )}
        </div>
      ) : (
        <p className="mb-6 text-sm text-[#7e6a5c] text-center py-10 border border-[#e0dada] rounded-md">
          등록된 다음 연습일이 없습니다.
        </p>
      )}

      {/* 필터 */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <label className="text-[#7E6363] font-medium">출석 날짜:</label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-[#A5796E] focus:border-[#A5796E]"
          >
            {scheduleDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[#7E6363] font-medium">파트:</label>
          <select
            value={selectedPart}
            onChange={(e) =>
              setSelectedPart(e.target.value as PartKey | "전체")
            }
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-[#A5796E] focus:border-[#A5796E]"
          >
            <option value="전체">전체</option>
            {orderedParts.map((part) => (
              <option key={part} value={part}>
                {partLabels[part]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border-2 border-[#d8d2c4] rounded-xl p-5 text-center">
          <div className="text-xs text-[#7E6363] mb-1 tracking-wide">출석</div>
          <div className="text-xl font-bold text-[#3E3232]">
            {counts.출석}명
          </div>
        </div>
        <div className="bg-white border-2 border-[#ccb997] rounded-xl p-5 text-center">
          <div className="text-xs text-[#7E6363] mb-1 tracking-wide">지각</div>
          <div className="text-xl font-bold text-[#a96d00]">
            {counts.지각}명
          </div>
        </div>
        <div className="bg-white border-2 border-[#e4b3b3] rounded-xl p-5 text-center">
          <div className="text-xs text-[#7E6363] mb-1 tracking-wide">불참</div>
          <div className="text-xl font-bold text-[#B00020]">
            {counts.불참}명
          </div>
        </div>
      </div>

      {/* 출석 테이블 */}
      <div className="border border-[#e4e0dc] rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm text-center">
          <thead className="bg-[#f5f4f2] text-[#3E3232]">
            <tr>
              <th className="px-4 py-3 font-semibold">이름</th>
              <th className="px-4 py-3 font-semibold">파트</th>
              <th className="px-4 py-3 font-semibold">출결 상태</th>
              <th className="px-4 py-3 font-semibold">관리</th>
            </tr>
          </thead>
          <tbody className="bg-[#fdfcfa]">
            {filteredMembers.map((member) => {
              const isEditing = editingId === member._id;
              const currentStatus = attendance.get(member._id) ?? "출석";

              return (
                <tr
                  key={member._id}
                  className="border-t border-[#eceae7] last:border-0 hover:bg-[#f7f6f4] transition"
                >
                  <td className="px-4 py-3 text-[#3E3232] whitespace-nowrap">
                    {member.name}
                  </td>
                  <td className="px-4 py-3 text-[#7E6363] whitespace-nowrap">
                    {member.part}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {isEditing ? (
                      <select
                        value={editingStatus}
                        onChange={(e) =>
                          setEditingStatus(e.target.value as AttendanceStatus)
                        }
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                      >
                        <option value="출석">출석</option>
                        <option value="지각">지각</option>
                        <option value="불참">불참</option>
                      </select>
                    ) : (
                      <span>{currentStatus}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="text-xs text-[#7E6363] hover:text-[#3E3232]"
                        >
                          저장
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-xs text-[#b14040] hover:underline"
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEdit(member._id)}
                        className="text-xs text-[#7E6363] hover:text-[#3E3232]"
                      >
                        수정
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
