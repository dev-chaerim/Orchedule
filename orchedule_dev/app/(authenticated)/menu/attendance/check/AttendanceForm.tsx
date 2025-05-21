"use client";

import { useState, useEffect, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { format } from "date-fns";
import { useToastStore } from "@/lib/store/toast";
import { useUserStore } from "@/lib/store/user";
import { getNearestDate } from "@/src/lib/utils/getNearestDate";
// import LoadingIndicator from "@/components/common/LoadingIndicator";

const statuses = ["출석", "지각", "불참"];

interface AttendanceRecord {
  memberId: string;
  status: "출석" | "지각" | "불참";
}

interface Season {
  _id: string;
  name: string;
  startDate: string;
  endDate?: string;
  pieces: string[];
}

export default function AttendanceForm() {
  const { showToast } = useToastStore();
  const { user } = useUserStore();
  const [date] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>(statuses[0]);
  const [loading, setLoading] = useState(false);
  const [seasonId, setSeasonId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDates = async () => {
      const res = await fetch("/api/schedules/dates");
      const dates = await res.json();
      const nearest = getNearestDate(dates);
      setSelectedDate(nearest);
    };
    fetchDates();
  }, []);

  const fetchAttendance = async () => {
    try {
      if (!seasonId) {
        console.error("시즌 ID가 설정되지 않았습니다.");
        return;
      }
      console.log("date, seasonID", date, seasonId);
      const response = await fetch(
        `/api/attendances?date=${format(
          date,
          "yyyy-MM-dd"
        )}&seasonId=${seasonId}`
      );

      if (!response.ok) throw new Error("출석 상태 불러오기 실패");

      const data = await response.json();
      console.log("불러온 출석 데이터:", data); // ✅ 데이터 구조 확인

      if (!data || !data.records) {
        console.warn("출석 데이터 없음 또는 잘못된 형식");
        return;
      }

      console.log("user?.id", user?.id);
      console.log("전체 records:", data.records);

      // ✅ 사용자 출석 상태 확인
      const userRecord = data.records.find(
        (record: AttendanceRecord) => record.memberId === user?.id
      );
      console.log("userRecord", userRecord);
      if (userRecord) {
        setSelectedStatus(userRecord.status);
        console.log("기존 출석 상태 불러옴:", userRecord.status);
      } else {
        console.log("기존 출석 데이터 없음");
      }
    } catch (error) {
      console.error("출석 상태 불러오기 오류:", error);
      showToast({ message: "출석 상태 불러오기 실패", type: "error" });
    }
  };

  // ✅ useEffect로 페이지 로드 시 출석 상태 가져오기
  useEffect(() => {
    if (user && seasonId) fetchAttendance();
  }, [user, seasonId]);

  // ✅ 최근 시즌 가져오기
  useEffect(() => {
    const fetchRecentSeason = async () => {
      try {
        const res = await fetch("/api/seasons");
        if (!res.ok) throw new Error("시즌 목록 불러오기 실패");
        const data: Season[] = await res.json();

        // ✅ 최근 시즌 가져오기 (시작 날짜 기준 내림차순)
        const recentSeason = data.sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        )[0];

        if (!recentSeason) {
          showToast({ message: "현재 시즌이 없습니다.", type: "error" });
          return;
        }

        setSeasonId(recentSeason._id); // ✅ 최근 시즌 ID 설정
        console.log("최근 시즌 ID:", recentSeason._id);
      } catch (err) {
        console.error("최근 시즌 가져오기 실패:", err);
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

      // ✅ 전송 데이터 확인
      const requestData = {
        date: format(date, "yyyy-MM-dd"),
        seasonId,
        memberId: user.id,
        status: selectedStatus,
      };
      console.log("전송 데이터:", requestData);

      const response = await fetch("/api/attendances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("서버 오류:", errorData);
        throw new Error(errorData.message || "출석 상태 저장 실패");
      }

      const result = await response.json();
      showToast({
        message: result.message || "출석 상태가 저장되었습니다.",
        type: "success",
      });
      console.log("출석 등록 결과:", result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("출석 상태 저장 에러:", error.message);
        showToast({ message: error.message, type: "error" });
      } else {
        console.error("예상치 못한 오류:", error);
        showToast({
          message: "예상치 못한 오류가 발생했습니다.",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[640px]">
        <h2 className="text-m font-bold text-[#3e3232] mb-6 mx-4">출결 등록</h2>
        <div className="p-4 py-6 mx-4">
          <div className="flex justify-center items-center gap-4 flex-wrap w-full">
            {selectedDate && (
              <div className="flex flex-col items-center justify-center w-[100px] h-[90px] bg-white rounded-xl shadow">
                <div className="text-[13px] text-[#7e6a5c]">
                  {format(new Date(selectedDate), "MMM")}
                </div>
                <div className="text-[20px] font-bold text-[#3e3232e7]">
                  {format(new Date(selectedDate), "d")}
                </div>
              </div>
            )}

            <div className="w-[100px] h-[90px] flex items-center justify-center bg-[#D7C0AE] text-white text-sm font-semibold rounded-xl shadow">
              {selectedStatus}
            </div>

            <div className="flex flex-col gap-2 items-center">
              <Listbox value={selectedStatus} onChange={setSelectedStatus}>
                <div className="relative w-[100px]">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-[#f8f6f2] py-2 pl-4 pr-8 text-sm text-[#3e3232d4] shadow font-semibold text-center">
                    {selectedStatus}
                    <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                      <ChevronDownIcon
                        className="h-4 w-4 text-[#7e6a5c]"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute mt-1 w-full rounded-xl bg-white shadow-lg z-10 text-sm text-[#3e3232]">
                      {statuses.map((status) => (
                        <Listbox.Option
                          key={status}
                          className={({ active }) =>
                            `cursor-pointer select-none px-4 py-2 text-center ${
                              active ? "bg-[#f0eae1]" : ""
                            }`
                          }
                          value={status}
                        >
                          {status}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>

              <button
                onClick={handleSave}
                disabled={loading}
                className={`w-[100px] bg-[#e5d5ae] text-white rounded-xl py-2 text-sm font-semibold shadow hover:opacity-90 transition text-center ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "저장 중..." : "변경"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
