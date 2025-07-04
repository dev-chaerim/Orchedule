"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useToastStore } from "@/lib/store/toast";
import { useUserStore } from "@/lib/store/user";
import { getNearestDate } from "@/lib/utils/getNearestDate";
import FilterDropdown from "@/components/dropdown/FilterDropdown";
import { AttendanceRecord, AttendanceData } from "@/src/lib/types/attendance";
import ErrorMessage from "@/components/common/ErrorMessage";

const statuses = ["출석", "지각", "불참"];

interface Season {
  _id: string;
  name: string;
  startDate: string;
  endDate?: string;
  pieces: string[];
}

interface AttendanceFormProps {
  setAttendanceRecords: React.Dispatch<
    React.SetStateAction<AttendanceRecord[]>
  >;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
}

export default function AttendanceForm({
  setAttendanceRecords,
  setRefreshTrigger,
}: AttendanceFormProps) {
  const showToast = useToastStore((state) => state.showToast);
  const { user } = useUserStore();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>(statuses[0]);
  const [loading, setLoading] = useState(false); // 버튼 클릭용
  const [error, setError] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(true); // ✅ 추가: 출결 상태 fetch용
  const [seasonId, setSeasonId] = useState<string | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const fetchDates = async () => {
      const res = await fetch("/api/schedules/dates");
      const dates = await res.json();
      const nearest = getNearestDate(dates);
      setSelectedDate(nearest);
    };
    fetchDates();
  }, []);

  useEffect(() => {
    if (!user || !seasonId || !selectedDate) return;

    const fetchAttendance = async () => {
      setAttendanceLoading(true); // ✅ 시작
      try {
        const response = await fetch(
          `/api/attendances?date=${format(
            selectedDate,
            "yyyy-MM-dd"
          )}&seasonId=${seasonId}`
        );
        const data: AttendanceData = await response.json();

        const userRecord = data.records.find((r) => r.memberId === user.id);

        if (isFirstLoad) {
          setSelectedStatus(userRecord?.status || "출석");
          setIsFirstLoad(false);
        }

        setAttendanceRecords(data.records);
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setAttendanceLoading(false); // ✅ 끝
      }
    };

    fetchAttendance();
  }, [user, seasonId, selectedDate, isFirstLoad]);

  useEffect(() => {
    const fetchRecentSeason = async () => {
      try {
        const res = await fetch("/api/seasons");
        const data: Season[] = await res.json();
        const recentSeason = data.sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        )[0];

        if (!recentSeason) {
          showToast({ message: "현재 시즌이 없습니다.", type: "error" });
          return;
        }

        setSeasonId(recentSeason._id);
      } catch (err) {
        console.log(err);
        setError(true);
        showToast({
          message: "최근 시즌을 불러올 수 없습니다.",
          type: "error",
        });
      }
    };

    fetchRecentSeason();
  }, []);

  const handleSave = async () => {
    if (!user) {
      showToast({ message: "로그인이 필요합니다.", type: "error" });
      return;
    }

    try {
      if (!seasonId) {
        showToast({
          message: "시즌 정보를 불러오지 못했습니다.",
          type: "error",
        });
        return;
      }

      setLoading(true);

      const requestData = {
        date: format(selectedDate, "yyyy-MM-dd"),
        seasonId,
        memberId: user.id,
        status: selectedStatus,
      };

      const response = await fetch("/api/attendances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "출석 상태 저장 실패");
      }

      const result = await response.json();
      setAttendanceRecords(result.records || []);
      showToast({
        message: result.message || "출석 상태가 저장되었습니다.",
        type: "success",
      });

      // refreshTrigger 증가 → MemberAttendanceList가 다시 fetch
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast({ message: error.message, type: "error" });
      } else {
        showToast({
          message: "예상치 못한 오류가 발생했습니다.",
          type: "error",
        });
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <ErrorMessage />;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[640px]">
        <h2 className="text-m font-bold text-[#3e3232] mb-6 mx-4">출결 등록</h2>

        {attendanceLoading ? (
          <div className="flex justify-center py-10 text-[#a79c90] text-sm">
            ⏳ 출결 데이터를 불러오는 중이에요...
          </div>
        ) : (
          <div className="py-4 w-full">
            <div className="flex justify-center items-center gap-4 flex-wrap w-full">
              {selectedDate && (
                <div className="flex flex-col items-center justify-center w-[80px] h-[78px] bg-white rounded-xl shadow">
                  <div className="text-[13px] text-[#7e6a5c]">
                    {format(new Date(selectedDate), "MMM")}
                  </div>
                  <div className="text-[20px] font-bold text-[#3e3232e7]">
                    {format(new Date(selectedDate), "d")}
                  </div>
                </div>
              )}

              <div className="w-[80px] h-[78px] flex items-center justify-center bg-[#D7C0AE] text-white text-sm font-semibold rounded-xl shadow">
                {selectedStatus}
              </div>

              <div className="flex flex-col gap-2 items-center">
                <FilterDropdown
                  options={statuses}
                  selected={selectedStatus}
                  onChange={setSelectedStatus}
                  buttonClassName=" bg-[#f8f6f2] text-[#3e3232d4]"
                  width="w-[80px]"
                />
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`w-[80px] bg-[#e5d5ae] text-white rounded-xl py-2 text-sm font-semibold shadow hover:opacity-90 transition text-center ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "저장 중..." : "변경"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
