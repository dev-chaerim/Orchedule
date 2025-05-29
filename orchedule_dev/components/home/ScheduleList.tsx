"use client";

import { useEffect, useState } from "react";
import { useSeasonStore } from "@/lib/store/season";
import { format } from "date-fns";
import MoreLink from "../MoreLink";
import LoadingSkeleton from "../common/LoadingSkeleton";

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

export default function ScheduleList() {
  const selectedSeason = useSeasonStore((state) => state.selectedSeason);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!selectedSeason) return;

      try {
        setLoading(true);
        const res = await fetch(
          `/api/schedules?seasonId=${selectedSeason._id}`
        );
        if (!res.ok) throw new Error("Failed to fetch schedules");
        const data: Schedule[] = await res.json();

        const sorted = [...data].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];

        const todaySchedules = sorted.filter((s) => s.date === todayStr);
        const futureSchedules = sorted.filter((s) => s.date > todayStr);
        const pastSchedules = sorted.filter((s) => s.date < todayStr);

        let selected: Schedule[] = [];

        if (todaySchedules.length > 0) {
          selected = todaySchedules;
        } else if (futureSchedules.length > 0) {
          selected = [
            ...pastSchedules.slice(-1),
            ...futureSchedules.slice(0, 1),
          ];
        } else {
          selected = pastSchedules.slice(-2);
        }

        setFilteredSchedules(selected);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [selectedSeason]);

  if (!selectedSeason) return null;
  if (loading) return <LoadingSkeleton lines={4} className="mt-2 mb-6" />;
  if (error)
    return (
      <p className="px-4 text-sm text-red-500">
        일정을 불러오는 데 실패했습니다.
      </p>
    );

  return (
    <section className="px-4 py-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold">연습 일정</h2>
        <MoreLink href="/menu/notice/schedule" />
      </div>

      {loading ? (
        <div className="mt-3">
          <LoadingSkeleton lines={4} />
        </div>
      ) : error ? (
        <p className="px-1 text-sm text-red-500">
          일정을 불러오는 데 실패했습니다.
        </p>
      ) : filteredSchedules.length === 0 ? (
        <p className="text-sm text-[#7e6a5c] text-center py-10 border border-dashed border-[#e0dada] rounded-md bg-white">
          등록된 연습 일정이 없습니다.
        </p>
      ) : (
        filteredSchedules.map((schedule) => {
          const [month, day] = format(new Date(schedule.date), "MMM d").split(
            " "
          );
          return (
            <div
              key={schedule._id}
              className="flex mb-3 rounded-xl overflow-hidden shadow bg-white"
            >
              <div className="w-16 bg-[#a08e8e] text-white text-center flex flex-col justify-center items-center py-2">
                <span className="text-xs font-bold">{month}</span>
                <span className="text-sm font-bold">{day}</span>
              </div>
              <div className="flex-1 p-3 text-sm text-[#3E3232]">
                {schedule.pieces.map((piece, idx) => (
                  <div key={idx} className="mb-1">
                    <p className="text-xs text-gray-500 mb-1">{piece.time}</p>
                    <p className="text-sm text-[#3E3232]">{piece.title}</p>
                    {piece.note && (
                      <p className="text-xs text-gray-400 mt-1">{piece.note}</p>
                    )}
                    {idx !== schedule.pieces.length - 1 && (
                      <hr className="border-t border-dashed border-gray-300 my-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}
