"use client";

import { useEffect, useState } from "react";
import { useSeasonStore } from "@/lib/store/season";
import { getNearestDate } from "@/src/lib/utils/getNearestDate";

interface Member {
  _id: string;
  name: string;
  part: string;
}

interface SeatAssignment {
  _id: string;
  memberId: Member;
  seatNumber: number;
  seasonId: string;
}

interface AttendanceRecord {
  memberId: string;
  status: "출석" | "지각" | "불참";
}

export default function AdminSeatAssignmentsPage() {
  const { selectedSeason } = useSeasonStore();
  const seasonId = selectedSeason?._id;

  const [members, setMembers] = useState<Member[]>([]);
  const [assignments, setAssignments] = useState<SeatAssignment[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [date, setDate] = useState("");

  // 날짜 가져오기
  useEffect(() => {
    const fetchDates = async () => {
      const res = await fetch("/api/schedules/dates");
      const data: string[] = await res.json();
      const nearest = getNearestDate(data);
      setDate(nearest);
    };
    fetchDates();
  }, []);

  // members 가져오기
  useEffect(() => {
    const fetchMembers = async () => {
      const res = await fetch("/api/members");
      const data: Member[] = await res.json();
      setMembers(data);
    };
    fetchMembers();
  }, []);

  // SeatAssignments 가져오기
  useEffect(() => {
    if (!seasonId) return;
    const fetchAssignments = async () => {
      const res = await fetch(`/api/seat-assignments?seasonId=${seasonId}`);
      const data: SeatAssignment[] = await res.json();
      setAssignments(data);
    };
    fetchAssignments();
  }, [seasonId]);

  // AttendanceRecords 가져오기
  useEffect(() => {
    if (!seasonId || !date) return;
    const fetchAttendance = async () => {
      const res = await fetch(
        `/api/attendances?seasonId=${seasonId}&date=${date}`
      );
      const data = await res.json();
      setAttendanceRecords(data.records);
    };
    fetchAttendance();
  }, [seasonId, date]);

  const handleSeatNumberChange = async (
    assignmentId: string,
    newSeatNumber: number
  ) => {
    await fetch(`/api/seat-assignments/${assignmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seatNumber: newSeatNumber }),
    });
    // 다시 불러오기
    const res = await fetch(`/api/seat-assignments?seasonId=${seasonId}`);
    const data: SeatAssignment[] = await res.json();
    setAssignments(data);
  };

  const handleDelete = async (assignmentId: string) => {
    await fetch(`/api/seat-assignments/${assignmentId}`, { method: "DELETE" });
    const res = await fetch(`/api/seat-assignments?seasonId=${seasonId}`);
    const data: SeatAssignment[] = await res.json();
    setAssignments(data);
  };

  const getAttendanceStatus = (memberId: string) => {
    const record = attendanceRecords.find((r) => r.memberId === memberId);
    return record?.status ?? "출석";
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "출석":
        return "bg-[#e2d8ce] text-[#3e3232]";
      case "지각":
        return "bg-[#d3c9e7] text-[#453c5c]";
      case "불참":
        return "bg-[#f3c5c5] text-[#5c3c3c]";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4 text-[#3e3232]">자리배치 관리</h2>

      <table className="w-full table-auto border border-[#e0dada] text-sm">
        <thead className="bg-[#f9f7f5] text-[#7e6a5c]">
          <tr>
            <th className="border border-[#e0dada] px-3 py-2 text-left">
              이름
            </th>
            <th className="border border-[#e0dada] px-3 py-2 text-left">
              파트
            </th>
            <th className="border border-[#e0dada] px-3 py-2 text-left">
              Seat Number
            </th>
            <th className="border border-[#e0dada] px-3 py-2 text-left">
              출석 상태
            </th>
            <th className="border border-[#e0dada] px-3 py-2 text-center">
              삭제
            </th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment._id} className="border-t border-[#e0dada]">
              <td className="px-3 py-2">{assignment.memberId.name}</td>
              <td className="px-3 py-2">{assignment.memberId.part}</td>
              <td className="px-3 py-2">
                <input
                  type="number"
                  value={assignment.seatNumber}
                  onChange={(e) =>
                    handleSeatNumberChange(
                      assignment._id,
                      parseInt(e.target.value, 10)
                    )
                  }
                  className="w-16 border border-[#ccc] rounded px-2 py-1 text-right"
                />
              </td>
              <td className="px-3 py-2">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                    getAttendanceStatus(assignment.memberId._id)
                  )}`}
                >
                  {getAttendanceStatus(assignment.memberId._id)}
                </span>
              </td>
              <td className="px-3 py-2 text-center">
                <button
                  onClick={() => handleDelete(assignment._id)}
                  className="text-red-500 hover:underline text-xs"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
