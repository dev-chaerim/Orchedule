"use client";

import { useState } from "react";
import AttendanceForm from "./AttendanceForm";
import MemberAttendanceList from "./MemberAttendanceList";
import { AttendanceRecord } from "@/src/lib/types/attendance";

export default function AttendanceCheckPage() {
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // ⭐️ 새로고침 트리거

  return (
    <div className="space-y-6">
      <AttendanceForm
        setAttendanceRecords={setAttendanceRecords}
        setRefreshTrigger={setRefreshTrigger} // ⭐️ 내려줌
      />
      <MemberAttendanceList
        attendanceRecords={attendanceRecords}
        refreshTrigger={refreshTrigger} // ⭐️ 내려줌
        setAttendanceRecords={setAttendanceRecords} // ⭐️ 내려줘야 fetch 후 업데이트 가능
      />
    </div>
  );
}
